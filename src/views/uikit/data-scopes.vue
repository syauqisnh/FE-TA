<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-scopes.css';
import { useRouter } from 'vue-router';
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

const uuid_scope = ref('');
const DataBusines = ref([]);
const businesOptions = ref([]);
const multiselectOptionsBusiness = ref([]);
const scope_name = ref('');
const scope_desc = ref('');
const scope_business = ref(null);

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const scope_uuid = ref(null);

let jumlah_row = 5;

const updateOptions = () => {
    businesOptions.value = [{ label: 'Pilih Busines', value: null }, ...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];

    multiselectOptionsBusiness.value = [...DataBusines.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
};

onMounted(async () => {
    await DataMe();
});

const Ubahnilai_jumlah_row = async () => {
    if (selectedLimit.value === 'default') {
        jumlah_row = 5;
    } else {
        jumlah_row = parseInt(selectedLimit.value, 10);
    }
};

const DataMe = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/me`);

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
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/landing-page'); // Pengguna belum login, arahkan ke landing page
        } else {
            console.error('Error: ', error); // Kesalahan lain
        }
    }
};

const fetchData = async () => {
    try {
        const params = new URLSearchParams();

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'scope_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/scope/get_all`, {
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
        if (user_uuid.value !== '') {
            params.append(`scope_business`, user_uuid.value);
        }

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'scope_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/scope/get_all_customer`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response.data.success) {
            tableData.value = response.data.data || [];
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
            params.append(`business_customer`, user_uuid.value);
        }
        const getBusines = await axios.get(`${baseURL}/api/${version}/business/get_all_customer`, {
            params: params
        });
        DataBusines.value = getBusines.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const addDataData = async () => {
    const name = scope_name.value;
    const desc = scope_desc.value;
    const business = scope_business.value;

    const response = await axios.post(`${baseURL}/api/${version}/scope`, {
        scope_name: name,
        scope_desc: desc,
        scope_business: business
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_scope.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/scope/${uuid_scope.value}`);
        if (response) {
            scope_name.value = response.data.data.scope_name;
            scope_desc.value = response.data.data.scope_desc;
            scope_business.value = response.data.data.scope_business.business_uuid;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};

const UpdateDataData = async () => {
    const name = scope_name.value;
    const desc = scope_desc.value;
    const business = scope_business.value;
    const response = await axios.put(`${baseURL}/api/${version}/scope/${uuid_scope.value}`, {
        scope_name: name,
        scope_desc: desc,
        scope_business: business
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_scope.value = '';
    }
};

const openModalHapus = async (value) => {
    uuid_scope.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/scope/${uuid_scope.value}`);
        if (response) {
            scope_name.value = response.data.data.scope_name;
            scope_desc.value = response.data.data.scope_desc;
            scope_business.value = response.data.data.scope_business;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/scope/${uuid_scope.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;

    scope_name.value = null;
    scope_desc.value = null;
    scope_business.value = null;
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;

    scope_name.value = null;
    scope_desc.value = null;
    scope_business.value = null;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;

    scope_name.value = null;
    scope_desc.value = null;
    scope_business.value = null;
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
    <div>
        <div class="judul-halaman-scope">
            <h1>Ruang Lingkup</h1>
        </div>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="scope_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                    <InputText v-model="scope_desc" placeholder="Tambahkan Desc" class="modal-input"></InputText>
                    <Dropdown v-model="scope_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="addDataData">Submit</button>
                </div>
            </div>
        </div>

        <!-- modal update -->
        <div v-if="isUpdateModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModalUpdate">&times;</span>
                <h4>Ubah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="scope_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                    <InputText v-model="scope_desc" placeholder="Tambahkan Desc" class="modal-input"></InputText>
                    <Dropdown v-model="scope_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="UpdateDataData">Ubah data</button>
                </div>
            </div>
        </div>

        <!-- modal delete -->
        <div v-if="isDeleteModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModalDelete">&times;</span>
                <h4>Hapus Data</h4>
                <div class="modal-form-group">
                    <p>
                        Apakah Anda yakin untuk menghapus scope bisnis <span class="bold-text"> "{{ scope_business.business_name }}"</span>
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
                        <div class="top-tabel-scope">
                            <button class="create-data-scope" @click="openModal">Tambah Data</button>

                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>

                            <span class="p-float-label">
                                <Dropdown v-if="user_level === 'administrator' || user_level === 'super administrator'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData">
                                </Dropdown>
                                <Dropdown v-if="user_level === 'customer'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchDataCustomer"> </Dropdown>
                            </span>
                        </div>
                        <div class="data-table-scope">
                            <h5>Data Table scope</h5>
                            <div class="search-container-scope">
                                <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <InputText v-if="user_level === 'customer'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer"></InputText>
                                <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                                <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope" @click="fetchDataCustomer"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="scope_name" header="Name" class="name-column"></Column>
                            <Column field="scope_desc" header="Desc" class="name-column"></Column>
                            <Column field="scope_business.business_name" header="Bisnis" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons-scope">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.scope_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.scope_uuid)"></Button>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
