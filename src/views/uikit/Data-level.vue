<script setup>
import { ref, onMounted } from 'vue';
import CountryService from '@/service/CountryService';
import NodeService from '@/service/NodeService';

const tableData = ref([]);
const selectedRkow = ref(null);

const inputValue = ref('');
const countryService = new CountryService();
const nodeService = new NodeService();

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
</script>
<template>
    <div class="grid p-fluid">
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
                <div class="dropdown-limit">
                    <div class="dropdown-limit2">
                        <select name="limit-data" class="limit-data" id="limit-data">
                            <option value="" disabled selected hidden>Limit Data</option>
                            <option value="lima-data">5 Data Perhalaman</option>
                            <option value="sepuluh-data">10 Data Perhalaman</option>
                            <option value="dualima-data">25 Data Perhalaman</option>
                            <option value="limapuluh-data">50 Data Perhalaman</option>
                            <option value="seratus-data">100 Data Perhalaman</option>
                        </select>
                    </div>
                </div>
                <div class="data-table">
                    <h5>Data Table Level</h5>
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
                                    @click="editItem(slotProps.rowData)"></Button>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon"
                                    @click="deleteItem(slotProps.rowData)"></Button>
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
    background: orange;
    border: none;
    color: white;
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
  margin-right: 20px; /* Sesuaikan jarak sesuai kebutuhan */
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

.limit-data option {
    margin: 10px;
    font-size: 14px; 
}
.limit-data:hover {
  border-color: #007BFF; /* Warna border saat hover */
}
</style>

