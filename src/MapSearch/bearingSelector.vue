<template>
	<div class="bearingSelector"
		:class="{
			'bearingSelector--activeDial' : isDragging,
			'bearingSelector--active' : active,
			'bearingSelector--inactive' : !active
		}"
	>
		<div class="bearingSelector__display" v-html="bearingDisplay"></div>

		<svg ref="dial" class="bearingSelectorDial" width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<polygon id="Triangle" fill="#fff" points="140 0 160 0 150 16"></polygon>
			<g v-bind:transform="rotationStyle">
				<circle class="bearingSelectorDial__dialSteps" cx="150" cy="150" r="120"></circle>

				<circle class="bearingSelectorDial__dialSteps bearingSelectorDial__dialSteps--small" cx="150" cy="150" r="123"></circle>

				<line class="bearingSelectorDial__runway"
					x1="0"
					y1="150"
					x2="300"
					y2="150"
				/>

				<line class="bearingSelectorDial__runwayCenterline"
					x1="0"
					y1="150"
					x2="300"
					y2="150"
				/>
				
				<svg class="bearingSelectorDial__knob-wrapper" viewBox="0 0 40 40" version="1.1" ref="knob"
					width="40" height="40"
					x="130" y="250"
				>
					<circle 
						class="bearingSelectorDial__knob"
						cx="20"
						cy="20"
						r="20"
						:class="{
							'bearingSelectorDial__knob--active' : isDragging
						}"
					/>

					<polygon class="bearingSelectorDial__knobArrow" points="10 20 18 10 18 30"
					></polygon>
					<polygon class="bearingSelectorDial__knobArrow" points="30 20 22 10 22 30"
					></polygon>
				</svg>

				<text class="bearingSelectorDial__direction"
					x="60" y="125"
					font-size="13"
					:transform="labelsUpRightLeft"
				>
					LEFT
				</text>

				<text class="bearingSelectorDial__direction"
					x="240"
					y="125"
					font-size="13"
					:transform="labelsUpRightRight"
					text-anchor="end"
				>
				RIGHT
				</text>

				<text class="bearingSelectorDial__direction"
					x="150"
					y="190"
					font-size="13"
					:transform="labelUpRightPilot"
					text-anchor="middle"
				>
					PILOT
				</text>
				</g>
		</svg>


	</div>

</template>
<script>
		import Vue from 'vue'
		import uiToggler from '../uiComponents/toggler.vue';
		

		export default {
				name: 'BearingSelector',
				components: {
					'ui-toggler' : uiToggler
				},
				created () {
					document.addEventListener('mousedown', this.mousedownHandler);
					document.addEventListener('mouseup', this.mouseupHandler);
					document.addEventListener('mousemove', this.mousemoveHandler);
				},
				beforeDestroy () {
					document.removeEventListener('mousedown', this.mousedownHandler);
					document.removeEventListener('mouseup', this.mouseupHandler);
					document.removeEventListener('mousemove', this.mousemoveHandler);
				},

				props: {
					active: {
						type: Boolean
					},
					value: {
						type: Number
					}
				},

				computed: {
					rotation () {
						return this.value - 90;
					},
					rotationStyle () {
						return `rotate(${this.rotation} 150 150)`;
					},
					bearingDisplay () {
						var bearingString = "" + this.value;
						var slength = bearingString.length;

						var spans = function (value) {
							var splitted = value.split("");
							var spannedString = splitted.map(function (item) {
								
								return `<span class="bearingSelector__display-digit">${item}</span>`;
							});
							return (spannedString.join('')) + `&deg;`;
						}
						
						if (slength == 2) {
							bearingString =  `0${bearingString}`;
						} else if (slength == 1) {
							bearingString = `00${bearingString}`;
						}


						return spans(bearingString);
					},
					labelUpRightPilot () {
						if (this.bearing > 200 && this.bearing < 340) {
							return `rotate(-180 150 185)`;
						}
						return ``;
					},
					labelsUpRightLeft () {
						if (this.bearing > 200 && this.bearing < 340) {
							return `rotate(180 72 120)`;
						}
						return ``;
					},
					labelsUpRightRight () {
						if (this.bearing > 200 && this.bearing < 340) {
							return `rotate(180 222 120)`;
						}
						return ``;
					}


				},

			
				methods: {
					mousedownHandler (event) {
						if (event.target == this.$refs.knob ||
							event.target.parentElement == this.$refs.knob
						) {
							this.isDragging = true;
						}
					},
					mouseupHandler () {
						this.isDragging = false;
					},
					mousemoveHandler (event) {
						if (this.isDragging) {

							var dial = this.$refs.dial.getBoundingClientRect();
							
							var cursorTop = event.pageY;
							var cursorLeft = event.pageX;
							
							var relTop = Math.min(Math.max(-1 + (cursorTop - dial.top) / (dial.height * 0.5), -1),1);

							var relLeft = Math.min(Math.max(-1 + (cursorLeft - dial.left) / (dial.width * 0.5), -1),1);

							var angleRad = Math.atan2(relTop, relLeft);
							var angleDeg = angleRad * 180 / Math.PI;
							
							

							// Set new bearing
							this.bearing = Math.floor((angleDeg < 0) ? 360 + angleDeg : angleDeg);

							this.$emit('input', this.bearing);
						}
					},
				},
				data () {
					return {
						isDragging: false,
						bearing: 0
					}
				}
		}



</script>
<style lang="scss">
@import '~globalVars';

.bearingSelector {
	position: fixed;
	top: 80px;
	bottom: 40px;
	width: 100%;
	background: rgba(#000,0.6);
	transition: all 200ms ease-in-out;
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	
}
.bearingSelector--inactive {
	pointer-events: none;
	background: rgba(#fff,0);
	opacity: 0.8;
	.bearingSelectorDial__knob-wrapper {
		opacity: 0;
	}
}

.bearingSelector--active {
	pointer-events: all;
}

.bearingSelector--activeDial {
	background: rgba(#000,0.2);
}


.bearingSelector__display {
	text-align: center;
	color: #000;
	padding: 0.6em 1.2em 0.5em;
	font-size: 14px;
	background: #fff;
	border-radius: 20px;
}

.bearingSelector__display-digit {
	display: inline-block;
	min-width: 0.8em;
	text-align: center;
	font-weight: bold;
}


.bearingSelectorDial {
	display: block;
	margin: 0 auto;
}

.bearingSelectorDial__dialSteps {
	fill: none;
	stroke-width: 15;
	stroke: #fff;
	stroke-dasharray: 2,45;
	stroke-dashoffset: 0;
}

.bearingSelectorDial__dialSteps--small {
	stroke-dasharray: 1,7;
	stroke-width: 8;
	stroke-dashoffset: -2;
}

.bearingSelectorDial__runway {
	stroke: rgba(#fff, 0.3);
	stroke-width: 30;
}

.bearingSelectorDial__runwayCenterline {
	stroke: #fff;
	stroke-width: 2;
	stroke-dasharray: 6,6;
	stroke-dashoffset: 2;
}

.bearingSelectorDial__knob {
	fill: $uiButtonPrimary;
}

.bearingSelectorDial__knob--active {
	fill: $uiInputActive;
}

.bearingSelectorDial__knobArrow {
	fill: $uiButtonPrimaryFront;
}

.bearingSelectorDial__direction {
	fill: #fff;
}

</style>
