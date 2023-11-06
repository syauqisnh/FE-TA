<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';

import '../css/login.css';

// Siapkan router
const router = useRouter();

const handleRegister = () => {
    router.push('/auth/register');
};

const handleDashboard = () => {
    router.push('/');
};

const logoUrl = computed(() => {
    return `${contextPath}layout/images/Test.jpg`;
});

const { layoutConfig, contextPath } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);


</script>

<template>
    <main class="container-1">
        <div class="gambar-login-1">
            <div class="konten-1">
                <h1>ADMIN</h1>
                <h1>CV.BEKANTANJANTAN</h1>
                <img src="/demo/images/landing/screen-2.png" alt="">
            </div>
        </div>
        <div class="login-1">
            <div class="gambar-bekantan-1">
                <img :src="logoUrl" alt="Logo Bekantan" class="logo">
            </div>
            <div class="judul-login-1">
                <h2>Silahkan Login</h2>
            </div>
            <div class="email-1">
                <InputText id="email" type="text" placeholder="Email address" class="w-full mb-5" style="padding: 1rem"
                    v-model="email" />
            </div>
            <div class="password-1">
                <InputText id="password" :type="checked ? 'text' : 'password'" placeholder="Password" class="w-full mb-5"
                    style="padding: 1rem" v-model="password" />
            </div>
            <div class="pembungkus-1">
                <div class="cekpw-1">
                    <input type="checkbox" name="cekpw" id="cekpw" v-model="checked">
                    <label for="cekpw">Lihat password</label>
                </div>
                <div class="lupapw-1">
                    <a href="#">Lupa Password?</a>
                </div>
            </div>
            <div class="masuk-1">
                <button @click="handleDashboard">Masuk</button>
            </div>
            <div class="register-1">
                <p>Belum punya akun? <a href="#" @click.prevent="handleRegister">Daftar</a></p>
            </div>
        </div>
    </main>
    <AppConfig simple />
</template>

<style scoped></style>
