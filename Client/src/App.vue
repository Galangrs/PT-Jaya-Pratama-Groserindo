<template>
    <div id="app">
        <div v-if="!isLogin">
            <register-form></register-form>
            <login-form @login-success="handleLoginSuccess"></login-form>
        </div>

        <div v-else>
            <create-history-form></create-history-form>
            <sales-report-button></sales-report-button>
            <button @click="logoutUser">Logout</button>
        </div>
    </div>
</template>

<script>
import RegisterForm from './components/RegisterForm.vue';
import LoginForm from './components/LoginForm.vue';
import SalesReportButton from './components/SalesReportButton.vue';
import CreateHistoryForm from './components/CreateHistoryForm.vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
    data() {
        return {
            isLogin: false,
        };
    },
    components: {
        RegisterForm,
        LoginForm,
        CreateHistoryForm,
        SalesReportButton,
    },
    methods: {
        handleLoginSuccess() {
            const token = localStorage.getItem('jwt');
            this.isLogin = !!token;
        },
        logoutUser() {
            Swal.fire({
                title: 'Logout',
                text: 'Are you sure you want to logout?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('jwt');
                    this.isLogin = false;
                }
            });
        },
    },
    created() {
        const token = localStorage.getItem('jwt');
        this.isLogin = !!token;
    },
};
</script>
