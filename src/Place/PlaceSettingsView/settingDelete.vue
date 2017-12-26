<template>
	<div class="placeSetting placeSetting--delete">
		<button @click="modal=true" class="uiButton">DELETE</button>

		<div class="uiModal" v-if="modal">
			<p>Are you sure you want to delete this place?</p>

			<button class="uiButton"
				@click="saveSetting"
			>
				DELETE
			</button>
			<button class="uiButton"
				@click="modal=false"
			>
				Leave it
			</button>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	
	export default {
		name: 'placeSettingDelete',
		mounted () {
		},
		watch: {
		},
		methods: {
			triggerModal () {
				//@todo: modal
			},
			saveSetting () {
				this.modal = false;
				this.$emit('deletePlace');
			}
		},
		data () {
			return {
				modal: false
			}
		}
	}

</script>