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
        description: 'Description of Template 6',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 7',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 8',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 9',
        userCount: '500'
    },
    {
        imageUrl: './public/layout/images/contoh.png',
        description: 'Description of Template 10',
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
const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>

<template>
    <div class="container">
        <div id="beranda" class="content">
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
            <div class="content-text">
                <div class="text-content">
                    <h1>Membuat website lebih mudah untuk <span>Bisnis Anda</span></h1>
                    <p>
                        Pilihan yang tepat bagi para fotografer yang ingin menciptakan jejak digital mereka dengan <br />
                        kombinasi kreativitas tinggi dan teknologi terkini.
                    </p>
                </div>
                <div class="input-domain">
                    <InputText v-model="value3" type="text" size="large" placeholder="Nama Domain Anda" style="width: 70%; height: 70px; margin-right: 15px; font-size: 20px" />
                    <Button label="Search" style="background-color: rgb(112, 194, 227); height: 70px; width: 13%; font-size: 17px; border: none" severity="secondary" raised />
                </div>
                <div class="button-content">
                    <Button @click="goToRegister" label="Ayo Bergabung Sekarang" style="background-color: orange; border: none;" severity="secondary" raised />
                    <p>Temukan potensi Anda dalam dunia fotografi bersama Bekantan Jantan.</p>
                </div>
            </div>
        </div>
        <div id="Tentang" class="content-2">
            <div>
                <h1>Apa Itu Web Builder <span>Company Profile?</span></h1>
            </div>
            <div class="text-content-2">
                <div class="gambar-content2">
                    <img src="/demo/images/landing/screen-2.png" alt="" />
                </div>
                <div class="p-content-2">
                    <p>
                        Web Builder Company Profile adalah layanan yang menyediakan platform untuk membangun dan mengelola halaman profil perusahaan secara online. Dengan fokus khusus pada bidang jasa fotografi, web builder ini memberikan solusi
                        praktis bagi fotografer yang ingin meningkatkan kehadiran mereka di dunia digital.
                    </p>
                    <p>
                        Menggunakan Web Builder Company Profile yang dirancang khusus untuk fotografi menawarkan berbagai keunggulan. Para fotografer dapat memanfaatkan desain yang telah disesuaikan khusus untuk menampilkan karya fotografi,
                        memastikan bahwa portofolio mereka tampil secara maksimal.
                    </p>
                    <p>Platform ini sangat mudah digunakan, dengan antarmuka yang intuitif yang cocok untuk fotografer dari semua tingkat keahlian, memungkinkan mereka untuk dengan mudah membuat dan mengelola situs web mereka sendiri.</p>
                </div>
            </div>
            <div class="last-content-2">
                <p>Kami berkomitmen untuk mendukung para fotografer dalam perjalanan kreatif mereka, <br> menyediakan alat yang mereka butuhkan untuk berkembang dan sukses di dunia digital.</p>
            </div>
        </div>
        <div id="produk" class="content-3">
            <h1>Jenis-Jenis Template <span>Company Profile</span></h1>
            <p class="p-judul">
                Company profile adalah alat penting dalam memperkenalkan dan mempromosikan bisnis Anda. <br />
                Berikut ini beberapa jenis template yang bisa Anda pertimbangkan:
            </p>
            <Carousel :value="displayedTemplates" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
                <template #item="slotProps">
                    <div class="column">
                        <div class="template-item">
                            <img :src="slotProps.data.imageUrl" alt="Template" />
                            <div class="desc">
                                <div class="user-count">
                                    <span class="p-desc">{{ slotProps.data.description }}</span>
                                    <div class="icon-card">
                                        <i class="fa fa-user" aria-hidden="true"></i>
                                        <span>Jumlah Pengguna {{ slotProps.data.userCount }}</span>
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
                </template>
            </Carousel>
        </div>
        <div id="harga" class="content-4">
            <div class="judul-content-4">
                <h1>
                    <span>Dapatkan Harga</span> yang <br />
                    Sesuai dengan Anggaran Bisnis Anda
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
        <hr />
        <div id="kontak" class="kontak">
            <div class="kontak-content">
                <div class="sejajar">
                    <div class="bekantan-logo">
                        <img :src="logoUrl" alt="logo" />
                    </div>
                    <div class="lokasi">
                        <img src="/public/layout/images/mapp.png" alt="nohp" />
                        <div>
                            <h3>Lokasi</h3>
                            <p>
                                Jln. Musium Perjuangan Komp. Wasaka, <br />
                                Kel.Sungai Jingah.RT.14 RW.02
                            </p>
                        </div>
                    </div>
                    <div class="email">
                        <img src="/public/layout/images/emaill.png" alt="nohp" />
                        <div>
                            <h3>Email</h3>
                            <p>admin@bekantanjantan.com</p>
                        </div>
                    </div>
                    <div class="whatsapp">
                        <img src="/public/layout/images/wa2.png" alt="nohp" />
                        <div>
                            <h3>WhatsApp</h3>
                            <p>0878-1449-3571</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="isi-foot">
                <div class="ikuti">
                    <h1>Ikuti Kami</h1>
                    <div class="sosmed">
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-instagram"></i></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-facebook"></i></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-twitter"></i></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-youtube"></i></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-tiktok"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="screen">
                <img src="/demo/images/landing/screen-2.png" alt="" />
            </div>
        </div>
        <div class="footer">
            <p>Copyright &copy; 2024 CV. Bekantan Jantan. All Rights Reserved.</p>
        </div>
    </div>
    <AppConfig simple />
</template>
<style scoped></style>
