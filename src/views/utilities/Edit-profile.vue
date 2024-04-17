<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
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


const validateData = ref('');
const detail_foto = ref(null);
const profileImage = ref('/public/layout/images/foto-belum.png');

const isModalOpenProfile = ref(false);
const isDeleteModalOpen = ref(false);

const openModalFoto = async () => {
    isModalOpenProfile.value = true;
};

const closeModalProfile = () => {
    isModalOpenProfile.value = false;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
};

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
        user_username.value = profileData.user_username;
        user_full_name.value = profileData.user_full_name;
        user_nohp.value = profileData.user_nohp;
        user_address.value = profileData.user_address;

        if (profileData.user_media && profileData.user_media.media_url) {
            profileImage.value = profileData.user_media.media_url;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
};

const ProfileCustomer = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/customer/${uuid.value}`);
        const profileData = response.data.data;
        customer_username.value = profileData.customer_username;
        customer_full_name.value = profileData.customer_full_name;
        customer_nohp.value = profileData.customer_nohp;
        customer_address.value = profileData.customer_address;

        if (profileData.customer_media && profileData.customer_media.media_url) {
            profileImage.value = profileData.customer_media.media_url;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
};

const openModalProfile = async (value) => {
    uuid.value = value;
    console.log('uuid_user:', uuid.value);
    try {
        const response = await axios.get(`${baseURL}/api/${version}/media/${uuid.value}`);
        const mediaDetail = response.data.data;
        openModalFoto(mediaDetail);
        detail_foto.value = response.data.data;
        console.log('UUID USER DI MEDIA', response.data.data);
        console.log('User', detail_foto.value[0]?.media_url);
    } catch (error) {
        console.error('Error media:', error);
    }
};

const onUpload = async () => {
    try {
        Swal.fire('Successfully', 'Sukses Menambahkan Foto', 'success').then(() => {
            window.location.reload();
        });
    } catch (error) {
        console.error('Error saat mengunggah file:', error);
        // Handle error jika diperlukan
        await Swal.fire('Upload Gagal', 'Terjadi kesalahan saat mengunggah file', 'error');
    }
};

const openModalHapus = async (value) => {
    uuid.value = value;
    console.log('uuid_user:', uuid.value);
    try {
        const response = await axios.get(`${baseURL}/api/${version}/media/${uuid.value}`);
        const mediaDetail = response.data.data;
        openModalDelete(mediaDetail);
        detail_foto.value = response.data.data;
        console.log('UUID USER DI MEDIA', response.data.data);
        console.log('media_uuid', detail_foto.value[0]?.media_uuid);
    } catch (error) {
        console.error('Error media:', error);
    }
};

const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/media/${detail_foto.value[0]?.media_uuid}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Username', customer_username.value);
    console.log('Username', user_username.value);
    const profileData = isCustomer.value
        ? {
              customer_username: customer_username.value,
              customer_full_name: customer_full_name.value,
              customer_nohp: customer_nohp.value,
              customer_address: customer_address.value
          }
        : {
              user_username: user_username.value,
              user_full_name: user_full_name.value,
              user_nohp: user_nohp.value,
              user_address: user_address.value
          };

    console.log(`sasa`, isCustomer.value);
    console.log(`Data`, profileData);

    try {
        let response;
        if (isCustomer.value) {
            response = await axios.put(`${baseURL}/api/${version}/customer/${uuid.value}`, profileData);
            console.log(`Customer`, response);
        } else {
            response = await axios.put(`${baseURL}/api/${version}/user/${uuid.value}`, profileData);
            console.log(`User`, response);
        }

        // Update local state with the updated data from the response
        const updatedProfileData = response.data.data;
        if (isCustomer.value) {
            customer_username.value = updatedProfileData.customer_username;
            customer_full_name.value = updatedProfileData.customer_full_name;
            customer_nohp.value = updatedProfileData.customer_nohp;
            customer_address.value = updatedProfileData.customer_address;
        } else {
            user_username.value = updatedProfileData.user_username;
            user_full_name.value = updatedProfileData.user_full_name;
            user_nohp.value = updatedProfileData.user_nohp;
            user_address.value = updatedProfileData.user_address;
        }

        if (response) {
            Swal.fire('Successfully', 'Sukses Update Data', 'success').then(() => {
                window.location.reload();
            });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        validateData.value = error.response.data.message;
        if (error) {
            Swal.fire('Fail', validateData.value, 'error');
            return;
        }
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
                <div v-if="isModalOpenProfile" class="modal">
                    <div class="modal-content">
                        <span class="close" @click="closeModalProfile">&times;</span>
                        <h4>Add Gambar</h4>
                        <div class="modal-form-group">
                            <FileUpload v-if="isCustomer" name="file" :url="`${baseURL}/api/${version}/media/upload_media_customer/${uuid}`" :onUpload="onUpload" :multiple="true" accept="image/*" :maxFileSize="300 * 1024 * 1024"> </FileUpload>
                            <FileUpload v-else name="file" :url="`${baseURL}/api/${version}/media/upload_media_user/${uuid}`" :onUpload="onUpload" :multiple="true" accept="image/*" :maxFileSize="300 * 1024 * 1024"> </FileUpload>
                        </div>
                    </div>
                </div>
                <div v-if="isDeleteModalOpen" class="modal">
                    <div class="modal-content">
                        <!-- Close button -->
                        <span class="close" @click="closeModalDelete">&times;</span>
                        <h4>Hapus Data</h4>
                        <div class="modal-form-group">
                            <button class="modal-button-suceess" @click="DeleteDataData">Hapus data</button>
                        </div>
                        <div class="modal-form-group">
                            <button class="modal-button-danger" @click="closeModalDelete">Batal</button>
                        </div>
                    </div>
                </div>
                <form @submit="handleSubmit" class="konten">
                    <div class="profile-foto" :class="{ 'has-image': profileImage !== '/public/layout/images/foto-belum.png' }">
                        <div class="gallery">
                            <a :href="profileImage" target="_blank">
                                <img :src="profileImage" alt="Foto Profil" class="wrapper-img-old" />
                            </a>
                        </div>
                        <div class="button-input">
                            <Button label="Tambah" style="background-color: green; margin-right: 10px" @click="() => openModalProfile(uuid)" raised />
                            <Button label="Hapus" severity="danger" style="margin-left: 10px" @click="openModalHapus(uuid)" raised />
                        </div>
                    </div>
                    <div class="username">
                        <label for="username">Username</label>
                        <InputText v-if="isCustomer" v-model="customer_username" :value="customer_username" id="username" type="text" class="w-full mb-5" />
                        <InputText v-else v-model="user_username" :value="user_username" id="username" type="text" class="w-full mb-5" />
                    </div>
                    <div class="fullName">
                        <label for="fullname">Nama Lengkap</label>
                        <InputText v-if="isCustomer" v-model="customer_full_name" :value="customer_full_name" id="fullname" type="text" class="w-full mb-5" />
                        <InputText v-else v-model="user_full_name" :value="user_full_name" id="fullname" type="text" class="w-full mb-5" />
                    </div>
                    <div class="nohp">
                        <label for="nohp">Nomor Ponsel</label>
                        <InputText v-if="isCustomer" v-model="customer_nohp" :value="customer_nohp" id="nohp" type="tel" class="w-full mb-5" />
                        <InputText v-else v-model="user_nohp" :value="user_nohp" id="nohp" type="tel" class="w-full mb-5" />
                    </div>
                    <div class="address">
                        <label for="address">Alamat</label>
                        <InputText v-if="isCustomer" v-model="customer_address" :value="customer_address" id="address" type="text" class="w-full mb-5" />
                        <InputText v-else v-model="user_address" :value="user_address" id="address" type="text" class="w-full mb-5" />
                    </div>
                    <div class="save">
                        <!-- <button type="submit">Simpan</button> -->
                        <Button type="submit" label="Simpan" severity="success" style="width: 100%" raised />
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

.profile-foto {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.gallery {
    margin: 20px;
}

.wrapper-img-old {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.wrapper-img-old:hover {
    transform: scale(1.1);
}

.button-input {
    margin: 20px;
    display: flex;
    align-items: center;
}

/* Menyembunyikan border jika gambar sudah ada */
.profile-foto:not(.has-image) .wrapper-img-old {
    border: 2px solid grey;
}
</style>
