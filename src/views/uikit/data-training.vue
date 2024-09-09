<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '/public/layout/css/style.css';
import Swal from 'sweetalert2';

const tableData = ref([]);

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

const uuid_training = ref();
const training_intent = ref('');
const training_question = ref('');
const training_answer = ref('');

const validateData = ref('');
const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

let jumlah_row = 5;

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    training_intent.value = '';
    training_question.value = '';
    training_answer.value = '';
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    training_intent.value = '';
    training_question.value = '';
    training_answer.value = '';
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    training_intent.value = '';
    training_question.value = '';
    training_answer.value = '';
};

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

        // Parameter 'order' dikirim sebagai string dan bukan objek
        if (selectedOrder.value !== 'default') {
            params.append(`order[${'training_id'}]`, selectedOrder.value);
        }

        // Tambahkan parameter 'limit' jika bukan default
        if (selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        // Tambahkan parameter 'keyword' jika ada input
        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        const response = await axios.get(`http://localhost:5800/api/v1/training/get_all`, { params });
        console.table(response.data.data);

        if (response && response.data && response.data.data) {
            tableData.value = response.data.data;
            console.log('Data diambil:', tableData.value);
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
        const intent = training_intent.value;
        const questions = training_question.value; // Asumsi pertanyaan dipisahkan oleh koma
        const answers = training_answer.value; // Asumsi jawaban dipisahkan oleh koma

        const response = await axios.post(`http://localhost:5800/api/v1/training_admin`, {
            intent: intent,
            questions: questions,
            answers: answers
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
    uuid_training.value = value;
    const response = await axios.get(`http://localhost:5800/api/v1/training/${uuid_training.value}`);
    if (response) {
        training_intent.value = response.data.data.training_intent;
        training_question.value = response.data.data.training_question;
        training_answer.value = response.data.data.training_answer;
        openModalUpdate();
    }
};

const UpdateDataData = async () => {
    try {
        const intent = training_intent.value;
        const questions = training_question.value;
        const answers = training_answer.value;
        const response = await axios.put(`http://localhost:5800/api/v1/training/${uuid_training.value}`, {
            intent: intent,
            questions: questions,
            answers: answers
        });

        if (response) {
            closeModalUpdate();
            Swal.fire('Successfully', 'Sukses Mengupdate Data', 'success').then(() => {
                window.location.reload();
            });
            uuid_training.value = '';
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
    uuid_training.value = value;
    const response = await axios.get(`http://localhost:5800/api/v1/training/${uuid_training.value}`);
    if (response) {
        training_intent.value = response.data.data.training_intent;
        training_question.value = response.data.data.training_question;
        training_answer.value = response.data.data.training_answer;
        openModalDelete();
    }
};

const DeleteDataData = async () => {
    const response = await axios.delete(`http://localhost:5800/api/v1/training/${uuid_training.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
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
    <div>
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <p v-if="validateData" style="color: red; margin: 0">{{ validateData }}</p>
                <div class="modal-form-group">
                    <InputText v-model="training_intent" placeholder="Tambahkan Intent" class="modal-input"></InputText>
                    <textarea v-model="training_question" placeholder="Tambahkan Pertanyaan (pisahkan dengan |)" class="modal-input" rows="5" cols="50"></textarea>
                    <textarea v-model="training_answer" placeholder="Tambahkan Jawaban (pisahkan dengan |)" class="modal-input" rows="5" cols="50"></textarea>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="addDataData">Submit</button>
                </div>
            </div>
        </div>
        <div v-if="isUpdateModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModalUpdate">&times;</span>
                <h4>Ubah Data</h4>
                <p v-if="validateData" style="color: red; margin: 0">{{ validateData }}</p>
                <div class="modal-form-group">
                    <InputText v-model="training_intent" placeholder="Tambahkan Intent" class="modal-input"></InputText>
                    <textarea v-model="training_question" placeholder="Tambahkan Pertanyaan (pisahkan dengan |)" class="modal-input" rows="5" cols="50"></textarea>
                    <textarea v-model="training_answer" placeholder="Tambahkan Jawaban (pisahkan dengan |)" class="modal-input" rows="5" cols="50"></textarea>
                </div>
                <div class="modal-form-group">
                    <button class="modal-button-suceess" @click="UpdateDataData">Ubah data</button>
                </div>
            </div>
        </div>
        <div v-if="isDeleteModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModalDelete">&times;</span>
                <h4>Hapus Data</h4>
                <div class="modal-form-group">
                    <p>
                        Apakah Anda yakin untuk menghapus judul <span class="bold-text"> "{{ training_intent }}"</span>
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
        <div class="judul-halaman-scope">
            <h1>Data Training</h1>
        </div>
        <div class="grid p-fluid">
            <div class="col-12">
                <div class="card">
                    <div class="container">
                        <div class="top-tabel-scope">
                            <button class="create-data-scope" @click="openModal">Tambah Data</button>

                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>

                            <span class="p-float-label">
                                <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            </span>
                        </div>
                        <div class="data-table-scope">
                            <h5>Data Table scope</h5>
                            <div class="search-container-scope">
                                <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <Button icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="training_intent" header="Judul" class="name-column"></Column>
                            <Column field="training_question" header="Pertanyaan" class="name-column"></Column>
                            <Column field="training_answer" header="Jawaban" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="slotProps">
                                    <div class="action-icons-scope">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(slotProps.data.training_uuid)"></Button>
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(slotProps.data.training_uuid)"></Button>
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

<style>
.modal-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    box-sizing: border-box;
}
</style>
