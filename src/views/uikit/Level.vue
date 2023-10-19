<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount } from 'vue';
import axios from 'axios'; 
import { useLayout } from '@/layout/composables/layout';

const { contextPath } = useLayout();
const displayConfirmation = ref(false)
const items = ref([
    {
        label: 'Update',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Delete',
        icon: 'pi pi-times'
    },
    {
        separator: true
    },
    {
        label: 'Home',
        icon: 'pi pi-home'
    }
    
]);

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();
const productService = new ProductService();
const filters = ref(null);
const uuid = ref('a');
const level_nama = ref('a');
const order = ref('asc'); // 'asc' or 'desc'
const keyword = ref('');
const limit = ref(10);
const page = ref(1);
const apiUrl = '/api-endpoint';

onBeforeMount(() => 
{
  initFilters1();
  fetchData();
});

const fetchData = () => {
    const filterType = filters.value?.name?.type;

  // Set up dynamic filter based on type
  let dynamicFilter;
  switch (filterType) {
    case 'uuid':
      dynamicFilter = uuid.value;
      break;
    case 'level_nama':
      dynamicFilter = level_nama.value;
      break;
    // Add more cases for other filter types as needed
    default:
      dynamicFilter = null;
  }
  axios.get(apiUrl, {
    params: {
      filter: dynamicFilter,
      order : order.value,
      keyword: keyword.value,
      limit: limit.value,
      page: page.value,
    },
  })
  .then((response) => {
    const responseData = response.data;
    console.log(responseData);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
   // products.value = productsResponse.data;
    //customer1.value = customersResponse.data;
    loading1.value = false;
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;

    initFilters1();
};

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
const expandAll = () => {
    expandedRows.value = products.value.filter((p) => p.id);
};
const collapseAll = () => {
    expandedRows.value = null;
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const calculateCustomerTotal = (name) => {
    let total = 0;
    if (customer3.value) {
        for (let customer of customer3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
const openConfirmation = () => {
  displayConfirmation.value = true;
};

const closeConfirmation = () => {
  displayConfirmation.value = false;
};
</script>
<template>
            <div class="card">
                <h5>level</h5>
                <div class="formgroup-inline">
                    <div class="field">
                        <label for=" level_nama" class="p-sr-only">nama level</label>
                        <InputText id="level_nama" type="text" placeholder="nama level" />
                    </div>
                    <Button label="input"></Button>
                </div>
            </div>
         
        
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>level</h5>
                <DataTable
                    :value="customer1"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="rowsPerPage"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="loading1"
                    :filters="filters1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['name', 'representative.name',]"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />                         
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />   
                                 <function />
                            </span>
                        </div>
                        <div class="row-per-page">
                        <label>data per halaman:</label>
                        <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option1" name="option" value="10" v-model="rowsPerPage" />10
                            <label for="option1"></label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option2" name="option" value="20" v-model="rowsPerPage" />20
                            <label for="option2"></label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option3" name="option" value="50" v-model="rowsPerPage" />50
                            <label for="option3"></label>
                        </div>
                    </div>
                </div>
            </div>
                    </template>
                    <template #empty> data not found. </template>
                    <template #loading> Loadingdata. Please wait. </template>
                    <Column field="name" header="uuid" style="min-width: 12rem" :sortable="true">
                        <template #body="{ data }">
                            {{ data.uuid }}
                            {{ data.name }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by uuid" />
                        </template>
                    </Column>
                    <Column header="level nama" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" >{{ data.representative.name }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">level nama</div>
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any" class="p-column-filter">
                                <template #option="slotProps">
                                    <div class="p-multiselect-representative-option">
                                        <span style="margin-left: 0.5em; vertical-align: middle">{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <column> 
                        <template #body>
                            <Button label="detail" class="mr-2 mb-2"  />
                        </template>
                    </column>
                   <column>   
                    <template #body>
                            <Button label="update" class="p-button-success mr-2 mb-2" />       
                    </template>                              
                </column>
                <column>   
                    <template #body>
                      
                
                <Button label="Delete" icon="pi pi-trash" class="p-button-danger" style="width: auto" @click="openConfirmation" />
                <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" class="p-button-text" autofocus />
                    </template>
                </Dialog>
                 
                    </template>                              
                </column>
                   </DataTable>
            </div>
        </div>
        </div>
    </template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
