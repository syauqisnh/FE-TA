<script setup>
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToBeranda = () => {
    router.push('/landing-page');
};

const countries = [
    { name: 'Bank Transfer', code: 'BT' },
    { name: 'E-Wallet', code: 'EW' }
]
</script>

<template>
    <div id="pembayaran" class="pembayaran">
        <div class="navbar">
            <div class="logo-bekantan">
                <a href=""
                    ><h1>USAHAMIKRO<span>SITE</span></h1></a
                >
            </div>
        </div>
        <div class="payment">
            <div class="text-center">
                <h1 class="text-3xl font-bold mb-5">Pembayaran</h1>
            </div>
            <div>
                <div>
                    <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Payment Via" style="width: 1000px; margin-bottom: 20px;">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex align-items-center">
                                <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px;" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                <div>
                    <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="From Bank" style="width: 100%; margin-bottom: 20px;">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex align-items-center">
                                <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                <div>
                    <InputText v-model="value3" type="text" placeholder="Nama" style="width: 100%; margin-bottom: 20px;" />
                </div>
                <div>
                    <InputText v-model="value3" type="text" placeholder="Payment to" style="width: 100%; margin-bottom: 20px;" />
                </div>
                <div>
                    <InputText v-model="value3" type="text" placeholder="Payment Profile" style="width: 100%; margin-bottom: 20px;" />
                </div>
                <div class="flex mt-4">
                    <Button @click="goToBeranda" label="Back" severity="secondary" raised style="width: 100%; margin-right: 10px;" />
                    <Button label="Next" severity="secondary" raised style="width: 100%; margin-left: 10px;" />
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
<style scoped>
.navbar {
    background-color: white;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px 10px 20px;
    width: 100%;
}

.logo-bekantan a h1 {
    margin: 0 auto;
    color: orange;
    font-weight: bold;
}
.logo-bekantan a h1 span {
    color: rgb(112, 194, 227);
}

.payment {
    display: flex;
    align-items: center;
    margin: auto;
    background-color: white;
    flex-direction: column;
    height: 550px;
    margin-top: 30px;
    width: 80%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}
</style>

