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
      foodList: [],
      
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
      if (!item.id) {
        item.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      let cart = this.getCart();
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        this.showCartNotification(`${item.name} (${cart[existingItemIndex].quantity}x) sudah di keranjang!`);
      } else {
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
      this.$emit('cart-updated', cart);
    },
    
    getCart() {
      if (!window.cartData) {
        window.cartData = [];
      }
      return [...window.cartData];
    },
    
    saveCart(cart) {
      window.cartData = cart;
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
    },

    // ✅ Tambahan: Ambil data dari API dan gabungkan ke foodList
    async fetchFoodFromAPI() {
      try {
        const res = await fetch('http://localhost:3000/foods')
        const data = await res.json()
        this.foodList = [...this.foodList, ...data]
      } catch (error) {
        console.error('Gagal mengambil data dari API:', error)
      }
    }
  },
  
  mounted() {
    this.loadCartFromStorage()
    this.fetchFoodFromAPI() // ✅ Tambahan: ambil data dari json-server
  }
}
</script>