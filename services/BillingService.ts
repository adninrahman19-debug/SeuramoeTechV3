
import { SubscriptionPlan, SubscriptionTier, RevenueConfig, Invoice, SubscriptionStatus, User } from '../types';
import AuthService from '../auth/AuthService';

class BillingService {
  private static PLANS_KEY = 'st_plans';
  private static REVENUE_KEY = 'st_rev_config';
  private static INVOICES_KEY = 'st_invoices';

  private static init() {
    if (!localStorage.getItem(this.PLANS_KEY)) {
      const initialPlans: SubscriptionPlan[] = [
        {
          id: 'p1', name: 'Standard Aceh', tier: SubscriptionTier.BASIC,
          priceMonthly: 499000, priceYearly: 4990000,
          limits: { stores: 1, staff: 3, products: 100, tickets: 20 },
          features: { branding: false, advancedAnalytics: false, reportingDepth: 'daily' },
          description: 'Solusi retail dasar untuk toko komputer lokal.'
        },
        {
          id: 'p2', name: 'Sumatra Expansion', tier: SubscriptionTier.PRO,
          priceMonthly: 1299000, priceYearly: 12990000,
          limits: { stores: 3, staff: 10, products: 1000, tickets: 100 },
          features: { branding: true, advancedAnalytics: true, reportingDepth: 'monthly' },
          description: 'Paket terpopuler untuk pertumbuhan bisnis lintas kota.'
        },
        {
          id: 'p3', name: 'Tech Giant', tier: SubscriptionTier.ENTERPRISE,
          priceMonthly: 2999000, priceYearly: 29990000,
          limits: { stores: 99, staff: 99, products: 99999, tickets: 99999 },
          features: { branding: true, advancedAnalytics: true, reportingDepth: 'yearly' },
          description: 'Skala korporasi dengan dukungan prioritas dan custom branding.'
        }
      ];
      localStorage.setItem(this.PLANS_KEY, JSON.stringify(initialPlans));
    }
    if (!localStorage.getItem(this.REVENUE_KEY)) {
      localStorage.setItem(this.REVENUE_KEY, JSON.stringify({
        platformCommission: 10,
        taxRate: 11,
        revenueSplit: { platform: 100, referral: 0 }
      }));
    }
    if (!localStorage.getItem(this.INVOICES_KEY)) {
      const initialInvoices: Invoice[] = [
        { id: 'INV-8801', userId: 'u2', userName: 'Teuku Abdullah', amount: 1299000, status: 'paid', date: '2023-12-01', planName: 'Sumatra Expansion (Monthly)' },
        { id: 'INV-9902', userId: 'u2', userName: 'Teuku Abdullah', amount: 1299000, status: 'paid', date: '2024-01-01', planName: 'Sumatra Expansion (Monthly)' },
        { id: 'INV-1023', userId: 'u2', userName: 'Teuku Abdullah', amount: 1299000, status: 'paid', date: '2024-02-01', planName: 'Sumatra Expansion (Monthly)' },
      ];
      localStorage.setItem(this.INVOICES_KEY, JSON.stringify(initialInvoices));
    }
  }

  static getPlans(): SubscriptionPlan[] { 
    this.init(); 
    return JSON.parse(localStorage.getItem(this.PLANS_KEY) || '[]'); 
  }

  // Add comment: Fix missing savePlan method
  static savePlan(plan: SubscriptionPlan) {
    const plans = this.getPlans();
    const idx = plans.findIndex(p => p.id === plan.id);
    if (idx !== -1) {
      plans[idx] = plan;
    } else {
      plans.push({ ...plan, id: 'p-' + Math.random().toString(36).substr(2, 9) });
    }
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
  }

  // Add comment: Fix missing deletePlan method
  static deletePlan(id: string) {
    const plans = this.getPlans();
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans.filter(p => p.id !== id)));
  }

  static getInvoicesForUser(userId: string): Invoice[] {
    this.init();
    const all: Invoice[] = JSON.parse(localStorage.getItem(this.INVOICES_KEY) || '[]');
    return all.filter(inv => inv.userId === userId);
  }

  static toggleAutoRenew(userId: string) {
    const users = AuthService.getAllUsers();
    const updated = users.map(u => u.id === userId ? { ...u, autoRenew: !u.autoRenew } : u);
    localStorage.setItem('st_users_database', JSON.stringify(updated));
    
    const current = AuthService.getCurrentUser();
    if (current?.id === userId) {
      localStorage.setItem('st_auth_user', JSON.stringify({ ...current, autoRenew: !current.autoRenew }));
    }
  }

  static upgradePlan(userId: string, tier: SubscriptionTier) {
    const plans = this.getPlans();
    const plan = plans.find(p => p.tier === tier);
    if (!plan) return;

    // Simulate Payment
    this.forceOverrideSubscription(userId, tier);
    this.generateInvoice(userId, plan);
  }
  
  static forceOverrideSubscription(userId: string, tier: SubscriptionTier) {
    const users = AuthService.getAllUsers();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          subscriptionTier: tier,
          isSubscriptionActive: true,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          subscriptionExpiry: expiry.toISOString().split('T')[0],
          status: 'active' as const
        };
      }
      return u;
    });
    localStorage.setItem('st_users_database', JSON.stringify(updatedUsers));
    
    const current = AuthService.getCurrentUser();
    if (current && current.id === userId) {
      const target = updatedUsers.find(u => u.id === userId);
      localStorage.setItem('st_auth_user', JSON.stringify(target));
    }
  }

  static getRevenueConfig(): RevenueConfig { 
    this.init();
    return JSON.parse(localStorage.getItem(this.REVENUE_KEY) || '{}'); 
  }
  
  static updateRevenueConfig(config: RevenueConfig) { 
    localStorage.setItem(this.REVENUE_KEY, JSON.stringify(config)); 
  }

  static getInvoices(): Invoice[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.INVOICES_KEY) || '[]');
  }

  static generateInvoice(userId: string, plan: SubscriptionPlan): Invoice {
    const user = AuthService.getAllUsers().find(u => u.id === userId);
    const newInvoice: Invoice = {
      id: 'INV-' + Math.floor(1000 + Math.random() * 9000),
      userId,
      userName: user?.fullName || 'Store Owner',
      amount: plan.priceMonthly,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      planName: plan.name + ' (Monthly)'
    };
    const current = this.getInvoices();
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify([newInvoice, ...current]));
    return newInvoice;
  }
}

export default BillingService;
