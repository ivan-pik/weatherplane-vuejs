<template>
		<div class="bearingSelector"
			:class="{
				'bearingSelector--activeDial' : isDragging,
				'bearingSelector--active' : active,
				'bearingSelector--inactive' : !active
			}"
		>

			<div class="bearingSelector__display" v-html="bearingDisplay">
			</div>

			<svg ref="dial" class="bearingSelectorDial" width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<polygon id="Triangle" fill="#fff" points="140 0 160 0 150 16"
					></polygon>
				<g  v-bind:transform="rotationStyle">
					<circle class="bearingSelectorDial__dialSteps" cx="150" cy="150" r="120"></circle>

					<circle class="bearingSelectorDial__dialSteps bearingSelectorDial__dialSteps--small" cx="150" cy="150" r="120"></circle>

					<line class="bearingSelectorDial__runway"
						x1="50"
						y1="150"
						x2="250"
						y2="150"
					/>
					<line class="bearingSelectorDial__runway"
						x1="0"
						y1="150"
						x2="10"
						y2="150"
					/>
					<line class="bearingSelectorDial__runway"
						x1="290"
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

						<polygon fill="#000" points="5 20 15 10 15 30"
						></polygon>
						<polygon fill="#000" points="35 20 25 10 25 30"
						></polygon>
					</svg>

					

					<text class="bearingSelectorDial__direction"
					x="50" y="140"
					font-size="15"
					:transform="labelsUpRightLeft"
					>Left</text>
					<text class="bearingSelectorDial__direction"
					x="250"
					y="140"
					font-size="15"
					:transform="labelsUpRightRight"
					text-anchor="end"
					>Right</text>
					<text class="bearingSelectorDial__direction"
					x="150"
					y="175"
					font-size="15"
					:transform="labelUpRightPilot"
					text-anchor="middle"
					>Pilot</text>
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
							return `rotate(-180 150 170)`;
						}
						return ``;
					},
					labelsUpRightLeft () {
						if (this.bearing > 200 && this.bearing < 340) {
							return `rotate(180 62 135)`;
						}
						return ``;
					},
					labelsUpRightRight () {
						if (this.bearing > 200 && this.bearing < 340) {
							return `rotate(180 232 135)`;
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
