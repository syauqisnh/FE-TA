<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '/public/layout/css/data-schedule.css';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const router = useRouter();

const tableData = ref([]);

const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

const user_username = ref('');
const user_level = ref('');
const user_uuid = ref('');

const uuid_schedule = ref('');
const uuid_business = ref('');
const uuid_layanan = ref('');
const uuid_dokter = ref('');
const DataBusiness = ref([]);
const DataLayanan = ref([]);
const DataDokter = ref([]);
const DataDate = ref([]);
const DataTime = ref([]);
const businessOptions = ref([]);
const layananOptions = ref([]);
const dokterOptions = ref([]);
const dateOptions = ref([]);
const multiselectOptionsTime = ref([]);
const uuid_practices = ref([]);
const schedule_name_pasien = ref('');
const schedule_noHp_pasien = ref('');
const schedule_address = ref('');
const schedule_status = ref('');
const schedule_date = ref(null);
const schedule_start_practice = ref('');

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

let jumlah_row = 5;

const updateOptions = () => {
    businessOptions.value = [{ label: 'Pilih Tujuan', value: null }, ...DataBusiness.value.map((index) => ({ label: index.business_name, value: index.business_uuid }))];
    layananOptions.value = [{ label: 'Pilih Layanan', value: null }, ...DataLayanan.value.map((index) => ({ label: index.service_name, value: index.service_uuid }))];
    dokterOptions.value = [{ label: 'Pilih Dokter', value: null }, ...DataDokter.value.map((index) => ({ label: index.teams_practice_as.team_name, value: index.doctor_name }))];
    dateOptions.value = [{ label: 'Pilih Date', value: null }, ...DataDate.value.map((index) => ({ label: index.practice_date, value: index.practice_date }))];

    // multiselectOptionsTime.value = [...DataTime.value.map((index) => ({ label: index.practice_start, value: index.practice_start }))];
};

const fetchDataOption = async () => {
    try {
        const getBusines = await axios.get(`${baseURL}/api/${version}/business/get_all`);
        const getTime = await axios.get(`${baseURL}/api/${version}/practice/get_all`);
        DataBusiness.value = getBusines.data.data;
        DataTime.value = getTime.data.data;

        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const fetchDataOptionCustomer = async () => {
    try {
        const businessParams = new URLSearchParams();
        if (user_uuid.value !== '') {
            businessParams.append('business_customer', user_uuid.value);
        }

        const teamParams = new URLSearchParams();
        if (user_uuid.value !== '') {
            teamParams.append('team_business', user_uuid.value);
        }

        const serviceParams = new URLSearchParams();
        if (user_uuid.value !== '') {
            serviceParams.append('service_business', user_uuid.value);
        }

        const practiceParams = new URLSearchParams();
        if (user_uuid.value !== '') {
            practiceParams.append('practice_business', user_uuid.value);
        }

        const getBusines = await axios.get(`${baseURL}/api/${version}/business/get_all_customer`, {
            params: businessParams
        });
        const getDokter = await axios.get(`${baseURL}/api/${version}/teams/get_all_customer`, {
            params: teamParams
        });
        const getLayanan = await axios.get(`${baseURL}/api/${version}/layanan/get_all_customer`, {
            params: serviceParams
        });
        const getTime = await axios.get(`${baseURL}/api/${version}/practice/get_all_customer`, {
            params: practiceParams
        });

        DataBusiness.value = getBusines.data.data;
        DataDokter.value = getDokter.data.data;
        DataLayanan.value = getLayanan.data.data;
        DataTime.value = getTime.data.data;
        updateOptions();
    } catch (error) {
        console.error('Error mengambil data:', error);
    }
};

const aa = async () => {
    const getLayanan = await axios.get(`${baseURL}/api/${version}/layanan_business/${uuid_business.value}`);
    DataLayanan.value = getLayanan.data;
    updateOptions();
};
const bb = async () => {
    const getDokter = await axios.get(`${baseURL}/api/${version}/practice_layanan/${uuid_layanan.value}`);
    DataDokter.value = getDokter.data.data;
    updateOptions();
};
const cc = async () => {
    const getDate = await axios.get(`${baseURL}/api/${version}/practice_dokter/${uuid_dokter.value}`);
    DataDate.value = getDate.data.data;
    updateOptions();
};

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
                await fetchDataOptionCustomer();
            } else {
                await fetchData();
                await fetchDataOption();
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

        if (selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        const response = await axios.get(`${baseURL}/api/${version}/schedule/get_all`, {
            params: params
        });

        console.log('Respon API:', response);

        if (response) {
            tableData.value = response.data.data || [];
            console.log(tableData.value);
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
            params.append(`schedule_business`, user_uuid.value);
        }

        if (selectedOrder.value !== 'default') {
            params.append(`order[${'schedule_id'}]`, selectedOrder.value);
        }

        if (selectedLimit.value !== 'default') {
            params.append('limit', selectedLimit.value);
        }

        if (inputSearch.value.trim()) {
            params.append('keyword', inputSearch.value.trim());
        }

        const response = await axios.get(`${baseURL}/api/${version}/schedule/get_all_customer`, {
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

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    schedule_name_pasien.value = '';
    schedule_noHp_pasien.value = '';
    schedule_address.value = '';
    schedule_date.value = null;
    schedule_start_practice.value = '';
    uuid_practices.value = [];
    uuid_business.value = '';
    uuid_dokter.value = '';
    uuid_layanan.value = '';
    DataLayanan.value = [];
    layananOptions.value = [{ label: 'Pilih Layanan', value: null }];
    updateOptions();
};

const openModalUpdate = () => {
    isUpdateModalOpen.value = true;
};

const closeModalUpdate = () => {
    isUpdateModalOpen.value = false;
    schedule_name_pasien.value = '';
    schedule_noHp_pasien.value = '';
    schedule_address.value = '';
    schedule_date.value = null;
    schedule_start_practice.value = '';
    uuid_practices.value = [];
    uuid_business.value = '';
    uuid_dokter.value = '';
    uuid_layanan.value = '';
    DataLayanan.value = [];
    layananOptions.value = [{ label: 'Pilih Layanan', value: null }];
    updateOptions();
};

const openModalDelete = () => {
    isDeleteModalOpen.value = true;
};

const closeModalDelete = () => {
    isDeleteModalOpen.value = false;
    schedule_name_pasien.value = '';
    schedule_noHp_pasien.value = '';
    schedule_address.value = '';
    schedule_date.value = null;
    schedule_start_practice.value = '';
    uuid_practices.value = [];
    uuid_business.value = '';
    uuid_dokter.value = '';
    uuid_layanan.value = '';
    DataLayanan.value = [];
    layananOptions.value = [{ label: 'Pilih Layanan', value: null }];
    updateOptions();
};

const limit = ref([
    { value: 'default', label: 'Limit Data' },
    { value: 5, label: '5 Data perhalaman' },
    { value: 10, label: '10 Data perhalaman' },
    { value: 25, label: '25 Data perhalaman' },
    { value: 50, label: '50 Data perhalaman' },
    { value: 100, label: '100 Data perhalaman' }
]);

const formattedTableData = computed(() => {
    return tableData.value.map((schedule) => ({
        ...schedule,
        schedule_status: schedule.schedule_status === 'Y' ? 'Selesai' : 'Belum Periksa',
        schedule_finish_practice: schedule.schedule_finish_practice ? schedule.schedule_finish_practice : 'Berproses',
        schedule_date: schedule.schedule_date ? moment(schedule.schedule_date).format('YYYY-MM-DD') : ''
    }));
});

const addSchedule = async () => {
    try {
        const payload = {
            schedule_name_pasien: schedule_name_pasien.value,
            schedule_noHp_pasien: schedule_noHp_pasien.value,
            schedule_address: schedule_address.value,
            schedule_date: schedule_date.value,
            schedule_start_practice: schedule_start_practice.value,
            schedule_practice: uuid_practices.value[0].value,
            schedule_business: uuid_business.value,
            schedule_doctor: uuid_dokter.value
        };

        const response = await axios.post(`${baseURL}/api/${version}/schedule`, payload);

        if (response.data.success) {
            console.log('masuk', payload);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message
            });
            fetchData();
            closeModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: response.data.message
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response ? error.response.data.message : 'Internal server error'
        });
    }
};

const statusOptions = ref([
    { value: 'Y', label: 'Selesai' },
    { value: 'N', label: 'Belum Periksa' }
]);

const OpenModalEdit = async (scheduleUuid) => {
    uuid_schedule.value = scheduleUuid;

    try {
        const response = await axios.get(`${baseURL}/api/${version}/schedule/${uuid_schedule.value}`);
        const data = response.data.data;

        schedule_name_pasien.value = data.schedule_name_pasien;
        schedule_noHp_pasien.value = data.schedule_noHp_pasien;
        schedule_address.value = data.schedule_address;
        uuid_business.value = data.schedule_business.business_uuid;
        uuid_layanan.value = data.schedule_practice.doctor_position.service_uuid;
        uuid_dokter.value = data.schedule_doctor.team_uuid;
        schedule_date.value = data.schedule_date;
        schedule_start_practice.value = data.schedule_start_practice;
        schedule_status.value = data.schedule_status;

        console.log('layanan ', uuid_layanan.value);

        openModalUpdate();
    } catch (error) {
        console.error('Error saat mengambil data untuk diedit:', error);
    }
};

const updateSchedule = async () => {
    try {
        const payload = {
            schedule_name_pasien: schedule_name_pasien.value,
            schedule_noHp_pasien: schedule_noHp_pasien.value,
            schedule_address: schedule_address.value,
            schedule_date: schedule_date.value,
            schedule_start_practice: schedule_start_practice.value,
            schedule_practice: uuid_practices.value[0].value,
            schedule_business: uuid_business.value,
            schedule_doctor: uuid_dokter.value,
            schedule_status: schedule_status.value
        };

        console.log('Dataaa', payload);

        const response = await axios.put(`${baseURL}/api/${version}/schedule/${uuid_schedule.value}`, payload);

        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message
            });
            fetchData();
            closeModalUpdate();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: response.data.message
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response ? error.response.data.message : 'Internal server error'
        });
    }
};

const openModalHapus = async (scheduleUuid) => {
    uuid_schedule.value = scheduleUuid;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/schedule/${uuid_schedule.value}`);
        const data = response.data.data;

        schedule_name_pasien.value = data.schedule_name_pasien;
        schedule_noHp_pasien.value = data.schedule_noHp_pasien;
        schedule_address.value = data.schedule_address;
        uuid_business.value = data.schedule_business.uuid;
        uuid_layanan.value = data.schedule_practice.doctor_position.service_uuid;
        uuid_dokter.value = data.schedule_doctor.team_uuid;
        schedule_date.value = data.schedule_date;
        schedule_start_practice.value = data.schedule_start_practice;
        schedule_status.value = data.schedule_status;

        openModalDelete();
    } catch (error) {
        console.error('Error saat mengambil data untuk diedit:', error);
    }
};
const DeleteDataData = async () => {
    const response = await axios.delete(`${baseURL}/api/${version}/schedule/${uuid_schedule.value}`);

    if (response) {
        closeModalDelete();
        Swal.fire('Successfully', 'Sukses Menghapus Data', 'success').then(() => {
            window.location.reload();
        });
    }
};

watch(
    uuid_business,
    (newPracticeUuid) => {
        if (newPracticeUuid) {
            aa();
        } else {
            DataLayanan.value = [];
            layananOptions.value = [{ label: 'Pilih Layanan', value: null }];
        }
    },
    { immediate: true }
);

watch(
    uuid_layanan,
    (newPracticeUuid) => {
        if (newPracticeUuid) {
            bb();
        } else {
            DataDokter.value = [];
            dokterOptions.value = [{ label: 'Pilih Dokter', value: null }];
        }
    },
    { immediate: true }
);

watch(
    uuid_dokter,
    (newPracticeUuid) => {
        if (newPracticeUuid) {
            cc();
        } else {
            DataDate.value = [];
            dateOptions.value = [{ label: 'Pilih Date', value: null }];
        }
    },
    { immediate: true }
);

const isTimeDropdownDisabled = computed(() => !schedule_date.value);

watch(schedule_date, (newDate) => {
    if (newDate) {
        const selectedPracticeUuid = uuid_dokter.value;
        if (selectedPracticeUuid) {
            multiselectOptionsTime.value = DataTime.value.filter((time) => time.practice_date === newDate && time.doctor_name.team_uuid === selectedPracticeUuid).map((time) => ({ label: time.practice_start, value: time.practice_start }));
        } else {
            multiselectOptionsTime.value = [];
        }
    } else {
        multiselectOptionsTime.value = [];
        schedule_start_practice.value = null;
    }
});

watch(schedule_start_practice, (newDate) => {
    if (newDate) {
        const selecteddoctorUuid = uuid_dokter.value;
        const selectedlayananUuid = uuid_layanan.value;
        const selectedDateUuid = schedule_date.value;

        uuid_practices.value = DataTime.value
            .filter((time) => time.practice_start === newDate && time.doctor_name.team_uuid === selecteddoctorUuid && time.doctor_position.service_uuid === selectedlayananUuid && time.practice_date === selectedDateUuid)
            .map((time) => ({ value: time.practice_uuid }));
    }
});
</script>

<template>
    <div>
        <div class="judul-halaman-scope">
            <h1>Data Pemesanan Antrian</h1>
        </div>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h4>Tambah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="schedule_name_pasien" placeholder="Nama Pasien" class="modal-input"></InputText>
                    <InputText v-model="schedule_noHp_pasien" placeholder="Nomor HP Pasien" class="modal-input">
                    </InputText>
                    <InputText v-model="schedule_address" placeholder="Alamat" class="modal-input"></InputText>
                    <Dropdown v-model="uuid_business" :options="businessOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Tujuan" class="modal-input"></Dropdown>
                    <Dropdown v-model="uuid_layanan" :options="layananOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Layanan" class="modal-input"></Dropdown>
                    <Dropdown v-model="uuid_dokter" :options="dokterOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Dokter" class="modal-input"></Dropdown>
                    <Dropdown v-model="schedule_date" :options="dateOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Tanggal" class="modal-input"></Dropdown>
                    <Dropdown v-model="schedule_start_practice" :options="multiselectOptionsTime" optionLabel="label"
                        optionValue="value" placeholder="Pilih Waktu" class="modal-input"
                        :disabled="isTimeDropdownDisabled"></Dropdown>
                </div>
                <div class="modal-form-group">
                    <Button class="modal-button-suceess" @click="addSchedule">Submit</Button>
                </div>
            </div>
        </div>

        <div v-if="isUpdateModalOpen" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close" @click="closeModalUpdate">&times;</span>
                <h4>Ubah Data</h4>
                <div class="modal-form-group">
                    <InputText v-model="schedule_name_pasien" placeholder="Nama Pasien" class="modal-input"></InputText>
                    <InputText v-model="schedule_noHp_pasien" placeholder="Nomor HP Pasien" class="modal-input">
                    </InputText>
                    <InputText v-model="schedule_address" placeholder="Alamat" class="modal-input"></InputText>
                    <Dropdown v-model="uuid_business" :options="businessOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Tujuan" class="modal-input" disabled></Dropdown>
                    <Dropdown v-model="uuid_layanan" :options="layananOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Layanan" class="modal-input" disabled></Dropdown>
                    <Dropdown v-model="uuid_dokter" :options="dokterOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Dokter" class="modal-input" disabled></Dropdown>
                    <Dropdown v-model="schedule_date" :options="dateOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Tanggal" class="modal-input"></Dropdown>
                    <Dropdown v-model="schedule_start_practice" :options="multiselectOptionsTime" optionLabel="label"
                        optionValue="value" placeholder="Pilih Waktu" class="modal-input"
                        :disabled="isTimeDropdownDisabled"></Dropdown>
                    <Dropdown v-model="schedule_status" :options="statusOptions" optionLabel="label" optionValue="value"
                        placeholder="Pilih Status" class="modal-input"></Dropdown>
                </div>
                <div class="modal-form-group">
                    <Button class="modal-button-suceess" @click="updateSchedule">Ubh data</Button>
                </div>
            </div>
        </div>

        <div v-if="isDeleteModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModalDelete">&times;</span>
                <h4>Hapus Data</h4>
                <div class="modal-form-group">
                    <p>
                        Apakah Anda yakin untuk menghapus scope bisnis <span class="bold-text"> "{{ schedule_name_pasien
                            }}"</span>
                    </p>
                </div>
                <div class="modal-form-group">
                    <Button class="modal-button-suceess" @click="DeleteDataData">Hapus data</Button>
                </div>
                <div class="modal-form-group">
                    <Button class="modal-button-danger" @click="closeModalDelete">Batal</Button>
                </div>
            </div>
        </div>

        <div class="grid p-fluid">
            <div class="col-12">
                <div class="card">
                    <div class="container">
                        <div class="top-tabel-schedule">
                            <button class="create-data-schedule" @click="openModal">Tambah Data</button>

                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value"
                                    v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>
                        </div>
                        <div class="data-table-scope">
                            <h5>Data Table Jadwal</h5>
                            <div class="search-container-scope">
                                <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'"
                                    v-model="inputSearch" placeholder="Search..." class="keyword"
                                    @keydown.enter="fetchData"></InputText>
                                <InputText v-if="user_level === 'customer'" v-model="inputSearch"
                                    placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer">
                                </InputText>
                                <Button v-if="user_level === 'administrator' || user_level === 'super administrator'"
                                    icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                                <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope"
                                    @click="fetchDataCustomer"></Button>
                            </div>
                        </div>
                        <DataTable :value="formattedTableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="schedule_queue" header="Antrian" class="name-column"></Column>
                            <Column field="schedule_name_pasien" header="Name" class="name-column"></Column>
                            <Column field="schedule_noHp_pasien" header="No Hp" class="name-column"></Column>
                            <Column field="schedule_address" header="Alamat" class="name-column"></Column>
                            <Column field="schedule_business.business_name" header="Bisnis" class="name-column">
                            </Column>
                            <Column field="schedule_practice.doctor_position.service_name" header="Layanan"
                                class="name-column"></Column>
                            <Column field="schedule_doctor.team_name" header="Dokter" class="name-column"></Column>
                            <Column field="schedule_date" header="Tanggal" class="name-column"></Column>
                            <Column field="schedule_start_practice" header="Waktu mulai" class="name-column"></Column>
                            <Column field="schedule_finish_practice" header="Waktu selesai" class="name-column">
                            </Column>
                            <Column field="schedule_status" header="Status" class="name-column"></Column>
                            <Column class="actions">
                                <template #body="rowData">
                                    <div class="action-icons-scope">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon"
                                            @click="() => OpenModalEdit(rowData.data.schedule_uuid)"></Button>
                                        <Button icon="pi pi-trash"
                                            class="p-button-rounded p-button-danger p-delete-icon"
                                            @click="() => openModalHapus(rowData.data.schedule_uuid)"></Button>
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
