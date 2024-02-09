<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-gallery.css';
import { useRouter } from 'vue-router';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();

const inputSearch = ref('');
const tableData = ref([]);

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');
const businesOptions = ref([]);
const multiselectOptionsBusiness = ref([]);

const gallery_name = ref('');
const gallery_desc = ref('');
const gallery_business = ref(null);
const DataBusines = ref([]);

const selectedOrder = ref('default');
const selectedLimit = ref('default');

const isModalOpen = ref(false);

const updateOptions = () => {
    businesOptions.value = [{ label: 'Pilih Busines', value: null }, ...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];

    multiselectOptionsBusiness.value = [...DataBusines.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
};

onMounted(async () => {
    await DataMe();
});

const order = ref([
    { value: 'default', label: 'Urutkan data' },
    { value: 'asc', label: 'Urutkan dari data awal ditambahkan' },
    { value: 'desc', label: 'Urutkan dari data terbaru' }
]);

const limit = ref([
    { value: 'default', label: 'Limit Data' },
    { value: 5, label: '5 Data perhalaman' },
    { value: 10, label: '10 Data perhalaman' },
    { value: 25, label: '25 Data perhalaman' },
    { value: 50, label: '50 Data perhalaman' },
    { value: 100, label: '100 Data perhalaman' }
]);

const DataMe = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/me`);

        if (response) {
            user_username.value = response.data.name;
            user_level.value = response.data.level;
            user_uuid.value = response.data.uuid;

            if (user_level.value == 'customer' || user_level.value == 'administrator') {
                await fetchData();
                await fetchDataOption();
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/landing-page'); // Pengguna belum login, arahkan ke landing page
        } else {
            console.error('Error: ', error); // Kesalahan lain
        }
    }
};

const fetchDataOption = async () => {
    try {
        const getBusines = await axios.get(`${baseURL}/api/${version}/business/get_all`);
        DataBusines.value = getBusines.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const fetchData = async () => {
    try {
        const params = new URLSearchParams();

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'gallery_id'}]`, selectedOrder.value);
        }

        // Tambahkan parameter 'limit' jika bukan default
        if (selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        // Tambahkan parameter 'keyword' jika ada input
        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        // Buat request ke backend
        const response = await axios.get(`${baseURL}/api/${version}/galleries/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response) {
            tableData.value = response.data.data || [];

            console.log(tableData.value);

            tableData.value.forEach((item) => {
                if (!item.business_nohp) {
                    item.business_nohp = 'BELUM DI ISI';
                }
                if (!item.business_address) {
                    item.business_address = 'BELUM DI ISI';
                }
            });
        } else {
            console.error('Respon sukses tetapi tidak ada data:', response.data.message);
            tableData.value = [];
        }
    } catch (error) {
        console.error('Error mengambil data:', error);
        if (error.response) {
            console.error('Error response dari backend:', error.response.data);
        }
    }
};

const addDataData = async () => {
    const name = gallery_name.value;
    const desc = gallery_desc.value;
    const business = gallery_business.value;

    const response = await axios.post(`${baseURL}/api/${version}/galleries`, {
        gallery_name: name,
        gallery_desc: desc,
        gallery_business: business
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;

    gallery_name.value = null;
    gallery_desc.value = null;
    gallery_business.value = null;
};
</script>

<template>
    <div class="judul-halaman-price">
        <h1>Gambar</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Buat Album</h4>
            <div class="modal-form-group">
                <InputText v-model="gallery_name" placeholder="Tambahkan Judul" class="modal-input"></InputText>
                <InputText v-model="gallery_desc" placeholder="Tambahkan Desc" class="modal-input"></InputText>
                <Dropdown v-model="gallery_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
            </div>
            <p v-if="validasi_price_media" class="validation-error text-red">{{ validasi_price_media }}</p>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="addDataData">Submit</button>
            </div>
        </div>
    </div>

    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <div class="container">
                    <div class="top-tabel-price">
                        <button class="create-data-price" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-price">
                        <h5>Data Table Harga</h5>
                        <div class="search-container-price">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-price" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="5" class="tabel">
                        <Column field="gallery_name" header="Judul" class="name-column"></Column>
                        <!-- <Column field="gallery_uuid" header="Judul" class="name-column"></Column> -->
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons">
                                    <router-link :to="{ name: 'halaman-view', params: { gallery_uuid: rowData.data.gallery_uuid } }">
                                        <button class="button-view">View</button>
                                    </router-link>
                                    <!-- <router-link to="/uikit/halaman-view">
                                        <button class="button-view">View</button>
                                    </router-link> -->
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.level_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.level_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
