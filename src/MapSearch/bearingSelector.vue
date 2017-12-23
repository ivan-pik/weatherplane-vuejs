<template>
		<div class="bearingSelector">

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
					<circle 
						class="bearingSelectorDial__knob"
						ref="knob"
						cx="150"
						cy="270"
						r="20"
						:class="{
							'bearingSelectorDial__knob--active' : isDragging
						}"
					/>

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

			<ui-toggler
				:options="directionOptions"
			/>

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

				computed: {
					rotationStyle () {
						return `rotate(${this.rotation} 150 150)`;
					},
					bearingDisplay () {
						var bearingString = "" + this.bearing;
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
						if (event.target == this.$refs.knob) {
							this.isDragging = true;
						}
					},
					mouseupHandler () {
						this.isDragging = false;
					},
					mousemoveHandler (event) {
						if (this.isDragging) {

							var dialTop = (this.$refs.dial.getBoundingClientRect()).top;

							var dialLeft = (this.$refs.dial.getBoundingClientRect()).left;

							var dialHeight = (this.$refs.dial.getBoundingClientRect()).height;

							var dialWidth = (this.$refs.dial.getBoundingClientRect()).width;
							
							var top = event.pageY;

							var left = event.pageX;
							
							var relTop = Math.min(Math.max(-1 + (top - dialTop) / (dialHeight * 0.5), -1),1);

							var relLeft = Math.min(Math.max(-1 + (left - dialLeft) / (dialWidth * 0.5), -1),1);

							var angleRad = Math.atan2(relTop, relLeft);

							var angleDeg = angleRad * 180 / Math.PI;
							
							this.rotation = angleDeg - 90;

							var newBearing = angleDeg;

							if (angleDeg < 0) {
								newBearing = 360 + angleDeg;
							}

							this.bearing = Math.floor(newBearing);
						}
					},
				},
				data () {
					return {
						rotation: 0,
						bearing: 90,
						isDragging: false,
						directionOptions: [
							{
								label: 'Left',
								value: 'left'
							},
							{
								label: 'Both',
								value: 'both',
								default: true
							},
							{
								label: 'Right',
								value: 'right'
							}
						]
					}
				}
		}



</script>
