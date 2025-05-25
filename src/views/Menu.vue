<template>
  <div class="menu-page">
    <div class="menu-container">
      <div class="menu-header">
        <h1 class="menu-title">
          <span class="title-icon">🍽️</span>
          Daftar Menu Makanan
        </h1>
        <p class="menu-subtitle">Pilihan terbaik untuk setiap selera</p>
        
        <!-- Cart Summary -->
        <div class="cart-summary" v-if="cartItemCount > 0">
          <router-link to="/cart" class="cart-link">
            <span class="cart-icon">🛒</span>
            <span class="cart-count">{{ cartItemCount }}</span>
            <span class="cart-text">Lihat Keranjang</span>
          </router-link>
        </div>
      </div>
      
      <!-- Kategori Menu -->
      <MenuCategory
        title="Makanan Berat"
        :items="heavyMeals"
        icon="🍛"
        class="category-heavy"
        @add-to-cart="addToCart"
      />
      
      <MenuCategory
        title="Snack"
        :items="snacks"
        icon="🥟"
        class="category-snack"
        @add-to-cart="addToCart"
      />
      
      <MenuCategory
        title="Minuman"
        :items="drinks" 
        icon="🥤"
        class="category-drink"
        @add-to-cart="addToCart"
      />
      
      <!-- Food List Section -->
      <div class="food-list-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">⭐</span>
            Menu Spesial
          </h2>
          <p class="section-subtitle">Rekomendasi pilihan terbaik kami</p>
        </div>
        
        <div class="food-grid">
          <div v-for="item in foodList" :key="item.id" class="food-card">
            <div class="food-card-header">
              <div class="food-emoji">🍽️</div>
              <div class="food-badge">Spesial</div>
            </div>
            
            <div class="food-card-content">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-description">{{ item.description }}</p>
              
              <div class="food-card-footer">
                <div class="food-price">
                  <span class="price-label">Harga:</span>
                  <span class="price-value">Rp {{ item.price.toLocaleString('id-ID') }}</span>
                </div>
                
                <button @click="addToCart(item)" class="add-to-cart-btn">
                  <span class="btn-icon">🛒</span>
                  <span class="btn-text">Tambahkan ke keranjang</span>
                  <div class="btn-ripple"></div>
                </button>
              </div>
            </div>
            
            <div class="card-shine"></div>
          </div>
        </div>
      </div>
      
      <!-- Cart Notification -->
      <div v-if="showNotification" class="cart-notification" :class="{ 'show': showNotification }">
        <div class="notification-content">
          <span class="notification-icon">✅</span>
          <span class="notification-text">{{ notificationMessage }}</span>
          <router-link to="/cart" class="notification-link">Lihat Keranjang</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuCategory from '../components/MenuCategory.vue'
import '../css/menu.css'

export default {
  name: 'Menu',
  components: {
    MenuCategory
  },
  data() {
    return {
      // Data untuk kategori menu
      heavyMeals: [
        { id: 101, name: 'Nasi Goreng', price: 15000, category: 'heavy', description: 'Nasi goreng dengan bumbu spesial dan telur mata sapi' },
        { id: 102, name: 'Mie Ayam', price: 12000, category: 'heavy', description: 'Mie ayam dengan bakso dan pangsit goreng' },
        { id: 103, name: 'Soto Ayam', price: 18000, category: 'heavy', description: 'Soto ayam kuning dengan nasi dan kerupuk' }
      ],
      snacks: [
        { id: 201, name: 'Siomay', price: 10000, category: 'snack', description: 'Siomay ikan dengan saus kacang dan kecap manis' },
        { id: 202, name: 'Risoles', price: 5000, category: 'snack', description: 'Risoles isi sayuran dan daging cincang' },
        { id: 203, name: 'Pisang Goreng', price: 7000, category: 'snack', description: 'Pisang goreng crispy dengan taburan gula halus' }
      ],
      drinks: [
        { id: 301, name: 'Teh Manis', price: 5000, category: 'drink', description: 'Teh manis hangat dengan gula aren' },
        { id: 302, name: 'Es Jeruk', price: 6000, category: 'drink', description: 'Es jeruk segar dengan potongan jeruk asli' },
        { id: 303, name: 'Jus Alpukat', price: 10000, category: 'drink', description: 'Jus alpukat segar dengan susu kental manis' }
      ],
      
      // Data untuk food list spesial
      foodList: [
        { 
          id: 1, 
          name: 'Nasi Goreng Spesial', 
          description: 'Nasi goreng dengan telur, ayam, dan sayuran segar yang lezat', 
          price: 25000,
          category: 'spesial'
        },
        { 
          id: 2, 
          name: 'Mie Ayam Premium', 
          description: 'Mie ayam dengan topping lengkap dan kuah kaldu yang gurih', 
          price: 20000,
          category: 'spesial'
        },
        { 
          id: 3, 
          name: 'Gado-Gado Jakarta', 
          description: 'Sayuran segar dengan bumbu kacang khas Jakarta yang autentik', 
          price: 18000,
          category: 'spesial'
        },
        { 
          id: 4, 
          name: 'Sate Ayam Madura', 
          description: 'Sate ayam bakar dengan bumbu kacang Madura yang pedas manis', 
          price: 30000,
          category: 'spesial'
        }
      ],
      
      // Notification state
      showNotification: false,
      notificationMessage: ''
    }
  },
  computed: {
    cartItemCount() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }
  },
  methods: {
    addToCart(item) {
      // Pastikan item memiliki ID yang unik
      if (!item.id) {
        item.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      let cart = this.getCart();
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item sudah ada, tambah quantity
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        this.showCartNotification(`${item.name} (${cart[existingItemIndex].quantity}x) sudah di keranjang!`);
      } else {
        // Item baru, tambah ke cart
        const cartItem = {
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category || 'other',
          quantity: 1,
          dateAdded: new Date().toISOString()
        };
        cart.push(cartItem);
        this.showCartNotification(`${item.name} ditambahkan ke keranjang!`);
      }
      
      this.saveCart(cart);
      
      // Emit event untuk update global state jika ada
      this.$emit('cart-updated', cart);
    },
    
    getCart() {
      // Menggunakan window.cartData sebagai pengganti localStorage
      if (!window.cartData) {
        window.cartData = [];
      }
      return [...window.cartData]; // Return copy untuk menghindari mutasi langsung
    },
    
    saveCart(cart) {
      window.cartData = cart;
      
      // Juga simpan ke localStorage jika tersedia (untuk penggunaan di luar artifact)
      if (typeof Storage !== 'undefined') {
        try {
          localStorage.setItem('foodCart', JSON.stringify(cart));
        } catch (error) {
          console.log('localStorage tidak tersedia:', error);
        }
      }
    },
    
    showCartNotification(message) {
      this.notificationMessage = message;
      this.showNotification = true;
      
      setTimeout(() => {
        this.showNotification = false;
      }, 4000);
    },
    
    // Method untuk load cart dari localStorage jika tersedia
    loadCartFromStorage() {
      if (typeof Storage !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('foodCart');
          if (savedCart) {
            window.cartData = JSON.parse(savedCart);
          }
        } catch (error) {
          console.log('Error loading cart from localStorage:', error);
        }
      }
    }
  },
  
  mounted() {
    // Load cart data saat component dimount
    this.loadCartFromStorage();
  }
}
</script>
