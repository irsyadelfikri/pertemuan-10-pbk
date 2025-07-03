<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-background">
        <div class="floating-food">🍕</div>
        <div class="floating-food">🍔</div>
        <div class="floating-food">🍜</div>
        <div class="floating-food">🥗</div>
        <div class="floating-food">🍰</div>
        <div class="floating-food">🍻</div>
      </div>
      
      <div class="hero-content">
        <div class="logo-section">
          <div class="logo-icon">🍽️</div>
          <h1 class="app-title">
            <span class="title-part">Foodie</span><span class="title-accent">Order</span>
          </h1>
        </div>
        
        <div class="welcome-text">
          <h2 class="welcome-heading">Selamat Datang!</h2>
          <p class="app-description">
            FoodieOrder adalah aplikasi pemesanan makanan online yang dirancang untuk memudahkan pengguna dalam memilih,
            memesan, dan melacak makanan favorit mereka. Aplikasi ini memungkinkan pengguna untuk melihat menu makanan,
            menambahkan makanan ke keranjang, melakukan pemesanan, serta login atau mendaftar sebagai pengguna.
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Easy Ordering</h3>
            <p>Pesan makanan favorit dengan mudah dan cepat</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Pengiriman cepat langsung ke lokasi Anda</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Pembayaran aman dengan berbagai metode</p>
          </div>
        </div>
        
        <div class="cta-buttons">
          <button @click="goToMenu" class="btn btn-primary">
            <span>Lihat Menu</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>
    
    <footer class="footer">
      <div class="social-links">
        <a href="https://www.instagram.com/irsyadellfkrii" target="_blank">Instagram</a> |
        <a href="https://www.facebook.com/irsyadelfkrii?mibextid=JRoKGi" target="_blank">Facebook</a> |
        <a href="https://youtu.be/Tcx8VPuRugc" target="_blank">YouTube</a>
      </div>
      <p class="footer-note">© 2025 FoodieOrder. All rights reserved.</p>
    </footer>
</div>
</template>

<script>
import '../css/home.css';

export default {
  name: 'Home',
  methods: {
    goToMenu() {
      // Navigasi ke halaman menu
      this.$router.push('/menu');
    }
  }
}
</script>
