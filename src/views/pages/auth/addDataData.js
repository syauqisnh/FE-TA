import { customer_username, customer_full_name, customer_nohp, customer_address, customer_email, customer_password } from './register.vue';

export const addDataData = async () => {
console.log(customer_username.value),
console.log(customer_full_name.value),
console.log(customer_nohp.value),
console.log(customer_address.value),
console.log(customer_email.value),
console.log(customer_password.value),
    ;
// try {
//     const response = await axios.post('http://localhost:9900/api/v1/customer', {
//         customer_username: customer_username.value,
//         customer_full_name: customer_full_name.value,
//         customer_nohp: customer_nohp.value,
//         customer_address: customer_address.value,
//         customer_email: customer_email.value,
//         customer_password: customer_password.value,
//     });
//     if (response.status === 200) {
//         // Reload halaman atau navigasi ke halaman lain
//         window.location.reload();
//     } else {
//         // Tampilkan pesan error atau lakukan handling lain
//         console.error('Gagal menambahkan data:', response);
//     }
// } catch (error) {
//     console.error('Error saat mengirim data:', error);
// }
};
