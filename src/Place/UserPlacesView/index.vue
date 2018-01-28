<template>
	<div class="viewWrapper">
		<navigation-header>
			My Places
		</navigation-header>	

		<div class="viewWrapper__scroller">
			<places-list
				:role="'userList'"
				:userName="userName"
			/>
		</div>
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
