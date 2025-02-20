<template>
  <div class="landing-page">
    <section class="hero">
      <h1>Korba - Smart Grocery Management</h1>
      <p class="subtitle">Create and manage your grocery lists efficiently and share them with your loved ones</p>
      
      <div class="hero-actions">
        <router-link to="/create" class="try-free-btn">Create your first grocery list for free</router-link>
        <router-link to="/register" class="get-pro-btn">Subscribe for extra features</router-link>
      </div>
    </section>

    <section class="features">
      <h2>Compare Features</h2>
      
      <div class="feature-comparison">
        <div class="feature-column basic">
          <h3>Basic Features</h3>
          <p class="price">Free</p>
          <p class="access-note">No account required</p>
          <ul>
            <li>
              <span class="check">✓</span>
              Create grocery lists
            </li>
            <li>
              <span class="check">✓</span>
              Basic item categorization
            </li>
            <li>
              <span class="check">✓</span>
              Share with others via a web link
            </li>
            <li class="unavailable">
              <span class="cross">✕</span>
              Lists are automatically deleted after 1 week
            </li>
            <li class="unavailable">
              <span class="cross">✕</span>
              Historical data
            </li>
            <li class="unavailable">
              <span class="cross">✕</span>
              Shopping analytics
            </li>
          </ul>
          <router-link to="/create" class="feature-btn basic-btn">
            Try For Free
          </router-link>
        </div>

        <div class="feature-column pro">
          <div class="pro-badge">Recommended</div>
          <h3>Pro Account</h3>
          <p class="price">$5/year</p>
          <p class="access-note">Full access to all features</p>
          <ul>
            <li>
              <span class="check">✓</span>
              All basic features
            </li>
            <li>
              <span class="check">✓</span>
              Save unlimited lists that presist forever
            </li>
            <li>
              <span class="check">✓</span>
              Advanced customization
            </li>
            <li>
              <span class="check">✓</span>
              Shopping insights dashboard
            </li>
            <li>
              <span class="check">✓</span>
              Secure access
            </li>
            <li>
              <span class="check">✓</span>
              Product Roadmap influence
            </li>
          </ul>
          <router-link to="/register" class="feature-btn pro-btn">
            Subscribe Now
          </router-link>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Create Lists</h3>
          <p>Easily create and organize your grocery lists with our intuitive interface</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Select Categories</h3>
          <p>Group items by categories for efficient shopping</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Track Progress</h3>
          <p>Check off items as you shop and track your shopping habits</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
  border-radius: 12px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.try-free-btn, .get-pro-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.try-free-btn {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.get-pro-btn {
  background-color: white;
  color: #2E7D32;
}

.try-free-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.get-pro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.features {
  padding: 2rem 0;
}

h2 {
  text-align: center;
  color: #2E7D32;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.feature-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.feature-column {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-column.pro {
  border: 2px solid #4CAF50;
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

.feature-column h3 {
  color: #2E7D32;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2E7D32;
  margin-bottom: 0.5rem;
}

.access-note {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.feature-column ul {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  text-align: left;
}

.feature-column li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check {
  color: #4CAF50;
  font-weight: bold;
}

.cross {
  color: #d32f2f;
  font-weight: bold;
}

.unavailable {
  color: #666;
}

.feature-btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.basic-btn {
  background-color: #f5f5f5;
  color: #2E7D32;
}

.pro-btn {
  background-color: #4CAF50;
  color: white;
}

.basic-btn:hover {
  background-color: #e0e0e0;
}

.pro-btn:hover {
  background-color: #43A047;
  transform: translateY(-2px);
}

.how-it-works {
  padding: 4rem 0;
  background-color: white;
  border-radius: 12px;
  margin-top: 4rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.step {
  text-align: center;
  padding: 2rem;
}

.step-number {
  width: 40px;
  height: 40px;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.step h3 {
  color: #2E7D32;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .feature-column.pro {
    transform: none;
  }
}
</style>
