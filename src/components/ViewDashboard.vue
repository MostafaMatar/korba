<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Welcome, {{ username }}</h1>
        <p class="subtitle">Manage your grocery lists</p>
      </div>
      
      <div class="filter-section">
        <div class="date-filter">
          <label for="dateFilter">Filter by date:</label>
          <input 
            type="date" 
            id="dateFilter"
            v-model="dateFilter"
            :max="today"
          >
          <button 
            v-if="dateFilter"
            @click="clearFilter" 
            class="clear-filter"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading your lists...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="filteredLists.length === 0" class="no-lists">
      <p>No grocery lists found{{ dateFilter ? ' for selected date' : '' }}.</p>
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
        <router-link 
          :to="{ name: 'view-list', params: { id: list.id }}" 
          class="view-button"
        >
          View Details
        </router-link>
      </div>
    </div>

    <router-link to="/create-list" class="fab-button">
      + New List
    </router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { getAllLists } from '../services/groceryService'

export default {
  name: 'ViewDashboard',
  setup() {
    const lists = ref([])
    const loading = ref(true)
    const error = ref(null)
    const username = ref('')
    const dateFilter = ref('')

    const today = new Date().toISOString().split('T')[0]

    const filteredLists = computed(() => {
      if (!dateFilter.value) return lists.value

      const selectedDate = new Date(dateFilter.value)
      selectedDate.setHours(0, 0, 0, 0)

      return lists.value.filter(list => {
        const listDate = new Date(list.created_at)
        listDate.setHours(0, 0, 0, 0)
        return listDate.getTime() === selectedDate.getTime()
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
        lists.value = await getAllLists()
      } catch (e) {
        error.value = 'Failed to load grocery lists'
        console.error('Error loading lists:', e)
      } finally {
        loading.value = false
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

    const clearFilter = () => {
      dateFilter.value = ''
    }

    onMounted(async () => {
      await Promise.all([loadUserProfile(), loadLists()])
    })

    return {
      lists,
      loading,
      error,
      username,
      dateFilter,
      today,
      filteredLists,
      formatDate,
      clearFilter
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

.date-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date-filter label {
  color: #666;
  font-weight: 600;
}

.date-filter input {
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.clear-filter {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  font-weight: 600;
}

.clear-filter:hover {
  text-decoration: underline;
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

.view-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.view-button:hover {
  background-color: #43A047;
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
</style>
