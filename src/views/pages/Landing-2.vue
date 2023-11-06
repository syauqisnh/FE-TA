<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';
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

const { layoutConfig, contextPath } = useLayout();

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const logoUrl = computed(() => {
    return `${contextPath}layout/images/Test.jpg`;
});
</script>

<template>
    <div class="container">
        <nav class="navbar">
            <div class="logo-bekantan">
                <a href="#">
                    <img :src="logoUrl" alt="Logo Bekantan" class="logo">
                </a>
            </div>
            <div class="fitur">
                <ul class="list">
                    <li class="">
                        <a href="">Home</a>
                    </li>
                    <li>
                        <a href="">Fiatures</a>
                    </li>
                    <li>
                        <a href="">About</a>
                    </li>
                    <li>
                        <a href="">Contact</a>
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
                <p>Kami memberikan akses penuh kepada admin untuk mengatur dan memaksimalkan semua 
                    <br> fitur yang ada di web company profile. Mulai dari pemantauan data pengguna, pengaturan<br> 
                    konten, hingga integrasi dengan platform lain, semua dapat diakses dengan mudah.</p>
                <div class="get">
                    <button>Get Started</button>
                </div>
            </div>
            <div class="gambar-1">
                <img src="/demo/images/landing/screen-2.png" alt="">
            </div>
        </main>
    </div>
    <AppConfig simple />
</template>

<style scoped>
/* #hero {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
    height: 700px;
    overflow: hidden;
}

@media screen and (min-width: 768px) {
    #hero {
        -webkit-clip-path: ellipse(150% 87% at 93% 13%);
        clip-path: ellipse(150% 87% at 93% 13%);
        height: 530px;
    }
}

@media screen and (min-width: 1300px) {
    #hero > img {
        position: absolute;
    }

    #hero > div > p {
        max-width: 450px;
    }
}

@media screen and (max-width: 1300px) {
    #hero {
        height: 600px;
    }

    #hero > img {
        position: static;
        transform: scale(1);
        margin-left: auto;
    }

    #hero > div {
        width: 100%;
    }

    #hero > div > p {
        width: 100%;
        max-width: 100%;
    }
} */
</style>
