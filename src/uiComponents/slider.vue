<template>
	<div class="uiSlider" ref="slider">
		<div class="uiSlider__track"
			@click="trackClickHandler"
		></div>
		<div class="uiSlider__knob"
			ref="knob"
			:style="concatStyles"
		></div>
		<div class="uiSlider__values">
			<div class="uiSlider__edgeValue uiSlider__edgeValue--min">
				{{minValue}}
			</div>
			<div class="uiSlider__currentValue">
				{{returnedValue}}
			</div>
			<div class="uiSlider__edgeValue uiSlider__edgeValue--max">
				{{maxValue}}
			</div>
		</div>
		{{modelValue}}
	</div>
</template>

<script>
	import Vue from 'vue';

	//@todo: Make the size calculations responsive
	
	export default {
		name: 'uiSlider',
		 model: {
			prop: 'modelValue',
			event: 'change'
		},
		props: {
			minValue: {
				type: Number
			},
			maxValue: {
				type: Number
			},
			modelValue: {
				default: 0
			},
			value: {
				type: Number
			},
			step: {
				type: Number
			}
		},
		created () {
			// @todo: remove events on component destroy
			document.addEventListener('mousedown', this.mousedownHandler);
			document.addEventListener('mouseup', this.mouseupHandler);
			document.addEventListener('mousemove', this.moveHandler);
		},
		mounted () {
			this.posLeft = (this.$refs.knob.getBoundingClientRect()).left;
			this.posRight = (this.$refs.slider.getBoundingClientRect()).right;
			
			this.moveKnobToValue(this.modelValue);
			 
		},
		computed: {
			concatStyles() {
				return this.leftStyle + this.transitionStyle;
			},
			leftStyle () {
				return `left: ${this.left}px; `;
			},
			sliderWidth () {
				return this.posRight - this.posLeft - 40;
			},
			progress () {
				return this.left / this.sliderWidth;
			},
			range () {
				return this.maxValue - this.minValue;
			},
			returnedValue () {
				let notSteppedValue =  this.minValue + this.range * this.progress;
				return Math.floor(notSteppedValue / this.step) * this.step;
			},
			nOfSteps () {
				if (this.range % this.step != 0) {
					// @todo: rework to a prop validation
					console.error("Meh, fractional step bro");
				}

				return this.range / this.step;
			},
			stepSize () {
				return this.sliderWidth / this.nOfSteps;
			} 
		},
		watch: {
			returnedValue () {
				this.updateInput();
			},
			modelValue (val) {
				if (!this.isKnob) {
					console.log("no knob");
					this.moveKnobToValue(val);
				}
			}
		},
		methods: {
			trackClickHandler () {

				let newValue = Math.min(Math.round(event.offsetX / this.stepSize), this.maxValue);

				console.log(newValue);

				this.moveKnobToValue(newValue);

			},
			moveKnobToValue (val) {
				console.log('moving know', val);
				
				let newLeft = val * this.stepSize;
				console.log('newLeft',newLeft);
				this.moveKnob(newLeft);

			},
			moveKnob(distance) {
				if(this.left != distance) {
					

					let knobOffset = Math.abs(this.left - distance);

					let transitionTime = (knobOffset / this.sliderWidth) * 200;

					this.transitionStyle = ` transition: all ${transitionTime}ms ease-in-out;`;
					
					this.left = distance;
					
					setTimeout(() => {
						this.transitionStyle = '';
					}, transitionTime);

				}
			},
			updateInput() {
				this.$emit('change', this.returnedValue);
			},
			alignKnobToStep () {
				let newLeft = ((this.returnedValue - this.minValue) / this.step) * this.stepSize;
				this.moveKnob(newLeft);
			},
			mousedownHandler () {
				let knob = this.$refs.knob;
				if (event.target == knob) {
					this.isKnob = true;
				} else {
					this.isKnob = false;
				}
			},
			mouseupHandler () {
				this.isKnob = false;
				this.first = true;
				this.offset = 0;
				this.alignKnobToStep();
			},
			moveHandler () {
				if (this.isKnob) {
					if (this.first) {
						this.offset = event.clientX - this.left;
						this.first = false;
					}
					let movement = Math.min(Math.max(event.clientX - this.offset, 0), this.posRight - 40);
					this.left =+ movement;
				}
			},
		},
		data () {
			return {
				left: 0,
				posLeft: 0,
				posRight: 0,
				isKnob: false,
				first: true,
				offset: 0,
				knobClass: '',
				transitionStyle: ''
			}
		}
	}
</script>

<style lang="scss">
	.uiSlider {
		position: relative;
		min-height: 40px;
		background: orange;
	}
	.uiSlider__track {
		margin: 0 10px;
		height: 40px;
		background-color: pink;
		position: relative;
		&::after {
			content: '';
			display: block;
			height: 2px;
			width: 100%;
			position: absolute;
			top: 19px;
			background-color: #000;
		}
	}
	.uiSlider__knob {
		position: absolute;
		top: 0;
		width: 40px;
		height: 40px;
		cursor: pointer;
		transition: all 0s ease-in-out;
		
		
		&::after {
			position: absolute;
			top: 10px;
			left: 10px;
			content: '';
			display: block;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background-color: black;
		}
	}

	.uiSlider__values {
		margin: 40px 10px 0;
		display: flex;
		justify-content: space-between;
		
	}

</style>