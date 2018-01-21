<template>
	<transition name="modalFlipOutX">
		<div v-if="show" class="uiModal">
			<slot name="content"></slot>
		</div>
	</transition>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'uiModal',
		props: {
			// true: it's pos fixed over the whole appView, otherwise sits in the flow
			overlay: { 
				type: Boolean,
				default: true
			},
			// Display or hide
			show: { 
				type: Boolean,
				default: true
			}
		},
		watch: {
			show (show) {
				if (show) {
					setTimeout(() => {
						this.$emit('opened');
					}, this.TRANSITION_DURATION);
				} else {
					setTimeout(() => {
						this.$emit('closed');
					}, this.TRANSITION_DURATION);
				}
			}
		},
		computed: {
			
		},
	 
		
		data () {
			return {
				TRANSITION_DURATION: 1000
			}
		}

	}

</script>

<style lang="scss">
	.uiModal {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: stretch;
		align-items: center;
	}

.modalFlipOutX-enter-active {
	-webkit-backface-visibility: visible !important;
	backface-visibility: visible !important;
	animation: flipOutX 1s;
}
.modalFlipOutX-leave-active {
	-webkit-backface-visibility: visible !important;
	backface-visibility: visible !important;
	animation: flipOutX 1s;
}
</style>
