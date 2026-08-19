import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const TopHeader: React.FC = () => {
  return (
    <div className="bg-black text-white text-xs sm:text-sm py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex-1 text-center sm:text-center sm:pl-28">
          <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
          <Link to="/shop" className="font-semibold underline ml-2 hover:text-exclusive-red transition-colors">
            ShopNow
          </Link>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 text-xs sm:text-sm">
          <span>English</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
