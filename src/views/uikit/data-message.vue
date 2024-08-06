\
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '/public/layout/css/style.css';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();
const validateData = ref('');

const tableData = ref([]);

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

const uuid_message = ref('');
const message_question = ref('');
const message_answer = ref('');

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const scope_uuid = ref(null);

let jumlah_row = 5;

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

            if (user_level.value == 'administrator') {
                await fetchData();
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

        if (selectedOrder.value !== 'default') {
            params.append(`order[${'message_id'}]`, selectedOrder.value);
        }

        if (selectedLimit.value && selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        // Buat request ke backend
        const response = await axios.get(`http://localhost:5800/api/v1/message/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response) {
            tableData.value = response.data.data || [];

            console.log(tableData.value);

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

const OpenModalEdit = async (value) => {
    uuid_message.value = value;
    try {
        const response = await axios.get(`http://localhost:5800/api/v1/message/${uuid_message.value}`);
        if (response) {
            message_question.value = response.data.data.message_question;
            message_answer.value = response.data.data.message_answer;
            openModalUpdate();
        }
    } catch (error) {
        console.error('Error saat mengedit data:', error);
    }
};

const UpdateDataData = async () => {
    try {
        const question = message_question.value;
        const answer = message_answer.value;
        const response = await axios.put(`http://localhost:5800/api/v1/message/${uuid_message.value}`, {
            message_question: question,
            message_answer: answer
        });

        if (response) {
            closeModalUpdate();
            Swal.fire('Successfully', 'Sukses Mengupdate Data', 'success').then(() => {
                window.location.reload();
            });
            uuid_message.value = '';
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
    uuid_message.value = value;
    try {
        const response = await axios.get(`http://localhost:5800/api/v1/message/${uuid_message.value}`);
        if (response) {
            message_question.value = response.data.data.message_question;
            message_answer.value = response.data.data.message_answer;
            openModalDelete();
        }
    } catch (error) {
        console.error('Error saat menghapus data:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`http://localhost:5800/api/v1/message/${uuid_message.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
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
    <div>
        <div class="judul-halaman-scope">
            <h1>Data Message</h1>
        </div>

        <!-- modal update -->
        <div v-if="isUpdateModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModalUpdate">&times;</span>
                <h4>Ubah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="message_question" placeholder="Perubahan Pesan" class="modal-input"></InputText>
                    <InputText v-model="message_answer" placeholder="Perubahan Jawaban" class="modal-input"></InputText>
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
                        Apakah Anda yakin untuk menghapus pertanyaan ini <span class="bold-text"> "{{ message_question }}"</span>
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
                        <div class="top-tabel-scope">
                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>
                            <span class="p-float-label">
                                <Dropdown v-if="user_level === 'administrator' || user_level === 'super administrator'" class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData">
                                </Dropdown>
                            </span>
                        </div>
                        <div class="data-table-scope">
                            <h5>Data Table scope</h5>
                            <div class="search-container-scope">
                                <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="message_question" header="Pesan" class="name-column"></Column>
                            <Column field="message_answer" header="Jawaban" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons-scope">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.message_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.message_uuid)"></Button>
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
