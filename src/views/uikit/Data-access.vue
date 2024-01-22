<!-- eslint-disable no-unused-vars -->
<script setup>
const Hakaksestolak = ref('');
const Hakakses = ref('');

import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-access.css';

const tableData = ref([]);
const DataModul = ref([]);
const DataPermission = ref([]);
const DataLevel = ref([]);
const moduleOptions = ref([]);
const permissionOptions = ref([]);
const levelOptions = ref([]);
const multiselectOptionsPermission = ref([]);
const multiselectOptionsLevel = ref([]);
const multiselectOptions = ref([
    { label: 'Pilih Level', value: null },
    { label: 'Data Modul', items: [...DataModul.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))] },
    { label: 'Data Permission', items: [...DataPermission.value.map((index) => ({ label: index.permission_name, value: index.permission_uuid }))] },
    { label: 'Data Level', items: [...DataLevel.value.map((index) => ({ label: index.level_name, value: index.level_uuid }))] }
]);

const uuid_access = ref();
// const access_uuid = ref();
const access_modul = ref(null);
const access_permission = ref(null);
const access_level = ref(null);

const inputSearch = ref('');
const selectedLimit = ref('default');
const selectedOrder = ref('default');

const multiselectValue = ref(null);
const multiselectValuePermission = ref(null);
const multiselectValueLevel = ref(null);

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
// const edit_access_name = ref('');
let jumlah_row = 5;

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;

    access_modul.value = null;
    access_permission.value = null;
    access_level.value = null;
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    access_modul.value = null;
    access_permission.value = null;
    access_level.value = null;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    uuid_access.value = '';
    access_modul.value = '';
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

const multiselectValues = ref([{ name: 'Super Administrator' }, { name: 'Administrator' }, { name: 'Customer' }]);

const updateOptions = () => {
    moduleOptions.value = [{ label: 'Pilih Module', value: null }, ...DataModul.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
    permissionOptions.value = [{ label: 'Pilih Permission', value: null }, ...DataPermission.value.map((index) => ({ label: index.permission_name, value: index.permission_uuid }))];
    levelOptions.value = [{ label: 'Pilih Level', value: null }, ...DataLevel.value.map((index) => ({ label: index.level_name, value: index.level_uuid }))];

    multiselectOptions.value = [...DataModul.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
    multiselectOptionsPermission.value = [...DataPermission.value.map((index) => ({ label: index.permission_name, value: index.permission_uuid }))];
    multiselectOptionsLevel.value = [...DataLevel.value.map((index) => ({ label: index.level_name, value: index.level_uuid }))];
};
onMounted(async () => {
    fetchData();
    fetchDataOption();
});

const fetchDataOption = async () => {
    try {
        const getModule = await axios.get('http://localhost:9900/api/v1/module/get_all');
        const getLevel = await axios.get('http://localhost:9900/api/v1/level/get_all');
        const getPermession = await axios.get('http://localhost:9900/api/v1/permissions/get_all');
        DataModul.value = getModule.data.data;
        DataPermission.value = getPermession.data.data;
        DataLevel.value = getLevel.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const fetchData = async () => {
    try {
        const filterNames = multiselectValue.value ? multiselectValue.value.map((item) => item.label) : [];
        const filterNamesPermission = multiselectValuePermission.value ? multiselectValuePermission.value.map((item) => item.label) : [];
        const filterNamesLevel = multiselectValueLevel.value ? multiselectValueLevel.value.map((item) => item.label) : [];

        const params = new URLSearchParams();

        // Conditionally add the 'order' parameter
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'access_id'}]`, selectedOrder.value);
        }

        // Tambahkan parameter 'keyword' jika ada input
        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        // Tambahkan parameter 'filter' untuk module names
        if (filterNames.length > 0) {
            params.append('filter[modul_name]', filterNames.join(','));
        }

        // Tambahkan parameter 'filter' untuk permission names
        if (filterNamesPermission.length > 0) {
            params.append('filter[permission_name]', filterNamesPermission.join(','));
        }

        // Tambahkan parameter 'filter' untuk level names
        if (filterNamesLevel.length > 0) {
            params.append('filter[level_name]', filterNamesLevel.join(','));
        }

        // Buat request ke backend
        const response = await axios.get('http://localhost:9900/api/v1/access/get_all', {
            params: params
        });

        console.log('Respon API:', response.data);
        tableData.value = response.data.data || [];
        Hakakses.value = response.data.message;
    } catch (error) {
        Hakaksestolak.value = error.response.data.msg;
    }
};


const addDataData = async () => {
    const nama_modul = access_modul.value;
    const nama_permission = access_permission.value;
    const nama_level = access_level.value;
    const response = await axios.post('http://localhost:9900/api/v1/access', {
        access_modul: nama_modul,
        access_permission: nama_permission,
        access_level: nama_level
    });

    if (response) {
        closeModal();
        window.location.reload();
    }
};

const OpenModalEdit = async (value) => {
    uuid_access.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/access/${uuid_access.value}`);
    if (response) {
        access_modul.value = response.data.data.access_modul.modul_uuid;
        access_permission.value = response.data.data.access_permission.permission_uuid;
        access_level.value = response.data.data.access_level.level_uuid;
        openModalUpdate();

        console.log('data detail modul = ', response.data.data.access_level.level_uuid);
    }
};
const UpdateDataData = async () => {
    const nama_modul = access_modul.value;
    const nama_permission = access_permission.value;
    const nama_level = access_level.value;

    const response = await axios.put(`http://localhost:9900/api/v1/access/${uuid_access.value}`, {
        access_modul: nama_modul,
        access_permission: nama_permission,
        access_level: nama_level
    });

    if (response) {
        closeModalUpdate();
        window.location.reload();
        uuid_access.value = '';
    }

    console.log(nama_modul);
    console.log(nama_permission);
    console.log(nama_level);
};
const openModalHapus = async (value) => {
    uuid_access.value = value;
    const response = await axios.get(`http://localhost:9900/api/v1/access/${uuid_access.value}`);
    if (response) {
        access_modul.value = response.data.data.access_modul;
        openModalDelete();
    }
};

const DeleteDataData = async () => {
    const response = await axios.delete(`http://localhost:9900/api/v1/access/${uuid_access.value}`);

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

watch(multiselectValue, fetchData);
watch(multiselectValuePermission, fetchData);
watch(multiselectValueLevel, fetchData);
</script>

<template>
    <div v-if="Hakaksestolak">
        <p>{{ Hakaksestolak }}</p>
    </div>

    <div v-if="Hakakses">
        <div class="judul-halaman-access">
            <h1>Data Access</h1>
        </div>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <div class="modal-form-group">
                    <Dropdown v-model="access_modul" :options="moduleOptions" optionLabel="label" optionValue="value" placeholder="Pilih Module" class="modal-input"></Dropdown>
                    <Dropdown v-model="access_permission" :options="permissionOptions" optionLabel="label" optionValue="value" placeholder="Pilih Permission" class="modal-input"></Dropdown>
                    <Dropdown v-model="access_level" :options="levelOptions" optionLabel="label" optionValue="value" placeholder="Pilih Level" class="modal-input"></Dropdown>
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
                    <Dropdown v-model="access_modul" :options="moduleOptions" optionLabel="label" optionValue="value" class="modal-input"></Dropdown>
                    <Dropdown v-model="access_permission" :options="permissionOptions" optionLabel="label" optionValue="value" class="modal-input"></Dropdown>
                    <Dropdown v-model="access_level" :options="levelOptions" optionLabel="label" optionValue="value" class="modal-input"></Dropdown>
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
                        Apakah Anda yakin untuk menghapus nama level <span class="bold-text"> "{{ access_modul.modul_name }}"</span>
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
                        <div class="top-tabel-access">
                            <button class="create-data-access" @click="openModal">Tambah Data</button>

                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>

                            <span class="p-float-label">
                                <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            </span>

                            <MultiSelect v-model="multiselectValue" :options="multiselectOptions" optionLabel="label" placeholder="Pilih Level" :filter="true">
                                <label for="dropdown">Filter Data</label>
                                <template #value="slotProps">
                                    <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                        <div>{{ option.label }}</div>
                                    </div>
                                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                                        <div class="p-1">Filter Modul</div>
                                    </template>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <div>{{ slotProps.option.label }}</div>
                                    </div>
                                </template>
                            </MultiSelect>

                            <MultiSelect v-model="multiselectValuePermission" :options="multiselectOptionsPermission" optionLabel="label" placeholder="Pilih Level" :filter="true">
                                <label for="dropdown">Filter Data</label>
                                <template #value="slotProps">
                                    <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                        <div>{{ option.label }}</div>
                                    </div>
                                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                                        <div class="p-1">Filter Permession</div>
                                    </template>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <div>{{ slotProps.option.label }}</div>
                                    </div>
                                </template>
                            </MultiSelect>

                            <MultiSelect v-model="multiselectValueLevel" :options="multiselectOptionsLevel" optionLabel="label" placeholder="Pilih Level" :filter="true">
                                <label for="dropdown">Filter Data</label>
                                <template #value="slotProps">
                                    <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                        <div>{{ option.label }}</div>
                                    </div>
                                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                                        <div class="p-1">Filter Level</div>
                                    </template>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <div>{{ slotProps.option.label }}</div>
                                    </div>
                                </template>
                            </MultiSelect>
                        </div>
                        <div class="data-table-access">
                            <h5>Data Table Access</h5>
                            <div class="search-container-access">
                                <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <Button icon="pi pi-search" class="search-button-access" @click="fetchData"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="access_modul.modul_name" header="Modul" class="name-column"></Column>
                            <Column field="access_permission.permission_name" header="Permission" class="name-column"></Column>
                            <Column field="access_level.level_name" header="Level" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons-access">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.access_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.access_uuid)"></Button>
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
