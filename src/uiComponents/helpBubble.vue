<template>
	<ui-transition-fade>
		<div 
			v-if="bubbleIsOpen"
			class="uiHelpBubble"
		>
			<div class="uiHelpBubble__content">
				<slot />
			</div>
		</div>
	</ui-transition-fade>
</template>

<script>
  
	export default {
		name: 'uiHelpBubble',
		props: {
			open: {
				type: Boolean
			}
		},
		mounted () {
			if (this.open) {

			}
		},
		watch: {
			open (open) {
				if (open) {
					this.showBubble();
				} else {
					this.hideBubble();
				}
			}
		},
		methods: {
			showBubble () {
				this.bubbleIsOpen = true;
				this.setTimer();
			},
			hideBubble () {
				this.bubbleIsOpen = false;
				clearTimeout(this.displayTimer);
			},
			setTimer () {
				this.displayTimer = setTimeout(this.hideBubble, this.DISPLAY_TIME)
			}
		},
		data () {
			return {
				bubbleIsOpen: false,
				DISPLAY_TIME: 3000,
				displayTimer: null
			}
		}

	}

</script>

<style lang="scss">

.uiHelpBubble {
	position: absolute;
	bottom: 20%;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	pointer-events: none;
}

.uiHelpBubble__content {
	background-color: rgba(#000, 0.7);
	color: #fff;
	padding: 1em 2em;
	border-radius: 50px;
	font-size: 0.6rem;
	text-align: center;
	line-height: 1.5;
}

</style>
