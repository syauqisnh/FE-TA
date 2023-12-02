<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import axios from 'axios';
const user_username = ref('');
const user_level = ref('');

const { onMenuToggle, contextPath } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

const CekDataLogin = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/me');

        user_username.value = response.data.name;
        user_level.value = response.data.level;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/Landing-2'); // Pengguna belum login, arahkan ke landing page
        } else {
            console.error('Error: ', error); // Kesalahan lain
        }
    }
};

onMounted(() => {
    CekDataLogin();
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `${contextPath}layout/images/Logo Bekantan.jpg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const onProfileClick = () => {
    topbarMenuActive.value = false;
    router.push('/Edit-profile');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <h1>
                BEKANTANJANTAN<span><span class="dashboard">All In One</span> Complete IT Solution</span>
            </h1>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onProfileClick()" class="p-link layout-topbar-button px-5">
                <span class="pi pi-user"></span>
                <i class="px-2">{{ user_username }}</i>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar {
    display: flex;
    align-items: center;
    height: 90px;
}

.layout-topbar-logo img {
    height: 65px !important;
}

.layout-topbar-logo h1 {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    margin: 0;
    color: rgb(107, 107, 107);
}

.layout-topbar-logo h1 span {
    font-size: 12px;
}

.dashboard {
    color: orange;
}
</style>
