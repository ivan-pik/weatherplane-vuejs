<template>
	<div>



<svg width="100px" height="100px" viewBox="-4 -4 108 108" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<defs>
		<path d="M18.8836,32.9150854 L17.5588,30.4972317 L12.2588,30.4972317 C12.0932,30.075878 12.5088,29.1611341 12.5088,29.1611341 C13.584,27.7433415 17.1464,26.2498902 17.1464,26.2498902 L16.0712,12.1645244 L2.1556,11.3278537 C-0.1632,10.9946341 0.0024,9.33457317 0.0024,9.33457317 C0.0024,7.99847561 2.4024,7.58034146 2.4024,7.58034146 L16.2368,6.00519512 L17.2276,1.83310976 L15.3244,1.83310976 L15.3244,1.24836585 L17.8868,1.24836585 L18.9652,0 L19.8776,1.24836585 L22.4464,1.24836585 L22.4464,1.83310976 L20.5432,1.83310976 L21.534,6.00519512 L35.362,7.58034146 C35.362,7.58034146 37.7652,7.99847561 37.7652,9.33457317 C37.7652,9.33457317 37.9308,10.9946341 35.612,11.3278537 L21.6996,12.164122 L20.622,26.2494878 C20.622,26.2494878 24.1872,27.742939 25.2596,29.1603293 C25.2596,29.1603293 25.6752,30.0746707 25.5096,30.4964268 L20.212,30.4964268 L18.8836,32.9150854" id="plane" stroke="none"  fill-rule="nonzero"></path>
	</defs>

		<g id="Group-2"
			v-bind:transform="runwayRotation()"
		>
        <rect id="Rectangle" fill="#555" x="0" y="0" width="25" height="100"></rect>
        <path d="M12,10 L12,90" stroke-dasharray="8 12" id="plane1" stroke="#fff" stroke-width="1" stroke-linecap="square"></path>
				<use
				v-bind:transform="plane1transform()"
				class="plane1" xlink:href="#plane" fill="#00ff00"   />
				<use
				v-bind:transform="plane2transform()"
				class="plane2" xlink:href="#plane" fill="orange"  />

    </g>
		<circle
		id="Oval-2" stroke="#333" stroke-width="7" fill="none" cx="50" cy="50" r="50"

		></circle>
		<circle
			v-bind:stroke-dasharray="bearingStroke()"
			v-bind:stroke-dashoffset="bearingOffset()"
			v-bind:transform="windRotation()"
		id="Oval-2" stroke="#00ff00" stroke-width="7" fill="none" cx="50" cy="50" r="50"

		></circle>

		<circle
			v-if="bothDirections"
			v-bind:stroke-dasharray="bearingStroke()"
			v-bind:stroke-dashoffset="bearingOffset()"
			v-bind:transform="windRotation2()"
		id="Oval-3" stroke="orange" stroke-width="7" fill="none" cx="50" cy="50" r="50"

		></circle>





</svg>

	</div>
</template>
<script>
    import Vue from 'vue';


    export default {
        name: 'windBearingToleranceChart',
				props: ['bearing','tolerance','bothDirections'],
				computed: {

				},
				methods: {
					plane1transform() {
						var transform = "translate(32 44) rotate(180)";
						if (this.bothDirections) {
							var transform = "scale(0.75) translate(35 46) rotate(180) ";
						}
						return transform;
					},
					plane2transform() {
						var transform = "translate(-6 58) scale(0)";
						if (this.bothDirections) {
							var transform = "scale(0.75) translate(-2 85) ";
						}
						return transform;
					},
					runwayRotation () {
						var transform = "rotate(" + this.bearing + " 50 50) translate(37 0)";
						return transform;
					},
					windRotation () {
						var transform = "rotate(" + this.bearing + " 50 50) translate(0 0)";
						return transform;
					},
					windRotation2 () {
						let bearing = this.bearing - 180;
						var transform = "rotate(" + bearing + " 50 50) translate(0 0)";
						return transform;
					},
					bearingStroke () {
						//@todo: DRY
						let portion = this.tolerance * 4 * 0.01 / 3.6;
						let circumference = this.DIAMETER * Math.PI;
						this.bearingStrokeLength = circumference * portion * 0.5;



							this.bearingStrokeValue = this.bearingStrokeLength + " " + circumference * (1-portion+portion);




						return this.bearingStrokeValue;
					},
					bearingOffset () {
						let offsetLenght = (this.bearingStrokeLength * 0.5 - (this.DIAMETER * Math.PI) * 0.25);
						this.offsetLength = offsetLenght ;
						return this.offsetLength;
					}
				},
        data () {
          return {
						DIAMETER: 100,
						bearingStrokeValue : 0,
						offsetLength: 0,
						bearingStrokeLength: 0
          }
        }

    }



</script>



<style scoped lang="scss">

</style>
