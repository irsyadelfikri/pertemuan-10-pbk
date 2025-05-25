<template>
  <div class="menu-category">
    <div class="category-header">
      <div class="category-title">
        <span class="category-icon">{{ icon }}</span>
        <h2 class="category-name">{{ title }}</h2>
      </div>
      <div class="category-count">{{ items.length }} item</div>
    </div>
    
    <div class="category-items">
      <div v-for="item in items" :key="item.id || item.name" class="category-item">
        <div class="item-header">
          <div class="item-icon">{{ icon }}</div>
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-description">{{ item.description || 'Makanan lezat dengan cita rasa terbaik' }}</p>
          </div>
        </div>
        
        <div class="item-footer">
          <div class="item-price">
            <span class="price-currency">Rp</span>
            <span class="price-amount">{{ item.price.toLocaleString('id-ID') }}</span>
          </div>
          
          <button @click="addToCart(item)" class="add-btn">
            <span class="add-icon">➕</span>
            <span class="add-text">Tambah</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuCategory',
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    icon: {
      type: String,
      default: '🍽️'
    }
  },
  methods: {
    addToCart(item) {
      // Emit event ke parent component (Menu.vue)
      this.$emit('add-to-cart', item);
    }
  }
}
</script>