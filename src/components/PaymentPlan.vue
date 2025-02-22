<template>
  <div class="payment-plan">
    <div class="plan-card">
      <h1>Premium Plan</h1>
      
      <div class="plan-features">
        <h2>What's Included:</h2>
        <ul>
          <li><span class="icon">✓</span> Create unlimited grocery lists</li>
          <li><span class="icon">✓</span> Share lists with family & friends</li>
          <li><span class="icon">✓</span> Add custom categories</li>
          <li><span class="icon">✓</span> Track purchase dates & stores</li>
          <li><span class="icon">✓</span> Export lists to PDF</li>
        </ul>
      </div>

      <div class="plan-price">
        <span class="price">$9.99</span>
        <span class="period">one-time payment</span>
      </div>

      <div class="payment-section">
        <p class="secure-note">🔒 Secure payment powered by Stripe</p>
        <button 
          @click="redirectToPayment"
          class="payment-button"
          :disabled="loading"
        >
          {{ loading ? 'Redirecting...' : 'Continue to Payment' }}
        </button>
      </div>

      <p class="terms">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'

export default {
  name: 'PaymentPlan',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async redirectToPayment() {
      this.loading = true
      try {
        const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY)
        
        // Redirect to Stripe payment page
        // Ensure we have a properly formatted base URL
        const isProd = process.env.NODE_ENV === 'production';
        let baseURL = isProd ? process.env.VUE_APP_URL : 'http://localhost:8080';
        
        // Ensure URL starts with http(s)://
        if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
          baseURL = `https://${baseURL}`;
        }
        
        // Remove trailing slash if present
        baseURL = baseURL.replace(/\/$/, '');

        const { error } = await stripe.redirectToCheckout({
          lineItems: [{
            price: process.env.VUE_APP_STRIPE_PRICE_ID,
            quantity: 1,
          }],
          mode: 'payment',
          successUrl: `${baseURL}/register?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseURL}/payment-failed`,
        })

        if (error) {
          console.error('Payment Error:', error)
          this.$router.push('/payment-failed')
        }
      } catch (err) {
        console.error('Stripe Error:', err)
        this.$router.push('/payment-failed')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.payment-plan {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.plan-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2E7D32;
  text-align: center;
  margin-bottom: 2rem;
}

.plan-features {
  margin: 2rem 0;
}

.plan-features h2 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.plan-features ul {
  list-style: none;
  padding: 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  color: #444;
}

.icon {
  color: #4CAF50;
  font-weight: bold;
  margin-right: 0.5rem;
}

.plan-price {
  text-align: center;
  margin: 2rem 0;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2E7D32;
}

.period {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.payment-section {
  margin: 2rem 0;
}

.secure-note {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
}

.payment-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.payment-button:hover:not(:disabled) {
  background-color: #43A047;
}

.payment-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.terms {
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .payment-plan {
    margin: 1rem auto;
  }
  
  .plan-card {
    padding: 1.5rem;
  }
  
  .price {
    font-size: 2rem;
  }
}
</style>
