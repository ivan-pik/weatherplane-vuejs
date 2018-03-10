<template>
	<div class="status" v-bind:class="className">
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'status',
		props: ['status'],
		computed: {
			className () {
				return this.status;
			}
		},
		methods: {
		


		},
		data () {
		  return {
			
		  }
		}

	}



</script>

<style lang="scss">
@import '~globalVars';
.status {
	display: block;
	width: $widthStatusBar;
	overflow: hidden;
	text-indent: 100%;
	transition: all 100ms ease-in-out;
	
	&.yes {
		background-color: $statusYes;
	}
	&.no {
		background-color: $statusNo;
	}
	&.na {
		background-color: $statusNA;
	}
}

</style>
