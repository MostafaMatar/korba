<template>
    <header class="app-header">
        <div class="header-content">
            <router-link to="/" class="logo">
                <span class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24">
                        <path fill="currentColor"
                            d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z" />
                    </svg>
                </span>
                <span class="logo-text">Korba</span>
            </router-link>
            <div class="nav-links">
                <template v-if="isAuthenticated">
                    <router-link to="/dashboard" class="nav-button">Dashboard</router-link>
                    <router-link to="/analytics" class="nav-button">Analytics</router-link>
                    <router-link to="/contact" class="nav-button">Contact Us</router-link>
                    <button @click="handleSignOut" class="nav-button logout">Sign Out</button>
                </template>
                <template v-else>
                    <router-link to="/login" class="nav-button login">Log In</router-link>
                    <router-link to="/register" class="nav-button register">Sign Up</router-link>
                </template>
            </div>
        </div>
    </header>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

export default {
    name: 'AppHeader',
    setup() {
        const isAuthenticated = ref(false)
        const router = useRouter()

        const handleSignOut = async () => {
            try {
                await supabase.auth.signOut()
                isAuthenticated.value = false
                router.push('/')
            } catch (error) {
                console.error('Error signing out:', error)
            }
        }

        onMounted(async () => {
            const { data: { user } } = await supabase.auth.getUser()
            isAuthenticated.value = !!user
        })

        return {
            isAuthenticated,
            handleSignOut
        }
    }
}
</script>

<style scoped>
.app-header {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #2E7D32;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.2s ease;
}

.logo:hover {
    color: #4CAF50;
}

.logo-icon {
    display: flex;
    align-items: center;
}

.nav-links {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.nav-button {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
}

.nav-button.login {
    color: #2E7D32;
}

.nav-button.login:hover {
    background-color: #f0f0f0;
}

.nav-button.register {
    background-color: #2E7D32;
    color: white;
}

.nav-button.register:hover {
    background-color: #1B5E20;
}

.nav-button.logout {
    color: #d32f2f;
    border: 1px solid #d32f2f;
    background: none;
    cursor: pointer;
}

.nav-button.logout:hover {
    background-color: #ffebee;
}
</style>
