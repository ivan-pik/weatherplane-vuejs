<template>
	<transition name="modalFlipOutX">
		<div v-if="show" class="uiModal"
			:class="{
				'uiModal--overlay' : this.overlay,
				'uiModal--popup' : this.popup,
				'uiModal--hasCloseButton' : this.closeButton,
				'uiModal--scrollContent' : this.scrollContent
			}"
		>
			<div class="uiModal__content">
				<button
					v-if="closeButton"
					class="modal__toggler is-open"
					@click="closeButtonHandler"
				>
					<span class="mainNavigation__burger mainNavigation__burger--1"></span>
					<span class="mainNavigation__burger mainNavigation__burger--2"></span>
					<span class="mainNavigation__burger mainNavigation__burger--2B"></span>
					<span class="mainNavigation__burger mainNavigation__burger--3"></span>
				</button>
				<slot name="content"></slot>
			</div>
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
			},
			closeButton: {
				type: Boolean,
				default: false
			},
			popup: {
				type: Boolean,
				default: false
			},
			scrollContent: {
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
	 	methods: {
			closeButtonHandler () {
				this.$emit('close-button-clicked');
			}
		},
		
		data () {
			return {
				TRANSITION_DURATION: 1000
			}
		}

	}

</script>

<style lang="scss">

@import '~globalVars';

.uiModal {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	// justify-content: center;
	align-content: stretch;
	align-items: center;
}

.uiModal--overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	z-index: 1000;
}


.uiModal--scrollContent {
	overflow: auto;
	touch-action: pan-y;
}

.uiModal--popup {
	background-color: rgba(#000, 0.8);
	& > .uiModal__content {
		background-color: #fff;
		position: relative;
		padding: 40px 1em 1em 1em;
		width: 100%;
		max-width: 80vw;
		border-radius: 3px;
		margin: 1em 0;
	}
	& > .modal__toggler {
		position: absolute;
	}
}

.uiModal:not(.uiModal--popup) {
	& > .uiModal__content {
		flex: 1 1 auto;
		width: 100%;
		// height: 100%;
		display: flex;
		flex-direction: column;
		border-top: 1px solid $colorSubtleBorder;
	}
}

.uiModal--hasCloseButton.uiModal--overlay{
	padding-top: 40px;
}

.modal__toggler {
	position: fixed;
	top: 0;
	right: 0;
}

.modalFlipOutX-enter-active {
	// -webkit-backface-visibility: visible !important;
	// backface-visibility: visible !important;
	// animation: flipOutX 0.5s reverse;

	-webkit-backface-visibility: visible !important;
	backface-visibility: visible !important;
	animation: flipInX 1s;
	
}
.modalFlipOutX-leave-active {
	-webkit-backface-visibility: visible !important;
	backface-visibility: visible !important;
	animation: flipOutX 1s;
}

.modal__toggler {
	display: block;
	width: 40px;
	height: 40px;
	cursor: pointer;
	
}

.modal__toggler--inPanel {
	position: absolute;
	top: 0;
	left: 0;
}

.mainNavigation__burger {
	display: block;
	position: absolute;
	width: 16px;
	height: 2px;
	background: $color-burger;
	left: 12px;
	transition: all 100ms ease-in-out;
}

.mainNavigation__burger--1 {
	top: 14px;
}


.mainNavigation__burger--2{
	top: 19px;
}

.mainNavigation__burger--2B{
	top: 19px;
}

.mainNavigation__burger--3 {
	bottom: 14px;
}

.modal__toggler.is-closed {
	.mainNavigation__burger--1 {
		transition: all 100ms 80ms ease-in-out;
	}

	.mainNavigation__burger--2{
		transition: all 100ms 0 ease-in-out;
	}

	.mainNavigation__burger--2B{
		transition: all 100ms 0 ease-in-out;
	}

	.mainNavigation__burger--3 {
		transition: all 100ms 80ms ease-in-out;
	}
}

.modal__toggler.is-open {
	.mainNavigation__burger--1 {
		top: 19px;
		opacity: 0;
	}


	.mainNavigation__burger--2{
		top: 19px;
		transform: rotate(45deg);
		width: 18px;
		left: 11px;
		transition: all 100ms 80ms ease-in-out;
	}

	.mainNavigation__burger--2B{
		top: 19px;
		transform: rotate(-45deg);
		width: 18px;
		left: 11px;
		transition: all 100ms 80ms ease-in-out;
	}

	.mainNavigation__burger--3 {
		bottom: 19px;
		opacity: 0;
	}
}
</style>
