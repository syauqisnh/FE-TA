<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';

import '../css/register.css';

// Siapkan router
const router = useRouter();

// Tentukan metode handleRegister Anda
const handleLogin = () => {
    // Gunakan router.push untuk navigasi ke rute register
    router.push('/auth/Login-2');
};

const logoUrl = computed(() => {
    return `${contextPath}layout/images/Test.jpg`;
});

const { layoutConfig, contextPath } = useLayout();
const username = ref('');
const email = ref('');
const password = ref('');
const cpassword = ref('');
const checked = ref(false);


</script>

<template>
    <main class="container-2">
        <div class="gambar-login-2">
            <div class="konten-2">
                <h1>REGISTER</h1>
                <h1>CV.BEKANTANJANTAN</h1>
                <img src="/demo/images/landing/screen-2.png" alt="">
            </div>
        </div>
        <div class="login-2">
            <div class="gambar-bekantan-2">
                <img :src="logoUrl" alt="Logo Bekantan" class="logo">
            </div>
            <div class="judul-login-2">
                <h2>Daftar</h2>
            </div>
            <div class="username-2">
                <InputText id="email" type="text" placeholder="Name" class="w-full mb-5" style="padding: 1rem"
                    v-model="username" />
            </div>
            <div class="email-2">
                <InputText id="email" type="text" placeholder="Email" class="w-full mb-5" style="padding: 1rem"
                    v-model="email" />
            </div>
            <div class="password-2">
                <InputText id="password" :type="checked ? 'text' : 'password'" placeholder="Password" class="w-full mb-5"
                    style="padding: 1rem" v-model="password" />
            </div>
            <div class="cpassword-2">
                <InputText id="password" :type="checked ? 'text' : 'password'" placeholder="Konfirmasi Password" class="w-full mb-5"
                    style="padding: 1rem" v-model="cpassword" />
            </div>
            <div class="masuk-2">
                <button>Selesai</button>
            </div>
            <div class="register-2">
                <p>Sudah punya akun? <a href="#" @click.prevent="handleLogin">Login</a></p>
            </div>
        </div>
    </main>
    <AppConfig simple />
</template>

<style scoped></style>
