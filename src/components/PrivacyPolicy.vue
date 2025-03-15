<template>
  <div class="privacy-policy">
    <h1>Privacy Policy</h1>
    <div class="policy-content">
      <section>
        <h2>Your Privacy Matters</h2>
        <p>We are committed to protecting your privacy and ensuring your personal information remains secure. This privacy policy explains how we collect, use, and safeguard your data when you use our grocery list service.</p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <p>We collect only the minimum information necessary to provide you with our service:</p>
        <ul>
          <li>Email address (for authentication)</li>
          <li>Username (for personalization)</li>
          <li>Grocery lists and items you create</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>Your information is used exclusively for:</p>
        <ul>
          <li>Managing your account</li>
          <li>Storing and organizing your grocery lists</li>
          <li>Providing you with access to your lists across devices</li>
          <li>Improving our service functionality and user experience</li>
        </ul>
      </section>

      <section>
        <h2>Data Protection</h2>
        <p>We implement strict security measures to protect your data:</p>
        <ul>
          <li>All data is encrypted in transit and at rest</li>
          <li>Access to user data is strictly controlled and monitored</li>
          <li>Regular security audits and updates are performed</li>
        </ul>
      </section>

      <section>
        <h2>No Data Sharing</h2>
        <p>We do not sell, rent, or share your personal information with any third parties. Your data is yours alone and is only used to provide you with our grocery list service.</p>
      </section>

      <section>
        <h2>Data Retention</h2>
        <p>Your data is retained for as long as you maintain an active account. You can request deletion of your account and associated data at any time.</p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data</li>
          <li>Opt-out of any optional data collection</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy'
}
</script>

<style scoped>
.privacy-policy {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  color: #2E7D32;
  text-align: center;
  margin-bottom: 2rem;
}

.policy-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

section {
  margin-bottom: 2rem;
}

h2 {
  color: #2E7D32;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  color: #333;
  line-height: 1.6;
}

li {
  margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
  .policy-content {
    padding: 1rem;
  }
}
</style>
