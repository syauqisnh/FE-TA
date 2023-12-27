<script setup>
import '../uikit/css/data-gallery.css';
</script>


<template>
    <div class="judul-halaman-price">
        <h1>Gambar</h1>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <!-- Close button -->
            <span class="close" @click="closeModal">&times;</span>
            <h4>Tambah Data</h4>
            <div class="modal-form-group">
                <InputText v-model="price_list_name" placeholder="Tambahkan Nama" class="modal-input"></InputText>
                <InputNumber v-model="price_list_price" inputId="currency-id" mode="currency" currency="IDR" locale="id-ID" :style="{ width: '100%' }" />
                <textarea v-model="price_list_desc" placeholder="Tambahkan Deskripsi" class="modal-textarea"></textarea>
                <label>Status:</label>
                <div class="radio-group">
                    <RadioButton v-model="price_list_status" value="active" label="Aktif"></RadioButton>
                    <label for="active">Ditampilkan</label>
                </div>
                <div class="radio-group">
                    <RadioButton v-model="price_list_status" value="inactive" label="Tidak Aktif"></RadioButton>
                    <label for="inactive">Dinonaktifkan</label>
                </div>
                <InputText v-model="price_list_order" placeholder="Tambahkan Urutan" class="modal-input"></InputText>
                <Dropdown v-model="price_list_business" :options="businesOptions" optionLabel="label" optionValue="value" placeholder="Pilih Bisnis" class="modal-input"></Dropdown>
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
            <p v-if="validasi_price_media" class="validation-error text-red">{{ validasi_price_media }}</p>
            <div class="modal-form-group">
                <button class="modal-button-suceess" @click="addDataData">Submit</button>
            </div>
        </div>
    </div>

    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <div class="container">
                    <div class="top-tabel-price">
                        <button class="create-data-price" @click="openModal">Tambah Data</button>

                        <span class="p-float-label">
                            <Dropdown class="limit-drop" :options="limit" optionLabel="label" optionValue="value" v-model="selectedLimit" @change="Ubahnilai_jumlah_row"> </Dropdown>
                        </span>

                        <span class="p-float-label">
                            <Dropdown class="order-drop" :options="order" optionLabel="label" optionValue="value" v-model="selectedOrder" @change="fetchData"> </Dropdown>
                        </span>
                    </div>
                    <div class="data-table-price">
                        <h5>Data Table Harga</h5>
                        <div class="search-container-price">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-price" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="price_list_name" header="Name" class="name-column"></Column>
                        <Column field="price_list_price" header="Desc" class="name-column"></Column>
                        <Column field="price_list_desc" header="Bisnis" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-price">
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
