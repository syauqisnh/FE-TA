<script setup>
import { ref, onMounted } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import axios from 'axios';

const customer = ref('');
const admin = ref('');

const DataMe = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/me');

        if (response) {
            if (response.data.level == 'customer') {
                customer.value = response.data.level;
            } else {
                admin.value = response.data.level;
            }
        }
    } catch (error) {
        console.error('Error: ', error); // Kesalahan lain
    }
};

onMounted(() => {
    DataMe();
});

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Data Master',
        items: [
            { label: 'Data Level', icon: 'pi pi-fw pi-server', to: '/uikit/Data-level' },
            { label: 'Data Module', icon: 'pi pi-fw pi-server', to: '/uikit/data-module' },
            { label: 'Data Permission', icon: 'pi pi-fw pi-server', to: '/uikit/data-permission' },
            { label: 'Data Access', icon: 'pi pi-fw pi-server', to: '/uikit/data-access' },
            { label: 'Data Media', icon: 'pi pi-fw pi-server', to: '/uikit/data-media' },
            { label: 'Data Customer', icon: 'pi pi-fw pi-server', to: '/uikit/data-customer' },
            { label: 'Data User', icon: 'pi pi-fw pi-server', to: '/uikit/data-user' }
        ]
    },

    {
        label: 'Data Menu Customer',
        items: [
            { label: 'Bisnis', icon: 'pi pi-fw pi-chart-line', to: '/uikit/data-bussiness' },
            { label: 'Ruang Lingkup', icon: 'pi pi-fw pi-globe', to: '/uikit/data-scopes' },
            { label: 'Tim atau Kelompok', icon: 'pi pi-fw pi-users', to: '/uikit/data-teams' },
            { label: 'Daftar Harga', icon: 'pi pi-fw pi-tag', to: '/uikit/data-price-list' },
            { label: 'TNC', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/data-tnc' }
        ]
    },
    {
        // label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                to: '/logout'
            }
        ]
    }
]);

const model_customer = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },

    {
        label: 'Data Menu Customer',
        items: [
            { label: 'Bisnis', icon: 'pi pi-fw pi-chart-line', to: '/uikit/data-bussiness' },
            { label: 'Ruang Lingkup', icon: 'pi pi-fw pi-globe', to: '/uikit/data-scopes' },
            { label: 'Tim atau Kelompok', icon: 'pi pi-fw pi-users', to: '/uikit/data-teams' },
            { label: 'Daftar Harga', icon: 'pi pi-fw pi-tag', to: '/uikit/data-price-list' },
            { label: 'TNC', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/data-tnc' }
        ]
    },
    {
        // label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                to: '/logout'
            }
        ]
    }
]);
</script>

<template>
    <ul v-if="admin" class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
    <ul v-if="customer" class="layout-menu">
        <template v-for="(item, i) in model_customer" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped></style>
