<script setup>
import '../pages/css/edit-profile.css';
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card docs">
                <div class="judul-profile">
                    <h1>Profile</h1>
                    <hr>
                </div>
                <div class="konten">
                    <div class="username">
                        <label for="">Username</label>
                        <InputText id="username" type="text" class="w-full mb-5"
                            style="padding: 1rem; border-top: none; border-right: none; border-left: none;" v-model="username" />
                    </div>
                    <div class="fullName">
                        <label for="">Nama Lengkap</label>
                        <InputText id="fullname" type="text" class="w-full mb-5"
                            style="padding: 1rem; border-top: none; border-right: none; border-left: none;" v-model="fullname" />
                    </div>
                    <div class="nohp">
                        <label for="">Nomor Ponsel</label>
                        <InputText id="nohp" type="tel" class="w-full mb-5" style="padding: 1rem; border-top: none; border-right: none; border-left: none;"
                            v-model="nohp" />
                    </div>
                    <div class="address">
                        <label for="">Alamat</label>
                        <InputText id="address" type="text" class="w-full mb-5" style="padding: 1rem; border-top: none; border-right: none; border-left: none;"
                            v-model="email" />
                    </div>
                    <div class="email">
                        <label for="">Email</label>
                        <InputText id="email" type="text" class="w-full mb-5" style="padding: 1rem; border-top: none; border-right: none; border-left: none;"
                            v-model="email" />
                    </div>
                    <div class="password">
                        <label for="">Password</label>
                        <InputText id="password" type="password" class="w-full mb-5"
                            style="padding: 1rem; border-top: none; border-right: none; border-left: none;" v-model="password" />
                    </div>
                    <div class="save">
                        <button>Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
