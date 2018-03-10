<template>
	<div class="placeSetting placeSetting--delete">

		<ui-button
			text="DELETE THIS PLACE"
			type="danger"
			@click="modal=true"
		/>

		<ui-modal
			:show="modal"
			:popup="true"
			v-on:closed="modalClosedHandler"
		>	
			<div slot="content">
					
					<ui-message
						type="prompt"
					>
						Are you sure you want to delete "{{placeName}}" ?
					</ui-message>

					<ui-button-group>
						<ui-button
							text="DELETE"
							type="danger"
							@click="saveSetting"
						/>
						<ui-button
							text="Keep it"
							type="primary"
							@click="modal=false"
						/>
					</ui-button-group>
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
