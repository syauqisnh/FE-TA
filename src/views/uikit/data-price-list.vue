<!-- eslint-disable no-unused-vars -->
<script setup>
import '../uikit/css/data-price-list.css';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import FileUpload from 'primevue/fileupload';

const router = useRouter();

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

const uuid_price_list = ref('');
const price_list_name = ref('');
const price_list_price = ref('');
const price_list_desc = ref('');
const price_list_status = ref('Y');
const price_list_order = ref('');
const price_list_business = ref('');
const price_list_media = ref('');
const validasi_price_media = ref('');

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');
const tableData = ref([]);
const DataBusines = ref([]);
const businesOptions = ref([]);
const multiselectOptionsBusiness = ref([]);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};


const updateOptions = () => {
    businesOptions.value = [{ label: 'Pilih Bisnis', value: null }, ...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];

    multiselectOptionsBusiness.value = [...DataBusines.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
};

const fetchDataOption = async () => {
    try {
        const getBusines = await axios.get('http://localhost:9900/api/v1/business/get_all');
        DataBusines.value = getBusines.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};
onMounted(async () => {
    await DataMe();
});

const DataMe = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/me');

        if (response) {
            user_username.value = response.data.name;
            user_level.value = response.data.level;
            user_uuid.value = response.data.uuid;

            if (user_level.value == 'customer' || user_level.value == 'administrator') {
                await fetchData();
                await fetchDataOption();
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/Landing-2'); // Pengguna belum login, arahkan ke landing page
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
            params.append(`order[${'price_list_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`http://localhost:9900/api/v1/price_list/get_all`, {
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

const jumlah_row = 5;

const addDataData = async () => {
    const name = price_list_name.value;
    const price = price_list_price.value;
    const desc = price_list_desc.value;
    const status = price_list_status.value === 'active' ? 'Y' : 'N';
    const order = price_list_order.value;
    const business = price_list_business.value;
    const media = price_list_media.value;

    if (media == '') {
        validasi_price_media.value = '*Mohon upload file Anda dahulu';
    } else {
        const response = await axios.post('http://localhost:9900/api/v1/price_list', {
            price_list_name: name,
            price_list_price: price,
            price_list_desc: desc,
            price_list_status: status,
            price_list_order: order,
            price_list_business: business,
            price_list_media: media
        });

        if (response) {
            closeModal();
            window.location.reload();
        }
    }
};

const onUpload = async (event) => {
    if (event.xhr.status === 200) {
        const responseText = event.xhr.responseText;

        // Parse response text menjadi objek JavaScript
        const responseObj = JSON.parse(responseText);

        // Sekarang Anda dapat mengakses media_uuid dari responseObj
        const mediaUuid = responseObj.data.media_uuid;
        price_list_media.value = mediaUuid;
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
    <div class="judul-halaman-price">
        <h1>Daftar Harga</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="price_list_name" placeholder="Tambahkan Nama" class="modal-input"></InputText>
                <InputText v-model="price_list_price" placeholder="Tambahkan Harga" class="modal-input"></InputText>
                <textarea v-model="price_list_desc" placeholder="Tambahkan Deskripsi" class="modal-textarea"></textarea>
                <label>Status:</label>
                <div class="radio-group">
                    <RadioButton v-model="price_list_status" value="active" label="Aktif"></RadioButton>
                    <label for="active">Ditampilkan</label>
                </div>
                <div class="radio-group">
                    <RadioButton v-model="price_list_status" value="inactive" label="Tidak Aktif"></RadioButton>
                    <label for="inactive">Dinonaktifkan</label>
                </div>
                <InputText v-model="price_list_order" placeholder="Tambahkan Urutan" class="modal-input"></InputText>
                <Dropdown v-model="price_list_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
            </div>
            <div class="modal-form-group">
                <FileUpload
                    name="file"
                    url="http://localhost:9900/api/v1/media/upload_media"
                    :onUpload="onUpload"
                    :multiple="true"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/*"
                    :maxFileSize="300 * 1024 * 1024"
                >
                </FileUpload>
            </div>
            <p v-if="validasi_price_media" class="validation-error text-red">{{ validasi_price_media }}</p>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="addDataData">Submit</button>
            </div>
        </div>
    </div>

    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <div class="container">
                    <div class="top-tabel-price">
                        <button class="create-data-price" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-price">
                        <h5>Data Table Harga</h5>
                        <div class="search-container-price">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-price" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="price_list_name" header="Nama" class="name-column"></Column>
                        <Column field="price_list_price" header="Harga" class="name-column"></Column>
                        <Column field="price_list_desc" header="Desc" class="name-column"></Column>
                        <Column field="price_list_status" header="Status" class="name-column"></Column>
                        <Column field="price_list_order" header="Pesanan" class="name-column"></Column>
                        <Column field="price_list_business.business_name" header="Bisnis" class="name-column"></Column>
                        <Column field="price_list_media.media_name" header="Media" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-price">
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
