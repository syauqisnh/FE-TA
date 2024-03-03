<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import '../uikit/css/data-gallery.css';
('vue');
import axios from 'axios';
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const galleryUuid = ref('');
const tableData = ref([]);

const uuid_media = ref('');
const media_uuid_table = ref('');
const media_table = ref('');
const media_name = ref('');
const media_hash_name = ref('');
const media_category = ref('');
const media_extensi = ref('');
const media_size = ref('');
const media_url = ref('');
const media_metadata = ref('');

const isDeleteModalOpen = ref(false);

onMounted(async () => {
    fetchData();
});

const fetchData = async () => {
    try {
        const $route = useRoute();
        if ($route.params && $route.params.gallery_uuid) {
            galleryUuid.value = $route.params.gallery_uuid;
        } else {
            console.error('Parameter gallery_uuid tidak ditemukan pada URL.');
        }

        const getData = await axios.get(`${baseURL}/api/${version}/media/${galleryUuid.value}`);
        tableData.value = getData.data.data || [];
        console.log(getData.data.data);
        console.log(tableData.value);
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const openModalHapus = async (value) => {
    uuid_media.value = value;
    console.log('UUID', uuid_media.value);
    const response = await axios.get(`${baseURL}/api/${version}/medias/${uuid_media.value}`);
    if (response) {
        media_uuid_table.value = response.data.data.media_uuid_table;
        media_name.value = response.data.data.media_name;
        media_table.value = response.data.data.media_table;
        media_hash_name.value = response.data.data.media_hash_name;
        media_category.value = response.data.data.media_category;
        media_extensi.value = response.data.data.media_extensi;
        media_size.value = response.data.data.media_size;
        media_url.value = response.data.data[0].media_url;
        media_metadata.value = response.data.data.media_metadata;
        openModalDelete();
    }
};

const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/media/${uuid_media.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
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

const isModalOpen = ref(false);
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
};

const isImage = (url) => {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
};
</script>

<template>
    <div>
        <h1>Foto Album</h1>
        <button class="create-data-price" @click="openModal">Add Gambar</button>

        <div class="container">
            <div class="gallery">
                <div v-for="(item, index) in tableData" :key="index" class="gallery-item">
                    <div v-if="isImage(item.media_url)">
                        <img :src="item.media_url" alt="Media" @click="() => openModalHapus(item.media_uuid)" class="gallery-image" />
                    </div>
                    <div v-else>
                        <video controls :src="item.media_url" @click="() => openModalHapus(item.media_uuid)" class="gallery-video"></video>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h4>Add Gambar</h4>
                <div class="modal-form-group">
                    <FileUpload name="file" :url="`${baseURL}/api/${version}/media/upload_media_any/${galleryUuid}`" :onUpload="onUpload" :multiple="true" accept="image/*, video/*" :maxFileSize="300 * 1024 * 1024"> </FileUpload>
                </div>
            </div>
        </div>
        <div v-if="isDeleteModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModalDelete">&times;</span>
                <h4>Hapus Data</h4>
                <div class="modal-form-group">
                    <img :src="media_url" alt="Media" style="height: 300px" />
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="DeleteDataData">Hapus data</button>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-danger" @click="closeModalDelete">Batal</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    margin: 20px 0px 10px 0px;
    padding: 30px;
    background-color: white;
    border-radius: 20px;
}
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-auto-rows: 200px; /* Atur tinggi kotak gambar di sini */
    grid-gap: 10px;
}

.gallery-item {
    position: relative;
    overflow: hidden;
}

.gallery-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Menyesuaikan gambar agar sesuai proporsi tanpa memotong */
    transition: transform 0.2s ease;
}

.gallery-image:hover {
    transform: scale(1.05);
}
</style>
