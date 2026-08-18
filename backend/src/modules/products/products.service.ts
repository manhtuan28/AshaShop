import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { RedisService } from '../redis/redis.service';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly redisService: RedisService,
  ) {}

  // ================= CATEGORIES =================

  async createCategory(dto: CreateCategoryDto): Promise<CategoryDocument> {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    const existing = await this.categoryModel.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Danh mục này đã tồn tại');
    }

    const category = new this.categoryModel({
      ...dto,
      slug,
    });
    const saved = await category.save();
    await this.redisService.del('categories:all');
    return saved;
  }

  async findAllCategories(): Promise<CategoryDocument[]> {
    const cacheKey = 'categories:all';
    const cached = await this.redisService.get<CategoryDocument[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.categoryModel.find().sort({ createdAt: -1 }).exec();
    await this.redisService.set(cacheKey, categories, 3600); // cache 1h
    return categories;
  }

  async findCategoryBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (dto.name && !dto.slug) {
      dto.slug = slugify(dto.name);
    } else if (dto.slug) {
      dto.slug = slugify(dto.slug);
    }

    Object.assign(category, dto);
    const updated = await category.save();
    await this.redisService.del('categories:all');
    return updated;
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const productsCount = await this.productModel.countDocuments({ category: id });
    if (productsCount > 0) {
      throw new BadRequestException(`Không thể xóa danh mục đang có ${productsCount} sản phẩm`);
    }

    const deleted = await this.categoryModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy danh mục để xóa');
    }
    await this.redisService.del('categories:all');
    return { message: 'Xóa danh mục thành công' };
  }

  // ================= PRODUCTS =================

  async createProduct(dto: CreateProductDto): Promise<ProductDocument> {
    const category = await this.categoryModel.findById(dto.categoryId);
    if (!category) {
      throw new BadRequestException('Danh mục sản phẩm không hợp lệ');
    }

    let baseSlug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    let slug = baseSlug;
    let counter = 1;
    while (await this.productModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = new this.productModel({
      ...dto,
      category: category._id,
      slug,
    });

    const saved = await product.save();
    await this.invalidateProductCache();
    return saved.populate('category');
  }

  async findAll(query: QueryProductDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isFeatured,
      sort,
      page = 1,
      limit = 12,
    } = query;

    const cacheKey = `products:${JSON.stringify(query)}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      if (Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const cat = await this.categoryModel.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = String(isFeatured) === 'true' || isFeatured === true;
    }

    let sortOptions: Record<string, any> = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    const result = {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.redisService.set(cacheKey, result, 300); // cache 5 min
    return result;
  }

  async findFeatured() {
    const cacheKey = 'products:featured';
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const items = await this.productModel
      .find({ isFeatured: true })
      .populate('category')
      .limit(8)
      .exec();

    await this.redisService.set(cacheKey, items, 600);
    return items;
  }

  async findBySlug(slug: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({ slug })
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    if (dto.categoryId) {
      const cat = await this.categoryModel.findById(dto.categoryId);
      if (!cat) throw new BadRequestException('Danh mục không hợp lệ');
      product.category = cat._id as any;
    }

    if (dto.name && !dto.slug) {
      product.slug = slugify(dto.name);
    } else if (dto.slug) {
      product.slug = slugify(dto.slug);
    }

    Object.assign(product, dto);
    const updated = await product.save();
    await this.invalidateProductCache();
    return updated.populate('category');
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy sản phẩm để xóa');
    }
    await this.invalidateProductCache();
    return { message: 'Xóa sản phẩm thành công' };
  }

  private async invalidateProductCache() {
    await this.redisService.delPattern('products:*');
  }
}
