<template>
	<div class="">
		<div class="mainNav">
			<h1 class="mainNav__title">My places</h1>
		</div>

		<places-list
			:role="'userList'"
			:userName="userName"
		 />
		
	</div>
</template>
<script>
	import Vue from 'vue';
	import {HTTP} from '../../http-common';
	import placesList from '../../Navigation/placesList.vue';

	export default {
		name: 'UserPlacesView',
		components: {
			'places-list' : placesList
		},
		computed: {
			userName () {
				return this.$route.params.username;
			},
		},
		methods: {

		},
		data () {
			return {
			}
		}


	}

</script>
