<template>
  <div class="analytics-container">
    <h1>Shopping Analytics</h1>

    <DateRangeFilter v-model="dateRange" />
    
    <div class="analytics-grid">
      <!-- Lists per Month Chart -->
      <div class="chart-card">
        <h2>Shopping Activity</h2>
        <Line
          v-if="loaded && dataAvailable"
          :data="monthlyListsData"
          :options="chartOptions.monthlyLists"
        />
        <div v-else-if="loaded && !dataAvailable" class="no-data-message">
          No shopping activity data available for the selected date range
        </div>
      </div>

      <!-- Top Stores Chart -->
      <div class="chart-card">
        <h2>Top Shopping Locations</h2>
        <Doughnut
          v-if="loaded && dataAvailable"
          :data="topStoresData"
          :options="chartOptions.stores"
        />
        <div v-else-if="loaded && !dataAvailable" class="no-data-message">
          No store data available for the selected date range
        </div>
      </div>

      <!-- Most Bought Items Chart -->
      <div class="chart-card">
        <h2>Most Purchased Items</h2>
        <Bar
          v-if="loaded && dataAvailable"
          :data="topItemsData"
          :options="chartOptions.items"
        />
        <div v-else-if="loaded && !dataAvailable" class="no-data-message">
          No items data available for the selected date range
        </div>
      </div>

      <!-- Category Distribution Chart -->
      <div class="chart-card">
        <h2>Shopping Categories</h2>
        <Pie
          v-if="loaded && dataAvailable"
          :data="categoryDistributionData"
          :options="chartOptions.categories"
        />
        <div v-else-if="loaded && !dataAvailable" class="no-data-message">
          No categories data available for the selected date range
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading your shopping insights...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchData" class="retry-button">Try Again</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import DateRangeFilter from './DateRangeFilter.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Doughnut, Pie } from 'vue-chartjs'
import { supabase } from '../lib/supabase'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'UserAnalytics',
  components: {
    Line,
    Bar,
    Doughnut,
    Pie,
    DateRangeFilter
  },
  setup() {
    const loading = ref(true)
    const loaded = ref(false)
    const dataAvailable = ref(false)
    const error = ref(null)
    const today = new Date().toISOString().split('T')[0]
    
    // Date range filter
    const dateRange = ref({
      start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
      end: today
    })

    // Chart Data
    const monthlyListsData = ref({
      labels: [],
      datasets: [{
        label: 'Lists Created',
        data: [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }]
    })

    const topStoresData = ref({
      labels: [],
      datasets: [{
        label: 'Visits',
        data: [],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FFC107',
          '#9C27B0',
          '#F44336'
        ],
        borderWidth: 1
      }]
    })

    const topItemsData = ref({
      labels: [],
      datasets: [{
        label: 'Times Purchased',
        data: [],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FFC107',
          '#9C27B0',
          '#F44336',
          '#FF9800',
          '#795548',
          '#607D8B',
          '#009688',
          '#E91E63'
        ],
        borderWidth: 1
      }]
    })

    const categoryDistributionData = ref({
      labels: [],
      datasets: [{
        label: 'Items per Category',
        data: [],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FFC107',
          '#9C27B0',
          '#F44336',
          '#FF9800',
          '#795548',
          '#607D8B'
        ],
        borderWidth: 1
      }]
    })

    // Chart Options
    const chartOptions = {
      monthlyLists: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      },
      stores: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
      items: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          y: {
            ticks: {
              autoSkip: false,
              padding: 10
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10
          }
        }
      },
      categories: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    }

    // Watch for date range changes
    watch(() => dateRange.value, () => {
      fetchData()
    }, { deep: true })

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null
        dataAvailable.value = false
        
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('Not authenticated')
        }

        // Fetch user's lists
        console.log('Date range:', dateRange.value)
        const { data: lists, error: listsError } = await supabase
          .from('grocery_lists')
          .select(`
            id,
            created_at,
            store,
            grocery_items (
              name,
              category
            )
          `)
          .eq('user_id', session.user.id)
          .gte('created_at', dateRange.value.start)
          .lte('created_at', new Date(dateRange.value.end + 'T23:59:59').toISOString())
          .order('created_at')

        console.log('Fetched lists:', lists)
        console.log('Lists error:', listsError)
        
        if (listsError) throw listsError

        // Check if we have any data
        const hasData = lists && lists.length > 0
        console.log('Has data:', hasData)

        if (hasData) {
          // Process monthly lists data
          console.log('Processing monthly data for lists:', lists.length)
          const monthlyData = processMonthlyData(lists)
          console.log('Processed monthly data:', monthlyData)
          monthlyListsData.value.labels = monthlyData.labels
          monthlyListsData.value.datasets[0].data = monthlyData.data

          // Process stores data
          const storesData = processStoresData(lists)
          topStoresData.value.labels = storesData.labels
          topStoresData.value.datasets[0].data = storesData.data

          // Process items data
          const itemsData = processItemsData(lists)
          topItemsData.value.labels = itemsData.labels
          topItemsData.value.datasets[0].data = itemsData.data

          // Process categories data
          const categoriesData = processCategoriesData(lists)
          categoryDistributionData.value.labels = categoriesData.labels
          categoryDistributionData.value.datasets[0].data = categoriesData.data

          dataAvailable.value = true
        }

        loaded.value = true
      } catch (err) {
        console.error('Error fetching analytics:', err)
        error.value = err?.message || 'Failed to load analytics data'
      } finally {
        loading.value = false
      }
    }

    const processMonthlyData = (lists) => {
      const monthlyMap = new Map()
      
      // Get start and end dates from the date range
      const start = new Date(dateRange.value.start)
      const end = new Date(dateRange.value.end)
      
      // Create map entries for each month in the range
      let current = new Date(start)
      while (current <= end) {
        // Create a date at the end of the current month to ensure we include the last month
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
        if (monthEnd > end) {
          // If this month extends beyond our end date, stop here
          break
        }
        const monthYear = current.toLocaleString('en-US', { month: 'short', year: '2-digit' })
        monthlyMap.set(monthYear, 0)
        current.setMonth(current.getMonth() + 1)
      }
      
      // Add the final month if we haven't already
      const finalMonth = end.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      if (!monthlyMap.has(finalMonth)) {
        monthlyMap.set(finalMonth, 0)
      }

      console.log('Monthly map initialized with months:', Array.from(monthlyMap.keys()))

      // Fill in the data
      lists.forEach(list => {
        const date = new Date(list.created_at)
        const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' })
        console.log('Processing list from:', monthYear)
        if (monthlyMap.has(monthYear)) {
          monthlyMap.set(monthYear, monthlyMap.get(monthYear) + 1)
        } else {
          console.log('Warning: List date', monthYear, 'not in range')
        }
      })

      console.log('Final monthly counts:', Object.fromEntries(monthlyMap))

      return {
        labels: Array.from(monthlyMap.keys()),
        data: Array.from(monthlyMap.values())
      }
    }

    const processStoresData = (lists) => {
      const storesMap = {}
      lists.forEach(list => {
        if (list.store) {
          storesMap[list.store] = (storesMap[list.store] || 0) + 1
        }
      })

      const sortedStores = Object.entries(storesMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)

      return {
        labels: sortedStores.map(([store]) => store),
        data: sortedStores.map(([,count]) => count)
      }
    }

    const processItemsData = (lists) => {
      const itemsMap = {}
      lists.forEach(list => {
        if (Array.isArray(list.grocery_items)) {
          list.grocery_items.forEach(item => {
            if (item && item.name) {
              // Reverse the item name that's stored reversed in the database
              const correctedName = item.name.split('').reverse().join('')
              itemsMap[correctedName] = (itemsMap[correctedName] || 0) + 1
            }
          })
        }
      })

      const sortedItems = Object.entries(itemsMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10) // Top 10 items

      return {
        labels: sortedItems.map(([item]) => item),
        data: sortedItems.map(([,count]) => count)
      }
    }

    const processCategoriesData = (lists) => {
      const categoriesMap = {}
      lists.forEach(list => {
        if (Array.isArray(list.grocery_items)) {
          list.grocery_items.forEach(item => {
            if (item && item.category) {
              categoriesMap[item.category] = (categoriesMap[item.category] || 0) + 1
            }
          })
        }
      })

      const sortedCategories = Object.entries(categoriesMap)
        .sort(([,a], [,b]) => b - a)

      return {
        labels: sortedCategories.map(([category]) => category),
        data: sortedCategories.map(([,count]) => count)
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      loaded,
      dataAvailable,
      error,
      today,
      dateRange,
      monthlyListsData,
      topStoresData,
      topItemsData,
      categoryDistributionData,
      chartOptions,
      fetchData
    }
  }
}
</script>

<style scoped>
.analytics-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  color: #2E7D32;
  text-align: center;
  margin-bottom: 2rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
}

.chart-card h2 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  color: #d32f2f;
  padding: 1rem;
  background: #ffebee;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 500px;
}

.retry-button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #43A047;
}

.no-data-message {
  text-align: center;
  color: #666;
  padding: 2rem;
}

@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }

  .date-filter {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
