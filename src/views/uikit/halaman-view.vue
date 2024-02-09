<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import '../uikit/css/data-gallery.css'; 'vue';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const galleryUuid = ref(null);
const tableData = ref([]);

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

        const getData = await axios.get(`${baseURL}/api/${version}/media/get_By_uuid_table/${galleryUuid.value}`);
        tableData.value = getData.data.data || [];
        console.log(getData.data.data)
        console.log(tableData.value);
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const isModalOpen = ref(false);
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<template>
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Add Gambar</h4>
            <div class="modal-form-group">
                <FileUpload
                    name="file"
                    :url="`${baseURL}/api/${version}/media/upload_media_any/${galleryUuid}`"
                    :onUpload="onUpload"
                    :multiple="true"
                    accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, image/*, video/*, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :maxFileSize="300 * 1024 * 1024"
                >
                </FileUpload>
            </div>
        </div>
    </div>
    <h1>Foto Album</h1>
    <button class="create-data-price" @click="openModal">Add Gambar</button>
    <div class="py-5">
        <DataTable :value="tableData" :paginator="true" :rows="5" class="tabel">
            <Column header="File" class="name-column">
                <template #body="slotProps">
                    <img :src="slotProps.data.media_url" alt="Media" :width="100" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
