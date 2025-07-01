<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Masuk ke Akun</h2>
          <p>Selamat datang kembali! Silakan masuk ke akun Anda.</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              required 
              placeholder="Masukkan email Anda"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              required 
              placeholder="Masukkan password Anda"
              class="form-input"
            />
          </div>
          
          <button type="submit" class="auth-btn">
            <span>Masuk</span>
            <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
        
        <div v-if="errorMessage" class="error-message">
          <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ errorMessage }}
        </div>
        
        <div class="auth-footer">
          <p>Belum punya akun? <router-link to="/register" class="auth-link">Daftar di sini</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user' // ✅ Tambahan: import store
import '../css/login.css'
console.log('Login.vue berhasil dimuat')

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const userStore = useUserStore() // ✅ Tambahan: inisialisasi store

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const user = users.find(u => u.email === email.value && u.password === password.value)

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    userStore.login(user) // ✅ Tambahan: simpan user ke Pinia
    router.push('/')
  } else {
    errorMessage.value = 'Email atau password salah.'
  }
}
</script>
