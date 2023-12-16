<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-scopes.css';
import '../uikit/css/data-teams.css'


const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

</script>

<template>
    <div class="judul-halaman-teams">
        <h1>Tim Atau Kelompok</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="business_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                <textarea v-model="business_desc" placeholder="Tambahkan Desc" class="modal-textarea"></textarea>
                <Dropdown v-model="team_scope" :options="teamOptions" optionLabel="label" optionValue="value" placeholder="Pilih Scope" class="modal-input"></Dropdown>
            </div>
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
            <p v-if="validasi_business_media" class="validation-error text-red">{{ validasi_business_media }}</p>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="addDataData">Submit</button>
            </div>
        </div>
    </div>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <div class="container">
                    <div class="top-tabel-teams">
                        <button class="create-data-teams" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>

                        <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Pilih Level" :filter="true">
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
                    <div class="data-table-teams">
                        <h5>Data Table Tim</h5>
                        <div class="search-container-teams">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-teams" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="level_name" header="Nama" class="name-column"></Column>
                        <Column field="level_name" header="Job Desc" class="name-column"></Column>
                        <Column field="level_name" header="Scope" class="name-column"></Column>
                        <Column field="level_name" header="Bisnis" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-teams">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="() => OpenModalEdit(rowData.data.level_uuid)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="() => openModalHapus(rowData.data.level_uuid)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
