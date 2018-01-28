<template>
	<div class="placeSetting placeSetting--delete">
		<button @click="modal=true" class="uiButton uiButton--danger">DELETE THIS PLACE</button>

		<ui-modal
			:show="modal"
			:popup="true"
			v-on:closed="modalClosedHandler"
		>	
			<div slot="content">
					
					<div class="uiTitle">
						Are you sure you want to delete "{{placeName}}" ?
					</div>
					<div class="uiButtonGroup">
						<button class="uiButton uiButton--danger"
							@click="saveSetting"
						>
							DELETE
						</button>
						<button class="uiButton uiButton--primary"
							@click="modal=false"
						>
							Keep it
						</button>
					</div>
			</div>
		</ui-modal>

	</div>
</template>

<script>
	import Vue from 'vue';
	import UiModal from 'uiComponents/modal.vue'
	
	export default {
		name: 'placeSettingDelete',
		components: {
			'ui-modal': UiModal,
		},
		props: {
			placeName: {
				type: String
			}
		},
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
			},
			modalClosedHandler () {

			}
		},
		data () {
			return {
				modal: false
			}
		}
	}

</script>

<style lang="scss">
	.placeSetting--delete {
		margin-bottom: 1em;
	}
</style>
