<template>
  <div class="orders-page">
    <div class="orders-container">
      <!-- Orders Header -->
      <div class="orders-header">
        <h1 class="orders-title">
          <span class="title-icon">📋</span>
          Riwayat Pesanan
        </h1>
        <div class="header-actions">
          <button
            @click="refreshOrders"
            class="refresh-btn"
            :disabled="isLoading"
          >
            <span class="btn-icon">{{ isLoading ? "⏳" : "" }}</span>
            {{ isLoading ? "Memuat..." : "Refresh" }}
          </button>
          <router-link to="/menu" class="back-to-menu">
            <span class="back-icon"></span>
            Kembali ke Menu
          </router-link>
        </div>
      </div>

      <!-- Orders Stats -->
      <div class="orders-stats">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-number">{{ orders.length }}</span>
            <span class="stat-label">Total Pesanan</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <span class="stat-number">Rp {{ formatPrice(totalSpent) }}</span>
            <span class="stat-label">Total Pengeluaran</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🍽️</div>
          <div class="stat-info">
            <span class="stat-number">{{ totalItemsPurchased }}</span>
            <span class="stat-label">Total Item</span>
          </div>
        </div>
      </div>

      <!-- Filter & Search -->
      <div class="orders-filters">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pesanan..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <select v-model="statusFilter" class="status-filter">
          <option value="">Semua Status</option>
          <option value="completed">Selesai</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <select v-model="sortBy" class="sort-filter">
          <option value="date-desc">Terbaru</option>
          <option value="date-asc">Terlama</option>
          <option value="total-desc">Harga Tertinggi</option>
          <option value="total-asc">Harga Terendah</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner">⏳</div>
        <p>Memuat riwayat pesanan...</p>
      </div>

      <!-- Empty Orders State -->
      <div
        v-else-if="filteredOrders.length === 0 && orders.length === 0"
        class="empty-orders"
      >
        <div class="empty-orders-icon">📋</div>
        <h2 class="empty-orders-title">Belum Ada Pesanan</h2>
        <p class="empty-orders-text">Anda belum melakukan pembelian apapun</p>
        <router-link to="/menu" class="shop-now-btn">
          <span class="btn-icon">🛒</span>
          Mulai Belanja
        </router-link>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredOrders.length === 0" class="empty-orders">
        <div class="empty-orders-icon">🔍</div>
        <h2 class="empty-orders-title">Tidak Ada Hasil</h2>
        <p class="empty-orders-text">
          Tidak ditemukan pesanan yang sesuai dengan filter
        </p>
        <button @click="clearFilters" class="clear-filters-btn">
          <span class="btn-icon">✖️</span>
          Hapus Filter
        </button>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-list">
        <div
          v-for="order in paginatedOrders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-info">
              <h3 class="order-id">Pesanan #{{ order.id }}</h3>
              <div class="order-meta">
                <span class="order-date">{{ formatDate(order.date) }}</span>
                <span class="order-status" :class="`status-${order.status}`">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
            <div class="order-total">
              <span class="total-label">Total:</span>
              <span class="total-amount"
                >Rp {{ formatPrice(order.total) }}</span
              >
            </div>
          </div>

          <div class="order-details" v-if="expandedOrder === order.id">
            <div class="order-items">
              <h4 class="items-title">
                <span class="items-icon">🍽️</span>
                Item Pesanan ({{ order.totalItems || order.items.length }})
              </h4>
              <div class="items-list">
                <div
                  v-for="item in order.items"
                  :key="`${order.id}-${item.id}`"
                  class="order-item"
                >
                  <div class="item-info">
                    <div
                      class="item-category"
                      :class="`category-${item.category || 'other'}`"
                    >
                      {{ getCategoryIcon(item.category) }}
                    </div>
                    <div class="item-details">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-description">{{
                        item.description || "Tidak ada deskripsi"
                      }}</span>
                    </div>
                  </div>
                  <div class="item-quantity-price">
                    <span class="item-quantity">{{ item.quantity }}x</span>
                    <span class="item-price"
                      >Rp {{ formatPrice(item.price) }}</span
                    >
                  </div>
                  <div class="item-subtotal">
                    Rp {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span
                  >Rp
                  {{
                    formatPrice(order.subtotal || calculateSubtotal(order))
                  }}</span
                >
              </div>
              <div class="summary-row">
                <span>Biaya Pengiriman:</span>
                <span>Rp {{ formatPrice(order.shippingCost || 0) }}</span>
              </div>
              <div class="summary-row total-row">
                <span>Total Pembayaran:</span>
                <span>Rp {{ formatPrice(order.total) }}</span>
              </div>
            </div>

            <div class="order-info-section">
              <div class="payment-info">
                <h5>Metode Pembayaran</h5>
                <span>{{ order.paymentMethod || "Tunai" }}</span>
              </div>
              <div class="customer-info" v-if="order.customerInfo">
                <h5>Informasi Pelanggan</h5>
                <p>{{ order.customerInfo.name || "Customer" }}</p>
                <p v-if="order.customerInfo.address">
                  {{ order.customerInfo.address }}
                </p>
                <p v-if="order.customerInfo.phone">
                  {{ order.customerInfo.phone }}
                </p>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <button
              @click="toggleOrderDetails(order.id)"
              class="toggle-details-btn"
            >
              <span class="btn-icon">
                {{ expandedOrder === order.id ? "🔽" : "▶️" }}
              </span>
              {{
                expandedOrder === order.id
                  ? "Sembunyikan Detail"
                  : "Lihat Detail"
              }}
            </button>

            <button
              @click="reorderItems(order)"
              class="reorder-btn"
              :disabled="isReordering"
            >
              <span class="btn-icon">{{ isReordering ? "⏳" : "🔄" }}</span>
              {{ isReordering ? "Memproses..." : "Pesan Lagi" }}
            </button>

            <button @click="shareOrder(order)" class="share-btn">
              <span class="btn-icon">📤</span>
              Bagikan
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="pagination-btn"
          >
            ◀️ Sebelumnya
          </button>

          <div class="pagination-info">
            Halaman {{ currentPage }} dari {{ totalPages }}
            <span class="pagination-total"
              >({{ filteredOrders.length }} pesanan)</span
            >
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="pagination-btn"
          >
            Selanjutnya ▶️
          </button>
        </div>
      </div>

      <!-- Success Notification -->
      <transition name="notification">
        <div
          v-if="showNotification"
          class="notification"
          :class="notificationClass"
        >
          <div class="notification-content">
            <span class="notification-icon">{{ notificationIcon }}</span>
            <span class="notification-text">{{ notificationMessage }}</span>
            <button @click="hideNotification" class="notification-close">
              ✖️
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import "../css/orders.css";

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      expandedOrder: null,
      searchQuery: "",
      statusFilter: "",
      sortBy: "date-desc",
      currentPage: 1,
      itemsPerPage: 5,
      showNotification: false,
      notificationMessage: "",
      notificationIcon: "✅",
      notificationClass: "success",
      orderUpdateInterval: null,
      isLoading: false,
      isReordering: false,
      notificationTimeout: null,
    };
  },

  computed: {
    filteredOrders() {
      let filtered = [...this.orders];

      // Filter berdasarkan search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order.id.toString().toLowerCase().includes(query) ||
            order.items.some(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                (item.description &&
                  item.description.toLowerCase().includes(query))
            )
        );
      }

      // Filter berdasarkan status
      if (this.statusFilter) {
        filtered = filtered.filter(
          (order) => order.status === this.statusFilter
        );
      }

      // Sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case "date-desc":
            return new Date(b.date) - new Date(a.date);
          case "date-asc":
            return new Date(a.date) - new Date(b.date);
          case "total-desc":
            return b.total - a.total;
          case "total-asc":
            return a.total - b.total;
          default:
            return 0;
        }
      });

      return filtered;
    },

    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOrders.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },

    totalSpent() {
      return this.orders.reduce((total, order) => {
        const orderTotal = typeof order.total === "number" ? order.total : 0;
        return total + orderTotal;
      }, 0);
    },

    totalItemsPurchased() {
      return this.orders.reduce((total, order) => {
        if (order.totalItems) {
          return total + order.totalItems;
        }
        if (Array.isArray(order.items)) {
          return (
            total +
            order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          );
        }
        return total;
      }, 0);
    },
  },

  methods: {
    async loadOrders() {
      this.isLoading = true;

      try {
        let loadedOrders = [];

        // Load dari localStorage dengan fallback
        if (typeof Storage !== "undefined") {
          const savedOrders = localStorage.getItem("orderHistory");
          if (savedOrders) {
            try {
              loadedOrders = JSON.parse(savedOrders);
            } catch (parseError) {
              console.warn("Error parsing localStorage orders:", parseError);
            }
          }
        }

        // Fallback ke window.orderHistory
        if (!Array.isArray(loadedOrders) || loadedOrders.length === 0) {
          if (window.orderHistory && Array.isArray(window.orderHistory)) {
            loadedOrders = [...window.orderHistory];
          }
        }

        // Validasi dan normalisasi data orders
        this.orders = loadedOrders
          .filter((order) => this.validateOrder(order))
          .map((order) => this.normalizeOrder(order))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log("Orders loaded successfully:", this.orders.length);
      } catch (error) {
        console.error("Error loading orders:", error);
        this.orders = [];
        this.showNotificationMessage(
          "Error memuat riwayat pesanan",
          "⚠️",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    validateOrder(order) {
      return (
        order &&
        (order.id || order.id === 0) &&
        order.date &&
        Array.isArray(order.items) &&
        order.items.length > 0 &&
        (typeof order.total === "number" || !isNaN(parseFloat(order.total)))
      );
    },

    normalizeOrder(order) {
      return {
        ...order,
        id: order.id.toString(),
        total:
          typeof order.total === "number"
            ? order.total
            : parseFloat(order.total) || 0,
        status: order.status || "completed",
        date: order.date || new Date().toISOString(),
        items: order.items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
          price:
            typeof item.price === "number"
              ? item.price
              : parseFloat(item.price) || 0,
        })),
        totalItems:
          order.totalItems ||
          order.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
        subtotal: order.subtotal || this.calculateSubtotal(order),
        shippingCost: order.shippingCost || 0,
      };
    },

    calculateSubtotal(order) {
      if (!Array.isArray(order.items)) return 0;
      return order.items.reduce((sum, item) => {
        const price =
          typeof item.price === "number"
            ? item.price
            : parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        return sum + price * quantity;
      }, 0);
    },

    async refreshOrders() {
      await this.loadOrders();
      this.showNotificationMessage(
        "Riwayat pesanan diperbarui",
        "🔄",
        "success"
      );
    },

    toggleOrderDetails(orderId) {
      this.expandedOrder = this.expandedOrder === orderId ? null : orderId;
    },

    async reorderItems(order) {
      if (this.isReordering) return;

      this.isReordering = true;

      try {
        if (!Array.isArray(order.items) || order.items.length === 0) {
          throw new Error("Tidak ada item untuk dipesan ulang");
        }

        // Ambil data keranjang dari server (jika ingin merge)
        let cartItems = [];
        try {
          const res = await fetch("https://foodieorder.glitch.me/keranjang");
          if (res.ok) {
            cartItems = await res.json();
          }
        } catch (e) {
          console.warn("Gagal mengambil cart dari server:", e);
        }

        // Tambahkan item ke keranjang
        let addedItems = 0;

        for (const item of order.items) {
          if (item && item.id && item.name && !isNaN(item.price)) {
            const existing = cartItems.find(
              (cartItem) => cartItem.id === item.id
            );
            const newItem = {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: (existing?.quantity || 0) + (item.quantity || 1),
              category: item.category || "other",
              description: item.description || "",
            };

            // Jika item sudah ada di cart (update), kalau tidak (tambah)
            const method = existing ? "PUT" : "POST";
            const url = existing
              ? `https://foodieorder.glitch.me/keranjang/${existing.id}`
              : `https://foodieorder.glitch.me/keranjang`;

            await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newItem),
            });

            addedItems++;
          }
        }

        if (addedItems === 0) {
          throw new Error("Tidak ada item valid untuk ditambahkan");
        }

        this.showNotificationMessage(
          `${addedItems} item berhasil ditambahkan ke keranjang`,
          "🛒",
          "success"
        );

        setTimeout(() => {
          this.$router.push("/cart");
        }, 2000);
      } catch (error) {
        console.error("Error reordering items:", error);
        this.showNotificationMessage(
          error.message || "Error menambahkan ke keranjang",
          "⚠️",
          "error"
        );
      } finally {
        this.isReordering = false;
      }
    },

    async shareOrder(order) {
      try {
        const orderText = this.generateOrderText(order);

        if (navigator.share && navigator.canShare) {
          await navigator.share({
            title: `Pesanan #${order.id}`,
            text: orderText,
          });
          this.showNotificationMessage(
            "Detail pesanan berhasil dibagikan",
            "📤",
            "success"
          );
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(orderText);
          this.showNotificationMessage(
            "Detail pesanan disalin ke clipboard",
            "📋",
            "success"
          );
        } else {
          // Fallback untuk browser lama
          const textArea = document.createElement("textarea");
          textArea.value = orderText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          this.showNotificationMessage(
            "Detail pesanan disalin",
            "📋",
            "success"
          );
        }
      } catch (error) {
        console.error("Error sharing order:", error);
        this.showNotificationMessage(
          "Gagal membagikan detail pesanan",
          "⚠️",
          "error"
        );
      }
    },

    generateOrderText(order) {
      const itemsList = order.items
        .map(
          (item) =>
            `- ${item.name} (${item.quantity}x) - Rp ${this.formatPrice(
              item.price * item.quantity
            )}`
        )
        .join("\n");

      return (
        `🧾 Pesanan #${order.id}\n` +
        `📅 Tanggal: ${this.formatDate(order.date)}\n` +
        `💰 Total: Rp ${this.formatPrice(order.total)}\n` +
        `📊 Status: ${this.getStatusText(order.status)}\n\n` +
        `🍽️ Items:\n${itemsList}\n\n` +
        `💳 Pembayaran: ${order.paymentMethod || "Tunai"}`
      );
    },

    clearFilters() {
      this.searchQuery = "";
      this.statusFilter = "";
      this.sortBy = "date-desc";
      this.currentPage = 1;
      this.showNotificationMessage("Filter berhasil dihapus", "✨", "success");
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        // Scroll to top of orders list
        this.$nextTick(() => {
          const ordersList = document.querySelector(".orders-list");
          if (ordersList) {
            ordersList.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    },

    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return "Tanggal tidak valid";
        }
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Tanggal tidak valid";
      }
    },

    formatPrice(price) {
      if (typeof price !== "number" || isNaN(price)) {
        return "0";
      }
      return Math.round(price).toLocaleString("id-ID");
    },

    getStatusText(status) {
      const statusMap = {
        completed: "Selesai",
        pending: "Pending",
        cancelled: "Dibatalkan",
        processing: "Diproses",
      };
      return statusMap[status] || "Tidak Diketahui";
    },

    getCategoryIcon(category) {
      const icons = {
        heavy: "🍛",
        snack: "🥟",
        drink: "🥤",
        special: "⭐",
        dessert: "🍰",
        other: "🍽️",
      };
      return icons[category] || icons["other"];
    },

    showNotificationMessage(message, icon = "✅", type = "success") {
      this.notificationMessage = message;
      this.notificationIcon = icon;
      this.notificationClass = type;
      this.showNotification = true;

      // Clear existing timeout
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }

      // Set new timeout
      this.notificationTimeout = setTimeout(
        () => {
          this.hideNotification();
        },
        type === "error" ? 5000 : 3000
      );
    },

    hideNotification() {
      this.showNotification = false;
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = null;
      }
    },

    handleOrderCreated(event) {
      if (event.detail && event.detail.order) {
        this.loadOrders();
        this.showNotificationMessage(
          "Pesanan baru ditambahkan ke riwayat",
          "📋",
          "success"
        );
      }
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    statusFilter() {
      this.currentPage = 1;
    },
    sortBy() {
      this.currentPage = 1;
    },
  },

  async created() {
    await this.loadOrders();
  },

  mounted() {
    // Listen untuk order baru
    if (typeof window !== "undefined") {
      window.addEventListener("orderCreated", this.handleOrderCreated);
    }

    // Auto refresh orders setiap 60 detik (dikurangi frekuensi)
    this.orderUpdateInterval = setInterval(() => {
      if (!this.isLoading) {
        this.loadOrders();
      }
    }, 60000);
  },

  beforeUnmount() {
    // Cleanup intervals dan event listeners
    if (this.orderUpdateInterval) {
      clearInterval(this.orderUpdateInterval);
    }

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    if (typeof window !== "undefined") {
      window.removeEventListener("orderCreated", this.handleOrderCreated);
    }
  },
};
</script>
