<template>
  <div class="cart-page">
    <div class="cart-container">
      <!-- Cart Header -->
      <div class="cart-header">
        <h1 class="cart-title">
          <span class="title-icon">🛒</span>
          Keranjang Belanja
        </h1>
        <router-link to="/menu" class="back-to-menu">
          <span class="back-icon">⬅️</span>
          Kembali ke Menu
        </router-link>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2 class="empty-cart-title">Keranjang Kosong</h2>
        <p class="empty-cart-text">Belum ada makanan yang ditambahkan ke keranjang</p>
        <router-link to="/menu" class="shop-now-btn">
          <span class="btn-icon">🍽️</span>
          Mulai Belanja
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-item">
            <span class="summary-label">Total Item:</span>
            <span class="summary-value">{{ totalItems }} item</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Harga:</span>
            <span class="summary-value total-price">Rp {{ formatPrice(totalPrice) }}</span>
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-info">
              <div class="item-category" :class="`category-${item.category}`">
                {{ getCategoryIcon(item.category) }}
              </div>
              <div class="item-details">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-description">{{ item.description || 'Tidak ada deskripsi' }}</p>
                <div class="item-meta">
                  <span class="item-price">Rp {{ formatPrice(item.price) }}</span>
                  <span class="item-category-text">{{ getCategoryName(item.category) }}</span>
                </div>
              </div>
            </div>
            
            <div class="item-actions">
              <div class="quantity-controls">
                <button 
                  @click="decreaseQuantity(item)" 
                  class="quantity-btn minus" 
                  :disabled="item.quantity <= 1"
                >
                  <span>-</span>
                </button>
                <span class="quantity-display">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="quantity-btn plus">
                  <span>+</span>
                </button>
              </div>
              
              <div class="item-total">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">Rp {{ formatPrice(item.price * item.quantity) }}</span>
              </div>
              
              <button @click="removeFromCart(item)" class="remove-btn">
                <span class="remove-icon">🗑️</span>
                Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Checkout Section -->
        <div class="checkout-section">
          <div class="checkout-summary">
            <div class="summary-row">
              <span>Subtotal ({{ totalItems }} item):</span>
              <span>Rp {{ formatPrice(totalPrice) }}</span>
            </div>
            <div class="summary-row">
              <span>Biaya Pengiriman:</span>
              <span>Rp {{ formatPrice(shippingCost) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total Pembayaran:</span>
              <span>Rp {{ formatPrice(grandTotal) }}</span>
            </div>
          </div>
          
          <div class="checkout-actions">
            <button @click="clearCart" class="clear-cart-btn" :disabled="cartItems.length === 0">
              <span class="btn-icon">🗑️</span>
              Kosongkan Keranjang
            </button>
            
            <button @click="proceedToCheckout" class="checkout-btn" :disabled="cartItems.length === 0">
              <span class="btn-icon">💳</span>
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      </div>

      <!-- Success Notification -->
      <transition name="notification">
        <div v-if="showNotification" class="notification">
          <div class="notification-content">
            <span class="notification-icon">{{ notificationIcon }}</span>
            <span class="notification-text">{{ notificationMessage }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import '../css/cart.css'

export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [],
      shippingCost: 5000,
      showNotification: false,
      notificationMessage: '',
      notificationIcon: '✅',
      cartUpdateInterval: null
    }
  },
  
  computed: {
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    grandTotal() {
      return this.totalPrice + this.shippingCost;
    }
  },
  
  methods: {
    loadCart() {
      try {
        // Prioritas: localStorage > window.cartData
        let loadedCart = [];
        
        // Coba load dari localStorage dulu
        if (typeof Storage !== 'undefined' && localStorage.getItem('foodCart')) {
          const savedCart = localStorage.getItem('foodCart');
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            loadedCart = parsedCart;
          }
        }
        // Fallback ke window.cartData
        else if (window.cartData && Array.isArray(window.cartData)) {
          loadedCart = [...window.cartData];
        }
        
        // Validasi dan bersihkan data cart
        this.cartItems = loadedCart.filter(item => 
          item && 
          item.id && 
          item.name && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );
        
        // Sync dengan window.cartData
        if (typeof window !== 'undefined') {
          window.cartData = [...this.cartItems];
        }
        
      } catch (error) {
        console.error('Error loading cart:', error);
        this.cartItems = [];
        this.showNotificationMessage('Error memuat keranjang', '⚠️');
      }
    },
    
    saveCart() {
      try {
        // Simpan ke window.cartData
        if (typeof window !== 'undefined') {
          window.cartData = [...this.cartItems];
        }
        
        // Simpan ke localStorage jika tersedia
        if (typeof Storage !== 'undefined') {
          localStorage.setItem('foodCart', JSON.stringify(this.cartItems));
        }
        
        // Trigger event untuk komponen lain
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { cartItems: this.cartItems, totalItems: this.totalItems }
          }));
        }
        
      } catch (error) {
        console.error('Error saving cart:', error);
        this.showNotificationMessage('Error menyimpan keranjang', '⚠️');
      }
    },
    
    increaseQuantity(item) {
      const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex !== -1) {
        this.cartItems[itemIndex].quantity += 1;
        this.saveCart();
        this.showNotificationMessage(`${item.name} ditambahkan (${this.cartItems[itemIndex].quantity}x)`, '✅');
      }
    },
    
    decreaseQuantity(item) {
      const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex !== -1 && this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity -= 1;
        this.saveCart();
        this.showNotificationMessage(`${item.name} dikurangi (${this.cartItems[itemIndex].quantity}x)`, '✅');
      }
    },
    
    removeFromCart(item) {
      const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex !== -1) {
        const itemName = this.cartItems[itemIndex].name;
        this.cartItems.splice(itemIndex, 1);
        this.saveCart();
        this.showNotificationMessage(`${itemName} dihapus dari keranjang`, '🗑️');
      }
    },
    
    clearCart() {
      if (this.cartItems.length > 0) {
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
          this.cartItems = [];
          this.saveCart();
          this.showNotificationMessage('Keranjang telah dikosongkan', '🗑️');
        }
      }
    },
    
    proceedToCheckout() {
      if (this.cartItems.length === 0) {
        this.showNotificationMessage('Keranjang kosong! Tambahkan makanan terlebih dahulu', '⚠️');
        return;
      }
      
      // Simulasi proses checkout
      this.showNotificationMessage('Mengarahkan ke halaman pembayaran...', '💳');
      
      // Dalam aplikasi nyata, ini akan redirect ke halaman checkout
      setTimeout(() => {
        const confirmed = confirm(
          `Konfirmasi Checkout:\n\n` +
          `Total Item: ${this.totalItems}\n` +
          `Total Harga: Rp ${this.formatPrice(this.grandTotal)}\n\n` +
          `Lanjutkan ke pembayaran?`
        );
        
        if (confirmed) {
          this.processPayment();
        }
      }, 1500);
    },
    
    processPayment() {
      // Simulasi proses pembayaran
      this.showNotificationMessage('Memproses pembayaran...', '⏳');
      
      setTimeout(() => {
        // Simpan order ke history
        this.saveOrderToHistory();
        
        // Berhasil checkout
        this.showNotificationMessage('Pembayaran berhasil! Terima kasih telah berbelanja! 🎉', '✅');
        
        // Kosongkan cart setelah berhasil checkout
        setTimeout(() => {
          this.cartItems = [];
          this.saveCart();
        }, 2000);
        
      }, 2000);
    },
    
    saveOrderToHistory() {
      try {
        // Buat order object
        const order = {
          id: 'ORDER-' + Date.now(),
          date: new Date().toISOString(),
          items: [...this.cartItems],
          subtotal: this.totalPrice,
          shippingCost: this.shippingCost,
          total: this.grandTotal,
          totalItems: this.totalItems,
          status: 'completed',
          paymentMethod: 'Tunai', // Bisa disesuaikan
          customerInfo: {
            name: 'Customer', // Bisa disesuaikan
            address: 'Alamat pengiriman' // Bisa disesuaikan
          }
        };
        
        // Load existing orders
        let orders = [];
        if (typeof Storage !== 'undefined') {
          const savedOrders = localStorage.getItem('orderHistory');
          if (savedOrders) {
            orders = JSON.parse(savedOrders);
          }
        }
        
        // Jika localStorage tidak tersedia, gunakan window.orderHistory
        if (!Array.isArray(orders) && window.orderHistory) {
          orders = [...window.orderHistory];
        }
        
        // Tambahkan order baru ke array
        orders.unshift(order); // unshift untuk menaruh order terbaru di atas
        
        // Batasi maksimal 50 order untuk performa
        if (orders.length > 50) {
          orders = orders.slice(0, 50);
        }
        
        // Simpan ke localStorage
        if (typeof Storage !== 'undefined') {
          localStorage.setItem('orderHistory', JSON.stringify(orders));
        }
        
        // Simpan ke window.orderHistory sebagai backup
        window.orderHistory = [...orders];
        
        // Trigger event untuk komponen lain
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('orderCreated', { 
            detail: { order: order, orders: orders }
          }));
        }
        
        console.log('Order saved successfully:', order);
        
      } catch (error) {
        console.error('Error saving order to history:', error);
        this.showNotificationMessage('Error menyimpan riwayat pesanan', '⚠️');
      }
    },
    
    getCategoryIcon(category) {
      const icons = {
        'heavy': '🍛',
        'snack': '🥟',
        'drink': '🥤',
        'special': '⭐',
        'other': '🍽️'
      };
      return icons[category] || icons['other'];
    },
    
    getCategoryName(category) {
      const names = {
        'heavy': 'Makanan Berat',
        'snack': 'Snack',
        'drink': 'Minuman',
        'special': 'Menu Spesial',
        'other': 'Lainnya'
      };
      return names[category] || names['other'];
    },
    
    formatPrice(price) {
      if (typeof price !== 'number' || isNaN(price)) {
        return '0';
      }
      return price.toLocaleString('id-ID');
    },
    
    showNotificationMessage(message, icon = '✅') {
      this.notificationMessage = message;
      this.notificationIcon = icon;
      this.showNotification = true;
      
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },
    
    handleCartUpdate() {
      // Method untuk handle update cart dari external sources
      const currentCartString = JSON.stringify(this.cartItems);
      const windowCartString = window.cartData ? JSON.stringify(window.cartData) : '[]';
      
      if (currentCartString !== windowCartString) {
        this.loadCart();
      }
    }
  },
  
  created() {
    // Load cart data saat component dibuat
    this.loadCart();
  },
  
  mounted() {
    // Setup interval untuk check cart updates
    this.cartUpdateInterval = setInterval(this.handleCartUpdate, 2000);
    
    // Listen untuk custom event cart updates
    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', this.handleCartUpdate);
    }
  },
  
  beforeUnmount() {
    // Cleanup interval dan event listeners
    if (this.cartUpdateInterval) {
      clearInterval(this.cartUpdateInterval);
      this.cartUpdateInterval = null;
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('cartUpdated', this.handleCartUpdate);
    }
  }
}
</script>