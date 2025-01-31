<template>
  <div class="create-list">
    <h1>Create New Grocery List</h1>
    <div class="list-form">
      <div class="form-group">
        <label for="listName">List Name</label>
        <input 
          type="text"
          id="listName"
          v-model="listName"
          placeholder="e.g., Weekly Groceries"
        >
      </div>
      
      <div class="items-section">
        <h2>Add Items</h2>
        <div class="add-item-form">
          <input 
            type="text"
            v-model="newItemForm.name"
            placeholder="Enter item name"
            @keyup.enter="addItem"
          >
          <select 
            v-model="newItemForm.category"
            class="category-select"
          >
            <option value="">Select Category</option>
            <option v-for="category in categories" 
                    :key="category.value" 
                    :value="category.value">
              {{ category.label }}
            </option>
          </select>
          <input 
            type="number"
            v-model="newItemForm.quantity"
            placeholder="Qty"
            min="1"
            class="quantity-input"
          >
          <input 
            type="text"
            v-model="newItemForm.comment"
            placeholder="Add a note"
            class="comment-input"
            @keyup.enter="addItem"
          >
          <button @click="addItem" :disabled="!newItemForm.name.trim() || !newItemForm.category">Add</button>
        </div>

        <ul class="items-list">
          <li v-for="(item, index) in items" :key="index" class="item">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-category">{{ getCategoryLabel(item.category) }}</span>
              <span class="item-quantity">Qty: {{ item.quantity }}</span>
              <span class="item-comment" v-if="item.comment">Note: {{ item.comment }}</span>
            </div>
            <button class="remove-btn" @click="removeItem(index)">×</button>
          </li>
        </ul>
      </div>

      <button 
        class="save-button"
        @click="saveList"
        :disabled="!listName.trim() || items.length === 0 || saving"
      >
        {{ saving ? 'Saving...' : 'Save List' }}
      </button>

      <p v-if="error" class="error-message">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script>
import { createList, addItems } from '../services/groceryService'

export default {
  name: 'CreateList',
  data() {
    return {
      listName: '',
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
      ],
      newItemForm: {
        name: '',
        category: '',
        quantity: 1,
        comment: ''
      },
      items: [],
      saving: false,
      error: null
    }
  },
  methods: {
    addItem() {
      if (this.newItemForm.name.trim() && this.newItemForm.category) {
        this.items.push({
          name: this.newItemForm.name.trim(),
          category: this.newItemForm.category,
          quantity: this.newItemForm.quantity,
          comment: this.newItemForm.comment.trim()
        })
        // Reset form
        this.newItemForm = {
          name: '',
          category: '',
          quantity: 1,
          comment: ''
        }
      }
    },
    removeItem(index) {
      this.items.splice(index, 1)
    },
    async saveList() {
      this.saving = true
      this.error = null

      try {
        // First create the list
        const list = await createList(this.listName)
        
        // Then add all items
        /*const items = */await addItems(list.id, this.items)
        
        // Navigate to the view list page
        this.$router.push({
          name: 'view-list',
          params: { 
            id: list.id
          }
        })
      } catch (err) {
        console.error('Failed to save list:', err)
        this.error = 'Failed to save list. Please try again.'
        this.saving = false
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
.create-list {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.list-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
  text-align: left;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.items-section {
  margin-top: 2rem;
}

.add-item-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.add-item-form input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-item-form input[type="text"] {
  flex: 1;
}

.category-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  min-width: 150px;
}

.quantity-input {
  width: 80px;
}

.comment-input {
  width: 200px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  flex-wrap: wrap;
}

.item-name {
  font-weight: bold;
  min-width: 150px;
}

.item-category {
  color: #4CAF50;
  font-weight: 500;
  min-width: 120px;
}

.item-quantity {
  color: #666;
  min-width: 80px;
}

.item-comment {
  color: #666;
  font-style: italic;
}

.add-item-form button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-item-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f5f5f5;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.save-button {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 2rem;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: left;
}
</style>
