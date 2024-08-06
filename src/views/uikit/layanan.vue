<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '/public/layout/css/style.css';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();
const validateData = ref('');

const tableData = ref([]);

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

const uuid_service = ref('');
const DataBusines = ref([]);
const businesOptions = ref([]);
const service_name = ref('');
const service_quota = ref('');
const service_business = ref(null);

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

let jumlah_row = 5;

const updateOptions = () => {
    businesOptions.value = [{ label: 'Pilih Bisnis', value: null }, ...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];
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

        if (selectedOrder.value !== 'default') {
            params.append(`order[${'service_id'}]`, selectedOrder.value);
        }

        if (selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        const response = await axios.get(`${baseURL}/api/${version}/layanan/get_all`, {
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
        if (user_uuid.value !== '') {
            params.append(`service_business`, user_uuid.value);
        }

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'service_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/layanan/get_all_customer`, {
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
    try {
        const name = service_name.value;
        const kuota = service_quota.value;
        const business = service_business.value;

        const response = await axios.post(`${baseURL}/api/${version}/layanan`, {
            service_name: name,
            service_quota: kuota,
            service_business: business
        });

        if (response) {
            closeModal();
            Swal.fire('Successfully', 'Sukses Menambahkan Data', 'success').then(() => {
                window.location.reload();
            });
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

const OpenModalEdit = async (value) => {
    uuid_service.value = value;
    console.log('uuid', uuid_service.value);
    try {
        const response = await axios.get(`${baseURL}/api/${version}/layanan/${uuid_service.value}`);
        if (response) {
            service_name.value = response.data.data.service_name;
            service_quota.value = response.data.data.service_quota;
            service_business.value = response.data.data.service_business.business_uuid;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};

const UpdateDataData = async () => {
    try {
        const name = service_name.value;
        const kuota = service_quota.value;
        const business = service_business.value;
        const response = await axios.put(`${baseURL}/api/${version}/layanan/${uuid_service.value}`, {
            service_name: name,
            service_quota: kuota,
            service_business: business
        });

        console.log('DATA:', response);

        if (response) {
            closeModalUpdate();
            Swal.fire('Successfully', 'Sukses Mengupdate Data', 'success').then(() => {
                window.location.reload();
            });
            uuid_service.value = '';
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
    uuid_service.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/layanan/${uuid_service.value}`);
        if (response) {
            service_name.value = response.data.data.service_name;
            service_business.value = response.data.data.service_business.business_uuid;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};

const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/layanan/${uuid_service.value}`);

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
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
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
            <h1>Data Layanan</h1>
        </div>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="service_name" placeholder="Layanan" class="modal-input"></InputText>
                    <InputText v-model="service_quota" placeholder="Kuota" class="modal-input"></InputText>
                    <Dropdown v-model="service_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
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
                    <InputText v-model="service_name" placeholder="Layanan" class="modal-input"></InputText>
                    <InputText v-model="service_quota" placeholder="Kuota" class="modal-input"></InputText>
                    <Dropdown v-model="service_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
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
                        Apakah Anda yakin untuk menghapus scope bisnis <span class="bold-text"> "{{ service_name }}"</span>
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
                            <h5>Data Table Jadwal</h5>
                            <div class="search-container-scope">
                                <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <InputText v-if="user_level === 'customer'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer"></InputText>
                                <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                                <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope" @click="fetchDataCustomer"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="service_name" header="Nama Layanan" class="name-column"></Column>
                            <Column field="service_business.business_name" header="Bisnis" class="name-column"></Column>
                            <Column field="service_quota" header="kuota" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons-scope">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.service_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.service_uuid)"></Button>
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
