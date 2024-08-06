<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import '/public/layout/css/landing.css';
import AOS from 'aos'
import 'aos/dist/aos.css';
const user_username = ref('');
const user_level = ref('');
const isLoginIn = ref(false)

const router = useRouter();
  AOS.init();

const goToLogin = () => {
    router.push('/auth/Login-2');
};

const goToDashboard = () => {
    router.push('/dashboard');
};

const CekDataLogin = async () => {
    try {
        const response = await axios.get('http://localhost:9900/api/v1/me');
        console.log(response)
        if (response) {
            user_username.value = response.data.name;
            user_level.value = response.data.level;

            isLoginIn.value = true;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            router.push('/');
        } else {
            console.error('Error: ', error); // Kesalahan lain
        }
    
    }
};


onMounted(() => {
    CekDataLogin();
});

const goToRegister = () => {
    router.push('/auth/register');
};

const goToPaymentPage = () => {
    router.push('/pembayaran');
};

const goToBot = () => {
    router.push('/bot');
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
        imageUrl: '/public/layout/images/rstemp.png',
        description: 'Tamplate Rumah Sakit',
        userCount: '500'
    },
    {
        imageUrl: '/public/layout/images/batikweb.png',
        description: 'Tamplate Website Batik',
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
                    <a href="/"
                        ><h1>USAHAMIKRO<span>SITE</span></h1></a
                    >
                </div>
                <div class="menu">
                    <ul>
                        <li><a href="#" @click="() => scrollToSection('beranda')">Beranda</a></li>
                        <li><a href="#" @click="() => scrollToSection('Tentang')">Tentang Kami</a></li>
                        <li><a href="#" @click="() => scrollToSection('produk')">Produk</a></li>
                        <li><a href="#" @click="() => scrollToSection('harga')">Harga</a></li>
                    </ul>
                    <div class="dashboard" v-if="isLoginIn">
                        <Button @click="goToDashboard" label="Dashboard" style="margin-right: 10px; color: orange; border: 2px solid orange" text raised />
                    </div>
                    <div v-else class="card-button">
                        <div class="login">
                            <Button @click="goToLogin" label="Login" style="margin-right: 10px; color: orange; border: 2px solid orange" text raised />
                        </div>
                        <div class="register">
                            <Button @click="goToRegister" label="Register" style="margin-left: 10px; background-color: orange; color: white" text raised />
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-text">
                <div class="text-content">
                    <h1>
                        Membuat website lebih mudah dan hemat untuk <br />
                        profile bisnis anda yang lebih profesional
                    </h1>
                    <p>
                        Pilihan yang tepat bagi para pembisnis yang ingin menciptakan jejak digital mereka dengan <br />
                        kombinasi kreativitas tinggi dan teknologi terkini.
                    </p>
                </div>
                <div class="input-domain">
                    <InputText v-model="value3" type="text" size="large" placeholder="Nama Domain Anda" style="width: 100%; margin-right: 15px" />
                    <Button label="Search" style="background-color: orange; height: 100%; width: 13%; border: none" severity="secondary" raised />
                </div>
                <div class="button-content">
                    <Button @click="goToRegister" label="Ayo Bergabung Sekarang" style="height: 50px; font-size: 15px; margin-bottom: 20px; background-color: rgb(112, 194, 227); border: none" severity="secondary" raised />
                    <p>Tingkatkan kualitas profile bisnis anda bersama kami.</p>
                </div>
            </div>
        </div>
        <div id="Tentang" class="content-2">
            <div>
                <h1>Apa yang ditawarkan <span>usahamikrosite?</span></h1>
            </div>
            <div class="text-content-2">
                <div data-aos="fade-right" class="gambar-content2">
                    <img src="/public/layout/images/images-cv.svg" alt="" />
                </div>
                <div data-aos="fade-left" class="p-content-2">
                    <div class="padding-content">
                        <div class="border-items">
                            <div class="icons-border">
                                <i class="pi pi-book"></i>
                            </div>
                            <p>
                                Usahamikrosite menyediakan pembuatan website company profil dengan cepat dan mudah. Anda tinggal pilih template yang disediakan oleh Usahamikrosite, dan anda juga boleh minta dibuatkan tampilan website sesuai ke ingin
                                anda. Pengelolaan dan maintenance website dikelola oleh tim IT kami sendiri tanpa perlu anda hire tim IT yang biaya per orang biasa-nya diatas UMR. <br />
                                Dibandingkan dengan minta jasa pembuatan website baru ke software house, dimana biaya pembuatan bahkan sekitar > 5jt, bahkan itu belum biaya maintenance per bulan atau perawatan baik dari website ataupun hosting.
                                Usahamikrosite menyediakan permintaan fitur sendiri yang belum disediakan oleh usahamikrosite, dimana perusahaan aplikasi lain nya yang menyediakan berlangganan tidak menerima request fitur baru diluar dari fitur yang
                                mereka sediakan
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fitur">
                <p>Fitur yang <span>usahamikrosite</span> tawarkan:</p>
            </div>
            <div class="pembungkus" style="display: flex; align-items: center; justify-content: center">
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Landing page</span>
                                <div class="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-home text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">520 </span>
                        <span class="text-500">newly registered</span>
                    </div>
                </div>
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Scheduling</span>
                                <div class="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-calendar text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">520 </span>
                        <span class="text-500">newly registered</span>
                    </div>
                </div>
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Notification</span>
                                <div class="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-comment text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">520 </span>
                        <span class="text-500">newly registered</span>
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center">
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Booking</span>
                                <div class="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-whatsapp text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">520 </span>
                        <span class="text-500">newly registered</span>
                    </div>
                </div>
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Task/Todo</span>
                                <div class="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-book text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">520 </span>
                        <span class="text-500">newly registered</span>
                    </div>
                </div>
            </div>
            <div class="last-content-2">
                <p>
                    Kami berkomitmen untuk mendukung para usaha mikro menengah kebawah dalam meningkatkan usaha mereka terlihat <br />
                    lebih profesional, sehingga berkembang dan mengikuti perkembangan zaman digital sekarang ini.
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
                            <img :src="slotProps.data.imageUrl" alt="Template" class="template-image" />
                            <div class="desc">
                                <div class="user-count">
                                    <span class="p-desc">{{ slotProps.data.description }}</span>
                                    <div class="icon-card">
                                        <i class="fa fa-user"></i>
                                        <span>Jumlah Pengguna {{ slotProps.data.userCount }}</span>
                                    </div>
                                </div>
                                <div class="button-card">
                                    <button @click="goToPaymentPage" class="shop">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                    <button>
                                        <i class="fa fa-eye"></i>
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
                                <h1>Diskon 50%</h1>
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
        <div class="bot">
            <button @click="goToBot">
                <img src="/public/layout/images/bot2.png" alt="" />
            </button>
        </div>
    </div>
    <AppConfig simple />
</template>
<style scoped>
.bot {
    position: fixed;
    bottom: 10px;
    right: 10px;
}

.bot button {
    border: none;
    cursor: pointer;
    background-color: transparent;
}

.bot button img {
    height: 100px;
}
.template-image {
    width: 100%;
    height: 200px;
    object-fit: contain;
    background-color: #f0f0f0; /* Optional: add a background color to fill the space */
}
</style>
