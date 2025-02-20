<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Welcome Back</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>

        <div class="form-links">
          <router-link to="/register" class="register-link">
            Create an account
          </router-link>
          <button 
            type="button" 
            class="forgot-password-link"
            @click="handleForgotPassword"
            :disabled="loading"
          >
            Forgot password?
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

export default {
  name: 'LogIn',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)
    const form = ref({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = null

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.value.email,
          password: form.value.password,
        })

        if (signInError) throw signInError

        router.push('/dashboard')
      } catch (e) {
        error.value = e.message
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = async () => {
      if (!form.value.email) {
        error.value = 'Please enter your email address'
        return
      }

      try {
        loading.value = true
        error.value = null

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          form.value.email
        )

        if (resetError) throw resetError

        alert('Password reset instructions have been sent to your email')
      } catch (e) {
        error.value = e.message
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleLogin,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #2E7D32;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #333;
  font-weight: 600;
}

input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #4CAF50;
  outline: none;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.login-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover:not(:disabled) {
  background-color: #43A047;
}

.login-button:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.form-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.register-link, .forgot-password-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.forgot-password-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.register-link:hover, .forgot-password-link:hover {
  text-decoration: underline;
}

.forgot-password-link:disabled {
  color: #9E9E9E;
  cursor: not-allowed;
}
</style>
