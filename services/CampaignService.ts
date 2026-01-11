
import { GlobalCampaign, Banner } from '../types';

class CampaignService {
  private static CAMPAIGNS_KEY = 'st_global_campaigns';
  private static BANNERS_KEY = 'st_global_banners';

  private static init() {
    if (!localStorage.getItem(this.CAMPAIGNS_KEY)) {
      const initialCampaigns: GlobalCampaign[] = [
        {
          id: 'cmp-1',
          title: 'Ramadan Tech Sale 2024',
          discountRate: 15,
          startDate: '2024-03-01',
          endDate: '2024-04-10',
          isActive: true
        }
      ];
      localStorage.setItem(this.CAMPAIGNS_KEY, JSON.stringify(initialCampaigns));
    }
    if (!localStorage.getItem(this.BANNERS_KEY)) {
      const initialBanners: Banner[] = [
        {
          id: 'bnr-1',
          title: 'New Store Launch',
          imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
          link: '/featured',
          position: 'top',
          isActive: true
        }
      ];
      localStorage.setItem(this.BANNERS_KEY, JSON.stringify(initialBanners));
    }
  }

  static getCampaigns(): GlobalCampaign[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.CAMPAIGNS_KEY) || '[]');
  }

  static saveCampaign(campaign: GlobalCampaign) {
    const campaigns = this.getCampaigns();
    const idx = campaigns.findIndex(c => c.id === campaign.id);
    if (idx !== -1) {
      campaigns[idx] = campaign;
    } else {
      campaigns.push({ ...campaign, id: 'cmp-' + Math.random().toString(36).substr(2, 9) });
    }
    localStorage.setItem(this.CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }

  static getBanners(): Banner[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.BANNERS_KEY) || '[]');
  }

  static toggleBanner(id: string) {
    const banners = this.getBanners();
    const updated = banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    localStorage.setItem(this.BANNERS_KEY, JSON.stringify(updated));
  }
}

export default CampaignService;
