import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

class CartService {
  private static STORAGE_KEY = 'st_customer_cart';

  static getCart(): CartItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static addToCart(product: Product) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  }

  static removeFromCart(productId: string) {
    const cart = this.getCart().filter(item => item.id !== productId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  }

  static updateQuantity(productId: string, delta: number) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    }
  }

  static clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.dispatchEvent(new Event('cart-updated'));
  }

  static getTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.quantity, 0);
    return {
      subtotal,
      itemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    };
  }
}

export default CartService;