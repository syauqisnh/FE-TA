<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-user.css';

//inisialisasi data level
const uuid_user = ref();
const user_username = ref('');
const user_full_name = ref('');
const user_nohp = ref('');
const user_address = ref('');
const user_email = ref('');
const user_password = ref('');
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

    //set varibel name_level saat modal di close
    user_username.value = '';
    user_full_name.value = '';
    user_nohp.value = '';
    user_address.value = '';
    user_email.value = '';
    user_password.value = '';
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    user_username.value = '';
    user_full_name.value = '';
    user_nohp.value = '';
    user_address.value = '';
    user_email.value = '';
    user_password.value = '';
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    uuid_user.value = '';
    user_username.value = '';
    user_full_name.value = '';
    user_nohp.value = '';
    user_address.value = '';
    user_email.value = '';
    user_password.value = '';
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
    fetchData();
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
        const response = await axios.get('http://localhost:9900/api/v1/user/get_all', {
            params: {
                order: { user_id: selectedOrder.value },
                keyword: inputSearch.value
            }
        });

        console.log('Respon API:', response.data);
        tableData.value = response.data.data || [];
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};
const addDataData = async () => {
    const username = user_username.value;
    const nama_langkap = user_full_name.value;
    const nohp = user_nohp.value;
    const address = user_address.value;
    const email = user_email.value;
    const password = user_password.value;
    const response = await axios.post('http://localhost:9900/api/v1/user', {
        user_username: username,
        user_full_name: nama_langkap,
        user_nohp: nohp,
        user_address: address,
        user_email: email,
        user_password: password
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_user.value = value;
    try {
        const response = await axios.get(`http://localhost:9900/api/v1/user/${uuid_user.value}`);
        if (response) {
            user_username.value = response.data.data.user_username;
            user_full_name.value = response.data.data.user_full_name;
            user_nohp.value = response.data.data.user_nohp;
            user_address.value = response.data.data.user_address;
            user_email.value = response.data.data.user_email;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};
const UpdateDataData = async () => {
    const username = user_username.value;
    const nama_langkap = user_full_name.value;
    const nohp = user_nohp.value;
    const address = user_address.value;
    const email = user_email.value;
    const password = user_password.value;
    const response = await axios.put(`http://localhost:9900/api/v1/user/${uuid_user.value}`, {
        user_username: username,
        user_full_name: nama_langkap,
        user_nohp: nohp,
        user_address: address,
        user_email: email,
        user_password: password
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_user.value = '';
    }
};
const openModalHapus = async (value) => {
    uuid_user.value = value;
    try {
        const response = await axios.get(`http://localhost:9900/api/v1/user/${uuid_user.value}`);
        if (response) {
            user_username.value = response.data.data.user_username;
            user_full_name.value = response.data.data.user_full_name;
            user_nohp.value = response.data.data.user_nohp;
            user_address.value = response.data.data.user_address;
            user_email.value = response.data.data.user_email;
            user_password.value = response.data.data.user_password;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`http://localhost:9900/api/v1/user/${uuid_user.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};

watch(fetchData);
</script>
<template>
    <div class="judul-halaman-user">
        <h1>Data User</h1>
    </div>
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="user_username" placeholder="Username" class="modal-input"></InputText>
                <InputText v-model="user_full_name" placeholder="Nama Lengkap" class="modal-input"></InputText>
                <InputText v-model="user_nohp" placeholder="Nomor Telepon (OPSIONAL)" class="modal-input"></InputText>
                <InputText v-model="user_address" placeholder="Alamat (OPSIONAL)" class="modal-input"></InputText>
                <InputText v-model="user_email" placeholder="Email" class="modal-input"></InputText>
                <InputText id="password" :type="checked ? 'text' : 'password'" placeholder="Password" class="modal-input" v-model="user_password" />
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
    <div v-if="isUpdateModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalUpdate">&times;</span>
            <h4>Ubah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="user_username" :value="user_username" class="modal-input"></InputText>
                <InputText v-model="user_full_name" :value="user_full_name" class="modal-input"></InputText>
                <InputText v-model="user_nohp" :value="user_nohp" class="modal-input"></InputText>
                <InputText v-model="user_address" :value="user_address" class="modal-input"></InputText>
                <InputText v-model="user_email" :value="user_email" class="modal-input"></InputText>
                <InputText v-model="user_password" :value="user_password" class="modal-input"></InputText>
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
                    Apakah Anda yakin untuk menghapus nama User <span class="bold-text"> "{{ user_username }}"</span>
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
                    <div class="top-tabel-user">
                        <button class="create-data-user" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-user">
                        <h5>Data Table User</h5>
                        <div class="search-container-user">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="user_username" header="Username" class="name-column"></Column>
                        <Column field="user_full_name" header="Nama Langkap" class="name-column"></Column>
                        <Column field="user_nohp" header="Nomor Telepon" class="name-column"></Column>
                        <Column field="user_address" header="Alamat" class="name-column"></Column>
                        <Column field="user_email" header="Email" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-user">
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
