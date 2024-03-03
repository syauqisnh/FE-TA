<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-gallery.css';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();
const validateData = ref('');

const inputSearch = ref('');
const tableData = ref([]);

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');
const businesOptions = ref([]);
const multiselectOptionsBusiness = ref([]);

const uuid_gallery = ref('');
const gallery_name = ref('');
const gallery_desc = ref('');
const gallery_business = ref(null);
const DataBusines = ref([]);

const selectedOrder = ref('default');
const selectedLimit = ref('default');

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

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

            if (response) {
                user_username.value = response.data.name;
                user_level.value = response.data.level;
                user_uuid.value = response.data.uuid;

                if (user_level.value == 'customer') {
                    await fetchDataCustomer();
                    await fetchDataOptionCustomer();
                } else {
                    await fetchData();
                    await fetchDataOption();
                }
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

const fetchDataOptionCustomer = async () => {
    try {
        const params = new URLSearchParams();
        if (user_uuid.value !== '') {
            params.append('business_customer', user_uuid.value);
        }

        const getBusiness = await axios.get(`${baseURL}/api/${version}/business/get_all_customer`, {
            params: params
        });

        DataBusines.value = getBusiness.data.data;
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

const fetchDataCustomer = async () => {
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
        const response = await axios.get(`${baseURL}/api/${version}/galleries/get_all_customer`, {
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

const OpenModalEdit = async (value) => {
    uuid_gallery.value = value;
    const response = await axios.get(`${baseURL}/api/${version}/galleries/${uuid_gallery.value}`);
    if (response) {
        gallery_name.value = response.data.data.gallery_name;
        gallery_desc.value = response.data.data.gallery_desc;
        gallery_business.value = response.data.data.gallery_business;
        openModalUpdate();
    }
};
const UpdateDataData = async () => {
    try {
        const name = gallery_name.value;
        const desc = gallery_name.value;
        const business = gallery_business.value;
        const response = await axios.put(`${baseURL}/api/${version}/galleries/${uuid_gallery.value}`, {
            gallery_name: name,
            gallery_desc: desc,
            gallery_business: business
        });

        if (response) {
            closeModalUpdate();
            Swal.fire('Successfully', 'Sukses Mengupdate Data', 'success').then(() => {
                window.location.reload();
            });
            uuid_gallery.value = '';
        }
    } catch (error) {
        console.error(error);
        validateData.value = error.response.data.message;
        if (error) {
            Swal.fire('Fail', validateData.value, 'error');
            return;
        }
    }
};

const openModalHapus = async (value) => {
    uuid_gallery.value = value;
    const response = await axios.get(`${baseURL}/api/${version}/galleries/${uuid_gallery.value}`);
    if (response) {
        gallery_name.value = response.data.data.gallery_name;
        gallery_desc.value = response.data.data.gallery_desc;
        gallery_business.value = response.data.data.gallery_business;
        openModalDelete();
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/galleries/${uuid_gallery.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
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

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    gallery_name.value = null;
    gallery_desc.value = null;
    gallery_business.value = null;
};
const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
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
    <div v-if="isUpdateModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalUpdate">&times;</span>
            <h4>Ubah Data</h4>
            <p v-if="validateData" style="color: red; margin: 0">{{ validateData }}</p>
            <div class="modal-form-group">
                <InputText v-model="gallery_name" :value="gallery_name" class="modal-input"></InputText>
                <InputText v-model="gallery_desc" :value="gallery_desc" class="modal-input"></InputText>
                <Dropdown v-model="gallery_business" :value="gallery_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
            </div>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="UpdateDataData">Ubah data</button>
            </div>
        </div>
    </div>
    <div v-if="isDeleteModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalDelete">&times;</span>
            <h4>Hapus Data</h4>
            <div class="modal-form-group">
                <p>
                    Apakah Anda yakin untuk menghapus nama album <span class="bold-text"> "{{ gallery_name }}"</span>
                </p>
            </div>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="DeleteDataData">Hapus data</button>
            </div>
            <div class="modal-form-group">
                <button class="modal-button-danger" @click="closeModalDelete">Batal</button>
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
                            <Dropdown v-if="user_level === 'administrator' || user_level === 'super administrator'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            <Dropdown v-if="user_level === 'customer'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchDataCustomer"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-price">
                        <h5>Data Table Harga</h5>
                        <div class="search-container-price">
                            <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <InputText v-if="user_level === 'customer'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer"></InputText>
                            <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                            <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope" @click="fetchDataCustomer"></Button>
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
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.gallery_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.gallery_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
