<template>
  <div class="date-filter">
    <div class="filter-group">
      <label for="startDate">From:</label>
      <input 
        type="date" 
        id="startDate" 
        v-model="localDateRange.start"
        :max="localDateRange.end"
        @change="handleChange"
      >
    </div>
    <div class="filter-group">
      <label for="endDate">To:</label>
      <input 
        type="date" 
        id="endDate" 
        v-model="localDateRange.end"
        :min="localDateRange.start"
        @change="handleChange"
      >
    </div>
    <button class="reset-button" @click="handleReset">
      Reset
    </button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'DateRangeFilter',
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const today = new Date().toISOString().split('T')[0]
    const localDateRange = ref({ ...props.modelValue })

    watch(() => props.modelValue, (newValue) => {
      localDateRange.value = { ...newValue }
    })

    const handleChange = () => {
      emit('update:modelValue', { ...localDateRange.value })
    }

    const handleReset = () => {
      const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
        .toISOString().split('T')[0]
      
      localDateRange.value = {
        start: sixMonthsAgo,
        end: today
      }
      handleChange()
    }

    return {
      today,
      localDateRange,
      handleChange,
      handleReset
    }
  }
}
</script>

<style scoped>
.date-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.reset-button {
  padding: 0.5rem 1rem;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background: #1B5E20;
}

@media (max-width: 768px) {
  .date-filter {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
