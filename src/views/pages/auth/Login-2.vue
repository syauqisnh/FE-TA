<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const validationLogin = ref('');

const user_email = ref('');
const user_password = ref('');
const { contextPath } = useLayout();
const checked = ref(false);

import '../css/login.css';

// Siapkan router
const router = useRouter();

const handleRegister = () => {
    router.push('/auth/register');
};

const handleLogin = async () => {
    try {
        await axios.post(`${baseURL}/api/${version}/login`, {
            email: user_email.value,
            password: user_password.value
        });
        // Sesuaikan respons dan simpan informasi sesi/token jika diperlukan
        router.push('/'); // Navigasi ke dashboard jika login sukses
    } catch (error) {
        // Tampilkan error jika login gagal
        console.error(error);
        validationLogin.value = error.response.data.msg
    }
    // const email = 'haasstt@gmail.com';
    // const password = '12345678';

    // if (user_email.value == email) {
    //     if (user_password.value == password) {
    //         router.push('/');
    //     }
    // }
};

const logoUrl = computed(() => {
    return `${contextPath}layout/images/Test.jpg`;
});

</script>

<template>
    <main class="container-1">
        <div class="gambar-login-1">
            <div class="konten-1">
                <h1>CV.BEKANTANJANTAN</h1>
                <p>All In One Complete IT Solution</p>
                <img src="/demo/images/landing/screen-2.png" alt="" />
            </div>
        </div>
        <div class="login-1">
            <div class="gambar-bekantan-1">
                <img :src="logoUrl" alt="Logo Bekantan" class="logo" />
            </div>
            <div class="judul-login-1">
                <h2>Silahkan Login</h2>
                <p v-if="validationLogin" class="validation-error text-danger">{{ validationLogin }}</p>
            </div>
            <div class="email-1">
                <InputText v-model="user_email" id="email" type="text" placeholder="Email address" class="w-full mb-5" style="padding: 1rem"/>
            </div>
            <div class="password-1">
                <InputText v-model="user_password" id="password" :type="checked ? 'text' : 'password'" placeholder="Password" class="w-full mb-5" style="padding: 1rem"/>
            </div>
            <div class="pembungkus-1">
                <div class="cekpw-1">
                    <input type="checkbox" name="cekpw" id="cekpw" v-model="checked" />
                    <label for="cekpw">Lihat password</label>
                </div>
                <div class="lupapw-1">
                    <a href="#">Lupa Password?</a>
                </div>
            </div>
            <div class="masuk-1">
                <button @click="handleLogin">Masuk</button>
            </div>
            <div class="register-1">
                <p>Belum punya akun? <a href="#" @click.prevent="handleRegister">Daftar</a></p>
            </div>
        </div>
    </main>
    <AppConfig simple />
</template>

<style scoped></style>
