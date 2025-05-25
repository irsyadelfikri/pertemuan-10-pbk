<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/menu" class="nav-link">Menu</router-link>
        <router-link to="/cart" class="nav-link">Keranjang</router-link>
        <router-link to="/orders" class="nav-link">Pesanan</router-link>
      </div>
      
      <div class="nav-right">
        <div v-if="currentUser" class="user-section">
          <span class="welcome-text">Halo, {{ currentUser.name }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
        <div v-else class="auth-section">
          <router-link to="/login" class="login-btn">Login</router-link>
          <router-link to="/register" class="register-btn">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import '../css/navbar.css'

const currentUser = ref(null)
const router = useRouter()

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  if (user) {
    currentUser.value = user
  }
})

const logout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push('/login')
}
</script>