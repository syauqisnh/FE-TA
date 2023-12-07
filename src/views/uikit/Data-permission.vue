<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-permission.css';

const Hakaksestolak = ref('');
const Hakakses = ref('');

const uuid_permission = ref();
const permission_name = ref('');
const edit_permission_name = ref('');

const tableData = ref([]);
const selectedLimit = ref('default');
const selectedOrder = ref('default');
const inputSearch = ref('');

let jumlah_row = 5;

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    permission_name.value = '';
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
    uuid_permission.value = '';
    permission_name.value = '';
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

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/permissions/get_all', {
            params: {
                order: { permission_id: selectedOrder.value },
                keyword: inputSearch.value
            }
        });

        console.log('Respon API:', response.data);
        tableData.value = response.data.data || [];
        Hakakses.value = response.data.message;
    } catch (error) {
        Hakaksestolak.value = error.response.data.msg;
    }
};

const addData = async () => {
    const nama_permission = permission_name.value;
    const response = await axios.post('http://localhost:9900/api/v1/permissions', {
        permission_name: nama_permission
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_permission.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/permissions/${uuid_permission.value}`);
    if (response) {
        edit_permission_name.value = response.data.data.permission_name;
        openModalUpdate();
    }
};

const updateData = async () => {
    const nama_permission = edit_permission_name.value;
    const response = await axios.put(`http://localhost:9900/api/v1/permissions/${uuid_permission.value}`, {
        permission_name: nama_permission
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_permission.value = '';
    }
};

const openModalHapus = async (value) => {
    uuid_permission.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/permissions/${uuid_permission.value}`);
    if (response) {
        permission_name.value = response.data.data.permission_name;
        openModalDelete();
    }
};
const deleteData = async () => {
    const response = await axios.delete(`http://localhost:9900/api/v1/permissions/${uuid_permission.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};

const Ubahnilai_jumlah_row = () => {
    if (selectedLimit.value === 'default') {
        jumlah_row = 5;
    } else {
        jumlah_row = parseInt(selectedLimit.value, 10);
    }
};

watch(fetchData);
</script>

<template>
    <div v-if="Hakaksestolak">
        <p>{{ Hakaksestolak }}</p>
    </div>

    <div v-if="Hakakses">
        <div class="judul-halaman-permission">
            <h1>Data Permission</h1>
        </div>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="permission_name" placeholder="Tambahkan Permission" class="modal-input"></InputText>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="addData">Submit</button>
                </div>
            </div>
        </div>

        <div v-if="isUpdateModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModalUpdate">&times;</span>
                <h4>Ubah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="edit_permission_name" :value="edit_permission_name" class="modal-input"></InputText>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="updateData">Ubah data</button>
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
                        Apakah Anda yakin untuk menghapus nama permission <span class="bold-text"> "{{ permission_name }}"</span>
                    </p>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="deleteData">Hapus data</button>
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
                        <div class="top-tabel-permission">
                            <button class="create-data-permission" @click="openModal">Tambah Data</button>

                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>

                            <span class="p-float-label">
                                <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            </span>
                        </div>
                        <div class="data-table-permission">
                            <h5>Data Table Permission</h5>
                            <div class="search-container-permission">
                                <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <Button icon="pi pi-search" class="search-button-permission" @click="fetchData"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="permission_name" header="Nama" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons-permission">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.permission_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.permission_uuid)"></Button>
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
