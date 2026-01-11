import React, { useState, useEffect } from 'react';
import CustomerOverview from './CustomerOverview';
import Marketplace from './Marketplace';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';
import RepairsTracker from './RepairsTracker';
import NewServiceRequest from './NewServiceRequest';
import CustomerProfile from './CustomerProfile';
import PaymentHistory from './PaymentHistory';
import WarrantyCenter from './WarrantyCenter';
import ReviewsAndRatings from './ReviewsAndRatings';
import ComplaintsAndHelp from './ComplaintsAndHelp';
import PromoLoyaltyHub from './PromoLoyaltyHub';
import Notifications from './Notifications';
import SmartHub from './SmartHub';
import CartService from '../../services/CartService';
import { ICONS } from '../../constants';

interface CustomerDashboardProps {
  activeTab: 'overview' | 'repairs' | 'orders' | 'profile' | 'marketplace' | 'cart' | 'checkout' | 'payments' | 'new-service' | 'warranty' | 'reviews' | 'help' | 'promo' | 'notifications' | 'smart';
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ activeTab }) => {
  const [currentView, setCurrentView] = useState(activeTab);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCurrentView(activeTab);
    updateCartCount();
    const handleCart = () => updateCartCount();
    window.addEventListener('cart-updated', handleCart);
    return () => window.removeEventListener('cart-updated', handleCart);
  }, [activeTab]);

  const updateCartCount = () => {
    const { itemCount } = CartService.getTotals();
    setCartCount(itemCount);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview': return <CustomerOverview />;
      case 'smart': return <SmartHub onNavigate={(path: any) => setCurrentView(path)} />;
      case 'repairs': return <RepairsTracker />;
      case 'warranty': return <WarrantyCenter />;
      case 'reviews': return <ReviewsAndRatings />;
      case 'help': return <ComplaintsAndHelp />;
      case 'promo': return <PromoLoyaltyHub />;
      case 'notifications': return <Notifications onNavigate={(path: any) => setCurrentView(path)} />;
      case 'new-service': return <NewServiceRequest onSuccess={() => setCurrentView('repairs')} onCancel={() => setCurrentView('repairs')} />;
      case 'orders': return <OrderHistory />;
      case 'payments': return <PaymentHistory />;
      case 'profile': return <CustomerProfile />;
      case 'marketplace': return <Marketplace />;
      case 'cart': return <Cart onProceedToCheckout={() => setCurrentView('checkout')} />;
      case 'checkout': return <Checkout />;
      default: return <CustomerOverview />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'overview': return 'Home Node';
      case 'smart': return 'Neural Intelligence Hub';
      case 'marketplace': return 'Sumatra Marketplace';
      case 'cart': return 'Keranjang Saya';
      case 'checkout': return 'Secure Checkout';
      case 'repairs': return 'Service Hub';
      case 'warranty': return 'Warranty Center';
      case 'reviews': return 'Ulasan & Rating';
      case 'help': return 'Pusat Bantuan';
      case 'promo': return 'Promo & Loyalty';
      case 'notifications': return 'Kotak Masuk';
      case 'new-service': return 'Ajukan Servis Baru';
      case 'orders': return 'Transaction Ledger';
      case 'payments': return 'Financial Ledger';
      case 'profile': return 'Profil & Pengaturan';
      default: return 'Customer Terminal';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
             {getTitle()}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Regional Ecosystem: <span className="text-indigo-400 font-bold">Sumatra-North-01</span></p>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={() => setCurrentView('smart')}
             className={`p-3 border rounded-2xl transition-all relative ${currentView === 'smart' ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-900 border-slate-800 text-indigo-400 hover:text-white'}`}
           >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
           </button>
           <button 
             onClick={() => setCurrentView('cart')}
             className={`p-3 border rounded-2xl transition-all relative ${currentView === 'cart' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
           >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth={2}/></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-slate-950 animate-in zoom-in">{cartCount}</span>}
           </button>
           <button 
             onClick={() => setCurrentView('new-service')}
             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
           >
             <ICONS.Plus className="w-5 h-5" /> Quick Service
           </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default CustomerDashboard;