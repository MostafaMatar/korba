<template>
  <div class="payment-failure">
    <div class="failure-card">
      <div class="icon-container">
        <span class="icon">❌</span>
      </div>
      
      <h1>Payment Failed</h1>
      
      <p class="message">
        We were unable to process your payment. This could be due to:
      </p>
      
      <ul class="reasons">
        <li>Insufficient funds</li>
        <li>Incorrect card information</li>
        <li>Connection issues</li>
        <li>Card declined by your bank</li>
      </ul>

      <div class="action-buttons">
        <button 
          @click="retryPayment"
          class="retry-button"
          :disabled="loading"
        >
          {{ loading ? 'Redirecting...' : 'Try Payment Again' }}
        </button>
        
        <button 
          @click="goHome"
          class="home-button"
        >
          Return Home
        </button>
      </div>

      <p class="support">
        Need help? Contact our support at <a href="mailto:support@korba.com">support@korba.com</a>
      </p>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'

export default {
  name: 'PaymentFailure',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async retryPayment() {
      this.loading = true
      try {
        const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY)
        
        const { error } = await stripe.redirectToCheckout({
          lineItems: [{
            price: process.env.VUE_APP_STRIPE_PRICE_ID,
            quantity: 1,
          }],
          mode: 'payment',
          successUrl: `${window.location.origin}/register?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment-failed`,
        })

        if (error) {
          console.error('Payment Error:', error)
        }
      } catch (err) {
        console.error('Stripe Error:', err)
      } finally {
        this.loading = false
      }
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.payment-failure {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.failure-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.icon-container {
  margin: 1rem 0;
}

.icon {
  font-size: 3rem;
}

h1 {
  color: #d32f2f;
  margin-bottom: 1.5rem;
}

.message {
  color: #333;
  margin-bottom: 1rem;
}

.reasons {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.reasons li {
  color: #666;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.reasons li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #d32f2f;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.retry-button {
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover:not(:disabled) {
  background-color: #43A047;
}

.retry-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.home-button {
  padding: 1rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.home-button:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.support {
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.support a {
  color: #4CAF50;
  text-decoration: none;
}

.support a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .payment-failure {
    margin: 1rem auto;
  }
  
  .failure-card {
    padding: 1.5rem;
  }
  
  .icon {
    font-size: 2.5rem;
  }
}
</style>
