<template>
	<div class="mainNav mainNav--weatherDetail">
		<navigation />
		<h1 class="mainNav__title">{{title}}</h1>
		<button class="mainNav__contextMenu">...</button>
	</div>
</template>

<script>
	import Navigation from './index.vue'

	export default {
		name: 'MainNav',
		components: {
			'navigation': Navigation,
		},
		props: {
			title: {
				type: String
			}
		},
		computed: {
			
		},
		methods: {
			
		},
		data() {
			return {
			}
		}
	}
</script>
