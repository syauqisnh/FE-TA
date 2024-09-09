<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

const message = ref('');
const history = ref([]);
const templates = ['Bagaimana cara menggunakan aplikasi ini?', 'Aplikasi ini tentang apa?', 'Bagaimana cara melakukan pembayaran?', 'Bagaimana cara mendaftar?'];

const scrollToBottom = () => {
    nextTick(() => {
        const container = document.querySelector('.over');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    });
};

const sendMessage = async () => {
    try {
        const response = await axios.post('http://localhost:5800/api/v1/training', { training_question: message.value }, { withCredentials: true });
        console.log('Data', response);
        console.log('Data', response.data.training_answer);
        if (response.data.training_answer) {
            history.value.push({ message: message.value, isQuestion: true });
            history.value.push({ message: response.data.training_answer, isQuestion: false });
            scrollToBottom();
        }
        message.value = '';
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
};

const sendMessageFromForm = (e) => {
    e.preventDefault();
    sendMessage();
};

const reuseMessage = (msg) => {
    message.value = msg;
    sendMessage();
};
</script>
<template>
    <div class="container-bot">
        <div class="sidebar-bot">
            <div class="logo-bot">
                <img src="/public/layout/images/1.png" alt="logo bot" />
                <h1>Chatbot</h1>
            </div>
            <hr />
            <div class="riwayat-bot">
                <h1>Riwayat :</h1>
                <div class="over">
                    <div v-for="(item, index) in history" :key="index" class="riwayat-item" @click="reuseMessage(item.message)">
                        <span v-if="item.isQuestion" class="riwayat-question">{{ item.message }}</span>
                    </div>
                </div>
            </div>
            <hr />
            <div class="out">
                <router-link to="/">
                    <button>Back</button>
                </router-link>
            </div>
        </div>
        <div class="content-bot">
            <div class="logo-2">
                <h1>Chatbot</h1>
            </div>
            <div class="isi-chat">
                <div v-for="(item, index) in history" :key="index" :class="{ 'pesan-dikirim': item.isQuestion, 'pesan-diterima': !item.isQuestion }" class="balon-chat">
                    <p>{{ item.message }}</p>
                </div>
            </div>
            <div class="templates">
                <h3>Template Pesan:</h3>
                <div class="template-container">
                    <div class="template-item" v-for="(template, index) in templates" :key="index" @click="reuseMessage(template)">
                        {{ template }}
                    </div>
                </div>
            </div>
            <form class="message-form" @submit.prevent="sendMessageFromForm">
                <input v-model="message" type="text" placeholder="Apa yang ingin anda tanyakan?" />
                <button type="submit">
                    <span>Kirim</span>
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* General Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
}

.container-bot {
    display: flex;
    height: 100vh;
    background-color: #f0f2f5;
}

.sidebar-bot {
    background-color: #2c3e50;
    color: white;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
}

.logo-bot {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 20px;
}

.logo-bot img {
    margin: 20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.logo-bot h1 {
    margin: 0;
    color: white;
    font-size: 24px;
}

.riwayat-bot {
    flex: 1;
}

.riwayat-bot h1 {
    font-size: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: white;
}

.riwayat-item {
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.riwayat-item:hover {
    background-color: #1abc9c;
}

.riwayat-question {
    color: white;
    font-weight: bold;
}
/* Content Styles */
.content-bot {
    background-color: #ecf0f1;
    flex: 4;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
}

.logo-2 {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.logo-2 h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 24px;
    font-weight: bold;
}

.isi-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.balon-chat {
    display: inline-block;
    max-width: 70%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 15px;
    word-wrap: break-word;
}

.pesan-dikirim {
    background-color: #dcf8c6;
    align-self: flex-end;
}

.pesan-diterima {
    background-color: #e5e5ea;
    align-self: flex-start;
}

/* Templates Styles */
.templates {
    margin-bottom: 20px;
}

.templates h3 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #2c3e50;
}

.template-container {
    display: flex;
    overflow-x: auto;
}

.template-item {
    background-color: #bdc3c7;
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex: 0 0 auto;
}

.template-item:hover {
    background-color: #95a5a6;
}

/* Message Form Styles */
.message-form {
    display: flex;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-form input {
    flex: 1;
    padding: 10px 20px;
    border: none;
    border-radius: 25px 0 0 25px;
    outline: none;
    font-size: 16px;
}

.message-form button {
    background-color: #3498db;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 0 25px 25px 0;
    cursor: pointer;
    font-size: 16px;
    outline: none;
    transition: background-color 0.3s ease;
}

.message-form button:hover {
    background-color: #2980b9;
}

/* Scrollbar Styles */
.over {
    max-height: 200px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #888 #444;
}

.over::-webkit-scrollbar {
    width: 8px;
}

.over::-webkit-scrollbar-track {
    background: #444;
}

.over::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
    border: 3px solid #444;
}

.out {
    text-align: center;
    margin-top: 15px;
}

.out button {
    background-color: #3498db;
    height: 50px;
    cursor: pointer;
    width: 100px;
    font-size: 16px;
    color: white;
    border: none;
    border-radius: 25px;
    transition: background-color 0.3s ease;
}

.out button:hover {
    background-color: #2980b9;
}
</style>
