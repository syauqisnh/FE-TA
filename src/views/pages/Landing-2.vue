<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
    router.push('/auth/Login-2');
};

const goToRegister = () => {
    router.push('/auth/register');
};

import '../pages/css/landing.css';

const { contextPath } = useLayout();

const logoUrl = computed(() => {
    return `${contextPath}layout/images/Test.jpg`;
});

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const isResponsiveMode = computed(() => {
    // Adjust the screen width threshold based on your design needs
    return window.innerWidth <= 768;
});

// Listen for window resize events to update isResponsiveMode
window.addEventListener('resize', () => {
    isMenuOpen.value = false; // Close the menu on resize
});
</script>

<template>
    <div class="container">
        <nav class="navbar">
            <div class="logo-bekantan">
                <a href="#">
                    <img :src="logoUrl" alt="Logo Bekantan" class="logo" />
                </a>
            </div>
            <div class="menu-toggle" @click="toggleMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="fitur" :class="{ active: isMenuOpen }">
                <ul class="list">
                    <li><a href="">Home</a></li>
                    <li><a href="">Features</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">Contact</a></li>
                    <li v-if="isResponsiveMode">
                        <div class="login">
                            <button @click="goToLogin">Login</button>
                        </div>
                    </li>
                    <li v-if="isResponsiveMode">
                        <div class="register">
                            <button @click="goToRegister">Register</button>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="login-reg">
                <div class="login">
                    <button @click="goToLogin">Login</button>
                </div>
                <div class="register">
                    <button @click="goToRegister">Register</button>
                </div>
            </div>
        </nav>
        <main class="isi-content">
            <div class="content-text">
                <h2>Welcome</h2>
                <h1>Admin CV Bekantan Jantan</h1>
                <p>
                    Kami memberikan akses penuh kepada admin untuk mengatur dan memaksimalkan semua <br />
                    fitur yang ada di web company profile. Mulai dari pemantauan data pengguna, pengaturan<br />
                    konten, hingga integrasi dengan platform lain, semua dapat diakses dengan mudah.
                </p>
                <div class="get">
                    <button @click="goToLogin">Get Started</button>
                </div>
            </div>
            <div class="gambar-1">
                <img src="/demo/images/landing/screen-2.png" alt="" />
            </div>
        </main>
    </div>
    <AppConfig simple />
</template>

<style scoped></style>
