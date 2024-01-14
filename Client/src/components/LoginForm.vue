<template>
    <h2>Login Form</h2>
    <form @submit.prevent="loginUser">
        <label>Email:</label>
        <input v-model="email" required>

        <label>Password:</label>
        <input v-model="password" type="password" required>

        <button type="submit">Login</button>
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
            password: '',
        };
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://localhost:3000/login', {
                    email: this.email,
                    password: this.password,
                });
                const data = response.data;
                console.log(data.message);

                localStorage.setItem('jwt', data.jwt);

                Swal.fire({
                    title: 'Success',
                    text: 'Login successful',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                this.$emit('login-success');
            } catch (error) {
                console.error(error.message);
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
