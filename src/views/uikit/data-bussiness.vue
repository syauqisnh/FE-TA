<!-- eslint-disable no-unused-vars -->
<script setup>
import '../uikit/css/data-bussiness.css'
</script>

<template>
    <div class="judul-halaman-bussiness">
        <h1>Data Bisnis</h1>
    </div>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <div class="container">
                    <div class="top-tabel-bussiness">
                        <button class="create-data-bussiness" @click="openModal">Tambah Data</button>

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
                    <div class="data-table-bussiness">
                        <h5>Data Table Bisnis</h5>
                        <div class="search-container-bussiness">
                            <InputText v-model="inputSearch" placeholder="Search..." class="keyword" @keydown.enter="fetchData"></InputText>
                            <Button icon="pi pi-search" class="search-button-bussiness" @click="fetchData"></Button>
                        </div>
                    </div>
                    <DataTable :value="tableData" :paginator="true" :rows="jumlah_row" class="tabel">
                        <Column field="level_name" header="Nama" class="name-column"></Column>
                        <Column class="actions">
                            <template #body="rowData">
                                <div class="action-icons-bussiness">
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
