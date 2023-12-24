<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
import axios from 'axios';

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

const { contextPath } = useLayout();
const customer_username = ref('');
const customer_full_name = ref('');
const customer_email = ref('');
const customer_password = ref('');
const checked = ref(false);

const addDataData = async () => {
    try {
        const response = await axios.post('http://localhost:9900/api/v1/registrasi', {
            customer_username: customer_username.value,
            customer_full_name: customer_full_name.value,
            customer_email: customer_email.value,
            customer_password: customer_password.value
        });

        if (response.status === 200) {
            handleLogin();
        } else {
            // Tampilkan pesan error atau lakukan handling lain
            console.error('Gagal menambahkan data:', response);
        }
    } catch (error) {
        console.error('Error saat mengirim data:', error);
    }
};
</script>

<template>
    <main class="container-2">
        <div class="gambar-login-2">
            <div class="konten-2">
                <h1>REGISTER</h1>
                <p>CV.BEKANTANJANTAN</p>
                <img src="/demo/images/landing/screen-2.png" alt="" />
            </div>
        </div>
        <div class="login-2">
            <div class="gambar-bekantan-2">
                <img :src="logoUrl" alt="Logo Bekantan" class="logo" />
            </div>
            <div class="judul-login-2">
                <h2>Daftar</h2>
            </div>
            <div class="username-2">
                <InputText id="username" type="text" v-model="customer_username" placeholder="Nama" class="w-full mb-5" style="padding: 1rem" />
            </div>
            <div class="username-2">
                <InputText id="namalengkap" type="text" v-model="customer_full_name" placeholder="Nama Lengkap" class="w-full mb-5" style="padding: 1rem" />
            </div>
            <div class="email-2">
                <InputText id="email" type="text" v-model="customer_email" placeholder="Email" class="w-full mb-5" style="padding: 1rem" />
            </div>
            <div class="password-2">
                <InputText id="password" :type="checked ? 'text' : 'password'" v-model="customer_password" placeholder="Password" class="w-full mb-5" style="padding: 1rem" />
            </div>
            <div class="cekpw-1">
                <input type="checkbox" name="cekpw" id="cekpw" v-model="checked" />
                <label for="cekpw">Lihat password</label>
            </div>
            <div class="masuk-2">
                <button @click="addDataData">Selesai</button>
            </div>
            <div class="register-2">
                <p>Sudah punya akun? <a href="#" @click.prevent="handleLogin">Login</a></p>
            </div>
        </div>
    </main>
    <AppConfig simple />
</template>

<style scoped></style>
