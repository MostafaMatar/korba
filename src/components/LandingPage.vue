<template>
  <div class="landing-page">
    <section class="banner">
      <div class="banner-content">
        <h1>Share Your Grocery Lists with Family and Friends</h1>
        <p class="subtitle">Make shopping easier and more collaborative than ever</p>
        <router-link to="/create-list" class="cta-button">Create Grocery List</router-link>
        
        <div class="features">
          <h2>Why Choose Korba?</h2>
          <ul>
            <li>
              <span class="feature-icon">✓</span>
              Access your grocery list from any device
            </li>
            <li>
              <span class="feature-icon">✓</span>
              Add quantity and notes to each item
            </li>
            <li>
              <span class="feature-icon">✓</span>
              Organize items in categories
            </li>
            <li>
              <span class="feature-icon">✓</span>
              Share with anyone via link
            </li>
            <li>
              <span class="feature-icon">✓</span>
              No installations, No sign ups, No hassle
            </li>
            <li>
              <span class="feature-icon">✓</span>
              Free to use, for everyone
            </li>
          </ul>
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
  width: 100%;
  min-height: 100vh;
}

.banner {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  padding: 4rem 2rem;
  color: white;
  text-align: center;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background-color: #FFC107;
  color: #000;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.cta-button:hover {
  transform: scale(1.05);
}

.features {
  margin-top: 4rem;
  text-align: left;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.75rem;
}

.features ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.features li {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.feature-icon {
  margin-right: 1rem;
  color: #FFC107;
  font-weight: bold;
}
</style>
