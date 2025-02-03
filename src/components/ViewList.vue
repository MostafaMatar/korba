<template>
  <div class="view-list">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="list" class="list-container">
      <div class="list-header">
        <h1>{{ list.name }}</h1>
        <div class="list-stats">
          <span class="stat">{{ completedItems }} of {{ list.items.length }} items purchased</span>
        </div>
      </div>

      <div class="category-sections">
        <div v-for="category in categorizedItems" :key="category.value" class="category-section">
          <h2 class="category-title">{{ category.label }}</h2>
          <ul class="items-list">
            <li v-for="item in category.items" :key="item.id" 
                :class="['item', { 'purchased': item.purchased }]">
              <div class="item-content">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    v-model="item.purchased"
                    @change="updatePurchased(item)"
                  >
                  <span class="checkmark"></span>
                </label>
                
                <div class="item-details">
                  <div class="item-main">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-quantity">Qty: {{ item.quantity }}</span>
                    <span v-if="item.comment" class="item-comment">Note: {{ item.comment }}</span>
                  </div>
                  
                  <div v-if="!item.purchased" class="item-reply">
                    <input 
                      type="text" 
                      v-model="item.reply"
                      placeholder="Add a reply (e.g., 'Out of stock')"
                      @keyup.enter="saveReply(item)"
                    >
                    <button 
                      @click="saveReply(item)"
                      :disabled="!item.reply?.trim() || item.savingReply"
                      class="reply-button"
                    >
                      {{ item.savingReply ? 'Saving...' : 'Add Reply' }}
                    </button>
                  </div>
                  
                  <div v-if="item.reply" class="reply-message">
                    <span class="reply-icon">↳</span>
                    {{ item.reply }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getList, updateItemPurchased, addItemReply } from '../services/groceryService'

export default {
  name: 'ViewList',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: null,
      loading: true,
      error: null,
      categories: [
        { value: 'produce', label: '🥬 Produce' },
        { value: 'dairy', label: '🥛 Dairy' },
        { value: 'meat', label: '🥩 Meat' },
        { value: 'bakery', label: '🥖 Bakery' },
        { value: 'pantry', label: '🥫 Pantry' },
        { value: 'frozen', label: '❄️ Frozen' },
        { value: 'beverages', label: '🥤 Beverages' },
        { value: 'household', label: '🏠 Household' },
        { value: 'other', label: '📦 Other' }
      ]
    }
  },
  async created() {
    try {
      const { list, items } = await getList(this.id)
      this.list = {
        ...list,
        items: items.map(item => ({
          ...item,
          savingReply: false
        }))
      }
    } catch (err) {
      console.error('Failed to load list:', err)
      this.error = 'Failed to load grocery list. Please try again later.'
    } finally {
      this.loading = false
    }
  },
  computed: {
    completedItems() {
      return this.list.items.filter(item => item.purchased).length
    },
    categorizedItems() {
      if (!this.list?.items) return []
      
      // Group items by category
      const grouped = this.list.items.reduce((acc, item) => {
        const category = this.categories.find(c => c.value === item.category) || { value: 'other', label: '📦 Other' }
        if (!acc[category.value]) {
          acc[category.value] = {
            label: category.label,
            items: []
          }
        }
        acc[category.value].items.push(item)
        return acc
      }, {})
      
      // Convert to array and sort by category label
      return Object.entries(grouped)
        .map(([value, data]) => ({
          value,
          label: data.label,
          items: data.items
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    }
  },
  methods: {
    async updatePurchased(item) {
      try {
        await updateItemPurchased(item.id, item.purchased)
      } catch (err) {
        console.error('Failed to update item:', err)
        item.purchased = !item.purchased // revert on error
        this.error = 'Failed to update item. Please try again.'
      }
    },
    async saveReply(item) {
      if (!item.reply?.trim() || item.savingReply) return

      item.savingReply = true
      try {
        await addItemReply(item.id, item.reply.trim())
      } catch (err) {
        console.error('Failed to add reply:', err)
        this.error = 'Failed to save reply. Please try again.'
      } finally {
        item.savingReply = false
      }
    },
    getCategoryLabel(categoryValue) {
      const category = this.categories.find(c => c.value === categoryValue)
      return category ? category.label : categoryValue
    }
  }
}
</script>

<style scoped>
.view-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading,
.error-message {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #ff4444;
}

.list-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  margin-bottom: 2rem;
  text-align: left;
}

.list-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.list-stats {
  color: #666;
  font-size: 0.9rem;
}

.category-section {
  margin-bottom: 2rem;
}

.category-title {
  color: #4CAF50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4CAF50;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.item:last-child {
  border-bottom: none;
}

.item-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.checkbox-container {
  position: relative;
  display: block;
  min-width: 24px;
  height: 24px;
  margin-top: 0.2rem;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #fff;
  border: 2px solid #4CAF50;
  border-radius: 4px;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4CAF50;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.item-details {
  flex: 1;
  text-align: left;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.item-name {
  font-weight: bold;
  min-width: 150px;
}

.item-quantity {
  color: #666;
  min-width: 80px;
}

.item-comment {
  color: #666;
  font-style: italic;
}

.purchased {
  background-color: #f8f8f8;
}

.purchased .item-main {
  opacity: 0.6;
}

.item-reply {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.item-reply input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.reply-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.reply-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reply-message {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  padding-left: 1rem;
  border-left: 2px solid #4CAF50;
}

.reply-icon {
  color: #4CAF50;
  margin-right: 0.5rem;
}
</style>
