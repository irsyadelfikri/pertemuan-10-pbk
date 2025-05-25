<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Buat Akun Baru</h2>
          <p>Bergabunglah dengan FoodieOrder dan nikmati pengalaman pesan makanan yang luar biasa!</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input 
              id="name"
              v-model="name" 
              type="text" 
              required 
              placeholder="Masukkan nama lengkap Anda"
              class="form-input"
            />
          </div>
          
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
              placeholder="Buat password yang kuat"
              class="form-input"
            />
          </div>
          
          <button type="submit" class="auth-btn">
            <span>Daftar Sekarang</span>
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
          <p>Sudah punya akun? <router-link to="/login" class="auth-link">Masuk di sini</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../css/register.css'

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleRegister = () => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const existingUser = users.find(u => u.email === email.value)
  if (existingUser) {
    errorMessage.value = 'Email sudah terdaftar.'
  } else {
    const newUser = { name: name.value, email: email.value, password: password.value }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    router.push('/')
  }
}
</script>