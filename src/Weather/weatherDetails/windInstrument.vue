<template>
	<div class="windInstrument">
		<svg width="180px" height="180px" viewBox="0 0 180 180" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				<polygon
					id="arrow"
					points="0,10 16,10 8,0"
				/>
				<mask id="inactiveMask">
					<rect  
						width="90" 
						height="180"
						:fill="sideOpacityStyle.leftBg"
						x="0" 
						y="0"
					/>
					<rect  
						width="90" 
						height="180"
						:fill="sideOpacityStyle.rightBg"
						x="90" 
						y="0"
					/>
				</mask>
			</defs>
			<g mask="url(#inactiveMask)">
				<ellipse
					class="windInstrument__maxWindSpeedIndicator"
					cx="90"
					cy="90"
					rx="74" 
					:ry="maxSpeedTreshold*2"
				>
				</ellipse>
				<circle class="windInstrument__dial" cx="90" cy="90" r="74"></circle>
				<circle class="windInstrument__dialSteps" cx="90" cy="90" r="69"></circle>
				
			</g>
			<g :transform="rotation">
			<svg width="16px" height="180px" viewBox="0 0 16 180"
				x="82"
				y="0"
			>

				
				
				<rect 
					class="windInstrument__windDirectionIndicator"
					width="4" 
					height="148"
					x="6" 
					y="16"
				/>

				

				<use y="7" class="windInstrument__windDirectionArrow" xlink:href="#arrow"></use>

				<use y="163" class="windInstrument__windDirectionArrow" xlink:href="#arrow"></use>

				<g
					transform="rotate(-90 0 0) translate(-90,-17)"
				>
					<svg width="90" height="50">
						<wind-speed-bar
							:uid="'instrumentBar'" 
							:windSpeed="windSpeed" 
							:windGust="windGust"
							:maxSpeedToDisplay="16"
							:maxSpeedTreshold="maxSpeedTreshold"
							:order="0"
							:chartWidth="69"
						/>
					</svg>
				</g>

				
				
				
			</svg>
			</g>

			<circle class="windInstrument__center" cx="90" cy="90" r="5"></circle>
			
		</svg>
	</div>
</template>

<script>
	import Vue from 'vue';
	import windSpeedBar from '../components/windSpeedBar.vue';
	
	export default {
		name: 'windInstrument',
		props: {
			windBearing: {
				type: Number
			},
			windSpeed: {
				type: Number
			},
			windGust: {
				type: Number
			},
			maxSpeedTreshold: {
				type: Number
			},
			activeSide: {
				type: String
			}
		},
		mounted () {
			this.sideOpacity(this.activeSide);
		},
		components: {
			'wind-speed-bar' : windSpeedBar
		},
		watch: {
			activeSide(val) {
				this.sideOpacity(val);
			}
		},

		computed: {
			angle () {
				return this.windBearing;
			},
		
			rotation () {
				return "rotate(" + this.angle + " 90 90)"
			}
		},
	 
		methods: {
			sideOpacity () {
				if (this.activeSide == "left") {
					this.sideOpacityStyle = {
						leftBg: "#fff",
						rightBg: "#555"
					}
				} else if (this.activeSide == "right") {
					this.sideOpacityStyle = {
						leftBg: "#555",
						rightBg: "#fff"
					}
				} else {
					this.sideOpacityStyle = {
						leftBg: "#fff",
						rightBg: "#fff"
					}
				}
			},
		},
		
		data () {
			return {
				maxCrossWind: 40,
				sideOpacityStyle: {
					leftBg: "#fff",
					rightBg: "#fff"
				}
			}
		}
	}
</script>

