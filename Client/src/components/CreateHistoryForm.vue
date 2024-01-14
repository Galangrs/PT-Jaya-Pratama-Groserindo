<template>
    <div>
        <h2>Create History</h2>
        <form @submit.prevent="createHistory">
                <label>Sales:</label>
                <select v-model="sales" required>
                    <option value="Barang">Barang</option>
                    <option value="Jasa">Jasa</option>
                </select>

                <label>Nominal:</label>
                <input v-model="nominal" type="number" required>

                <label>Due Date:</label>
                <input v-model="dueDate" type="date" required>

                <button type="submit">Create History</button>
        </form>
    </div>
</template>
    
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
    data() {
        return {
            sales: 'Barang',
            nominal: '',
            dueDate: '',
        };
    },
    methods: {
        async createHistory() {
            try {
                const token = localStorage.getItem('jwt');
                const headers = { jwt: token };

                const response = await axios.post('http://localhost:3000/createhistory', {
                    sales: this.sales,
                    nominal: this.nominal,
                    due_date: this.dueDate,
                }, { headers });

                console.log(response.data.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });
            } catch (error) {
                console.error(error.response.data.message);
                Swal.fire({
                    title: 'Error',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
    },
};
</script>
