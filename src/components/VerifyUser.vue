<template>
  <div class="verify-container">
    <div class="verify-card">
      <div v-if="loading" class="loading-state">
        <h1>Setting Up Your Account</h1>
        <div class="progress-steps">
          <div class="step" :class="{ active: step >= 1, complete: step > 1 }">
            Verifying Payment
          </div>
          <div class="step" :class="{ active: step >= 2, complete: step > 2 }">
            Creating Account
          </div>
          <div class="step" :class="{ active: step >= 3, complete: step > 3 }">
            Setting Up Subscription
          </div>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <h1>Something Went Wrong</h1>
        <p class="error-message">{{ error }}</p>
        <button @click="retrySetup" class="retry-button">
          Try Again
        </button>
      </div>

      <div v-else class="success-state">
        <h1>Welcome to Korba Pro! 🎉</h1>
        <p class="success-message">
          Your account has been created successfully. You can now access all Pro features.
        </p>
        <div class="action-buttons">
          <router-link to="/create-list" class="start-button">
            Create Your First List
          </router-link>
          <router-link to="/dashboard" class="dashboard-button">
            View Your Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

export default {
  name: 'VerifyUser',
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const error = ref(null)
    const step = ref(1)

    const createAccount = async (registrationData) => {
      try {
        step.value = 2
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: registrationData.email,
          password: registrationData.password,
          options: {
            data: {
              username: registrationData.username
            }
          }
        })

        if (signUpError) throw signUpError

        step.value = 3
        // Create profile with pro subscription
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: registrationData.username,
              email: registrationData.email,
              subscription_tier: 'pro'
            }
          ])

        if (profileError) throw profileError

        // Clear registration data
        localStorage.removeItem('pendingRegistration')
        
        loading.value = false
      } catch (err) {
        console.error('Account creation failed:', err)
        error.value = err.message
        loading.value = false
      }
    }

    const retrySetup = async () => {
      loading.value = true
      error.value = null
      step.value = 1
      await setupAccount()
    }

    const setupAccount = async () => {
      try {
        const registrationData = JSON.parse(localStorage.getItem('pendingRegistration'))
        if (!registrationData) {
          throw new Error('No registration data found')
        }

        await createAccount(registrationData)
      } catch (err) {
        console.error('Setup failed:', err)
        error.value = 'Failed to set up your account. Please try again.'
        loading.value = false
      }
    }

    onMounted(() => {
      if (!route.query.session_id) {
        error.value = 'Invalid verification attempt'
        loading.value = false
        return
      }
      setupAccount()
    })

    return {
      loading,
      error,
      step,
      retrySetup
    }
  }
}
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.verify-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.loading-state h1,
.error-state h1,
.success-state h1 {
  color: #2E7D32;
  margin-bottom: 2rem;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.step {
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
  position: relative;
}

.step.active {
  background-color: #E8F5E9;
  color: #2E7D32;
  font-weight: bold;
}

.step.complete {
  background-color: #C8E6C9;
  color: #1B5E20;
}

.step.complete::after {
  content: '✓';
  position: absolute;
  right: 1rem;
  color: #2E7D32;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.success-message {
  color: #2E7D32;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.retry-button,
.start-button,
.dashboard-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.retry-button {
  background-color: #d32f2f;
  color: white;
  border: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.start-button {
  background-color: #4CAF50;
  color: white;
}

.dashboard-button {
  background-color: #f5f5f5;
  color: #2E7D32;
}

.retry-button:hover,
.start-button:hover {
  transform: translateY(-2px);
}

.dashboard-button:hover {
  background-color: #E8F5E9;
}

@media (max-width: 600px) {
  .verify-card {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
