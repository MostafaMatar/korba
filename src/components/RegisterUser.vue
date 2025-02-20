<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Subscribe to Pro</h1>
      <p>Subscribe now to our pro features to keep your grocery lists forever and gain insights on your shopping habits</p>

      <form @submit.prevent="handleRegister" class="register-form">
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

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="register-button">
          {{ loading ? 'Creating Account...' : getButtonText() }}
        </button>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RegisterUser',
  setup() {
    const loading = ref(false);
    const error = ref(null);
    const form = ref({
      username: '',
      email: '',
      password: ''
    });

    const getButtonText = () => {
      return loading.value ? 'Creating Account...' : 'Subscribe Now - $5/year';
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
      getButtonText
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
  max-width: 800px;
}

h1, h2 {
  color: #2E7D32;
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 2rem;
}

.plan-selection {
  margin-bottom: 2rem;
}

.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.plan-card {
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.plan-card.selected {
  border-color: #4CAF50;
  background: #f1f8e9;
}

.pro-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.plan-card h3 {
  color: #2E7D32;
  margin-bottom: 1rem;
}

.plan-card .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2E7D32;
  margin-bottom: 1rem;
}

.plan-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-card ul li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.plan-card ul li::before {
  content: '✓';
  color: #4CAF50;
  font-weight: bold;
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

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #43A047;
}

.register-button:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  color: #666;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-card {
    padding: 1.5rem;
  }

  .plans {
    grid-template-columns: 1fr;
  }
}
</style>
