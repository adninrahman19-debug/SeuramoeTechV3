
import { Review } from '../types';

class ReviewService {
  private static STORAGE_KEY = 'st_store_reviews';

  private static init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initial: Review[] = [
        { id: 'rev-1', storeId: 's1', customerName: 'Rahmat Hidayat', rating: 5, comment: 'Layanan cepat dan teknisi sangat ahli. Laptop saya kembali normal hanya dalam 1 hari!', status: 'active', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'rev-2', storeId: 's1', productId: 'p-101', productName: 'Asus ROG G14', customerName: 'Dian Sastro', rating: 4, comment: 'Barang ori dan bergaransi resmi. Pengiriman ke Meulaboh aman.', reply: 'Terima kasih kak Dian, semoga awet ya laptopnya!', status: 'active', createdAt: new Date(Date.now() - 345600000).toISOString() },
        { id: 'rev-3', storeId: 's1', customerName: 'Anonim', rating: 1, comment: 'Kata kasar dan spam iklan kompetitor.', status: 'hidden', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    }
  }

  static getReviews(storeId: string): Review[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return all.filter((r: Review) => r.storeId === storeId);
  }

  static reply(id: string, reply: string) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const updated = all.map((r: Review) => r.id === id ? { ...r, reply } : r);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  static toggleVisibility(id: string) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const updated = all.map((r: Review) => r.id === id ? { ...r, status: r.status === 'active' ? 'hidden' : 'active' } : r);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  static getSatisfactionStats(storeId: string) {
    const reviews = this.getReviews(storeId).filter(r => r.status === 'active');
    if (reviews.length === 0) return { avg: 0, total: 0, distribution: [0,0,0,0,0] };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const dist = [0,0,0,0,0];
    reviews.forEach(r => dist[r.rating - 1]++);

    return {
      avg: parseFloat((sum / reviews.length).toFixed(1)),
      total: reviews.length,
      distribution: dist.reverse() // 5, 4, 3, 2, 1
    };
  }
}

export default ReviewService;
