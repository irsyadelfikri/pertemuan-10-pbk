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

      <!-- Snack Section -->
      <div class="food-list-section">
        <div class="section-header">
          <h2 class="section-title">🍘 Snack</h2>
          <p class="section-subtitle">Cemilan enak untuk menemani hari Anda</p>
        </div>

        <div class="food-grid">
          <div v-for="item in snacks" :key="item.id" class="food-card">
            <div class="food-card-header">
              <div class="food-emoji">🍘</div>
              <div class="food-badge">Snack</div>
            </div>

            <div class="food-card-content">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-description">{{ item.description }}</p>

              <div class="food-card-footer">
                <div class="food-price">
                  <span class="price-label">Harga:</span>
                  <span class="price-value">Rp {{ item.price.toLocaleString("id-ID") }}</span>
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

      <!-- Minuman Section -->
      <div class="food-list-section">
        <div class="section-header">
          <h2 class="section-title">🥤 Minuman</h2>
          <p class="section-subtitle">Minuman segar untuk menyegarkan harimu</p>
        </div>

        <div class="food-grid">
          <div v-for="item in drinks" :key="item.id" class="food-card">
            <div class="food-card-header">
              <div class="food-emoji">🥤</div>
              <div class="food-badge">Minuman</div>
            </div>

            <div class="food-card-content">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-description">{{ item.description }}</p>

              <div class="food-card-footer">
                <div class="food-price">
                  <span class="price-label">Harga:</span>
                  <span class="price-value">Rp {{ item.price.toLocaleString("id-ID") }}</span>
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

      <!-- Spesial Section -->
      <div class="food-list-section">
        <div class="section-header">
          <h2 class="section-title"><span class="section-icon">⭐</span> Menu Spesial</h2>
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
                  <span class="price-value">Rp {{ item.price.toLocaleString("id-ID") }}</span>
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

      <!-- Notification -->
      <div v-if="showNotification" class="cart-notification" :class="{ show: showNotification }">
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
import MenuCategory from "../components/MenuCategory.vue";
import "../css/menu.css";

export default {
  name: "Menu",
  components: {
    MenuCategory,
  },
  data() {
    return {
      snacks: [],
      drinks: [],
      foodList: [],
      showNotification: false,
      notificationMessage: "",
    };
  },
  computed: {
    async cartItemCount() {
      const cart = await this.getCart();
      return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    },
  },
  methods: {
    async addToCart(item) {
      if (!item.id) {
        item.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      let cart = await this.getCart();
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
        this.showCartNotification(`${item.name} (${cart[existingItemIndex].quantity}x) sudah di keranjang!`);
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category || "other",
          quantity: 1,
          dateAdded: new Date().toISOString(),
        });
        this.showCartNotification(`${item.name} ditambahkan ke keranjang!`);
      }

      await this.saveCart(cart);
      this.$emit("cart-updated", cart);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    },

    async getCart() {
      try {
        const response = await fetch("https://foodieorder.glitch.me/keranjang");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Gagal mengambil cart dari server:", error);
        return [];
      }
    },

    async saveCart(cart) {
      try {
        const response = await fetch("https://foodieorder.glitch.me/keranjang");
        const existing = await response.json();

        for (const item of existing) {
          await fetch(`https://foodieorder.glitch.me/keranjang/${item.id}`, { method: "DELETE" });
        }

        for (const item of cart) {
          await fetch("https://foodieorder.glitch.me/keranjang", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
        }
      } catch (error) {
        console.error("Gagal menyimpan cart:", error);
      }
    },

    showCartNotification(message) {
      this.notificationMessage = message;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 4000);
    },

    async fetchFoodFromAPI() {
      try {
        const res = await fetch("https://foodieorder.glitch.me/foods");
        const data = await res.json();
        this.foodList = data.filter(item => item.category === "spesial");
        this.snacks = data.filter(item => item.category === "snack");
        this.drinks = data.filter(item => item.category === "drink");
      } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
      }
    },
  },

  mounted() {
    this.fetchFoodFromAPI();
  },
};
</script>
