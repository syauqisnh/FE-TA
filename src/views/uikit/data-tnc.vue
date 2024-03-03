<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import '../uikit/css/data-tnc.css';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();

const tableData = ref([]);

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');
const uuid_tnc = ref('');

const tnc_uuid_table = ref(null);
const tnc_name = ref('');
const DataPrice = ref([]);
const DataBusines = ref([]);
const priceOptions = ref([]);
const multiselectOptionsPrice = ref([]);
const multiselectOptionsBusiness = ref([]);

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;

    tnc_uuid_table.value = null;
    tnc_name.value = null;
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;

    tnc_uuid_table.value = null;
    tnc_name.value = null;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;

    tnc_uuid_table.value = null;
    tnc_name.value = null;
};

onMounted(async () => {
    await DataMe();
});
const fetchData = async () => {
    try {
        const params = new URLSearchParams();

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'tnc_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/tnc/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response) {
            tableData.value = response.data.data || [];

            console.log(tableData.value);
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
            params.append(`order[${'tnc_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/tnc/get_all_customer`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response) {
            tableData.value = response.data.data || [];

            console.log(tableData.value);
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

const fetchDataOptionCustomer = async () => {
    try {
        const params = new URLSearchParams();
        if (user_uuid.value !== '') {
            params.append('business_customer', user_uuid.value);
        }

        const getPrice = await axios.get(`${baseURL}/api/${version}/price_list/get_all_customer`);

        const filteredData = getPrice.data.data.filter((price) => price.price_list_status !== 'N');

        DataPrice.value = filteredData;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};
const updateOptions = () => {
    priceOptions.value = [{ label: 'Pilih Harga', value: null }, ...DataPrice.value.map((index) => ({ label: index.price_list_name, value: index.price_list_uuid }))];

    multiselectOptionsPrice.value = [...DataPrice.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
    multiselectOptionsBusiness.value = [...DataBusines.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
};

const fetchDataOption = async () => {
    try {
        const getPrice = await axios.get(`${baseURL}/api/${version}/price_list/get_all`);

        // Filter data berdasarkan status 'N'
        const filteredData = getPrice.data.data.filter((price) => price.price_list_status !== 'N');

        DataPrice.value = filteredData;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

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

const addDataData = async () => {
    const nameHarga = tnc_uuid_table.value;
    const name = tnc_name.value;

    const response = await axios.post(`${baseURL}/api/${version}/tnc`, {
        tnc_uuid_table: nameHarga,
        tnc_name: name
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_tnc.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/tnc/${uuid_tnc.value}`);
        if (response) {
            tnc_uuid_table.value = response.data.data.tnc_uuid_table;
            tnc_name.value = response.data.data.tnc_name;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};
const UpdateDataData = async () => {
    const tabel = tnc_uuid_table.value;
    const name = tnc_name.value;
    const response = await axios.put(`${baseURL}/api/${version}/tnc/${uuid_tnc.value}`, {
        tnc_uuid_table: tabel,
        tnc_name: name
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_tnc.value = '';
    }
};

const openModalHapus = async (value) => {
    uuid_tnc.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/tnc/${uuid_tnc.value}`);
        if (response) {
            tnc_uuid_table.value = response.data.data.tnc_uuid_table;
            tnc_name.value = response.data.data.tnc_name;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/tnc/${uuid_tnc.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};

const limit = ref([
    { value: 'default', label: 'Limit Data' },
    { value: 5, label: '5 Data perhalaman' },
    { value: 10, label: '10 Data perhalaman' },
    { value: 25, label: '25 Data perhalaman' },
    { value: 50, label: '50 Data perhalaman' },
    { value: 100, label: '100 Data perhalaman' }
]);

const order = ref([
    { value: 'default', label: 'Urutkan data' },
    { value: 'asc', label: 'Urutkan dari data awal ditambahkan' },
    { value: 'desc', label: 'Urutkan dari data terbaru' }
]);
</script>

<template>
    <div class="judul-halaman-tnc">
        <h1>Third National Communication</h1>
    </div>
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <Dropdown v-model="tnc_uuid_table" :options="priceOptions" optionLabel="label" optionValue="value" placeholder="Pilih Harga" class="modal-input"></Dropdown>
                <InputText v-model="tnc_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
            </div>
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
            <div class="modal-form-group">
                <Dropdown v-model="tnc_uuid_table" :options="priceOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                <InputText v-model="tnc_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
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
                    Apakah Anda yakin untuk menghapus tnc anda <span class="bold-text"> "{{ tnc_name }}"</span>
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
                    <div class="top-tabel-tnc">
                        <button class="create-data-tnc" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown v-if="user_level === 'administrator' || user_level === 'super administrator'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            <Dropdown v-if="user_level === 'customer'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchDataCustomer"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-tnc">
                        <h5>Data Table TNC</h5>
                        <div class="search-container-tnc">
                            <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <InputText v-if="user_level === 'customer'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer"></InputText>
                            <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                            <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope" @click="fetchDataCustomer"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="5" class="tabel">
                        <Column field="tnc_uuid_table.price_list_name" header="Nama Harga" class="name-column"></Column>
                        <Column field="tnc_name" header="Name" class="name-column"></Column>
                        <Column field="tnc_business.business_name" header="Bisnis" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-tnc">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.tnc_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.tnc_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
