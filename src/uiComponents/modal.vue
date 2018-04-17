<template>
	<transition name="modal">
		<div v-if="show" class="uiModal"
			ref="overlay"
			:class="{
				'uiModal--overlay' : this.overlay,
				'uiModal--popup' : this.popup,
				'uiModal--hasCloseButton' : this.closeButton,
				'uiModal--hasTitle' : this.headerTitle,
				'uiModal--scrollContent' : this.scrollContent
			}"
			@click="closeOverlayHandler"
		>
			
			<div class="uiModal__window">
				<div class="uiModal__header"
					v-if="closeButton || headerTitle"
				>
					<div class="uiModal__title">
						{{headerTitle}}
					</div>
					<button
						v-if="closeButton"
						class="modal__toggler is-open"
						@click="closeButtonHandler"
					>
						<span class="modal__burger modal__burger--1"></span>
						<span class="modal__burger modal__burger--2"></span>
						<span class="modal__burger modal__burger--2B"></span>
						<span class="modal__burger modal__burger--3"></span>
					</button>
					
				</div>
				<div class="uiModal__content">
					<slot name="content"></slot>
				</div>
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
				default: true
			},
			scrollContent: {
				type: Boolean,
				default: true
			},
			headerTitle: {
				type: String
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
		created () {
			document.addEventListener('keyup', this.escKeyHandler);
		},
		beforeDestroy () {
			document.removeEventListener('keyup', this.escKeyHandler);
		},
	 	methods: {
			closeButtonHandler () {
				this.emitCloseEvent();
			},
			closeOverlayHandler (e) {
				if (e.target == this.$refs.overlay) {
					this.emitCloseEvent();
				}
			},
			escKeyHandler (e) {
				if(e.keyCode == 27) {
					this.emitCloseEvent();
				}
			},
			emitCloseEvent () {
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
	// display: flex;
	// flex-direction: column;
	// justify-content: center;
	// align-content: stretch;
	// align-items: center;
	text-align: center;
}

//--------------------------------------------
// Overlay Popup

.uiModal--overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100%;
	background-color: rgba(#000, 0.8);
	z-index: 100000;
	padding: 0.7rem;
	

	.uiModal__window {
		display: inline-block;
		background-color: #fff;
		border-radius: 3px;
		max-width: 400px;
		width: 100%;
		position: relative;
		text-align: left;
	}
}

.uiModal--scrollContent {
	overflow: auto;
}

.uiModal--popup {
	// padding: var(--layout-header-height) 40px;
}


.uiModal__window {
	transition: all 200ms ease-in-out;
}

.uiModal__header {
	display: block;
	border-bottom: 1px solid silver;
	height: 50px;
	line-height: 50px;
	flex: 1 0 auto;
}

.uiModal__content {
	// display: flex;
	// flex-direction: column;
}

.uiModal {
	.uiModal__content {
		// overflow: hidden;
	}
}









.uiModal__title {
	padding: 0 50px;
	text-align: center;
	font-size: 0.9rem;
	font-weight: 700;
}

.modal__toggler {
	top: 0;
	right: 0;
}

.modal-enter-active {
	animation: flipInX 200ms;
	.uiModal__window {
		transform: translate(0,-20px);
		opacity: 0;
	}
}

.modal-leave-active {
	animation: flipOutX 200ms;
	.uiModal__window {
		
	}
}

.modal__toggler {
	position: absolute;
	right: 0;
	top: 0;
	display: block;
	width: 50px;
	height: 50px;
	cursor: pointer;
	
}

.modal__toggler--inPanel {
	position: absolute;
	top: 0;
	left: 0;
}

.modal__burger {
	display: block;
	position: absolute;
	width: 16px;
	height: 2px;
	background: $color-burger;
	left: 12px;
	transition: all 100ms ease-in-out;
}

.modal__burger--1 {
	top: 14px;
}


.modal__burger--2{
	top: 19px;
}

.modal__burger--2B{
	top: 19px;
}

.modal__burger--3 {
	bottom: 14px;
}



.modal__toggler.is-open {
	.modal__burger--1 {
		top: 24px;
		opacity: 0;
	}

	.modal__burger--2{
		top: 24px;
		transform: rotate(45deg);
		width: 18px;
		left: 16px;
		transition: all 100ms 80ms ease-in-out;
	}

	.modal__burger--2B{
		top: 24px;
		transform: rotate(-45deg);
		width: 18px;
		left: 16px;
		transition: all 100ms 80ms ease-in-out;
	}

	.modal__burger--3 {
		bottom: 24px;
		opacity: 0;
	}
}



  @keyframes flipOutX {
	from {
	  opacity: 1;
	}
  
	30% {
	
	}
  
	to {
	  opacity: 0;
	}
  }


  
	@keyframes flipInX {
		from {
			opacity: 0;
		}
	
		40% {
		
		}
	
		60% {
			
		}
	
		80% {
			
		}
	
		to {
			opacity: 1;
		}
	}

</style>
