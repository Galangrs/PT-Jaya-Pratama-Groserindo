<template>
    <div>
        <h2 v-if="isLogin">Welcome, User!</h2>
        <h2 v-else>Login Form</h2>
        
        <template v-if="!isLogin">
            <form @submit.prevent="loginUser">
                <label>Email:</label>
                <input v-model="email" required>

                <label>Password:</label>
                <input v-model="password" type="password" required>

                <button type="submit">Login</button>
            </form>
        </template>

        <template v-else>
            <button @click="logoutUser">Logout</button>
            <!-- Add other components for the logged-in state -->
        </template>
    </div>
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
            isLogin: false,
        };
    },
    methods: {
        logoutUser() {
            localStorage.removeItem('jwt');
            this.isLogin = false;
            this.$emit('logout');
        },
    },
};
</script>
