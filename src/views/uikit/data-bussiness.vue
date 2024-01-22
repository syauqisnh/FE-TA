<!-- eslint-disable no-unused-vars -->
<script setup>
import '../uikit/css/data-bussiness.css';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import FileUpload from 'primevue/fileupload';

const router = useRouter();

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
const business_media = ref('');
const validasi_business_media = ref('');

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
    business_media.value = '';
    validasi_business_media.value = '';
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
    console.log(user_level.value);
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
        const response = await axios.get('http://localhost:9900/api/v1/me');

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
        const response = await axios.get(`http://localhost:9900/api/v1/business/get_all`, {
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
        const response = await axios.get(`http://localhost:9900/api/v1/business/get_all_customer`, {
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

const addDataData = async () => {
    const name = business_name.value;
    const desc = business_desc.value;
    const provinsi = business_province.value;
    const kabupaten = business_regency.value;
    const kecamatan = business_subdistrict.value;
    const alamat = business_address.value;
    const notelp = business_notelp.value;
    const email = business_email.value;
    const link_wa = business_link_wa.value;
    const media = business_media.value;

    if (media == '') {
        validasi_business_media.value = '*Mohon upload file Anda dahulu';
    } else {
        const response = await axios.post('http://localhost:9900/api/v1/business', {
            business_name: name,
            business_desc: desc,
            business_province: provinsi,
            business_regency: kabupaten,
            business_subdistrict: kecamatan,
            business_address: alamat,
            business_notelp: notelp,
            business_email: email,
            business_link_wa: link_wa,
            business_media: media
        });

        if (response) {
            closeModal();
            window.location.reload();
        }
    }
};

const OpenModalEdit = async (value) => {
    uuid_business.value = value;
    // console.log(value)
    try {
        const response = await axios.get(`http://localhost:9900/api/v1/business/${uuid_business.value}`);
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
    const name = business_name.value;
    const desc = business_desc.value;
    const provinsi = business_province.value;
    const kabupaten = business_regency.value;
    const kecamatan = business_subdistrict.value;
    const alamat = business_address.value;
    const notelp = business_notelp.value;
    const email = business_email.value;
    const link_wa = business_link_wa.value;
    const response = await axios.put(`http://localhost:9900/api/v1/business/${uuid_business.value}`, {
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
        window.location.reload();
        uuid_business.value = '';
    }
};

const openModalHapus = async (value) => {
    uuid_business.value = value;
    try {
        const response = await axios.get(`http://localhost:9900/api/v1/business/${uuid_business.value}`);
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
    const response = await axios.delete(`http://localhost:9900/api/v1/business/${uuid_business.value}`);

    if (response) {
        closeModalDelete();
        window.location.reload();
    }
};

const onUpload = async (event) => {
    if (event.xhr.status === 200) {
        const responseText = event.xhr.responseText;

        // Parse response text menjadi objek JavaScript
        const responseObj = JSON.parse(responseText);

        // Sekarang Anda dapat mengakses media_uuid dari responseObj
        const mediaUuid = responseObj.data.media_uuid;
        business_media.value = mediaUuid;
    } else {
        console.error('Upload failed', event);
    }
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
                <FileUpload
                    name="file"
                    url="http://localhost:9900/api/v1/media/upload_media"
                    :onUpload="onUpload"
                    :multiple="true"
                    accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, image/*, video/*, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

    <div v-if="isModalOpenFile" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalFile">&times;</span>
            <h4>Tambah File</h4>
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
            <div class="modal-form-group">
                <button class="modal-button-suceess">Submit</button>
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
                                <a :href="slotProps.data.business_link_wa" style="color: blue">
                                    <img src="demo/images/product/wa2.png" alt="WhatsApp Image" style="width: 60px; height: 60px; margin-right: 5px" />
                                </a>
                            </template>
                        </Column>
                        <Column field="business_customer.customer_full_name" header="Customer" class="name-column"></Column>
                        <Column header="File" class="name-column">
                            <template #body="slotProps">
                                <a :href="slotProps.data.business_media.media_url" style="color: blue">
                                    <img src="demo/images/product/ddc.png" alt="WhatsApp Image" style="width: 80px; height: 50px; margin-right: 5px" />
                                </a>
                            </template>
                        </Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-business">
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
