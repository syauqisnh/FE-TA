<script setup>
import { ref, onMounted } from 'vue';
import CountryService from '@/service/CountryService';
import NodeService from '@/service/NodeService';


const tableData = ref([]);
const selectedRkow = ref(null);

const inputValue = ref('');
const countryService = new CountryService();
const nodeService = new NodeService();

const selectedLimit = ref(''); // default value
const limits = ref([
    { value: "lima-data", label: "5 Data Perhalaman" },
    { value: "sepuluh-data", label: "10 Data Perhalaman" },
    { value: "dualima-data", label: "25 Data Perhalaman" },
    { value: "limapuluh-data", label: "50 Data Perhalaman" },
    { value: "seratus-data", label: "100 Data Perhalaman" }
]);


const addNewItem = () => {
    const newItem = { name: inputValue.value };
    tableData.value = [...tableData.value, newItem];

    // Clear the form after adding the item
    inputValue.value = '';
};

onMounted(() => {
    // Populate the initial data
    tableData.value = [
        { name: 'John Doe' },
        { name: 'Jane Doe' },
        // Add more initial data as needed
    ];

    countryService.getCountries().then((data) => {
        // Use data as needed
    });

    nodeService.getTreeNodes().then((data) => {
        // Use data as needed
    });
});
const isModalOpen = ref(false);
const isModalOpenDel = ref(false);

// Function to open the modal
const openModal = () => {
    isModalOpen.value = true;
};

// Function to close the modal
const closeModal = () => {
    isModalOpen.value = false;
};

const openModalDel = () => {
    isModalOpenDel.value = true;
};

// Function to close the modal
const closeModalDel = () => {
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
                    <Button label="Yes" class="button-add" @click="addNewUpdate"></Button>
                </div>
                <div class="delete-no">
                    <Button label="No" class="button-add" @click="addNewUpdate"></Button>
                </div>
            </div>
        </div>
    </div>
    <div class="grid p-fluid">
        <div class="col-12 md:col-6">
            <div class="pembungkus1">
                <div class="card">
                    <div>
                        <h5>Create Data Module</h5>
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
                                    <input type="checkbox" name="checkbox-items" id="checkbox-items">
                                    <span>Super administrator</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="checkbox-items" id="checkbox-items">
                                    <span>Administrator</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="checkbox-items" id="checkbox-items">
                                    <span>Customer</span>
                                </div>
                            </div>
                        </div>
                        <div class="dropdown-order">
                            <h4>Urutkan Data:</h4>
                            <div class="order-input">
                                <div>
                                    <input type="radio" name="radio-items" id="radio-items">
                                    <span>Berdasarkan data terakhir<br>ditambahkan (Z-A)</span>
                                </div>
                                <div>
                                    <input type="radio" name="radio-items" id="radio-items">
                                    <span>Berdasarkan data pertama<br>ditambahkan (A-Z)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 md:col-6">
        </div>
        <div class="col-12">
            <div class="card">
                <div class="drop">
                    <span class="p-float-label">
                        <Dropdown class="limit-drop" v-model="selectedLimit" :options="limits" optionLabel="label"
                            optionValue="value">
                        </Dropdown>
                        <label for="dropdown">Limit Data</label>
                    </span>
                </div>
                <div class="data-table">
                    <h5>Data Table Module</h5>
                    <div class="search-container">
                        <InputText v-model="inputSearch" placeholder="Search..." class="keyword"></InputText>
                        <Button icon="pi pi-search" class="search-button"></Button>
                    </div>
                </div>
                <DataTable :value="tableData" :paginator="true" :rows="10" class="tabel">
                    <Column field="name" header="Name" class="name-column"></Column>
                    <!-- Hapus atribut header untuk menghilangkan label "Actions" -->
                    <Column class="actions">
                        <template #body="slotProps">
                            <!-- Wrapper untuk ikon-ikon -->
                            <div class="action-icons">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon"
                                    @click="openModal"></Button>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon"
                                    @click="openModalDel"></Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
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
    background-color: #007BFF;

    &:hover {
        background-color: #0056b3;
    }
}

.p-delete-icon {
    margin-left: 5px;
    background-color: #FF3A3A;

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
    border-color: #007BFF;
}

.pembungkus1 {
    display: flex;
    height: 100%;
}

.dropdown select:focus {
    outline: none;
    border-color: #007BFF;
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
.delete-yes .button-add{
    width: 125px;
    background-color: red;
}
.delete-yes .button-add:hover {
    background-color: rgb(255, 101, 101);
}
.delete-no .button-add{
    width: 125px;
    background-color: rgb(1, 162, 1);
}
.delete-no .button-add:hover {
    background-color: rgb(2, 212, 2);
}
</style>

