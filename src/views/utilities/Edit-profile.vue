<script setup>
import axios from 'axios';
import '../pages/css/edit-profile.css';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const customer_username = ref('');
const customer_full_name = ref('');
const customer_nohp = ref('');
const customer_address = ref('');

const user_username = ref('');
const user_full_name = ref('');
const user_nohp = ref('');
const user_address = ref('');
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const uuid = ref('');
const route = useRoute();
uuid.value = route.params.uuid;

const isCustomer = ref(false);

onMounted(async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/me`);
        const userRole = response.data.level;

        if (userRole === 'administrator') {
            await ProfileUser();
        } else {
            await ProfileCustomer();
            isCustomer.value = true;
        }
    } catch (error) {
        console.error('Error checking user role:', error);
    }
});

const ProfileUser = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/user/${uuid.value}`);
        const profileData = response.data.data;
        // Set variabel profil admin di sini
        user_username.value = profileData.user_username;
        user_full_name.value = profileData.user_full_name;
        user_nohp.value = profileData.user_nohp;
        user_address.value = profileData.user_address;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
};

const ProfileCustomer = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/customer/${uuid.value}`);
        const profileData = response.data.data;
        // Set variabel profil pelanggan di sini
        customer_username.value = profileData.customer_username;
        customer_full_name.value = profileData.customer_full_name;
        customer_nohp.value = profileData.customer_nohp;
        customer_address.value = profileData.customer_address;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get(`${baseURL}/api/${version}/me`);
        const userRole = response.data.level;

        const username = user_username.value;
        const nama_langkap = user_full_name.value;
        const nohp = user_nohp.value;
        const address = user_address.value;
        if (userRole === 'administrator') {
            const response = await axios.put(`${baseURL}/api/${version}/user/${uuid.value}`, {
                user_username: username,
                user_full_name: nama_langkap,
                user_nohp: nohp,
                user_address: address
            });
            if (response) {
                console.log('Data admin berhasil diperbarui');
                uuid.value = '';
            }
            console.log('Sasa', response)
        } else {
            console.log('Ini adalah Customer');
        }
    } catch (error) {
        console.log('Terjadi kesalahan saat menyimpan data:', error);
    }
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card docs">
                <div class="judul-profile">
                    <h1>Profile</h1>
                    <hr />
                </div>
                <form @submit="handleSubmit" class="konten">
                    <div class="username">
                        <label for="username">Username</label>
                        <InputText :value="isCustomer ? customer_username : user_username" id="username" type="text" class="w-full mb-5" :modelValue="isCustomer ? customer_username : user_username" />
                    </div>
                    <div class="fullName">
                        <label for="fullname">Nama Lengkap</label>
                        <InputText :value="isCustomer ? customer_full_name : user_full_name" id="fullname" type="text" class="w-full mb-5" :modelValue="isCustomer ? customer_full_name : user_full_name" />
                    </div>
                    <div class="nohp">
                        <label for="nohp">Nomor Ponsel</label>
                        <InputText :value="isCustomer ? customer_nohp : user_nohp" id="nohp" type="tel" class="w-full mb-5" :modelValue="isCustomer ? customer_nohp : user_nohp" />
                    </div>
                    <div class="address">
                        <label for="address">Alamat</label>
                        <InputText :value="isCustomer ? customer_address : user_address" id="address" type="text" class="w-full mb-5" :modelValue="isCustomer ? customer_address : user_address" />
                    </div>
                    <div class="save">
                        <button type="submit">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
