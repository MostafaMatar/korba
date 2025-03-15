import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from './lib/supabase'
import LandingPage from './components/LandingPage.vue'
import PrivacyPolicy from './components/PrivacyPolicy.vue'
import ContactForm from './components/ContactForm.vue'
import CreateList from './components/CreateList.vue'
import ViewList from './components/ViewList.vue'
import RegisterUser from './components/RegisterUser.vue'
import PaymentPlan from './components/PaymentPlan.vue'
import PaymentFailure from './components/PaymentFailure.vue'
import UserAnalytics from './components/UserAnalytics.vue'
import VerifyUser from './components/VerifyUser.vue'
import LogIn from './components/LogIn.vue'
import ViewDashboard from './components/ViewDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPage
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicy
  },
  {
    path: '/create-list',
    name: 'create-list',
    component: CreateList
  },
  {
    path: '/view-list/:id',
    name: 'view-list',
    component: ViewList,
    props: true
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterUser,
  props: route => ({
    sessionId: route.query.session_id
  })
  },
  {
    path: '/verification',
    name: 'verification',
    component: VerifyUser
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: ViewDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment-plan',
    name: 'payment-plan',
    component: PaymentPlan
  },
  {
    path: '/payment-failed',
    name: 'payment-failed',
    component: PaymentFailure
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: UserAnalytics,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || ''),
  routes
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
