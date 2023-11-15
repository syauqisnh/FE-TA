<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const tableData = ref([]);

const limits = ref([
    { value: 5, label: "5 Data Perhalaman" },
    { value: 10, label: "10 Data Perhalaman" },
    { value: 25, label: "25 Data Perhalaman" },
    { value: 50, label: "50 Data Perhalaman" },
    { value: 100, label: "100 Data Perhalaman" }
]);


onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/level/get_all');
        console.log('API Response:', response.data);
        tableData.value = response.data.data || []; // Sesuaikan dengan struktur data dari API Anda
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
</script> 

<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <div class="container">
                    <span class="p-float-label">
                        <Dropdown class="limit-drop" v-model="selectedLimit" :options="limits" optionLabel="label"
                            optionValue="value">
                        </Dropdown>
                        <label for="dropdown">Limit Data</label>
                    </span>
                    <div class="data-table">
                        <h5>Data Table Level</h5>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="5" class="tabel">
                        <Column field="level_name" header="Name" class="name-column"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
