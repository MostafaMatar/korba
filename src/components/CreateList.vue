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

      <div v-if="isAuthenticated" class="form-group-row">
        <div class="form-group">
          <label for="purchaseDate">Planned Shopping Date</label>
          <input 
            type="date"
            id="purchaseDate"
            v-model="purchaseDate"
            :min="new Date().toISOString().split('T')[0]"
            placeholder="Select when you plan to shop"
          >
        </div>

        <div class="form-group">
          <label for="store">Preferred Store</label>
          <input 
            type="text"
            id="store"
            v-model="store"
            placeholder="e.g., Walmart"
          >
        </div>
      </div>
      
      <div class="items-section">
        <h2 class="section-title">Add Items</h2>
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
          <button 
            @click="addItem" 
            :disabled="!newItemForm.name.trim() || !newItemForm.category"
            class="add-button"
          >
            Add
          </button>
        </div>

        <div class="items-list">
          <div v-for="(item, index) in items" :key="index" class="item">
            <div class="item-content">
              <div class="item-details">
                <div class="item-main">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-quantity">Qty: {{ item.quantity }}</span>
                  <span v-if="item.comment" class="item-comment">Note: {{ item.comment }}</span>
                </div>
                <div class="item-category">{{ getCategoryLabel(item.category) }}</div>
              </div>
              <button class="remove-btn" @click="removeItem(index)">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          class="save-button"
          @click="saveList"
          :disabled="!listName.trim() || items.length === 0 || saving"
        >
          {{ saving ? 'Saving...' : 'Save List' }}
        </button>
      </div>

      <p v-if="error" class="error-message">
        {{ error }}
      </p>
    </div>

    <!-- Print Preview Modal -->
    <div v-if="showPrintModal" class="modal-overlay" @click="closePrintModal">
      <div class="modal print-modal" @click.stop>
        <h2>Print Preview</h2>
        <div class="print-content" ref="printContent">
          <h3>{{ listName }}</h3>
          <div class="print-items">
            <template v-for="category in groupedItems" :key="category.name">
              <h4>{{ category.label }}</h4>
              <ul>
                <li v-for="item in category.items" :key="item.name">
                  {{ item.name }} ({{ item.quantity }})
                  <span v-if="item.comment" class="print-comment">
                    - {{ item.comment }}
                  </span>
                </li>
              </ul>
            </template>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="performPrint" class="print-action-btn">
            Print
          </button>
          <button @click="closePrintModal" class="close-button">
            Close
          </button>
        </div>
      </div>
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
import { supabase } from '../lib/supabase'

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
      showPrintModal: false,
      savedListId: null,
      urlCopied: false,
      isAuthenticated: false,
      purchaseDate: '',
      store: ''
    }
  },
  async created() {
    const { data: { session } } = await supabase.auth.getSession()
    this.isAuthenticated = !!session
  },
  computed: {
    shareUrl() {
      return `${window.location.origin}/view-list/${this.savedListId}`
    },
    groupedItems() {
      return this.categories.map(category => ({
        ...category,
        items: this.items.filter(item => item.category === category.value)
      })).filter(category => category.items.length > 0)
    }
  },
  methods: {
    addItem() {
      const trimmedName = this.newItemForm.name.trim();
      if (trimmedName && this.newItemForm.category) {
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
      if (!this.isAuthenticated) {
        this.error = 'You need a Pro account to save lists'
        return
      }

      this.saving = true
      this.error = null

      try {
        const list = await createList(this.listName, this.purchaseDate, this.store)
        await addItems(list.id, this.items)
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
      this.savedListId = null
      this.urlCopied = false
      this.listName = ''
      this.items = []
    },
    printList() {
      this.showPrintModal = true
    },
    closePrintModal() {
      this.showPrintModal = false
    },
    performPrint() {
      window.print()
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

.basic-features-banner {
  background-color: #FFF3E0;
  border: 1px solid #FFB74D;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.upgrade-link {
  color: #F57C00;
  font-weight: bold;
  text-decoration: none;
}

.upgrade-link:hover {
  text-decoration: underline;
}

.list-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-button, .print-button, .upgrade-button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.print-button {
  background-color: #2196F3;
  color: white;
}

.upgrade-button {
  background-color: #F57C00;
  color: white;
  display: inline-block;
}

.save-button:disabled,
.print-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Print modal specific styles */
.print-modal {
  max-width: 600px;
}

.print-content {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.print-items h4 {
  color: #2E7D32;
  margin: 1rem 0 0.5rem;
}

.print-items ul {
  list-style: none;
  padding-left: 1rem;
}

.print-comment {
  color: #666;
  font-style: italic;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  color: #2E7D32;
  margin-bottom: 1rem;
  font-size: 1.5rem;
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
  font-size: 0.9rem;
  color: #666;
  background: #f5f5f5;
}

.copy-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.copy-button.copied {
  background-color: #43A047;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.view-list-button,
.close-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.view-list-button {
  background-color: #4CAF50;
  color: white;
}

.view-list-button:hover {
  background-color: #43A047;
}

.close-button {
  background-color: #e0e0e0;
  color: #333;
}

.close-button:hover {
  background-color: #bdbdbd;
}

/* Existing styles... */
.form-group {
  margin-bottom: 2rem;
}

.section-title {
  color: #2E7D32;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-button:hover:not(:disabled) {
  background-color: #43A047;
}

.add-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
  text-align: left;
}

input[type="text"],
input[type="date"],
input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  color: #333;
  transition: all 0.2s ease;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #4CAF50;
}

/* Custom styling for date input */
input[type="date"] {
  /* Remove default date input styling */
  -webkit-appearance: none;
  appearance: none;
}

/* Style the calendar icon */
input[type="date"]::-webkit-calendar-picker-indicator {
  background-color: transparent;
  padding: 0.3rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
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

/* Items List Styles */
.items-list {
  margin-top: 1rem;
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
  gap: 0.75rem;
}

.item-details {
  flex: 1;
  text-align: left;
}

.item-main {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
  width: 100%;
}

.item-name {
  font-weight: bold;
  flex: 1;
  min-width: 200px;
}

.item-quantity {
  color: #666;
  white-space: nowrap;
}

.item-comment {
  color: #666;
  font-style: italic;
  width: 100%;
  margin-top: 0.25rem;
}

.item-category {
  color: #4CAF50;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid #ff4444;
  border-radius: 4px;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
  background: #ff4444;
  color: white;
}

@media (max-width: 600px) {
  .item-main {
    gap: 0.25rem;
  }
  
  .item-name {
    min-width: unset;
    width: 100%;
  }
  
  .item-details {
    width: 100%;
  }
}
</style>

<!-- Print styles -->
<style>
@media print {
  body * {
    visibility: hidden;
  }
  .print-content,
  .print-content * {
    visibility: visible;
  }
  .print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
