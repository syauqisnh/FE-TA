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
import Swal from 'sweetalert2';
import '../uikit/css/data-level.css';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

//inisialisasi data level
const uuid_level = ref();
const level_name = ref('');

const validateAddData = ref('');

const Hakaksestolak = ref('');
const Hakakses = ref('');

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
    level_name.value = '';
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    level_name.value = '';
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
        const params = new URLSearchParams();

        // Tambahkan parameter 'order' berdasarkan 'selectedOrder.value'
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'level_id'}]`, selectedOrder.value);
        }

        // Tambahkan parameter 'limit' jika bukan default
        if (selectedLimit.value && selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        // Tambahkan parameter 'filter' untuk 'level_name'
        const filterNames = multiselectValue.value ? multiselectValue.value.map((item) => item.name) : [];
        if (filterNames.length > 0) {
            params.append('filter[level_name]', filterNames.join(','));
        }

        // Tambahkan parameter 'keyword' jika ada input
        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        // Buat request ke backend
        const response = await axios.get(`${baseURL}/api/${version}/level/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response.data.success) {
            tableData.value = response.data.data || [];
            Hakakses.value = response.data.message;
        } else {
            console.error('Respon sukses tetapi tidak ada data:', response.data.message);
            tableData.value = [];
        }
    } catch (error) {
        Hakaksestolak.value = error.response.data.msg;
    }
};

const addDataData = async () => {
    try {
        const nama_level = level_name.value;
        const response = await axios.post(`${baseURL}/api/${version}/level`, {
            level_name: nama_level
        });

        if (response) {
            closeModal();
            Swal.fire('Successfully', 'Sukses Menambahkan Data', 'success').then(() => {
                window.location.reload();
            });
        }
    } catch (error) {
        console.error(error);
        validateAddData.value = error.response.data.message;
        if (error) {
            Swal.fire('Fail', validateAddData.value, 'error');
            return;
        }
    }
};
const OpenModalEdit = async (value) => {
    uuid_level.value = value;
    const response = await axios.get(`${baseURL}/api/${version}/level/${uuid_level.value}`);
    if (response) {
        level_name.value = response.data.data.level_name;
        openModalUpdate();
    }
};
const UpdateDataData = async () => {
    try {
        const nama_level = level_name.value;
        const response = await axios.put(`${baseURL}/api/${version}/level/${uuid_level.value}`, {
            level_name: nama_level
        });

        if (response) {
            closeModalUpdate();
            Swal.fire('Successfully', 'Sukses Mengupdate Data', 'success').then(() => {
                window.location.reload();
            });
            uuid_level.value = '';
        }
    } catch (error) {
        console.error(error);
        validateAddData.value = error.response.data.message;
        if (error) {
            Swal.fire('Fail', validateAddData.value, 'error');
            return;
        }
    }
};
const openModalHapus = async (value) => {
    uuid_level.value = value;
    const response = await axios.get(`${baseURL}/api/${version}/level/${uuid_level.value}`);
    if (response) {
        level_name.value = response.data.data.level_name;
        openModalDelete();
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/level/${uuid_level.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
};

watch(multiselectValue, fetchData);
</script>

<template>
    <div v-if="Hakaksestolak">
        <p>{{ Hakaksestolak }}</p>
    </div>

    <div v-if="Hakakses">
        <div class="judul-halaman">
            <h1>Data Level</h1>
        </div>
        <!-- modal add -->
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <p v-if="validateAddData" style="color: red; margin: 0">{{ validateAddData }}</p>
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
                <p v-if="validateAddData" style="color: red; margin: 0">{{ validateAddData }}</p>
                <div class="modal-form-group">
                    <InputText v-model="level_name" :value="level_name" class="modal-input"></InputText>
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
    </div>
</template>
