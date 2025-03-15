<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create Your Account</h1>
      <p v-if="!sessionId">Complete your payment to create your premium account</p>
      <p v-else>Set up your account credentials</p>

      <form v-if="sessionId" @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            minlength="3"
            :disabled="loading"
          />
        </div>

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
            minlength="6"
            :disabled="loading"
          />
          <small>Password must be at least 6 characters long</small>
        </div>

        <div class="form-group privacy-agreement">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.privacyAgreed"
              required
              :disabled="loading"
            />
            I agree to the <router-link to="/privacy-policy" target="_blank">Privacy Policy</router-link>
          </label>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="register-button">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>
      </form>

      <div v-else class="redirect-section">
        <p class="redirect-message">You'll need a premium account to continue</p>
        <button @click="goToPayment" class="payment-button">
          Continue to Payment - $10.00
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export default {
  name: 'RegisterUser',
  props: {
    sessionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const loading = ref(false);
    const error = ref(null);
    const form = ref({
      username: '',
      email: '',
      password: '',
      privacyAgreed: false
    });

    const goToPayment = () => {
      window.location.href = '/payment-plan';
    };

    const handleRegister = async () => {
      try {
        loading.value = true;
        error.value = null;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.value.email)) {
          throw new Error('Please enter a valid email address');
        }

        // Validate privacy policy agreement
        if (!form.value.privacyAgreed) {
          throw new Error('You must agree to the Privacy Policy to continue');
        }

        // Register user with Supabase
        const { error: authError } = await supabase.auth.signUp({
          email: form.value.email,
          password: form.value.password,
          options: {
            data: {
              username: form.value.username,
              stripe_session: props.sessionId,
              is_premium: true
            }
          }
        })

        if (authError) throw authError

        // Redirect to verification page
        window.location.href = '/verification'
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
      handleRegister,
      goToPayment
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h1 {
  color: #2E7D32;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.register-form {
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

small {
  color: #666;
  font-size: 0.875rem;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.register-button, .payment-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.register-button:hover:not(:disabled),
.payment-button:hover:not(:disabled) {
  background-color: #43A047;
}

.register-button:disabled,
.payment-button:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

.privacy-agreement {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 600;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.redirect-section {
  text-align: center;
}

.redirect-message {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .register-card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
