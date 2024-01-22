<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
    router.push('/auth/Login-2');
};

const goToRegister = () => {
    router.push('/auth/register');
};

import '../pages/css/landing.css';

const { contextPath } = useLayout();

const logoUrl = computed(() => {
    return `${contextPath}layout/images/logo-bekantan-v3.png`;
});

const isMenuOpen = ref(false);

// const toggleMenu = () => {
//     isMenuOpen.value = !isMenuOpen.value;
// };

// const isResponsiveMode = computed(() => {
//     return window.innerWidth <= 768;
// });

window.addEventListener('resize', () => {
    isMenuOpen.value = false;
});

const templateList = ref([
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 1',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 2',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 3',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 4',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 5',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 1',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 2',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 3',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 4',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 5',
        userCount: '500'
    }
]);

const itemsPerPage = 6;
const currentPage = ref(1);

const displayedTemplates = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = currentPage.value * itemsPerPage;
    return templateList.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(templateList.value.length / itemsPerPage));

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const scrollToSection = (sectionId) => {
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        window.scrollTo({
            top: targetSection.offsetTop - navbarHeight, // Gunakan offset navbar
            behavior: 'smooth'
        });
    }
};
</script>

<template>
    <div class="container">
        <div class="navbar">
            <div class="logo-bekantan">
                <img :src="logoUrl" alt="logo" />
            </div>
            <div class="menu">
                <ul>
                    <li><a @click="() => scrollToSection('beranda')">Beranda</a></li>
                    <li><a @click="() => scrollToSection('Tentang')">Tentang Kami</a></li>
                    <li><a @click="() => scrollToSection('produk')">Produk</a></li>
                    <li><a @click="() => scrollToSection('harga')">Harga</a></li>
                </ul>
            </div>
            <div class="login-reg">
                <div class="login">
                    <button @click="goToLogin">Login</button>
                </div>
                <div class="register">
                    <button @click="goToRegister">Daftar</button>
                </div>
            </div>
        </div>
        <div id="beranda" class="content">
            <div class="text-content">
                <h1>
                    Membuat Jejak Digital <br />
                    Mengesankan untuk <span>Bisnis Fotografer Anda</span>
                </h1>
                <p>
                    Bekantan Jantan adalah pilihan yang tepat bagi para fotografer yang ingin menciptakan jejak digital mereka dengan <br />
                    kombinasi kreativitas tinggi dan teknologi terkini.
                </p>
            </div>
            <div class="button-content">
                <button @click="goToRegister">Ayo Daftar Sekarang Juga</button>
                <p>Temukan potensi Anda dalam dunia fotografi bersama Bekantan Jantan.</p>
            </div>
        </div>
        <div id="Tentang" class="content-2">
            <h1>Apa Itu Web Builder <span>Company Profile?</span></h1>
            <p>
                Web Builder Company Profile adalah layanan yang menyediakan platform untuk membangun dan mengelola halaman profil perusahaan secara online. Dengan fokus khusus pada bidang jasa fotografi, web builder ini memberikan solusi praktis bagi
                fotografer yang ingin meningkatkan kehadiran mereka di dunia digital.
            </p>
            <p>
                Dengan menggunakan Web Builder Company Profile untuk jasa fotografer, Anda dapat dengan mudah membuat dan mengelola halaman profil perusahaan Anda. Ini termasuk menampilkan portofolio foto terbaik Anda, memberikan informasi tentang
                layanan yang Anda tawarkan, dan berbagi cerita unik mengenai pengalaman fotografi Anda.
            </p>
            <p>
                Keuntungan menggunakan layanan ini meliputi desain template yang responsif dan menarik secara visual, memungkinkan potensi klien melihat karya-karya Anda dengan mudah. Selain itu, integrasi media sosial dan fitur lainnya mempermudah
                berbagi konten dan meningkatkan interaksi dengan pengunjung.
            </p>
            <p>Dengan Web Builder Company Profile untuk fotografer, Anda dapat fokus pada passion Anda dalam fotografi, sementara platform ini membantu membangun citra profesional dan menjangkau lebih banyak klien potensial secara online.</p>
        </div>
        <div id="produk" class="content-3">
            <h1>Jenis-Jenis Template <span>Company Profile</span></h1>
            <p class="p-judul">
                Company profile adalah alat penting dalam memperkenalkan dan mempromosikan bisnis Anda. <br />
                Berikut ini beberapa jenis template yang bisa Anda pertimbangkan:
            </p>
            <div class="template-container">
                <div v-for="(template, index) in displayedTemplates" :key="index" class="template-item">
                    <img :src="template.imageUrl" alt="Template" />
                    <div class="desc">
                        <div class="user-count">
                            <span class="p-desc">{{ template.description }}</span>
                            <div class="icon-card">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span>Jumlah Pengguna {{ template.userCount }}</span>
                            </div>
                        </div>
                        <div class="button-card">
                            <button class="shop">
                                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                            </button>
                            <button>
                                <i class="fa fa-eye" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination-buttons">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <div id="harga" class="content-4">
            <div class="judul-content-4">
                <h1>
                    <span>Dapatkan situs web</span> yang berkelas <br />
                    dengan harga yang sesuai dengan anggaran bisnis Anda.
                </h1>
            </div>
            <div class="card-container">
                <Card class="card-items">
                    <template #title>
                        <h1>3 bulan</h1>
                    </template>
                    <template #content>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <div class="harga">
                            <h1 class="harga-akhir-no">Rp 170.000<span>/bulan</span></h1>
                        </div>
                    </template>
                </Card>
                <Card class="card-items" style="height: 550px">
                    <template #title>
                        <div class="penawaran">
                            <p>Penawaran Istimewa!</p>
                        </div>
                        <h1 class="m-0">1 Tahun</h1>
                    </template>
                    <template #content>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <div class="harga">
                            <h3>Diskon Hingga 50%</h3>
                            <span class="harga-dicoret">Rp 200.000</span>
                            <h1 class="harga-akhir">Rp 100.000<span>/bulan</span></h1>
                        </div>
                    </template>
                </Card>
                <Card class="card-items">
                    <template #title>
                        <h1>6 bulan</h1>
                    </template>
                    <template #content>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <div class="harga">
                            <h1 class="harga-akhir-no">Rp 150.000<span>/bulan</span></h1>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div id="kontak" class="kontak">
            <div class="kontak-content">
                <img :src="logoUrl" alt="logo" />
                <a href="mailto:your@email.com" target="_blank">
                    <i class="fas fa-envelope"> Email</i>
                </a>
                <a href="tel:+123456789" target="_blank">
                    <i class="fas fa-phone"> 08732881893</i>
                </a>
                <a href="your_map_link" target="_blank">
                    <i class="fas fa-map-marker-alt"> Banjarmasin,Indonesia</i>
                </a>
            </div>
            <div class="screen">
                <img src="/demo/images/landing/screen-2.png" alt="" />
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
/* Tambahan gaya jika diperlukan */
</style>
