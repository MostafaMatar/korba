<template>
  <div class="landing-page">
    <section class="hero">
      <h1>Transform Your Grocery Shopping Forever</h1>
      <p class="subtitle">The smart way to plan, track, and optimize your grocery shopping. Join thousands of happy families saving time and money every week.</p>
      
      <div class="hero-actions">
        <router-link to="/create-list" class="try-free-btn">CREATE GROCERY LIST NOW</router-link>
        <router-link to="/register" class="get-pro-btn">UNLOCK ALL FEATURES</router-link>
      </div>
    </section>

    <section class="features">
      <h2>Compare Features</h2>
      
      <div class="feature-comparison">
        <div class="feature-column basic">
          <h3>Basic Features</h3>
          <p class="price">Free</p>
          <p class="access-note">No account required • Start instantly</p>
          <ul>
            <li>
              <span class="check">✓</span>
              Create unlimited grocery lists
            </li>
            <li>
              <span class="check">✓</span>
              Smart item categorization
            </li>
            <li>
              <span class="check">✓</span>
              Share lists via secure web link
            </li>
            <li class="unavailable">
              <span class="cross">✕</span>
              Lists expire after 7 days
            </li>
            <li class="unavailable">
              <span class="cross">✕</span>
              No shopping analytics
            </li>
            <li class="unavailable">
              <span class="cross">✕</span>
              Basic features only
            </li>
          </ul>
          <router-link to="/create" class="feature-btn basic-btn">
            Start Free Trial
          </router-link>
        </div>

        <div class="feature-column pro">
          <div class="pro-badge">Most Popular</div>
          <h3>Pro Account</h3>
          <p class="price">$10</p>
          <p class="access-note">One-time payment • Lifetime access</p>
          <ul>
            <li>
              <span class="check">✓</span>
              All basic features included
            </li>
            <li>
              <span class="check">✓</span>
              Lists never expire
            </li>
            <li>
              <span class="check">✓</span>
              Advanced shopping analytics
            </li>
            <li>
              <span class="check">✓</span>
              Smart budget optimization
            </li>
            <li>
              <span class="check">✓</span>
              Priority customer support
            </li>
            <li>
              <span class="check">✓</span>
              Early access to new features
            </li>
          </ul>
          <router-link to="/register" class="feature-btn pro-btn">
            Get Lifetime Access Now
          </router-link>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How Korba Transforms Your Shopping</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Smart List Creation</h3>
          <p>Create organized shopping lists in seconds with our AI-powered interface</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Efficient Shopping</h3>
          <p>Save time with smart categorization and optimal shopping routes</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Track & Save</h3>
          <p>Monitor spending patterns and get personalized saving opportunities</p>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <h2>Loved by Shoppers Like You</h2>
      <div class="testimonial-grid">
        <div class="testimonial">
          <div class="rating">★★★★★</div>
          <p>"I've reduced my grocery spending by 30% and saved countless hours. The pro features are absolutely worth it!"</p>
          <div class="author">- Sarah M., Working Mom</div>
        </div>
        <div class="testimonial">
          <div class="rating">★★★★★</div>
          <p>"Finally, a grocery app that actually makes sense. The sharing feature has made coordinating with my partner so much easier."</p>
          <div class="author">- James K., Food Enthusiast</div>
        </div>
        <div class="testimonial">
          <div class="rating">★★★★★</div>
          <p>"The analytics helped me understand my shopping habits and save money. Best $10 I've ever spent!"</p>
          <div class="author">- Maria R., Budget Planner</div>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Start Optimizing Your Grocery Shopping Today</h2>
      <div class="cta-buttons">
        <router-link to="/create-list" class="try-free-btn">Try For Free</router-link>
        <router-link to="/register" class="get-pro-btn">Get Pro Access</router-link>
      </div>
      <p class="guarantee-text">Lifetime access • One-time payment</p>
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
  position: relative;
  overflow: hidden;
}

.social-proof {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.social-proof span {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.no-card {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.try-free-btn, .get-pro-btn {
  padding: 1.2rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
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
  transform: translateY(-2px);
}

.get-pro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.features {
  padding: 4rem 0;
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
  transition: transform 0.3s ease;
}

.feature-column:hover {
  transform: translateY(-5px);
}

.feature-column.pro {
  border: 2px solid #4CAF50;
  transform: scale(1.05);
  z-index: 1;
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
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
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
  transform: translateY(-2px);
}

.pro-btn:hover {
  background-color: #43A047;
  transform: translateY(-2px);
}

.guarantee {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.how-it-works {
  padding: 4rem 0;
  background-color: white;
  border-radius: 12px;
  margin: 4rem 0;
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
  transition: transform 0.3s ease;
}

.step:hover {
  transform: translateY(-5px);
}

.step-number {
  width: 50px;
  height: 50px;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto 1rem;
  font-size: 1.2rem;
}

.step h3 {
  color: #2E7D32;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.testimonials {
  padding: 4rem 0;
  background-color: #fff;
  border-radius: 12px;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.testimonial {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  text-align: left;
  transition: transform 0.3s ease;
}

.testimonial:hover {
  transform: translateY(-5px);
}

.rating {
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.author {
  color: #666;
  margin-top: 1rem;
  font-style: italic;
}

.cta {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
  border-radius: 12px;
  margin-top: 4rem;
}

.cta h2 {
  color: white;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin: 2rem 0;
}

.guarantee-text {
  font-size: 0.9rem;
  opacity: 0.8;
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

  .social-proof {
    gap: 1rem;
  }

  .social-proof span {
    font-size: 0.8rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .feature-column.pro {
    transform: none;
  }

  .testimonial-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style>
