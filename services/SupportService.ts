
import { SupportTicket, WarrantyClaim, CustomerComplaint, SupportStatus, WarrantyStatus, WarrantyRegistration } from '../types';

class SupportService {
  private static TICKETS_KEY = 'st_global_tickets';
  private static REGISTRATIONS_KEY = 'st_warranty_registrations';
  private static WARRANTIES_KEY = 'st_global_warranties';
  private static COMPLAINTS_KEY = 'st_global_complaints';

  private static init() {
    if (!localStorage.getItem(this.TICKETS_KEY)) {
      localStorage.setItem(this.TICKETS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.REGISTRATIONS_KEY)) {
      // Mock some registrations for demo users
      const mock: WarrantyRegistration[] = [
        { id: 'REG-1', storeId: 's1', productId: 'p-101', productName: 'Asus ROG G14', customerName: 'Ali Akbar', customerPhone: '081233334444', serialNumber: 'ROG-G14-SUM-001', purchaseDate: '2023-10-01', expiryDate: '2024-10-01', isActive: true }
      ];
      localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify(mock));
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
    window.dispatchEvent(new Event('tickets-updated'));
    return newTicket;
  }

  static updateTicket(id: string, updates: Partial<SupportTicket>) {
    const all = this.getTickets();
    const updated = all.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tickets-updated'));
  }

  static escalateTicket(id: string) {
    this.updateTicket(id, { status: SupportStatus.ESCALATED, priority: 'URGENT' });
  }

  static reassignTechnician(id: string, technicianName: string) {
    this.updateTicket(id, { technicianName });
  }

  static deleteTicket(id: string) {
    const all = this.getTickets();
    const updated = all.filter(t => t.id !== id);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tickets-updated'));
  }

  // --- Warranty Logic ---
  static getWarrantyRegistrations(storeId: string): WarrantyRegistration[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]');
    return all.filter((r: WarrantyRegistration) => r.storeId === storeId);
  }

  static getRegistrationByImei(imei: string): WarrantyRegistration | undefined {
    const all = JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]');
    return all.find((r: WarrantyRegistration) => r.serialNumber === imei);
  }

  static registerWarranty(reg: Omit<WarrantyRegistration, 'id'>) {
    const all = JSON.parse(localStorage.getItem(this.REGISTRATIONS_KEY) || '[]');
    const newReg = { ...reg, id: 'REG-' + Date.now() };
    localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify([newReg, ...all]));
    window.dispatchEvent(new Event('warranties-updated'));
  }

  static getWarranties(): WarrantyClaim[] {
    const stored = localStorage.getItem(this.WARRANTIES_KEY);
    if (!stored) {
       // Mock for demo
       const mock: WarrantyClaim[] = [
         { id: 'CL-8821', ticketId: 'T-101', storeName: 'Aceh Tech', customerName: 'Ali Akbar', imei: 'ROG-G14-SUM-001', claimReason: 'Layar bergaris', status: WarrantyStatus.PENDING, abuseRiskScore: 12, createdAt: new Date().toISOString() }
       ];
       localStorage.setItem(this.WARRANTIES_KEY, JSON.stringify(mock));
       return mock;
    }
    return JSON.parse(stored);
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
    const all = JSON.parse(localStorage.getItem(this.COMPLAINTS_KEY) || '[]');
    return storeId ? all.filter((c: CustomerComplaint) => c.storeId === storeId) : all;
  }

  static createComplaint(complaint: Omit<CustomerComplaint, 'id' | 'createdAt' | 'isResolved' | 'status'>) {
    const all = this.getComplaints();
    const newComplaint = {
      ...complaint,
      id: 'C-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      isResolved: false,
      status: SupportStatus.OPEN
    };
    localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify([newComplaint, ...all]));
    window.dispatchEvent(new Event('complaints-updated'));
    return newComplaint;
  }

  static resolveComplaint(id: string, response: string) {
    const all = this.getComplaints();
    const updated = all.map((c: CustomerComplaint) => c.id === id ? { ...c, isResolved: true, status: SupportStatus.RESOLVED, response } : c);
    localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('complaints-updated'));
  }

  static escalateComplaint(id: string) {
    const all = this.getComplaints();
    const updated = all.map((c: CustomerComplaint) => c.id === id ? { ...c, status: SupportStatus.ESCALATED } : c);
    localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('complaints-updated'));
  }
}

export default SupportService;
