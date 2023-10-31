<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';

import CountryService from '@/service/CountryService';
import NodeService from '@/service/NodeService';

const tableData = ref([]);
const inputValue = ref('');
const inputUpdate = ref('');
const inputSearch = ref('');
const levelNameFilters = ref([]);
const sortOrder = ref(''); // '' means no sorting, 'desc' means descending, and 'asc' means ascending

// const inputValue = ref('');
const countryService = new CountryService();
const nodeService = new NodeService();

const selectedLimit = ref('5'); // default value
const limits = ref([
    { value: 5, label: '5 Data Perhalaman' },
    { value: 10, label: '10 Data Perhalaman' },
    { value: 25, label: '25 Data Perhalaman' },
    { value: 50, label: '50 Data Perhalaman' },
    { value: 100, label: '100 Data Perhalaman' }
]);
const selectedorder1 = ref(''); // default value
const order1 = ref([
    { value: 'asc', label: 'asc' },
    { value: 'desc', label: 'desc' }
]);
const selectedorder2 = ref(''); // default value
const order2 = ref([
    { value: 'asc', label: 'asc' },
    { value: 'desc', label: 'desc' }
]);
const selectedorder3 = ref(''); // default value
const order3 = ref([
    { value: 'asc', label: 'asc' },
    { value: 'desc', label: 'desc' }
]);
const selectedorder4 = ref(''); // default value
const order4 = ref([
    { value: 'asc', label: 'asc' },
    { value: 'desc', label: 'desc' }
]);
const multiselectValue = ref(null);
const multiselectValues = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);
const selectedpage = ref('1'); // default value

const perPage = ref(selectedLimit);
const totalRecords = ref(0);

const currentPage = ref(selectedpage); // Tambahkan currentPage dan initialize dengan 1

// Computed property to dynamically generate the list of pages
const dynamicPageList = computed(() => {
    const totalPages = Math.ceil(totalRecords.value / perPage.value);
    return Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => ({ value, label: value.toString() }));
});
watch([totalRecords, perPage], () => {
    console.log('Total pages:', dynamicPageList.value);
});

onMounted(async () => {
    await fetchData();
    watch([levelNameFilters, sortOrder, selectedLimit], fetchData);
});

// Fungsi untuk mengambil data dari server
const fetchData = async () => {
    try {
        const perPageValue = parseInt(perPage.value, 10);
        if (isNaN(perPageValue) || perPageValue <= 0) {
            console.error('Nilai perPage tidak valid.');
            return;
        }

        const searchQuery = inputSearch.value ? `&keyword=${encodeURIComponent(inputSearch.value)}` : '';
        const filterQuery = levelNameFilters.value.length > 0 ? `&filter[level_name]=${encodeURIComponent(levelNameFilters.value.join(','))}` : '';
        const sortQuery = sortOrder.value ? `&order[level_id]=${sortOrder.value}` : ''; // Modifikasi di sini
        const response = await axios.get(`http://localhost:9900/api/v1/level/get_all?limit=${perPageValue}&page=${currentPage.value}${searchQuery}${filterQuery}${sortQuery}`);

        tableData.value = response.data.data || [];
        totalRecords.value = response.data.pages.total || 0;
    } catch (error) {
        console.error('Error saat mengambil data:', error);
    }
};

const updateSortOrder = (order) => {
    sortOrder.value = order;
    fetchData();
};

const searchData = async () => {
    // Reset currentPage to 1 when performing a new search
    currentPage.value = 1;
    await fetchData();
};

// Fungsi untuk menangani perubahan halaman
const onPageChange = (newPage) => {
    // Handle the page change, for example, fetch data for the new page
    console.log(`Page changed to ${newPage}`);
    // fetchData(newPage);
    selectedpage.value = newPage;
};

const addNewItem = async () => {
    try {
        const newItem = { level_name: inputValue.value };
        const response = await axios.post('http://localhost:9900/api/v1/level', newItem);

        // Gunakan data dari respons untuk mengupdate tabel
        tableData.value = [...tableData.value, response.data];

        // Bersihkan formulir setelah menambahkan item
        inputValue.value = '';
    } catch (error) {
        console.error('Error saat menambahkan item baru:', error);
        // Tangani error sesuai kebutuhan (misalnya, tampilkan pesan ke pengguna)
    }
};

const isModalOpen = ref(false);
const isModalOpenDel = ref(false);
const level_uuid = ref('level_uuid.value');

// Function to open the modal
const openModal = () => {
    isModalOpen.value = true;
};

// Function to close the modal
const closeModal = () => {
    isModalOpen.value = false;
};

const deleteData = async () => {
    try {
        console.log('Deleting data...', level_uuid.value);
        if (level_uuid.value) {
            const response = await axios.delete(`http://localhost:9900/api/v1/level/${level_uuid.value}`);
            console.log('Data deleted successfully:', response.data);
            closeModalDel();
        }
    } catch (error) {
        console.error('Failed to delete data:', error);
    }
};

const openModalDel = (uuid) => {
    level_uuid.value = uuid;
    isModalOpenDel.value = true;
};

const closeModalDel = () => {
    level_uuid.value = null; // Reset level_uuid setelah menutup modal delete
    isModalOpenDel.value = false;
};
</script>
<template>
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Edit Nama Anda:</h4>
            <div class="pembungkus-edit">
                <div class="edit">
                    <InputText v-model="inputUpdate" placeholder="Name" class="input-text"></InputText>
                </div>
                <div class="edit-button">
                    <Button label="Update" class="button-add" @click="addNewUpdate"></Button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isModalOpenDel" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalDel">&times;</span>
            <h4>Delete Data</h4>
            <p>Apakah anda yakin akan menghapus data?</p>
            <div class="pembungkus-delete">
                <div class="delete-yes">
                    <Button label="Yes" class="button-add" @click="deleteData(level_uuid.value)"></Button>
                </div>
                <div class="delete-no">
                    <Button label="No" class="button-add" @click="closeModalDel"></Button>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="grid p-fluid">
        <div class="col-12 md:col-6">
            <div class="pembungkus1">
                <div class="card">
                    <div>
                        <h5>Create Data Level</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-2">
                                <InputText v-model="inputValue" placeholder="Name" class="input-text"></InputText>
                            </div>
                            <div class="col-12 mb-2">
                                <Button label="Create" class="button-add" @click="addNewItem"></Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="dropdown">
                        <div class="filter-section">
                            <h4>Filter</h4>
                            <div class="filter-input">
                                <div>
                                    <input type="checkbox" v-model="levelNameFilters" value="Super administrator">
                                    <span>Super administrator</span>
                                </div>
                                <div>
                                    <input type="checkbox" v-model="levelNameFilters" value="Administrator">
                                    <span>Administrator</span>
                                </div>
                                <div>
                                    <input type="checkbox" v-model="levelNameFilters" value="Customer">
                                    <span>Customer</span>
                                </div>

                            </div>
                        </div>
                        <div class="dropdown-order">
                            <h4>Urutkan Data:</h4>
                            <div class="order-input">
                                <div>
                                    <input type="radio" name="radio-items" id="radio-items-desc" value="desc"
                                        v-model="sortOrder">
                                    <span>Berdasarkan data terakhir ditambahkan (Z-A)</span>
                                </div>
                                <div>
                                    <input type="radio" name="radio-items" id="radio-items-asc" value="asc"
                                        v-model="sortOrder">
                                    <span>Berdasarkan data pertama ditambahkan (A-Z)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

    <div class="col-12 md:col-6"></div>
    <div class="col-12">
        <div class="card">
            <Toolbar>
                <template v-slot:start>
                    <Dropdown class="limit-drop" v-model="selectedLimit" :options="limits" optionLabel="label" optionValue="value"> </Dropdown>
                    <label for="dropdown">Limit Data</label>
                    <Dropdown class="limit-drop" v-model="selectedorder1" :options="order1" optionLabel="label" optionValue="value"> </Dropdown>
                    <label for="dropdown">urutan data berdasarkan waktu</label>
                    <Dropdown class="limit-drop" v-model="selectedorder2" :options="order2" optionLabel="label" optionValue="value"> </Dropdown>
                    <label for="dropdown">urutan data berdasarkan testimonial</label>
                    <Dropdown class="limit-drop" v-model="selectedorder3" :options="order3" optionLabel="label" optionValue="value"> </Dropdown>
                    <label for="dropdown">urutan data berdasarkan customer</label>
                    <Dropdown class="limit-drop" v-model="selectedorder4" :options="order4" optionLabel="label" optionValue="value"> </Dropdown>
                    <label for="dropdown">urutan data berdasarkan bussiness</label>
                    <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Select Countries" :filter="true">
                        <label for="dropdown">filter data</label>
                        <template #value="slotProps">
                            <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                <div>{{ option.name }}</div>
                            </div>
                            <template v-if="!slotProps.value || slotProps.value.length === 0">
                                <div class="p-1">filter</div>
                            </template>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Toolbar>

            <div class="data-table">
                <h5>Data Table Level</h5>
                <div class="search-container">
                    <InputText v-model="inputSearch" placeholder="Search..." class="keyword"></InputText>
                    <Button icon="pi pi-search" class="search-button" @click="searchData"></Button>
                </div>
            </div>
            <DataTable :value="tableData" :paginator="true" :rows="10" :totalRecords="totalRecords" @onPage="onPageChange" class="tabel">
                <Column field="tbl_testimonial" header="testimonial" class="name-column" ></Column>
                <Column field="tbl_customer" header="customer" class="name-column" ></Column>
                <Column field="tbl_bussiness" header="bussiness" class="name-column" ></Column>
                <Column class="actions">
                    <template #body="slotProps">
                        <div class="action-icons">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="openModal"></Button>
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="openModalDel"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.data-table {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.filter-input input span {
    display: flex;
    align-items: center;
}

.filter-input input {
    transform: scale(1.5);
    margin-top: 15px;
    margin-right: 10px;
    margin-bottom: 15px;
}

.data-halaman span {
    font-size: 15px;
    margin-right: 10px;
}

.judul-data-halaman {
    font-weight: bold;
}

.pembungkus1 .card {
    width: 100%;
    height: 100%;
    margin-right: 10px;
    margin-left: 10px;
}

.keyword {
    padding-right: 40px;
    width: 100%;
    border: 1px solid gray;
}

.search-button {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;
    color: grey;
}

.search-button:hover {
    background-color: rgb(255, 189, 65);
}

.name-column {
    display: flex;
    align-items: center;
}

.action-icons {
    display: flex;
    justify-content: flex-end; // Posisikan ikon ke kanan
    align-items: center;
    width: 100%; // Gunakan seluruh lebar kolom
    padding-right: 20%; // Menambahkan padding kanan 20px, Anda bisa menyesuaikan nilainya sesuai keinginan
}

.search-container {
    display: flex;
    align-items: center;
    position: relative;
    width: 25%;
}

.p-edit-icon {
    margin-right: 5px;
    background-color: #007bff;

    &:hover {
        background-color: #0056b3;
    }
}

.p-delete-icon {
    margin-left: 5px;
    background-color: #ff3a3a;

    &:hover {
        background-color: #b32f2f;
    }
}

.button-add {
    background-color: orange;
    border: none;
    margin-top: 10px;
    margin-bottom: 10px;
}

.button-add:hover {
    background-color: rgb(255, 189, 65);
}

.dropdown select {
    width: 200px;
    height: 30px;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 20px;
    /* Adjust as needed */
    margin-bottom: 15px;
    background-color: white;
    color: #333;
    cursor: pointer;
}

.dropdown select:hover {
    border-color: #007bff;
}

.pembungkus1 {
    display: flex;
    height: 100%;
}

.dropdown select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.dropdown {
    display: flex;
    justify-content: space-around;
}

.dropdown h4 {
    text-align: center;
}

.col-12 {
    width: 100%;
}

.order-input input span {
    display: flex;
    align-items: center;
}

.order-input input {
    transform: scale(1.5);
    margin-top: 15px;
    margin-right: 10px;
    margin-bottom: 15px;
}

.dropdown-limit {
    display: inline-block;
    margin-right: 20px;
    /* Sesuaikan jarak sesuai kebutuhan */
}

.limit-data {
    background-color: #fff;
    border: 1px solid gray;
    padding: 10px;
    font-size: 15px;
    cursor: pointer;
    width: 150px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
}

.custom-dropdown {
    width: 200px;
    position: relative;
    font-family: Arial, sans-serif;
}

.custom-dropdown select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    appearance: none;
    /* Removes the default styling */
    -webkit-appearance: none;
    /* Removes the default styling for Chrome and Safari */
    -moz-appearance: none;
    /* Removes the default styling for Firefox */
    background-color: #fff;
    cursor: pointer;
    font-size: 16px;
}

/* Arrow styling */
.custom-dropdown::before {
    content: '▼';
    /* Unicode arrow symbol */
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    /* Makes the arrow unclickable */
}

.drop {
    margin-bottom: 20px;
}

.limit-drop {
    width: 20%;
}

.modal {
    display: flex; // gunakan flexbox
    align-items: center; // menyelaraskan konten vertikal di tengah
    justify-content: center; // menyelaraskan konten horizontal di tengah
    position: fixed; // posisi tetap untuk menutupi seluruh viewport
    z-index: 1;
    top: 0;
    left: 0; // pastikan modal menutupi seluruh viewport
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); // tambahkan overlay transparan untuk meningkatkan tampilan
    overflow: auto;
}

.modal-content {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    width: 80%; // Anda dapat mengubah ini sesuai kebutuhan
    max-width: 500px; // tambahkan max-width agar modal tidak terlalu lebar di layar besar
    border-radius: 20px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.edit .input-text {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
}

.edit-button button {
    background-color: rgb(1, 162, 1);
    width: 100%;
}

.edit-button button:hover {
    background-color: rgb(2, 212, 2);
}

.pembungkus-delete {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.delete-yes .button-add {
    width: 125px;
    background-color: red;
}

.delete-yes .button-add:hover {
    background-color: rgb(255, 101, 101);
}

.delete-no .button-add {
    width: 125px;
    background-color: rgb(1, 162, 1);
}

.delete-no .button-add:hover {
    background-color: rgb(2, 212, 2);
}
</style>
