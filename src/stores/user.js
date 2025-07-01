// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),
  actions: {
    login(user) {
      this.currentUser = user
    },
    logout() {
      this.currentUser = null
    }
  }
})