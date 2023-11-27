<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios, { Axios } from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-module.css';

const uuid_module = ref();
const module_name = ref('');
const edit_module_name = ref('');

const tableData = ref([]);
const inputSearch = ref('');
const selectedLimit = ref('default');
const selectedOrder = ref('default');

let jumlah_row = 5;

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    module_name.value = '';
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
    uuid_module.value = '';
    module_name.value = '';
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
        const response = await axios.get('http://localhost:9900/api/v1/module/get_all', {
            params: {
                order: { module_id: selectedOrder.value },
                keyword: inputSearch.value
            }
        });

        console.log('Respon API:', response.data);
        tableData.value = response.data.data || [];
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const addData = async () => {
    const nama_modul = module_name.value;
    const response = await axios.post('http://localhost:9900/api/v1/module', {
        module_name: nama_modul
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_module.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/module/${uuid_module.value}`);
    if (response) {
        edit_module_name.value = response.data.data.module_name;
        openModalUpdate();
    }
};

const updateData = async () => {
    const nama_modul = edit_module_name.value;
    const response = await axios.put(`http://localhost:9900/api/v1/module/${uuid_module.value}`, {
        module_name: nama_modul
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_module.value = '';
    }
};

const openModalHapus = async (value) => {
    uuid_module.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/module/${uuid_module.value}`);
    if (response) {
        module_name.value = response.data.data.module_name;
        openModalDelete();
    }
};
const deleteData = async () => {
    const response = await axios.delete(`http://localhost:9900/api/v1/module/${uuid_module.value}`);

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
    <div class="judul-halaman-module">
        <h1>Data Module</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="module_name" placeholder="Tambahkan Module" class="modal-input"></InputText>
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
                <InputText v-model="edit_module_name" :value="edit_module_name" class="modal-input"></InputText>
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
                    Apakah Anda yakin untuk menghapus nama modul <span class="bold-text"> "{{ module_name }}"</span>
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
                    <div class="top-tabel-module">
                        <button class="create-data-module" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-module">
                        <h5>Data Table Module</h5>
                        <div class="search-container-module">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-module" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="module_name" header="Nama" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-module">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.module_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.module_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
