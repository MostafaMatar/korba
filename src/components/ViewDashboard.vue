<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Welcome, {{ username }}</h1>
        <p class="subtitle">Manage your grocery lists</p>
      </div>
      
      <div class="filter-section">
        <DateRangeFilter v-model="dateRange" />
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading your lists...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="filteredLists.length === 0" class="no-lists">
      <p>No grocery lists found{{ dateRange.start ? ' for selected date range' : '' }}.</p>
      <router-link to="/create-list" class="create-list-button">
        Create Your First List
      </router-link>
    </div>

    <div v-else class="lists-grid">
      <div 
        v-for="list in filteredLists" 
        :key="list.id" 
        class="list-card"
      >
        <div class="list-info">
          <h3>{{ list.name }}</h3>
          <p class="date">
            Created: {{ formatDate(list.created_at) }}
          </p>
        </div>
        <div class="list-actions">
          <router-link 
            :to="{ name: 'view-list', params: { id: list.id }}" 
            class="view-button"
          >
            View Details
          </router-link>
          <button 
            @click="openDeleteModal(list)"
            class="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <router-link to="/create-list" class="fab-button">
      +
    </router-link>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Delete List</h3>
        <p>Are you sure you want to delete this list? This action cannot be undone.</p>
        <div class="modal-actions">
          <button 
            @click="confirmDelete"
            class="confirm-button"
            :disabled="deleteInProgress"
          >
            {{ deleteInProgress ? 'Deleting...' : 'Delete' }}
          </button>
          <button 
            @click="closeDeleteModal"
            class="cancel-button"
            :disabled="deleteInProgress"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabase'
import DateRangeFilter from './DateRangeFilter.vue'

export default {
  name: 'ViewDashboard',
  components: {
    DateRangeFilter
  },
  setup() {
    const lists = ref([])
    const loading = ref(true)
    const error = ref(null)
    const username = ref('')
    const today = new Date().toISOString().split('T')[0]

    // Delete modal state
    const showDeleteModal = ref(false)
    const selectedList = ref(null)
    const deleteInProgress = ref(false)

    // Date range filter
    const dateRange = ref({
      start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
      end: today
    })

    const filteredLists = computed(() => {
      if (!dateRange.value.start || !dateRange.value.end) return lists.value

      const start = new Date(dateRange.value.start)
      start.setHours(0, 0, 0, 0)
      const end = new Date(dateRange.value.end)
      end.setHours(23, 59, 59, 999)

      return lists.value.filter(list => {
        const listDate = new Date(list.created_at)
        return listDate >= start && listDate <= end
      })
    })

    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.user_metadata?.username) {
          username.value = user.user_metadata.username
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()
          
          if (profile?.username) {
            username.value = profile.username
          }
        }
      } catch (e) {
        console.error('Error loading user profile:', e)
        username.value = 'User'
      }
    }

    const loadLists = async () => {
      try {
        loading.value = true
        error.value = null
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error: listsError } = await supabase
          .from('grocery_lists')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', dateRange.value.start)
          .lte('created_at', new Date(dateRange.value.end + 'T23:59:59').toISOString())
          .order('created_at', { ascending: false })

        if (listsError) throw listsError
        lists.value = data || []
      } catch (e) {
        error.value = 'Failed to load grocery lists'
        console.error('Error loading lists:', e)
      } finally {
        loading.value = false
      }
    }

    const openDeleteModal = (list) => {
      selectedList.value = list
      showDeleteModal.value = true
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      selectedList.value = null
    }

    const confirmDelete = async () => {
      if (!selectedList.value) return

      try {
        deleteInProgress.value = true
        error.value = null

        const { error: deleteError } = await supabase
          .from('grocery_lists')
          .delete()
          .eq('id', selectedList.value.id)

        if (deleteError) throw deleteError

        // Remove the list from the local array
        lists.value = lists.value.filter(l => l.id !== selectedList.value.id)
        closeDeleteModal()
      } catch (e) {
        error.value = 'Failed to delete list'
        console.error('Error deleting list:', e)
      } finally {
        deleteInProgress.value = false
      }
    }

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(async () => {
      await Promise.all([loadUserProfile(), loadLists()])
    })

    // Watch for date range changes
    watch(() => dateRange.value, () => {
      loadLists()
    }, { deep: true })

    return {
      lists,
      loading,
      error,
      username,
      dateRange,
      today,
      filteredLists,
      formatDate,
      showDeleteModal,
      deleteInProgress,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.welcome-section {
  margin-bottom: 2rem;
}

h1 {
  color: #2E7D32;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.filter-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.list-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.list-info h3 {
  color: #2E7D32;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.list-actions {
  display: flex;
  gap: 1rem;
}

.view-button, .delete-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
}

.view-button {
  background-color: #4CAF50;
  color: white;
}

.view-button:hover {
  background-color: #43A047;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.loading {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 3rem 0;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.no-lists {
  text-align: center;
  margin: 3rem 0;
  color: #666;
}

.create-list-button {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: transform 0.2s ease;
}

.create-list-button:hover {
  transform: scale(1.05);
}

.fab-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #4CAF50;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.fab-button:hover {
  transform: scale(1.1);
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

.modal h3 {
  color: #d32f2f;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.confirm-button, .cancel-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.confirm-button {
  background-color: #f44336;
  color: white;
}

.confirm-button:hover:not(:disabled) {
  background-color: #d32f2f;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-button:hover:not(:disabled) {
  background-color: #bdbdbd;
}

.confirm-button:disabled,
.cancel-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
