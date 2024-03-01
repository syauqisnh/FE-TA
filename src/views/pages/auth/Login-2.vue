<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const validationLogin = ref('');

const user_email = ref('');
const user_password = ref('');
const checked = ref(false);
const isLoading = ref(false);

// Siapkan router
const router = useRouter();

const handleRegister = () => {
    router.push('/auth/register');
};

const handleLogin = async () => {
    isLoading.value = true;
    try {
        await axios.post(`${baseURL}/api/${version}/login`, {
            email: user_email.value,
            password: user_password.value
        });
        setTimeout(() => {
            router.push('/');
            isLoading.value = false;
        }, 3000);
    } catch (error) {
        console.error(error);
        validationLogin.value = error.response.data.msg;
        isLoading.value = false;
    }
};

console.log(isLoading.value);
</script>

<template>
    <main class="container-1">
        <div class="login-1">
            <div class="left"></div>
            <div class="right">
                <div class="mb-5">
                    <router-link to="/">
                        <i class="pi pi-chevron-left" style="font-size: 17px; color: blue;"><span>Kembali</span></i>
                    </router-link>
                </div>
                <div class="logo-bekantan">
                    <a href=""
                        ><h1>USAHAMIKRO<span>SITE</span></h1></a
                    >
                </div>
                <div class="pembukus-login">
                    <div class="judul-login-1">
                        <h2>Login</h2>
                        <p v-if="validationLogin" class="validation-error text-danger">{{ validationLogin }}</p>
                    </div>
                    <div class="email-1">
                        <InputText v-model="user_email" id="email" type="text" placeholder="Email address" class="w-full mb-3" style="padding: 1rem" />
                    </div>
                    <div class="password-1">
                        <InputText v-model="user_password" id="password" :type="checked ? 'text' : 'password'" placeholder="Password" class="w-full mb-3" style="padding: 1rem" />
                    </div>
                    <div class="pembungkus-1">
                        <div class="mb-3 checkbox-wrapper">
                            <input type="checkbox" name="cekpw" id="cekpw" v-model="checked" />
                            <label for="cekpw">Lihat password</label>
                        </div>
                        <div class="lupapw-1">
                            <a href="#">Lupa Password?</a>
                        </div>
                    </div>
                    <div class="mb-3">
                        <!-- <button @click="handleLogin" style="display: flex; justify-content: center; align-items: center"><span v-if="!isLoading">Masuk</span><span v-else class="loader"></span></button> -->
                        <Button @click="handleLogin" style="margin-right: 10px; width: 100%; height: 50px; color: orange; border: 2px solid orange; display: flex; justify-content: center; font-weight: bold" text raised>
                            <template #default>
                                <span v-if="!isLoading">Masuk</span>
                                <span v-else class="loader"></span>
                            </template>
                        </Button>
                    </div>
                    <div></div>
                    <div class="register-1">
                        <p>Belum punya akun? <a href="#" @click.prevent="handleRegister">Daftar</a></p>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <AppConfig simple />
</template>

<style scoped>
.container-1 {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    height: 100vh;
}
.login-1 {
    background-color: white;
    height: 80%;
    width: 70%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 20px;
}
.left {
    background-image: url('/public/layout/images/background-new.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}
.logo-bekantan {
    display: flex;
    align-items: center;
}

.logo-bekantan a h1 {
    color: orange;
    font-weight: bold;
    font-size: 25px;
}

.logo-bekantan a h1 span {
    color: rgb(112, 194, 227);
}
.right {
    padding: 25px;
}

.pembukus-login {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: orange;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    position: absolute; /* Mengatur posisi absolut */
    left: calc(50% - 12px); /* Pusatkan horizontal */
    top: calc(50% - 12px); /* Pusatkan vertikal */
}

input[type='checkbox'] {
    width: 20px;
    height: 20px;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
}

.register-1 {
    font-size: 15px;
}

@keyframes spin89345 {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.pembungkus-1 {
    display: flex;
    justify-content: space-between;
}
</style>
