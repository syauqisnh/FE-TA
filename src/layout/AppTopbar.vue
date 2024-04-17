<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import axios from 'axios';

const user_username = ref('');
const user_fullName = ref('');
const user_level = ref('');
const detail_foto = ref([]);
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const uuid = ref('');
const router = useRouter();

const baseURL = import.meta.env.VITE_API_BASE_URL;
const version = import.meta.env.VITE_API_BASE_VERSION;

const { onMenuToggle } = useLayout();

const CekDataLogin = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/me');
        user_username.value = response.data.name;
        user_fullName.value = response.data.fullName;
        user_level.value = response.data.level;
        uuid.value = response.data.uuid;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/');
        } else {
            console.error('Error: ', error); // Kesalahan lain
        }
    }
};

const CekDataMedia = async (value) => {
    uuid.value = value;
    try {
        const response = await axios.get(`${baseURL}/api/${version}/media/${uuid.value}`);
        detail_foto.value = response.data.data;
    } catch (error) {
        console.error('Error media:', error);
    }
};

const userAvatar = computed(() => {
    return detail_foto.value[0]?.media_url || '/public/layout/images/Profile.jpeg';
});


onMounted(async () => {
    try {
        await CekDataLogin();
        await CekDataMedia(uuid.value);
        bindOutsideClickListener();
    } catch (error) {
        console.error('Error during component initialization:', error);
    }
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const onProfileClick = () => {
    topbarMenuActive.value = false;
    router.push(`/dashboard/edit-profile/${uuid.value}`);
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
        <router-link to="/">
            <div class="logo-bekantan">
                <a href="">
                    <h1>USAHAMIKRO<span>SITE</span></h1>
                </a>
            </div>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onProfileClick()" class="button-profile">
                <img class="profile-topbar" :src="userAvatar" alt="foto-profile">
                <div class="person">
                    <p class="username">{{ user_username }}</p>
                    <p class="fullname">{{ user_fullName }}</p>
                </div>
                <i class="pi pi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.button-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    margin: 0 auto;
}

.button-profile p {
    margin: 0 auto;
    margin-left: 15px;
    margin-right: 15px;
}

.layout-topbar {
    display: flex;
    align-items: center;
    height: 90px;
}

.logo-bekantan {
    text-align: center;
}

.username {
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
    font-size: 15px;
}
.fullname {
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
    font-size: 12px;
    color: gray;
    font-weight: bold;
}

.logo-bekantan a h1 {
    margin: 0 auto;
    color: orange;
    font-weight: bold;
}

.logo-bekantan a h1 span {
    color: rgb(112, 194, 227);
}

.profile-topbar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

</style>
