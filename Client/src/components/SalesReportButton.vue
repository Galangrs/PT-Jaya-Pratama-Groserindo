<template>
	<div>
		<h2>Sales Report</h2>
		<label for="start-date">Start Date:</label>
		<input type="date" id="start-date" v-model="startDate">

		<label for="end-date">End Date:</label>
		<input type="date" id="end-date" v-model="endDate">

		<button @click="generateSalesReport">Generate Sales Report</button>
	</div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
	data() {
		return {
			startDate: '',
			endDate: '',
		};
	},
	methods: {
		async generateSalesReport() {
		try {
			const requestBody = {
				startDate: this.startDate,
				endDate: this.endDate,
			};

			const token = localStorage.getItem('jwt');
			const headers = { jwt: token };

			const response = await axios.post('http://localhost:3000/report', requestBody, { headers, responseType: 'arraybuffer' });

			const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'SalesReport.xlsx';
			link.click();

			Swal.fire({
				icon: 'success',
				title: 'Sales Report Generated',
				text: 'The sales report has been successfully generated.',
			});
		} catch (error) {
			console.error(error.response);
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
