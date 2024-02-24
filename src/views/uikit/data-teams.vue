<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Swal from 'sweetalert2';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-teams.css';
import { useRouter } from 'vue-router';
import FileUpload from 'primevue/fileupload';

const router = useRouter();
const validateData = ref('');

const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const uuid_team = ref('');
const team_name = ref('');
const team_job_desc = ref('');
const team_media = ref('');
const validasi_team_media = ref('');

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

const tableData = ref([]);
const DataBusines = ref([]);
const DataScope = ref([]);
const businesOptions = ref([]);
const scopeOptions = ref([]);
const multiselectOptionsBusiness = ref([]);
const multiselectOptionsScope = ref([]);
const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');
const team_business = ref(null);
const team_scope = ref(null);

const updateOptions = () => {
    businesOptions.value = [{ label: 'Pilih Bisnis', value: null }, ...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];

    multiselectOptionsBusiness.value = [...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];
    multiselectOptionsScope.value = [...DataScope.value.map((index) => ({ label: index.scope_name, value: index.scope_uuid }))];
};

const fetchDataOption = async () => {
    try {
        const getBusines = await axios.get(`${baseURL}/api/${version}/business/get_all`);
        const getScope = await axios.get(`${baseURL}/api/${version}/scope/get_all`);
        DataBusines.value = getBusines.data.data;
        DataScope.value = getScope.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const fetchDataOptionCustomer = async () => {
    try {
        const params = new URLSearchParams();
        if (user_uuid.value !== '') {
            params.append('business_customer', user_uuid.value);
        }

        const getBusiness = await axios.get(`${baseURL}/api/${version}/business/get_all_customer`, {
            params: params
        });

        const getScope = await axios.get(`${baseURL}/api/${version}/scope/get_all`);

        console.log('getScope data:', getScope.data);

        DataBusines.value = getBusiness.data.data;
        DataScope.value = getScope.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

watch(
    team_business,
    (newBusinessUuid) => {
        if (newBusinessUuid) {
            scopeOptions.value = DataScope.value.filter((scope) => scope.scope_business.business_uuid === newBusinessUuid).map((scope) => ({ label: scope.scope_name, value: scope.scope_uuid }));
        } else {
            scopeOptions.value = [{ label: 'Pilih Scope', value: null }];
        }
    },
    { immediate: true }
);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;

    team_name.value = null;
    team_job_desc.value = null;
    team_business.value = null;
    team_scope.value = null;
    team_media.value = null;
    validasi_team_media.value = null;
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;

    team_name.value = null;
    team_job_desc.value = null;
    team_business.value = null;
    team_scope.value = null;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;

    team_name.value = null;
    team_job_desc.value = null;
    team_business.value = null;
    team_scope.value = null;
};

onMounted(async () => {
    await DataMe();
});

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

let jumlah_row = 5;
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
            params.append(`order[${'team_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/teams/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response.data.success) {
            tableData.value = response.data.data || [];

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
            params.append(`team_business`, user_uuid.value);
        }

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'team_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/teams/get_all_customer`, {
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

const addDataData = async () => {
    try {
        const name = team_name.value;
        const desc = team_job_desc.value;
        const business = team_business.value;
        const scope = team_scope.value;
        const media = team_media.value;

        if (media == '') {
            validasi_team_media.value = '*Mohon upload file Anda dahulu';
        } else {
            const response = await axios.post(`${baseURL}/api/${version}/teams`, {
                team_name: name,
                team_job_desc: desc,
                team_business: business,
                team_scope: scope,
                team_media: media
            });

            if (response) {
                closeModal();
                Swal.fire('Successfully', 'Sukses Menambahkan Data', 'success').then(() => {
                    window.location.reload();
                });
            }
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
    uuid_team.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/teams/${uuid_team.value}`);
        if (response) {
            team_name.value = response.data.data.team_name;
            team_job_desc.value = response.data.data.team_job_desc;
            team_business.value = response.data.data.team_business.business_uuid;
            team_scope.value = response.data.data.team_scope.scope_uuid;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};

const openModalHapus = async (value) => {
    uuid_team.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/teams/${uuid_team.value}`);
        if (response) {
            team_name.value = response.data.data.team_name;
            team_job_desc.value = response.data.data.team_job_desc;
            team_business.value = response.data.data.team_business;
            team_scope.value = response.data.data.team_scope;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};

const UpdateDataData = async () => {
    try {
        const name = team_name.value;
        const desc = team_job_desc.value;
        const business = team_business.value;
        const scope = team_scope.value;
        const response = await axios.put(`${baseURL}/api/${version}/teams/${uuid_team.value}`, {
            team_name: name,
            team_job_desc: desc,
            team_business: business,
            team_scope: scope
        });

        if (response) {
            closeModalUpdate();
            window.location.reload();
            uuid_team.value = '';
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

const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/teams/${uuid_team.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
};

const onUpload = async (event) => {
    if (event.xhr.status === 200) {
        const responseText = event.xhr.responseText;

        // Parse response text menjadi objek JavaScript
        const responseObj = JSON.parse(responseText);

        // Sekarang Anda dapat mengakses media_uuid dari responseObj
        const mediaUuid = responseObj.data.media_uuid;
        team_media.value = mediaUuid;
    } else {
        console.error('Upload failed', event);
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
    <div class="judul-halaman-teams">
        <h1>Tim Atau Kelompok</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="team_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                <textarea v-model="team_job_desc" placeholder="Tambahkan Desc" class="modal-textarea"></textarea>
                <Dropdown v-model="team_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                <Dropdown v-model="team_scope" :options="scopeOptions" optionLabel="label" optionValue="value" placeholder="Pilih Scope" class="modal-input"></Dropdown>
            </div>
            <div class="modal-form-group">
                <FileUpload
                    name="file"
                    :url="`${baseURL}/api/${version}/media/upload_media`"
                    :onUpload="onUpload"
                    :multiple="true"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/*"
                    :maxFileSize="300 * 1024 * 1024"
                >
                </FileUpload>
            </div>
            <p v-if="validasi_business_media" class="validation-error text-red">{{ validasi_business_media }}</p>
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
                <InputText v-model="team_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                <textarea v-model="team_job_desc" placeholder="Tambahkan Job Desc" class="modal-textarea"></textarea>
                <Dropdown v-model="team_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                <Dropdown v-model="team_scope" :options="scopeOptions" optionLabel="label" optionValue="value" placeholder="Pilih Scope" class="modal-input"></Dropdown>
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
                    Apakah Anda yakin untuk menghapus data teams <span class="bold-text"> "{{ team_business.business_name }}"</span>
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
                    <div class="top-tabel-teams">
                        <button class="create-data-teams" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown v-if="user_level === 'administrator' || user_level === 'super administrator'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            <Dropdown v-if="user_level === 'customer'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchDataCustomer"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-teams">
                        <h5>Data Table Tim</h5>
                        <div class="search-container-teams">
                            <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <InputText v-if="user_level === 'customer'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer"></InputText>
                            <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                            <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope" @click="fetchDataCustomer"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="team_name" header="Nama" class="name-column"></Column>
                        <Column field="team_job_desc" header="Job Desc" class="name-column"></Column>
                        <Column field="team_business.business_name" header="Bisnis" class="name-column"></Column>
                        <Column field="team_scope.scope_name" header="Scope" class="name-column"></Column>
                        <Column header="Foto" class="name-column">
                            <template #body="slotProps">
                                <a :href="slotProps.data.team_media.media_url">
                                    <img :src="slotProps.data.team_media.media_url" alt="Media" :width="100" style="cursor: pointer; border-radius: 10px" />
                                </a>
                            </template>
                        </Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-teams">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.team_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.team_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
