<!-- eslint-disable no-unused-vars -->
<script setup>
import '../uikit/css/data-price-list.css';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Swal from 'sweetalert2';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import FileUpload from 'primevue/fileupload';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();
const validateData = ref('');

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

const uuid_price_list = ref('');
const price_list_name = ref('');
const price_list_price = ref('');
const price_list_desc = ref('');
const price_list_status = ref('Y');
const price_list_order = ref('');
const price_list_business = ref(null);
const detail_file = ref(null);
const validasi_price_media = ref('');

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');
const tableData = ref([]);
const DataBusines = ref([]);
const businesOptions = ref([]);
const multiselectOptionsBusiness = ref([]);
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

const categories = ref([
    { name: 'Diaktifkan', key: 'Y' },
    { name: 'Dinonaktifkan', key: 'N' }
]);

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isModalOpenFile = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const openModalFile = () => {
    isModalOpenFile.value = true;
};

const closeModalFile = () => {
    isModalOpenFile.value = false;
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    price_list_name.value = null;
    price_list_business.value = null;
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    price_list_name.value = '';
};

const updateOptions = () => {
    businesOptions.value = [{ label: 'Pilih Bisnis', value: null }, ...DataBusines.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];

    multiselectOptionsBusiness.value = [...DataBusines.value.map((index) => ({ label: index.module_name, value: index.module_uuid }))];
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
        const response = await axios.get(`${baseURL}/api/${version}/price_list/get_all`, {
            params: params
        });

        if (response.data.success) {
            tableData.value = response.data.data || [];
            tableData.value = response.data.data.map((item) => ({
                ...item,
                price_list_status_formatted: item.price_list_status === 'Y' ? 'Diaktifkan' : 'Dinonaktifkan',
                price_list_price_formatted: `Rp ${item.price_list_price.toLocaleString('id-ID')}`
            }));
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
        const response = await axios.get(`${baseURL}/api/${version}/price_list/get_all_customer`, {
            params: params
        });

        if (response.data.success) {
            tableData.value = response.data.data || [];
            tableData.value = response.data.data.map((item) => ({
                ...item,
                price_list_status_formatted: item.price_list_status === 'Y' ? 'Diaktifkan' : 'Dinonaktifkan',
                price_list_price_formatted: `Rp ${item.price_list_price.toLocaleString('id-ID')}`
            }));
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

const fetchDataOptionCustomer = async () => {
    try {
        const params = new URLSearchParams();
        if (user_uuid.value !== '') {
            params.append('business_customer', user_uuid.value);
        }

        const getBusiness = await axios.get(`${baseURL}/api/${version}/business/get_all_customer`, {
            params: params
        });

        DataBusines.value = getBusiness.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
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

const addDataData = async () => {
    try {
        const name = price_list_name.value;
        const price = price_list_price.value;
        const desc = price_list_desc.value;
        const statusKey = price_list_status.value;
        const status = categories.value.find((category) => category.key === statusKey)?.key || 'N';
        const order = price_list_order.value;
        const business = price_list_business.value;

        const response = await axios.post(`${baseURL}/api/${version}/price_list`, {
            price_list_name: name,
            price_list_price: price,
            price_list_desc: desc,
            price_list_status: status,
            price_list_order: order,
            price_list_business: business
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

const openModalUpload = async (value) => {
    uuid_price_list.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/media/${uuid_price_list.value}`);
        const mediaDetail = response.data.data;
        openModalFile(mediaDetail);
        detail_file.value = response.data.data;
    } catch (error) {
        console.error('Error media:', error);
    }
};

const OpenModalEdit = async (value) => {
    uuid_price_list.value = value;
    const response = await axios.get(`${baseURL}/api/${version}/price_list/${uuid_price_list.value}`);
    if (response) {
        price_list_name.value = response.data.data.price_list_name;
        price_list_price.value = response.data.data.price_list_price;
        price_list_desc.value = response.data.data.price_list_desc;
        price_list_status.value = response.data.data.price_list_status;
        price_list_order.value = response.data.data.price_list_order;
        price_list_business.value = response.data.data.price_list_business;
        openModalUpdate();
    }
};
const UpdateDataData = async () => {
    try {
        const nama_price_list = price_list_name.value;
        const harga_price_list = price_list_price.value;
        const desc_price_list = price_list_desc.value;
        const statusKey = price_list_status.value;
        const status = categories.value.find((category) => category.key === statusKey)?.key || 'N'; // Mencari objek kategori yang sesuai dengan kunci status
        const order_price_list = price_list_order.value;
        const bisnis_price_list = price_list_business.value;
        const response = await axios.put(`${baseURL}/api/${version}/price_list/${uuid_price_list.value}`, {
            price_list_name: nama_price_list,
            price_list_price: harga_price_list,
            price_list_desc: desc_price_list,
            price_list_status: status,
            price_list_order: order_price_list,
            price_list_business: bisnis_price_list
        });

        if (response) {
            closeModalUpdate();
            window.location.reload();
            uuid_price_list.value = '';
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

const onUpload = async (event) => {
    try {
        Swal.fire('Successfully', 'Sukses Menambahkan Foto', 'success').then(() => {
            window.location.reload();
        });
    } catch (error) {
        console.error('Error saat mengunggah file:', error);
        await Swal.fire('Upload Gagal', 'Terjadi kesalahan saat mengunggah file', 'error');
    }
};

const openModalHapus = async (value) => {
    uuid_price_list.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/price_list/${uuid_price_list.value}`);
        if (response) {
            price_list_name.value = response.data.data.price_list_name;
            price_list_price.value = response.data.data.price_list_price;
            price_list_desc.value = response.data.data.price_list_desc;
            price_list_status.value = response.data.data.price_list_status;
            price_list_order.value = response.data.data.price_list_order;
            price_list_business.value = response.data.data.price_list_business;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/price_list/${uuid_price_list.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
};
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
                <InputNumber v-model="price_list_price" placeholder="Tambahkan Harga" class="modal-input" :prefix="'Rp '"></InputNumber>
                <textarea v-model="price_list_desc" placeholder="Tambahkan Deskripsi" class="modal-textarea"></textarea>
                <label>Status:</label>
                <div class="flex flex-column gap-3">
                    <div v-for="category in categories" :key="category.key" class="flex align-items-center">
                        <RadioButton v-model="price_list_status" :inputId="category.key" name="dynamic" :value="category.key" />
                        <label :for="category.key" class="ml-2">{{ category.name }}</label>
                    </div>
                </div>
                <InputText v-model="price_list_order" placeholder="Tambahkan Urutan" class="modal-input"></InputText>
                <Dropdown v-model="price_list_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
            </div>
            <p v-if="validasi_price_media" class="validation-error text-red">{{ validasi_price_media }}</p>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="addDataData">Submit</button>
            </div>
        </div>
    </div>
    <div v-if="isModalOpenFile" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalFile">&times;</span>
            <h4>Tambah File</h4>
            <div class="modal-form-group">
                <FileUpload
                    name="file"
                    :url="`${baseURL}/api/${version}/media/upload_media_price/${uuid_price_list}`"
                    :onUpload="onUpload"
                    :multiple="true"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/*"
                    :maxFileSize="300 * 1024 * 1024"
                >
                </FileUpload>
            </div>
        </div>
    </div>
    <div v-if="isUpdateModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalUpdate">&times;</span>
            <h4>Ubah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="price_list_name" :value="price_list_name" class="modal-input"></InputText>
                <InputNumber v-model="price_list_price" :value="price_list_price" class="modal-input" :prefix="'Rp '"></InputNumber>
                <textarea v-model="price_list_desc" class="modal-textarea"></textarea>
                <label>Status:</label>
                <div class="flex flex-column gap-3">
                    <div v-for="category in categories" :key="category.key" class="flex align-items-center">
                        <RadioButton v-model="price_list_status" :inputId="category.key" name="dynamic" :value="category.key" />
                        <label :for="category.key" class="ml-2">{{ category.name }}</label>
                    </div>
                </div>
                <InputText v-model="price_list_order" :value="price_list_order" class="modal-input"></InputText>
                <Dropdown v-model="price_list_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
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
                    Apakah Anda yakin untuk menghapus nama Harga <span class="bold-text"> "{{ price_list_name }}"</span>
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
                        <Column field="price_list_price_formatted" header="Harga" class="name-column"></Column>
                        <Column field="price_list_desc" header="Desc" class="name-column"></Column>
                        <Column field="price_list_status_formatted" header="Status" class="name-column"></Column>
                        <Column field="price_list_order" header="Pesanan" class="name-column"></Column>
                        <Column field="price_list_business.business_name" header="Bisnis" class="name-column"></Column>
                        <Column header="File" class="name-column">
                            <!-- <template #body="slotProps">
                                <a :href="slotProps.data.price_list_media.media_url" style="display: flex; align-items: center; justify-content: center; flex-direction: column; color: blue">
                                    <i class="pi pi-file-o" style="font-size: 2rem"></i>
                                    <span style="font-size: 12px">{{ slotProps.data.price_list_media.media_name }}</span>
                                </a>
                            </template> -->
                            <template #body="slotProps">
                                <div class="action-icons-teams-foto">
                                    <a v-if="slotProps.data.price_list_media && slotProps.data.price_list_media.media_url" :href="slotProps.data.price_list_media.media_url" target="_blank">
                                        <i class="pi pi-file-o" style="font-size: 2rem"></i>
                                        <span style="font-size: 12px">{{ slotProps.data.price_list_media.media_name }}</span>
                                    </a>
                                    <span v-else style="color: red">Belum Upload File</span>
                                </div>
                            </template>
                        </Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-price">
                                    <Button icon="pi pi-upload" class="p-button-rounded p-button-info p-edit-icon" style="background-color: grey; border: none" @click="() => openModalUpload(rowData.data.price_list_uuid)"></Button>
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.price_list_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.price_list_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.action-icons-price {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
