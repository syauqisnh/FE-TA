<!-- eslint-disable no-unused-vars -->
<script setup>
import '/public/layout/css/data-bussiness.css';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
// import FileUpload from 'primevue/fileupload';
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();
const validateData = ref('');

const uuid_business = ref('');
const business_name = ref('');
const business_desc = ref('');
const business_province = ref('');
const business_regency = ref('');
const business_subdistrict = ref('');
const business_address = ref('');
const business_notelp = ref('');
const business_email = ref('');
const business_link_wa = ref('');
const detail_file = ref(null);

const tableData = ref([]);
const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');
const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

let jumlah_row = 5;

const isModalOpen = ref(false);
const isModalOpenFile = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;

    business_name.value = '';
    business_desc.value = '';
    business_province.value = '';
    business_regency.value = '';
    business_subdistrict.value = '';
    business_address.value = '';
    business_notelp.value = '';
    business_email.value = '';
    business_link_wa.value = '';
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

    business_name.value = '';
    business_desc.value = '';
    business_province.value = '';
    business_regency.value = '';
    business_subdistrict.value = '';
    business_address.value = '';
    business_notelp.value = '';
    business_email.value = '';
    business_link_wa.value = '';
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    business_name.value = '';
    business_desc.value = '';
    business_province.value = '';
    business_regency.value = '';
    business_subdistrict.value = '';
    business_address.value = '';
    business_notelp.value = '';
    business_email.value = '';
    business_link_wa.value = '';
};

const order = ref([
    { value: 'default', label: 'Urutkan data' },
    { value: 'asc', label: 'Urutkan dari data awal ditambahkan' },
    { value: 'desc', label: 'Urutkan dari data terbaru' }
]);

const limit = ref([
    { value: 'default', label: 'Limit Data' },
    { value: 5, label: '5 Data perhalaman' },
    { value: 10, label: '10 Data perhalaman' },
    { value: 25, label: '25 Data perhalaman' },
    { value: 50, label: '50 Data perhalaman' },
    { value: 100, label: '100 Data perhalaman' }
]);

onMounted(async () => {
    await DataMe();
});

const Ubahnilai_jumlah_row = async () => {
    if (selectedLimit.value === 'default') {
        jumlah_row = 5;
    } else {
        jumlah_row = parseInt(selectedLimit.value, 10);
    }
};

const DataMe = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/${version}/me`);

        if (response) {
            user_username.value = response.data.name;
            user_level.value = response.data.level;
            user_uuid.value = response.data.uuid;

            if (user_level.value == 'customer') {
                await fetchDataCustomer();
            } else {
                await fetchData();
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/landing-page');
        } else {
            console.error('Error: ', error);
        }
    }
};
const fetchData = async () => {
    try {
        const params = new URLSearchParams();

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'business_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/business/get_all`, {
            params: params
        });

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
            params.append(`business_customer`, user_uuid.value);
        }

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'business_id'}]`, selectedOrder.value);
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
        const response = await axios.get(`${baseURL}/api/${version}/business/get_all_customer`, {
            params: params
        });

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

const addDataData = async () => {
    try {
        const name = business_name.value;
        const desc = business_desc.value;
        const provinsi = business_province.value;
        const kabupaten = business_regency.value;
        const kecamatan = business_subdistrict.value;
        const alamat = business_address.value;
        const notelp = business_notelp.value;
        const email = business_email.value;
        const link_wa = business_link_wa.value;

        const response = await axios.post(`${baseURL}/api/${version}/business`, {
            business_name: name,
            business_desc: desc,
            business_province: provinsi,
            business_regency: kabupaten,
            business_subdistrict: kecamatan,
            business_address: alamat,
            business_notelp: notelp,
            business_email: email,
            business_link_wa: link_wa
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

const OpenModalEdit = async (value) => {
    uuid_business.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/business/${uuid_business.value}`);
        if (response) {
            business_name.value = response.data.data.business_name;
            business_desc.value = response.data.data.business_desc;
            business_province.value = response.data.data.business_province;
            business_regency.value = response.data.data.business_regency;
            business_subdistrict.value = response.data.data.business_subdistrict;
            business_address.value = response.data.data.business_address;
            business_notelp.value = response.data.data.business_notelp;
            business_email.value = response.data.data.business_email;
            business_link_wa.value = response.data.data.business_link_wa;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};

const UpdateDataData = async () => {
    try {
        const name = business_name.value;
        const desc = business_desc.value;
        const provinsi = business_province.value;
        const kabupaten = business_regency.value;
        const kecamatan = business_subdistrict.value;
        const alamat = business_address.value;
        const notelp = business_notelp.value;
        const email = business_email.value;
        const link_wa = business_link_wa.value;
        const response = await axios.put(`${baseURL}/api/${version}/business/${uuid_business.value}`, {
            business_name: name,
            business_desc: desc,
            business_province: provinsi,
            business_regency: kabupaten,
            business_subdistrict: kecamatan,
            business_address: alamat,
            business_notelp: notelp,
            business_email: email,
            business_link_wa: link_wa
        });

        if (response) {
            closeModalUpdate();
            Swal.fire('Successfully', 'Sukses Mengupdate Data', 'success').then(() => {
                window.location.reload();
            });
            uuid_business.value = '';
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

const openModalHapus = async (value) => {
    uuid_business.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/business/${uuid_business.value}`);
        if (response) {
            business_name.value = response.data.data.business_name;
            business_desc.value = response.data.data.business_desc;
            business_province.value = response.data.data.business_province;
            business_regency.value = response.data.data.business_regency;
            business_subdistrict.value = response.data.data.business_subdistrict;
            business_address.value = response.data.data.business_address;
            business_notelp.value = response.data.data.business_notelp;
            business_email.value = response.data.data.business_email;
            business_link_wa.value = response.data.data.business_link_wa;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/business/${uuid_business.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
};

const openModalUpload = async (value) => {
    uuid_business.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/media/${uuid_business.value}`);
        const mediaDetail = response.data.data;
        openModalFile(mediaDetail);
        detail_file.value = response.data.data;
    } catch (error) {
        console.error('Error media:', error);
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

const customField = (rowData) => {
    return rowData.business_customer ? rowData.business_customer.customer_full_name || rowData.business_customer.user_full_name : '';
};
</script>

<template>
    <div class="judul-halaman-business">
        <h1>Data Bisnis</h1>
    </div>
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>

            <div class="modal-form-group">
                <InputText v-model="business_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                <textarea v-model="business_desc" placeholder="Tambahkan Desc" class="modal-textarea"></textarea>
                <InputText v-model="business_province" placeholder="Tambahkan Provinsi" class="modal-input"></InputText>
                <InputText v-model="business_regency" placeholder="Tambahkan Kabupaten" class="modal-input"></InputText>
                <InputText v-model="business_subdistrict" placeholder="Tambahkan Kecamatan" class="modal-input"></InputText>
                <InputText v-model="business_address" placeholder="Tambahkan Alamat" class="modal-input"></InputText>
                <InputText v-model="business_notelp" placeholder="Tambahkan Nohp" class="modal-input"></InputText>
                <InputText v-model="business_email" placeholder="Tambahkan Email" class="modal-input"></InputText>
                <InputText v-model="business_link_wa" placeholder="Tambahkan Link Wa" class="modal-input"></InputText>
            </div>
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
                    :url="`${baseURL}/api/${version}/media/upload_media_business/${uuid_business}`"
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
                <InputText v-model="business_name" :value="business_name" class="modal-input"></InputText>
                <textarea v-model="business_desc" class="modal-textarea"></textarea>
                <InputText v-model="business_province" :value="business_province" class="modal-input"></InputText>
                <InputText v-model="business_regency" :value="business_regency" class="modal-input"></InputText>
                <InputText v-model="business_subdistrict" :value="business_subdistrict" class="modal-input"></InputText>
                <InputText v-model="business_address" :value="business_address" class="modal-input"></InputText>
                <InputText v-model="business_notelp" :value="business_notelp" class="modal-input"></InputText>
                <InputText v-model="business_email" :value="business_email" class="modal-input"></InputText>
                <InputText v-model="business_link_wa" :value="business_link_wa" class="modal-input"></InputText>
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
                    Apakah Anda yakin untuk menghapus nama Customer <span class="bold-text"> "{{ business_name }}"</span>
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
                    <div class="top-tabel-business">
                        <button class="create-data-business" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown v-if="user_level === 'administrator' || user_level === 'super administrator'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            <Dropdown v-if="user_level === 'customer'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchDataCustomer"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-business">
                        <h5>Data Table Bisnis</h5>
                        <div class="search-container-business">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-business" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="business_name" header="Nama" class="name-column"></Column>
                        <Column field="business_desc" header="Desc" class="name-column"></Column>
                        <Column field="business_province" header="Provinsi" class="name-column"></Column>
                        <Column field="business_regency" header="Kabupaten" class="name-column"></Column>
                        <Column field="business_subdistrict" header="Kecamatan" class="name-column"></Column>
                        <Column field="business_address" header="Alamat" class="name-column"></Column>
                        <Column field="business_notelp" header="No Hp" class="name-column"></Column>
                        <Column field="business_email" header="Email" class="name-column"></Column>
                        <Column header="WhatsApp" class="name-column">
                            <template #body="slotProps">
                                <a :href="slotProps.data.business_link_wa" style="display: flex; align-items: center; justify-content: center; flex-direction: column; color: #25d366">
                                    <i class="pi pi-whatsapp" style="font-size: 2rem"></i>
                                    <span>WhatsApp</span>
                                </a>
                            </template>
                        </Column>
                        <Column :field="customField" header="Pengguna" class="name-column"></Column>
                        <Column header="File" class="name-column">
                            <template #body="slotProps">
                                <div class="action-icons-teams-foto">
                                    <a v-if="slotProps.data.business_media && slotProps.data.business_media.media_url" :href="slotProps.data.business_media.media_url" target="_blank">
                                        <i class="pi pi-file-o" style="font-size: 2rem"></i>
                                        <span style="font-size: 12px">{{ slotProps.data.business_media.media_name }}</span>
                                    </a>
                                    <span v-else style="color: red;">Belum Upload File</span>
                                </div>
                            </template>
                        </Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-business">
                                    <Button icon="pi pi-upload" class="p-button-rounded p-button-info p-edit-icon" style="background-color: grey; border: none;" @click="() => openModalUpload(rowData.data.business_uuid)"></Button>
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.business_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.business_uuid)"></Button>
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
.action-icons-business {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
