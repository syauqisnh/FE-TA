<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import '/public/layout/css/landing.css';
import AOS from 'aos'
import 'aos/dist/aos.css'; 

const router = useRouter();
  AOS.init();

const goToLogin = () => {
    router.push('/auth/Login-2');
};

const goToRegister = () => {
    router.push('/auth/register');
};

const goToPaymentPage = () => {
    router.push('/pembayaran');
};

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
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 1',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 2',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 3',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 4',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 5',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 6',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 7',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 8',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
        description: 'Description of Template 9',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/images-cv.svg',
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
                    <a href=""
                        ><h1>USAHAMIKRO<span>SITE</span></h1></a
                    >
                </div>
                <div class="menu">
                    <ul>
                        <li><a @click="() => scrollToSection('beranda')">Beranda</a></li>
                        <li><a @click="() => scrollToSection('Tentang')">Tentang Kami</a></li>
                        <li><a @click="() => scrollToSection('produk')">Produk</a></li>
                        <li><a @click="() => scrollToSection('harga')">Harga</a></li>
                    </ul>
                    <div class="login">
                        <Button @click="goToLogin" label="Login" style="height: 50px; width: 100px; margin-right: 10px; color: orange; border: 2px solid orange; font-size: 15px" text raised />
                    </div>
                    <div class="register">
                        <Button @click="goToRegister" label="Register" style="height: 50px; width: 100px; margin-left: 10px; background-color: orange; color: white; font-size: 15px" text raised />
                    </div>
                </div>
            </div>
            <div class="content-text">
                <div class="text-content">
                    <h1>Membuat website lebih mudah untuk Bisnis Anda</h1>
                    <p>
                        Pilihan yang tepat bagi para pembisnis yang ingin menciptakan jejak digital mereka dengan <br />
                        kombinasi kreativitas tinggi dan teknologi terkini.
                    </p>
                </div>
                <div class="input-domain">
                    <InputText v-model="value3" type="text" size="large" placeholder="Nama Domain Anda" style="width: 70%; height: 70px; margin-right: 15px; font-size: 20px" />
                    <Button label="Search" style="background-color: orange; height: 70px; width: 13%; font-size: 17px; border: none" severity="secondary" raised />
                </div>
                <div class="button-content">
                    <Button @click="goToRegister" label="Ayo Bergabung Sekarang" style="background-color: rgb(112, 194, 227); border: none" severity="secondary" raised />
                    <p>Temukan potensi Anda dalam dunia bisnis bersama kami</p>
                </div>
            </div>
        </div>
        <div id="Tentang" class="content-2">
            <div>
                <h1>Apa Itu Web Builder <span>Company Profile?</span></h1>
            </div>
            <div class="text-content-2">
                <div data-aos="fade-right" class="gambar-content2">
                    <img src="/public/layout/images/images-cv.svg" alt="" />
                </div>
                <div data-aos="fade-left" class="p-content-2">
                    <div class="padding-content">
                        <div class="border-items">
                            <div class="icons-border">
                                <i class="pi pi-pencil"></i>
                            </div>
                            <p>
                                Web Builder Company Profile adalah layanan yang menyediakan platform untuk membangun dan mengelola halaman profil perusahaan secara online. Dengan fokus khusus pada bidang bisnis jasa, web builder ini memberikan solusi
                                praktis bagi fotografer yang ingin meningkatkan kehadiran mereka di dunia digital.
                            </p>
                        </div>
                        <div class="border-items">
                            <div class="icons-border">
                                <i class="pi pi-book"></i>
                            </div>
                            <p>
                                Web Builder Company Profile yang dirancang khusus untuk jasa menawarkan berbagai keunggulan. Para jasa dapat memanfaatkan desain yang telah disesuaikan khusus untuk menampilkan karya fotografi, memastikan bahwa
                                portofolio mereka tampil secara maksimal.
                            </p>
                        </div>
                        <div class="border-items">
                            <div class="icons-border">
                                <i class="pi pi-angle-double-right"></i>
                            </div>
                            <p>Platform ini sangat mudah digunakan, dengan antarmuka yang intuitif yang cocok untuk bisnis anda dari semua tingkat keahlian, memungkinkan mereka untuk dengan mudah membuat dan mengelola situs web mereka sendiri.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="last-content-2">
                <p>
                    Kami berkomitmen untuk mendukung para fotografer dalam perjalanan kreatif mereka, <br />
                    menyediakan alat yang mereka butuhkan untuk berkembang dan sukses di dunia digital.
                </p>
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
                                    <button @click="goToPaymentPage" class="shop">
                                        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
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
                        <h1 class="judul-h1">.com</h1>
                    </template>
                    <template #content>
                        <p class="isi">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <div class="harga">
                            <h1 class="harga-akhir-id">Rp 170.000<span>/bulan</span></h1>
                            <Button label="Pilih Paket" style="background-color: rgb(112, 194, 227); height: 50px; width: 100%; font-size: 17px; margin-top: 50px; border: none" severity="secondary" raised />
                        </div>
                    </template>
                </Card>
                <Card class="card-items" style="height: 550px">
                    <template #title>
                        <div class="penawaran">
                            <p>Penawaran Istimewa!</p>
                        </div>
                        <div class="judul-domain">
                            <h1 class="m-0">.co.id</h1>
                        </div>
                    </template>
                    <template #content>
                        <p class="isi">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <div class="harga">
                            <div class="diskon">
                                <span class="harga-dicoret">Rp 400.000</span>
                                <h3>Diskon 50%</h3>
                            </div>
                            <h1 class="harga-akhir">Rp 200.000<span>/bulan</span></h1>
                            <Button @click="goToPaymentPage" label="Pilih Paket" style="background-color: red; height: 50px; width: 100%; font-size: 17px; margin-top: 50px; border: none" severity="secondary" raised />
                        </div>
                    </template>
                </Card>
                <Card class="card-items">
                    <template #title>
                        <h1 class="judul-h1-2">.id</h1>
                    </template>
                    <template #content>
                        <p class="isi">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <div class="harga">
                            <h1 class="harga-akhir-id">Rp 170.000<span>/bulan</span></h1>
                            <Button label="Pilih Paket" style="background-color: rgb(112, 194, 227); height: 50px; width: 100%; font-size: 17px; margin-top: 50px; border: none" severity="secondary" raised />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <hr />
        <div id="kontak" class="kontak">
            <div>
                <div class="logo-bekantan">
                    <a href=""
                        ><h1>USAHAMIKRO<span>SITE</span></h1></a
                    >
                </div>
                <div class="admin-kontak">
                    <a href="">
                        <h1>Email:</h1>
                        <p>email@gmail.com</p>
                    </a>
                </div>
                <div class="admin-kontak">
                    <a href="">
                        <h1>Kontak:</h1>
                        <p>082578991029</p>
                    </a>
                </div>
            </div>
            <div class="isi-foot">
                <div class="ikuti">
                    <h1>Ikuti Kami</h1>
                    <div class="sosmed">
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-instagram"></i><span>Instagram</span></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-facebook"></i><span>Facebook</span></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-twitter"></i><span>Twitter</span></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-youtube"></i><span>Youtube</span></a>
                        </div>
                        <div class="icon">
                            <a href="#" target="_blank" class="icons"><i class="fab fa-tiktok"></i><span>Tiktok</span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="screen">
                <img src="/public/layout/images/images-cv.svg" alt="" />
            </div>
        </div>
        <div class="footer">
            <p>Copyright &copy; 2024 CV. Bekantan Jantan. All Rights Reserved.</p>
        </div>
    </div>
    <AppConfig simple />
</template>
<style scoped></style>
