import { SupportTicket, WarrantyClaim, CustomerComplaint, SupportStatus, WarrantyStatus, WarrantyRegistration } from '../types';

class SupportService {
  private static TICKETS_KEY = 'st_global_tickets';
  private static WARRANTIES_KEY = 'st_global_warranties';
  private static COMPLAINTS_KEY = 'st_global_complaints';
  private static REGISTRATIONS_KEY = 'st_warranty_registrations';

  private static init() {
    if (!localStorage.getItem(this.TICKETS_KEY)) {
      const initialTickets: SupportTicket[] = [
        {
          id: 'T-8801', storeId: 's1', storeName: 'Aceh Tech Center',
          customerName: 'Ali Akbar', deviceModel: 'MacBook Air M2',
          issueDescription: 'Screen flicker issue after 2 months.',
          status: SupportStatus.CHECKING, priority: 'HIGH',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          slaDeadline: new Date(Date.now() + 86400000).toISOString(),
          estimatedCost: 1500000
        },
        {
          id: 'T-8802', storeId: 's1', storeName: 'Aceh Tech Center',
          customerName: 'Siti Aminah', deviceModel: 'ThinkPad X1 Carbon',
          issueDescription: 'Keyboard water damage.',
          status: SupportStatus.REPAIRING, priority: 'URGENT',
          technicianName: 'Budi Santoso',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          slaDeadline: new Date(Date.now() - 3600000).toISOString(),
          estimatedCost: 850000
        },
        {
          id: 'T-7701', storeId: 's1', storeName: 'Aceh Tech Center',
          customerName: 'Teuku Ryan', deviceModel: 'Asus TUF Gaming F15',
          issueDescription: 'Thermal throttling & Fan noise.',
          status: SupportStatus.RESOLVED, priority: 'MEDIUM',
          technicianName: 'Budi Santoso',
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          slaDeadline: new Date(Date.now() - 345600000).toISOString(),
          estimatedCost: 450000,
          actualCost: 450000,
          technicalNotes: 'Pembersihan heatsink mendalam, ganti thermal paste (Arctic MX-4). Kipas kiri dibersihkan dari debu keras.',
          beforeImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=200',
          afterImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200'
        }
      ];
      localStorage.setItem(this.TICKETS_KEY, JSON.stringify(initialTickets));
    }
    if (!localStorage.getItem(this.REGISTRATIONS_KEY)) {
      const initialRegs: WarrantyRegistration[] = [
        { id: 'REG-001', storeId: 's1', productId: 'p-101', productName: 'Asus ROG G14', customerName: 'Ali Akbar', customerPhone: '0812345678', serialNumber: 'SN-ASUS-990011', purchaseDate: '2023-12-01', expiryDate: '2024-12-01', isActive: true }
      ];
      localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify(initialRegs));
    }
    if (!localStorage.getItem(this.WARRANTIES_KEY)) {
      const initialWarranties: WarrantyClaim[] = [
        {
          id: 'W-101', ticketId: 'T-8801', storeName: 'Aceh Tech Center',
          customerName: 'Ali Akbar', imei: 'SN-ASUS-990011',
          claimReason: 'Manufacturing defect - Display Panel',
          status: WarrantyStatus.PENDING, abuseRiskScore: 12,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.WARRANTIES_KEY, JSON.stringify(initialWarranties));
    }
    if (!localStorage.getItem(this.COMPLAINTS_KEY)) {
      const initialComplaints: CustomerComplaint[] = [
        {
          id: 'C-001', storeId: 's1', storeName: 'Aceh Tech Center',
          customerName: 'Sufyan', subject: 'Layanan Lambat',
          message: 'Laptop saya sudah seminggu belum ada kabar progres servisnya.',
          severity: 'MAJOR', isResolved: false, status: SupportStatus.OPEN,
          createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: 'C-002', storeId: 's1', storeName: 'Aceh Tech Center',
          customerName: 'Meutia', subject: 'Salah Sparepart',
          message: 'RAM yang dipasang tidak sesuai dengan invoice.',
          severity: 'CRITICAL', isResolved: false, status: SupportStatus.IN_PROGRESS,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(initialComplaints));
    }
  }

  static getTickets(storeId?: string): SupportTicket[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(this.TICKETS_KEY) || '[]');
    return storeId ? all.filter((t: SupportTicket) => t.storeId === storeId) : all;
  }

  static createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt'>) {
    const all = this.getTickets();
    const newTicket = { 
      ...ticket, 
      id: 'T-' + Math.floor(1000 + Math.random() * 9000), 
      createdAt: new Date().toISOString() 
    };
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify([newTicket, ...all]));
    return newTicket;
  }

  static updateTicket(id: string, updates: Partial<SupportTicket>) {
    const all = this.getTickets();
    const updated = all.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(updated));
  }

  static escalateTicket(id: string) {
    this.updateTicket(id, { status: SupportStatus.ESCALATED, priority: 'URGENT' });
  }

  static reassignTechnician(id: string, technicianName: string) {
    this.updateTicket(id, { technicianName });
  }

  static getWarrantyRegistrations(storeId: string): WarrantyRegistration[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]').filter((r: WarrantyRegistration) => r.storeId === storeId);
  }

  static getRegistrationByImei(imei: string): WarrantyRegistration | undefined {
    this.init();
    const all: WarrantyRegistration[] = JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]');
    return all.find(r => r.serialNumber === imei);
  }

  static registerWarranty(reg: Omit<WarrantyRegistration, 'id'>) {
    const all = JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]');
    const newReg = { ...reg, id: 'REG-' + Date.now() };
    localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify([newReg, ...all]));
  }

  static getWarranties(): WarrantyClaim[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.WARRANTIES_KEY) || '[]');
  }

  static updateWarranty(id: string, updates: Partial<WarrantyClaim>) {
    const warranties = this.getWarranties();
    const updated = warranties.map(w => w.id === id ? { ...w, ...updates } : w);
    localStorage.setItem(this.WARRANTIES_KEY, JSON.stringify(updated));
  }

  static updateWarrantyStatus(id: string, status: WarrantyStatus) {
    this.updateWarranty(id, { status });
  }

  static getComplaints(storeId?: string): CustomerComplaint[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(this.COMPLAINTS_KEY) || '[]');
    return storeId ? all.filter((c: CustomerComplaint) => c.storeId === storeId) : all;
  }

  static updateComplaint(id: string, updates: Partial<CustomerComplaint>) {
    const all = JSON.parse(localStorage.getItem(this.COMPLAINTS_KEY) || '[]');
    const updated = all.map((c: CustomerComplaint) => c.id === id ? { ...c, ...updates } : c);
    localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(updated));
  }

  static resolveComplaint(id: string, response: string) {
    this.updateComplaint(id, { isResolved: true, status: SupportStatus.RESOLVED, response });
  }

  static escalateComplaint(id: string) {
    this.updateComplaint(id, { status: SupportStatus.ESCALATED });
  }
}

export default SupportService;
