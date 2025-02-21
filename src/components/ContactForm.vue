<template>
  <div class="contact-form-container">
    <h1>Contact Us</h1>
    <p class="description">Send us your feedback, suggestions, or report any issues.</p>
    
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-group">
        <label for="subject">Subject</label>
        <input 
          type="text" 
          id="subject" 
          v-model="form.subject" 
          required
          placeholder="Enter subject"
        >
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea 
          id="message" 
          v-model="form.message" 
          required
          rows="6"
          placeholder="Enter your message"
        ></textarea>
      </div>

      <button type="submit" :disabled="sending" class="submit-button">
        {{ sending ? 'Sending...' : 'Send Message' }}
      </button>

      <div v-if="status" :class="['status-message', status.type]">
        {{ status.message }}
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

export default {
  name: 'ContactForm',
  setup() {
    const form = ref({
      subject: '',
      message: ''
    })
    const sending = ref(false)
    const status = ref(null)

    const handleSubmit = async () => {
      sending.value = true
      status.value = null

      try {
        await emailjs.send(
          'service_q47ixka',
          'template_50rvvmu',
          {
            subject: form.value.subject,
            message: form.value.message
          },
          '9EVf8eDgmSqF10P3y'
        )

        status.value = {
          type: 'success',
          message: 'Message sent successfully!'
        }

        // Reset form
        form.value.subject = ''
        form.value.message = ''
      } catch (error) {
        console.error('Failed to send message:', error)
        status.value = {
          type: 'error',
          message: 'Failed to send message. Please try again.'
        }
      } finally {
        sending.value = false
      }
    }

    return {
      form,
      sending,
      status,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.contact-form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.contact-form {
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
  font-weight: 600;
  color: #333;
}

input, textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
}

.submit-button {
  background-color: #2E7D32;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #1B5E20;
}

.submit-button:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.status-message {
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.status-message.success {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-message.error {
  background-color: #FFEBEE;
  color: #D32F2F;
}
</style>
