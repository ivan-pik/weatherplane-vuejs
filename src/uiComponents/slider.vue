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
				{{minValue}} {{unit}}
			</div>
			<div class="uiSlider__currentValue">
				{{knobValue}} {{unit}}
			</div>
			<div class="uiSlider__edgeValue uiSlider__edgeValue--max">
				{{maxValue}} {{unit}}
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';

	//@todo: Make the size calculations responsive
	//@todo: Better aligning of knob to the nearest possible value
	//@todo: returns NaN when min and maxValue are 0
	
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
			},
			value: {
				type: Number
			},
			step: {
				type: Number
			},
			name: {
				type: String
			},
			unit: {
				type: String
			}
		},
		created () {
			document.addEventListener('mousedown', this.mousedownHandler);
			document.addEventListener('mouseup', this.mouseupHandler);
			document.addEventListener('mousemove', this.moveHandler);
		},
		beforeDestroy () {
			document.removeEventListener('mousedown', this.mousedownHandler);
			document.removeEventListener('mouseup', this.mouseupHandler);
			document.removeEventListener('mousemove', this.moveHandler);
		},
		mounted () {
			this.posLeft = (this.$refs.knob.getBoundingClientRect()).left;
			this.posRight = (this.$refs.slider.getBoundingClientRect()).right;
			this.moveKnobToValue(this.currentValue);
			this.knobValue = this.currentValue;
			
		},
		computed: {
			currentValue () {
				return this.modelValue;
			},
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

				return ;

				// return this.left / this.sliderWidth;
			},
			range () {
				return  this.maxValue - this.minValue;
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
			maxValue () {
				this.moveKnobToValue(this.currentValue);
			},
			minValue () {
				this.moveKnobToValue(this.currentValue);
			},
			currentValue (val) {
				if (!this.isKnob) {
					this.moveKnobToValue(val);
					this.knobValue = val;
				}
			}
		},
		methods: {
			trackClickHandler () {
				let clickedToProgress = Math.min(Math.max( (event.offsetX - 10) / this.sliderWidth, 0),1);

				let newValue = this.alignValueToStep(this.getValueFromProgress(clickedToProgress));

				this.updateInput(newValue);
				this.knobValue = newValue;
			},

			getValueFromProgress (progress) {
				return this.minValue + (this.range * progress)
			},

			alignValueToStep (value) {
				return Math.floor(value / this.step) * this.step;
			},

	


			moveKnobToValue (val) {
				var absoluteVal = val - (this.minValue);
				let newLeft = absoluteVal * this.stepSize;
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
			updateInput(value) {
				this.$emit('change', value);
			},
			alignValueToClosestStep (value) {
				return ((this.value - this.minValue) / this.step) * this.stepSize;
			},
			alignKnobToStep () {
				let newLeft = ((this.knobValue - this.minValue) / this.step) * this.stepSize;
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
				if (this.isKnob) {
					this.alignKnobToStep();
					this.updateInput(this.knobValue);
				}
				this.isKnob = false;
				this.first = true;
				this.offset = 0;
				
			},
			moveHandler () {
				if (this.isKnob) {
					if (this.first) {
						this.offset = event.clientX - this.left;
						this.first = false;
					}
					let movement = Math.min(Math.max(event.clientX - this.offset, 0), this.posRight - 40);
					this.left =+ movement;
					this.knobProgress = this.left / this.sliderWidth;
					this.knobValue = this.alignValueToStep(this.getValueFromProgress(this.knobProgress));
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
				transitionStyle: '',
				knobProgress: 0,
				knobValue: 0,
			}
		}
	}
</script>

<style lang="scss">
	.uiSlider {
		position: relative;
		min-height: 40px;
	}
	.uiSlider__track {
		margin: 0 10px;
		height: 40px;
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
		margin: 5px 10px 0;
		display: flex;
		justify-content: space-between;
		
	}

</style>