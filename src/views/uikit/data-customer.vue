<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '/public/layout/css/style-2.css';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;
const Hakaksestolak = ref('');
const Hakakses = ref('');

const uuid_customer = ref();
const customer_username = ref('');
const customer_full_name = ref('');
const customer_nohp = ref('');
const customer_address = ref('');
const customer_email = ref('');
const customer_password = ref('');
const checked = ref(false);

const tableData = ref([]);
const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

let jumlah_row = 5;

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    customer_username.value = '';
    customer_full_name.value = '';
    customer_nohp.value = '';
    customer_address.value = '';
    customer_email.value = '';
    customer_password.value = '';
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    customer_username.value = '';
    customer_full_name.value = '';
    customer_nohp.value = '';
    customer_address.value = '';
    customer_email.value = '';
    customer_password.value = '';
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    uuid_customer.value = '';
    customer_username.value = '';
    customer_full_name.value = '';
    customer_nohp.value = '';
    customer_address.value = '';
    customer_email.value = '';
    customer_password.value = '';
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

onMounted(async () => {
    await fetchData();
});

const Ubahnilai_jumlah_row = async () => {
    if (selectedLimit.value === 'default') {
        jumlah_row = 5;
    } else {
        jumlah_row = parseInt(selectedLimit.value, 10);
    }
};

const fetchData = async () => {
    try {
        const params = new URLSearchParams();

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'customer_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/customer/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response.data.success) {
            tableData.value = response.data.data || [];
            Hakakses.value = response.data.message;

            tableData.value.forEach((item) => {
                if (!item.customer_nohp) {
                    item.customer_nohp = 'BELUM DI ISI';
                }
                if (!item.customer_address) {
                    item.customer_address = 'BELUM DI ISI';
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
            Hakaksestolak.value = error.response.data.msg;
        }
    }
};

const addDataData = async () => {
    const username = customer_username.value;
    const nama_langkap = customer_full_name.value;
    const nohp = customer_nohp.value;
    const address = customer_address.value;
    const email = customer_email.value;
    const password = customer_password.value;
    const response = await axios.post(`${baseURL}/api/${version}/customer`, {
        customer_username: username,
        customer_full_name: nama_langkap,
        customer_nohp: nohp,
        customer_address: address,
        customer_email: email,
        customer_password: password
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_customer.value = value;
    // console.log(value)
    try {
        const response = await axios.get(`${baseURL}/api/${version}/customer/${uuid_customer.value}`);
        if (response) {
            customer_username.value = response.data.data.customer_username;
            customer_full_name.value = response.data.data.customer_full_name;
            customer_nohp.value = response.data.data.customer_nohp;
            customer_address.value = response.data.data.customer_address;
            customer_email.value = response.data.data.customer_email;
            customer_password.value = response.data.data.customer_password;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};
const UpdateDataData = async () => {
    const username = customer_username.value;
    const nama_langkap = customer_full_name.value;
    const nohp = customer_nohp.value;
    const address = customer_address.value;
    // const email = customer_email.value;
    // const password = customer_password.value;
    const response = await axios.put(`${baseURL}/api/${version}/customer/${uuid_customer.value}`, {
        customer_username: username,
        customer_full_name: nama_langkap,
        customer_nohp: nohp,
        customer_address: address
        // customer_email: email,
        // customer_password: password
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_customer.value = '';
    }
};
const openModalHapus = async (value) => {
    uuid_customer.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/customer/${uuid_customer.value}`);
        if (response) {
            customer_username.value = response.data.data.customer_username;
            customer_full_name.value = response.data.data.customer_full_name;
            customer_nohp.value = response.data.data.customer_nohp;
            customer_address.value = response.data.data.customer_address;
            customer_email.value = response.data.data.customer_email;
            customer_password.value = response.data.data.customer_password;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/customer/${uuid_customer.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};
</script>

<template>
    <div v-if="Hakaksestolak">
        <p>{{ Hakaksestolak }}</p>
    </div>

    <div v-if="Hakakses">
        <div class="judul-halaman-customer">
            <h1>Data Customer</h1>
        </div>
        <!-- modal add -->
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="customer_username" placeholder="Username" class="modal-input"></InputText>
                    <InputText v-model="customer_full_name" placeholder="Nama Lengkap" class="modal-input"></InputText>
                    <InputText v-model="customer_nohp" placeholder="Nomor Telepon (OPSIONAL)" class="modal-input"></InputText>
                    <InputText v-model="customer_address" placeholder="Alamat (OPSIONAL)" class="modal-input"></InputText>
                    <InputText v-model="customer_email" placeholder="Email" class="modal-input"></InputText>
                    <InputText id="password" :type="checked ? 'text' : 'password'" placeholder="Password" class="modal-input" v-model="customer_password" />
                    <div class="cekpw-1">
                        <input type="checkbox" name="cekpw" id="cekpw" v-model="checked" />
                        <label for="cekpw">Lihat password</label>
                    </div>
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
                    <InputText v-model="customer_username" :value="customer_username" class="modal-input"></InputText>
                    <InputText v-model="customer_full_name" :value="customer_full_name" class="modal-input"></InputText>
                    <InputText v-model="customer_nohp" :value="customer_nohp" class="modal-input"></InputText>
                    <InputText v-model="customer_address" :value="customer_address" class="modal-input"></InputText>
                    <!-- <InputText v-model="customer_email" :value="customer_email" class="modal-input"></InputText> -->
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
                        Apakah Anda yakin untuk menghapus nama Customer <span class="bold-text"> "{{ customer_username }}"</span>
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
                        <div class="top-tabel-customer">
                            <button class="create-data-customer" @click="openModal">Tambah Data</button>

                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>

                            <span class="p-float-label">
                                <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            </span>
                        </div>
                        <div class="data-table-customer">
                            <h5>Data Table Customer</h5>
                            <div class="search-container-customer">
                                <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <Button icon="pi pi-search" class="search-button-customer" @click="fetchData"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="customer_username" header="Username" class="name-column"></Column>
                            <Column field="customer_full_name" header="Nama Lengkap" class="name-column"></Column>
                            <Column field="customer_nohp" header="Nomor Telepon" class="name-column">
                                <template #body="rowData">
                                    <span :class="rowData.data.customer_nohp === 'BELUM DI ISI' ? 'text-red' : 'text-black'">
                                        {{ rowData.data.customer_nohp }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="customer_address" header="Alamat" class="name-column">
                                <template #body="rowData">
                                    <span :class="rowData.data.customer_address === 'BELUM DI ISI' ? 'text-red' : 'text-black'">
                                        {{ rowData.data.customer_address }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="customer_email" header="Email" class="name-column"></Column>
                            <Column field="customer_level.level_name" header="Level" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.customer_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.customer_uuid)"></Button>
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
