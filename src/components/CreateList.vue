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

    <!-- Share Modal -->
    <div v-if="showShareModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>List Created Successfully! 🎉</h2>
        <p class="modal-description">
          Your grocery list has been created. You can now share it with others or view it directly.
        </p>
        
        <div class="share-url-container">
          <input 
            ref="shareUrlInput"
            type="text"
            readonly
            :value="shareUrl"
            class="share-url-input"
          >
          <button 
            @click="copyShareUrl" 
            class="copy-button"
            :class="{ copied: urlCopied }"
          >
            {{ urlCopied ? 'Copied!' : 'Copy Link' }}
          </button>
        </div>

        <div class="modal-actions">
          <button class="view-list-button" @click="viewList">
            View List
          </button>
          <button class="close-button" @click="closeModal">
            Close
          </button>
        </div>
      </div>
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
      error: null,
      showShareModal: false,
      savedListId: null,
      urlCopied: false
    }
  },
  computed: {
    shareUrl() {
      return `${window.location.origin}/view-list/${this.savedListId}`
    }
  },
  methods: {
    addItem() {
      const trimmedName = this.newItemForm.name.trim();
      if (trimmedName && this.newItemForm.category) {
        // Convert to char codes and back to ensure proper string encoding
        const itemName = [...trimmedName].map(char => String.fromCharCode(char.charCodeAt(0))).join('');
        this.items.push({
          name: itemName,
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
        await addItems(list.id, this.items)
        
        // Show share modal instead of immediate navigation
        this.savedListId = list.id
        this.showShareModal = true
      } catch (err) {
        console.error('Failed to save list:', err)
        this.error = 'Failed to save list. Please try again.'
      } finally {
        this.saving = false
      }
    },
    getCategoryLabel(categoryValue) {
      const category = this.categories.find(c => c.value === categoryValue)
      return category ? category.label : categoryValue
    },
    async copyShareUrl() {
      try {
        await navigator.clipboard.writeText(this.shareUrl)
        this.urlCopied = true
        setTimeout(() => {
          this.urlCopied = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy URL:', err)
      }
    },
    viewList() {
      this.$router.push({
        name: 'view-list',
        params: { id: this.savedListId }
      })
    },
    closeModal() {
      this.showShareModal = false
      // Reset state
      this.savedListId = null
      this.urlCopied = false
      // Clear form for new list
      this.listName = ''
      this.items = []
    }
  }
}
</script>

<style scoped>
.create-list {
  max-width: 800px;
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
  flex-wrap: wrap;
  gap: 0.5rem;
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
  min-width: 200px;
}

.category-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  flex: 1;
  min-width: 150px;
}

.quantity-input {
  width: 80px;
  min-width: unset;
}

.comment-input {
  flex: 1;
  min-width: 200px;
}

@media (max-width: 600px) {
  .add-item-form {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .add-item-form input,
  .category-select {
    width: 100%;
  }
  
  .quantity-input {
    width: 100%;
  }
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  flex-wrap: wrap;
}

.item-name {
  font-weight: bold;
  flex: 1;
  min-width: 200px;
}

.item-category {
  color: #4CAF50;
  font-weight: 500;
}

.item-quantity {
  color: #666;
  white-space: nowrap;
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

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 95%;
  max-width: 500px;
  text-align: center;
  margin: 1rem;
}

@media (max-width: 600px) {
  .modal {
    padding: 1rem;
  }
  
  .share-url-container {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .view-list-button,
  .close-button {
    width: 100%;
  }
}

.modal h2 {
  color: #4CAF50;
  margin-bottom: 1rem;
}

.modal-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.share-url-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.share-url-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #f5f5f5;
}

.copy-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 100px;
  transition: background-color 0.3s;
}

.copy-button.copied {
  background-color: #45a049;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.view-list-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.close-button {
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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
