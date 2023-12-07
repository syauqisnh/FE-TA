<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-media.css';

const tableData = ref([]);
const inputSearch = ref('');
const selectedOrder = ref('default');
const selectedLimit = ref('default');

const Hakaksestolak = ref('');
const Hakakses = ref('');

let jumlah_row = 5;

onMounted(async () => {
    fetchData();
});

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

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/media/get_all', {
            params: {
                order: { media_id: selectedOrder.value },
                keyword: inputSearch.value
            }
        });

        console.log('Respon API:', response.data);
        tableData.value = response.data.data || [];
        Hakakses.value = response.data.message;
    } catch (error) {
        console.error('Error mengambil data:', error);
        Hakaksestolak.value = error.response.data.msg;
    }
};
</script>
<template>
    <div v-if="Hakaksestolak">
        <p>{{ Hakaksestolak }}</p>
    </div>

    <div v-if="Hakakses">
        <div class="judul-halaman-media">
            <h1>Data Media</h1>
        </div>
        <div class="grid p-fluid">
            <div class="col-12">
                <div class="card">
                    <div class="container">
                        <div class="top-tabel-media">
                            <span class="p-float-label">
                                <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                            </span>

                            <span class="p-float-label">
                                <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                            </span>

                            <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Pilih Media" :filter="true">
                                <label for="dropdown">Filter Data</label>
                                <template #value="slotProps">
                                    <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                        <div>{{ option.name }}</div>
                                    </div>
                                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                                        <div class="p-1">Filter</div>
                                    </template>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <div>{{ slotProps.option.name }}</div>
                                    </div>
                                </template>
                            </MultiSelect>
                        </div>
                        <div class="data-table-media">
                            <h5>Data Table Media</h5>
                            <div class="search-container-media">
                                <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                                <Button icon="pi pi-search" class="search-button-media" @click="fetchData"></Button>
                            </div>
                        </div>
                        <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                            <Column field="media_table" header="Tabel" class="name-column"></Column>
                            <Column field="media_name" header="Nama" class="name-column"></Column>
                            <Column field="media_hash_name" header="Nama Belakang" class="name-column"></Column>
                            <Column field="media_category" header="Kategori" class="name-column"></Column>
                            <Column field="media_extensi" header="Extensi" class="name-column"></Column>
                            <Column field="media_size" header="Size" class="name-column"></Column>
                            <Column field="media_url" header="URL" class="name-column"></Column>
                            <Column field="media_metadata" header="Meta Data" class="name-column"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
