<template>
    <h2>Register Form</h2>
        <form @submit.prevent="registerUser">
            <label>Email:</label>
            <input v-model="email" required>
    
            <label>Username:</label>
            <input v-model="username" required>
    
            <label>Password:</label>
            <input v-model="password" type="password" required>
    
            <button type="submit">Register</button>
        </form>
    </template>
    
<script>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            username: '',
            password: '',
        };
    },
    methods: {
        async registerUser() {
            try {
                const response = await axios.post('http://localhost:3000/register', {
                    email: this.email,
                    username: this.username,
                    password: this.password,
                });
                const data = response.data;
                console.log(data.message);
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error(error);
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
