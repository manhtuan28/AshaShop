import React from 'react';
import { Link } from 'react-router-dom';
import { Store, DollarSign, ShoppingBag, Coins, Truck, Headset, ShieldCheck, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSiteConfigStore } from '../store/useSiteConfigStore';

export const About: React.FC = () => {
  const { currentLanguage, t } = useLanguageStore();
  const { getLocalizedConfig } = useSiteConfigStore();
  const config = getLocalizedConfig(currentLanguage);

  const stats = [
    { icon: Store, value: '10.5k', label: 'Sellers active our site' },
    { icon: DollarSign, value: '33k', label: 'Monthly Product Sale', active: true },
    { icon: ShoppingBag, value: '45.5k', label: 'Customer active in our site' },
    { icon: Coins, value: '25k', label: 'Annual gross sale in our site' },
  ];

  const team = [
    {
      name: 'Tom Cruise',
      role: 'Founder & Chairman',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Emma Watson',
      role: 'Managing Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Will Smith',
      role: 'Product Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-24">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t('nav.about')}</span>
      </nav>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-black">{config.aboutTitle || t('about.title')}</h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            {config.aboutStory1 || t('about.story1')}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {config.aboutStory2 || t('about.story2')}
          </p>
        </div>

        <div className="lg:col-span-6">
          <img
            src={config.aboutImageUrl || 'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?auto=format&fit=crop&w=800&q=80'}
            alt="Our Story"
            className="rounded-2xl w-full object-cover shadow-md max-h-[450px]"
          />
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`border border-gray-300 rounded p-8 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 group cursor-pointer ${
                stat.active ? 'bg-exclusive-red text-white border-exclusive-red shadow-lg' : 'hover:bg-exclusive-red hover:text-white hover:border-exclusive-red'
              }`}
            >
              <div className={`w-16 h-16 rounded-full p-2 flex items-center justify-center transition-colors ${
                stat.active ? 'bg-white/30 text-white' : 'bg-neutral-200 group-hover:bg-white/30'
              }`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                  stat.active ? 'bg-white text-black' : 'bg-black text-white group-hover:bg-white group-hover:text-black'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-xs">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Team Members Section */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="space-y-4 group">
              <div className="bg-exclusive-bg rounded aspect-[3/4] overflow-hidden flex items-end justify-center p-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-black">{member.name}</h3>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <div className="flex items-center gap-4 text-black">
                <Twitter className="w-4 h-4 cursor-pointer hover:text-exclusive-red transition-colors" />
                <Instagram className="w-4 h-4 cursor-pointer hover:text-exclusive-red transition-colors" />
                <Linkedin className="w-4 h-4 cursor-pointer hover:text-exclusive-red transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Guarantees Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center pt-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
              <Truck className="w-8 h-8" />
            </div>
          </div>
          <h4 className="font-bold text-lg">{config.badgeDeliveryTitle || t('home.badge.delivery.title')}</h4>
          <p className="text-xs text-gray-500">{config.badgeDeliveryDesc || t('home.badge.delivery.desc')}</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
              <Headset className="w-8 h-8" />
            </div>
          </div>
          <h4 className="font-bold text-lg">{config.badgeServiceTitle || t('home.badge.service.title')}</h4>
          <p className="text-xs text-gray-500">{config.badgeServiceDesc || t('home.badge.service.desc')}</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <h4 className="font-bold text-lg">{config.badgeReturnTitle || t('home.badge.moneyBack.title')}</h4>
          <p className="text-xs text-gray-500">{config.badgeReturnDesc || t('home.badge.moneyBack.desc')}</p>
        </div>
      </div>

    </div>
  );
};
