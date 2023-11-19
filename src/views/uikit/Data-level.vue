<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-level.css';

//inisialisasi data level
const uuid_level = ref();
const level_name = ref('');
const edit_level_name = ref('');

const tableData = ref([]);
const inputSearch = ref('');
const selectedOrder = ref('default');
const multiselectValue = ref(null);
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
    level_name.value = '';
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
    uuid_level.value = '';
    level_name.value = '';
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

const multiselectValues = ref([
    { name: 'Super Administrator', code: 'AU' },
    { name: 'Administrator', code: 'BR' },
    { name: 'Customer', code: 'CN' }
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
        const filterNames = multiselectValue.value ? multiselectValue.value.map((item) => item.name) : [];

        const response = await axios.get('http://localhost:9900/api/v1/level/get_all', {
            params: {
                order: { level_id: selectedOrder.value },
                filter: {
                    level_name: filterNames.join(',')
                },
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
    const nama_level = level_name.value;
    const response = await axios.post('http://localhost:9900/api/v1/level', {
        level_name: nama_level
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};
const OpenModalEdit = async (value) => {
    uuid_level.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/level/${uuid_level.value}`);
    if (response) {
        edit_level_name.value = response.data.data.level_name;
        openModalUpdate();
    }
};
const UpdateDataData = async () => {
    const nama_level = edit_level_name.value;
    const response = await axios.put(`http://localhost:9900/api/v1/level/${uuid_level.value}`, {
        level_name: nama_level
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_level.value = '';
    }
};
const openModalHapus = async (value) => {
    uuid_level.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/level/${uuid_level.value}`);
    if (response) {
        level_name.value = response.data.data.level_name;
        openModalDelete();
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`http://localhost:9900/api/v1/level/${uuid_level.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};

watch(multiselectValue, fetchData);
</script>

<template>
    <div class="judul-halaman">
        <h1>Data Level</h1>
    </div>
    <!-- modal add -->
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="level_name" placeholder="Tambahkan level" class="modal-input"></InputText>
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
                <InputText v-model="edit_level_name" :value="edit_level_name" class="modal-input"></InputText>
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
                    Apakah Anda yakin untuk menghapus nama level <span class="bold-text"> "{{ level_name }}"</span>
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
                    <div class="top-tabel">
                        <button class="create-data" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>

                        <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Pilih Level" :filter="true">
                            <label for="dropdown">Filter Data</label>
                            <template #value="slotProps">
                                <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                    <div>{{ option.name }}</div>
                                </div>
                                <template v-if="!slotProps.value || slotProps.value.length === 0">
                                    <div class="p-1">Filter</div>
                                </template>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>
                    <div class="data-table">
                        <h5>Data Table Level</h5>
                        <div class="search-container">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="level_name" header="Nama" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons">
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
