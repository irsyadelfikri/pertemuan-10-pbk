import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user' // pastikan path sesuai struktur proyekmu

describe('User Store', () => {
  beforeEach(() => {
    // Aktifkan Pinia untuk setiap test
    setActivePinia(createPinia())
  })

  it('default currentUser adalah null', () => {
    const userStore = useUserStore()
    expect(userStore.currentUser).toBe(null)
  })

  it('login() menyimpan data user ke currentUser', () => {
    const userStore = useUserStore()
    const dummyUser = { name: 'Irsyad', email: 'irsyadelf@mail.com' }

    userStore.login(dummyUser)

    expect(userStore.currentUser).toEqual(dummyUser)
  })

  it('logout() menghapus currentUser menjadi null', () => {
    const userStore = useUserStore()
    userStore.login({ name: 'Irsyad' }) // login dulu
    userStore.logout() // lalu logout

    expect(userStore.currentUser).toBe(null)
  })
})
