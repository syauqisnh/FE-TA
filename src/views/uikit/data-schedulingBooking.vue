<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import '../uikit/css/data-teams.css';
</script>

<template>
    <div class="judul-halaman-teams">
        <h1>Data Scheduling</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="team_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                <textarea v-model="team_job_desc" placeholder="Tambahkan Desc" class="modal-textarea"></textarea>
                <Dropdown v-model="team_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                <Dropdown v-model="team_scope" :options="scopeOptions" optionLabel="label" optionValue="value" placeholder="Pilih Scope" class="modal-input"></Dropdown>
            </div>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="addDataData">Submit</button>
            </div>
        </div>
    </div>
    <div v-if="isUpdateModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModalUpdate">&times;</span>
            <h4>Ubah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="team_name" placeholder="Tambahkan Name" class="modal-input"></InputText>
                <textarea v-model="team_job_desc" placeholder="Tambahkan Job Desc" class="modal-textarea"></textarea>
                <Dropdown v-model="team_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
                <Dropdown v-model="team_scope" :options="scopeOptions" optionLabel="label" optionValue="value" placeholder="Pilih Scope" class="modal-input"></Dropdown>
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
                    Apakah Anda yakin untuk menghapus data teams <span class="bold-text"> "{{ team_business.business_name }}"</span>
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
    <div v-if="isModalOpenProfile" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModalProfile">&times;</span>
            <h4>Add Gambar</h4>
            <div class="modal-form-group">
                <FileUpload name="file" :url="`${baseURL}/api/${version}/media/upload_media_profile/${uuid_team}`" :onUpload="onUpload" :multiple="true" accept="image/*" :maxFileSize="300 * 1024 * 1024"> </FileUpload>
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
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-teams">
                        <h5>Data Table Scheduling</h5>
                        <div class="search-container-teams">
                            <InputText v-if="user_level === 'administrator' || user_level === 'super administrator'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <InputText v-if="user_level === 'customer'" v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchDataCustomer"></InputText>
                            <Button v-if="user_level === 'administrator' || user_level === 'super administrator'" icon="pi pi-search" class="search-button-scope" @click="fetchData"></Button>
                            <Button v-if="user_level === 'customer'" icon="pi pi-search" class="search-button-scope" @click="fetchDataCustomer"></Button>
                        </div>
                    </div>
                    <DataTable :value="serviceData" :paginator="true" :rows="10" class="tabel">
                        <Column field="service_name" header="Nama" class="name-column"></Column>
                        <Column field="service_description" header="Deskripsi" class="name-column"></Column>
                        <Column field="service_status" header="Status" class="name-column"></Column>
                        <Column field="start_time" header="Waktu Mulai" class="name-column"></Column>
                        <Column field="end_time" header="Waktu Selesai" class="name-column"></Column>
                        <Column field="location" header="Lokasi" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-services">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-edit-icon" @click="editService(rowData)"></Button>
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-delete-icon" @click="deleteService(rowData)"></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.action-icons-teams {
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapper-img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    overflow: hidden;
}

.wrapper-img-old {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    overflow: hidden;
    border: 2px solid green;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.d-none {
    display: none;
}
</style>
