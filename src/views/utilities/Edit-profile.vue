<script setup>
import '../pages/css/edit-profile.css';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userDetail = ref(null);

const getUserDetail = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/me');
        const userData = response.data;
        // Simpan data pengguna untuk ditampilkan di formulir
        console.log(userData)
        userDetail.value = userData;
    } catch (error) {
        console.error('Error fetching user detail:', error);
    }
};

onMounted(() => {
    // Panggil metode untuk mendapatkan detail pengguna saat komponen dimuat
    getUserDetail();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card docs">
                <div class="judul-profile">
                    <h1>Profile</h1>
                    <hr>
                </div>
                <div class="konten">
                    <div class="profile-picture">
                        <label for="file-upload" class="custom-file-upload">
                            <img v-if="uploadedImage" :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" />
                            <i class="pi pi-plus"></i> Upload Foto
                        </label>
                        <input id="file-upload" type="file" accept="image/*" @change="onFileUpload" />
                    </div>
                    <div class="username">
                        <label for="username">Username</label>
                        <InputText id="username" type="text" class="w-full mb-5" v-model="username" />
                    </div>
                    <div class="fullName">
                        <label for="fullname">Nama Lengkap</label>
                        <InputText id="fullname" type="text" class="w-full mb-5" v-model="fullname" />
                    </div>
                    <div class="nohp">
                        <label for="nohp">Nomor Ponsel</label>
                        <InputText id="nohp" type="tel" class="w-full mb-5" v-model="nohp" />
                    </div>
                    <div class="address">
                        <label for="address">Alamat</label>
                        <InputText id="address" type="text" class="w-full mb-5" v-model="address" />
                    </div>
                    <div class="email">
                        <label for="email">Email</label>
                        <InputText id="email" type="text" class="w-full mb-5" v-model="email" />
                    </div>
                    <div class="password">
                        <label for="password">Password</label>
                        <InputText id="password" type="password" class="w-full mb-5" v-model="password" />
                    </div>
                    <div class="save">
                        <button>Simpan</button>
                    </div>
                </div>
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
