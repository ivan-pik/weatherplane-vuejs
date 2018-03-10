<template>
	<div class="uiSliderWrapper">
		<ui-label v-if="label">
			{{label}}
		</ui-label>
		<div class="uiSlider"
			ref="slider"
			:class="{
				'disabled' : disabled,
				'is-dragging' : isKnob,
				}"
		>
			<div class="uiSlider__trackValue"
				v-bind:style="{
					'width': this.left + 'px',
					'transition' : `all ${this.transitionTime}ms ease-in-out`
					}"
			></div>
			<div class="uiSlider__track"
				
				@click="trackClickHandler"
			></div>
			<div class="uiSlider__knob"
				v-bind:class="{'is-dragging' : this.isKnob}"
				ref="knob"
				v-on:touchstart="touchStart"
				v-on:touchend="touchEnd"
				v-bind:style="{
					'left': this.left + 'px',
					'transition' : `all ${this.transitionTime}ms ease-in-out`
					}"
			>
				<div class="uiSlider__knobValue">
					{{knobValue}}
				</div>
			</div>
			<div class="uiSlider__values">
				<div class="uiSlider__edgeValue uiSlider__edgeValue--min">
					{{minValue}} {{minValueUnit}}
				</div>
				<div class="uiSlider__currentValue">
					{{knobValue}} {{knobValueUnit}}
				</div>
				<div class="uiSlider__edgeValue uiSlider__edgeValue--max">
					{{maxValue}} {{maxValueUnit}}
				</div>
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
			label: {
				type: String
			},
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
			},
			unitPlural: {
				type: String
			}
		},
		created () {
			document.addEventListener('mousedown', this.mousedownHandler);
			document.addEventListener('mouseup', this.mouseupHandler);
			document.addEventListener('mousemove', this.moveHandler);
			document.addEventListener('touchmove', this.moveHandler);
		},
		beforeDestroy () {
			document.removeEventListener('mousedown', this.mousedownHandler);
			document.removeEventListener('mouseup', this.mouseupHandler);
			document.removeEventListener('mousemove', this.moveHandler);
			document.removeEventListener('touchmove', this.moveHandler);
		},
		mounted () {
			this.knobValue = this.currentValue;
			this.sliderWidth = this.$refs.slider.offsetWidth - 40;
			this.posLeft = this.$refs.slider.offsetLeft;
			this.posRight = this.posLeft + this.$refs.slider.offsetWidth;
			setTimeout(() => {
				this.moveKnobToValue(this.currentValue);
				this.init = false;
			},1000);
		},
		computed: {
			currentValue () {
				return this.modelValue;
			},
			range () {
				let range = this.maxValue - this.minValue;
				if (range == 0) {
					this.disabled = true;
				} else {
					this.disabled = false;
				}
				return range;
			},
			
			nOfSteps () {
				if (this.range % this.step != 0) {
					// @todo: rework to a prop validation
					console.error("Meh, fractional step bro");
				}

				return this.range / this.step;
			},
			stepSize () {
				if (this.nOfSteps != 0) {
					return this.sliderWidth / this.nOfSteps;
				} else {
					return 1;
				}
			},
			minValueUnit () {
				if (this.minValue === 1) {
					return this.unit
				} else {
					return this.unitPlural || this.unit
				}
			},
			maxValueUnit () {
				if (this.maxValue === 1) {
					return this.unit
				} else {
					return this.unitPlural || this.unit
				}
			} ,
			knobValueUnit () {
				if (this.knobValue === 1) {
					return this.unit
				} else {
					return this.unitPlural || this.unit
				}
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
			touchStart () {
				this.isTouch = true;
				this.isKnob = true;
			},
			touchEnd () {
				this.isTouch = false;
				this.mouseupHandler();
			},
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
				return (Math.floor(value / this.step) * this.step) + (Math.round(value % this.step) * this.step);
			},

			moveKnobToValue (val) {
				var absoluteVal = val - (this.minValue);
				
				let newLeft = absoluteVal * this.stepSize;
				this.moveKnob(newLeft);
			},
			moveKnob(distance) {
				if(this.left != distance) {
					
					let knobOffset = Math.abs(this.left - distance);
					let transitionMultiplier = 400;
					if (this.init) {
						transitionMultiplier = 1200;
					}

					let transitionTime = (knobOffset / this.sliderWidth) * transitionMultiplier;

					this.transitionTime = transitionTime;
					
					this.left = distance;
					
					setTimeout(() => {
						this.transitionTime = 0;
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
					var pointerX = this.isTouch ? event.touches[0].clientX : event.clientX;
					if (this.first) {
						this.offset = pointerX - this.left;
						this.first = false;
					}
					let movement = Math.min(Math.max(pointerX - this.offset, 0),   this.posRight - this.posLeft - 40);
					this.left =+ movement;
					this.knobProgress = Math.min(this.left / this.sliderWidth, 1);
					this.knobValue = this.alignValueToStep(this.getValueFromProgress(this.knobProgress));
				}
			},
			touchmoveHandler () {
				
			}
		},
		data () {
			return {
				disabled: false,
				left: 0,
				posRight: 0,
				posLeft: 0,
				isKnob: false,
				first: true,
				offset: 0,
				knobClass: '',
				transitionTime: 0,
				knobProgress: 0,
				knobValue: 0,
				isTouch: false,
				sliderWidth: 0,
				init: true
			}
		}
	}
</script>

<style lang="scss">

	@import '~globalVars';

	.uiSlider {
		position: relative;
		min-height: 40px;
		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}
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
			background-color: $uiInputInactive;
		}
	}
	.uiSlider__trackValue {
		position: absolute;
		left: 10px;
		z-index: 1;
		pointer-events: none;
		&::after {
			content: '';
			display: block;
			height: 2px;
			width: 100%;
			position: absolute;
			top: 19px;
			background-color: $uiInputActive;
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
			background-color: $uiInputActive;
		}

		&::before {
			position: absolute;
			top: 14px;
			left: 14px;
			content: '';
			display: block;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background-color: #fff;
			z-index: 1;
			opacity: 0;
			transition: all 200ms ease-in-out;
		}
	}

	.uiSlider__values {
		font-size: 9px;
		margin: 0 10px 0;
		display: flex;
		justify-content: space-between;
		color: $uiInputInactiveFront;
		position: relative;
		top: -3px;
		
	}
	.uiSlider__currentValue {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		font-weight: bold;
		color: $textBaseColour;
		font-size: 12px;
	}

	.uiSlider__knobValue {
		font-size: 0.7rem;
		display: inline-block;
		pointer-events: none;
		background-color: $uiInputActive;
		position: absolute;
		padding: 0.5em;
		bottom: 100%;
		width: 40px;
		text-align: center;
		border-radius: 3px;
		color: $uiInputActiveFront;
		opacity: 0;
		transform: translate(0,30px);
		transition: all 200ms ease-in-out;
	}

	.uiSlider__knob.is-dragging {

		.uiSlider__knobValue {
			opacity: 1;
			transform: translate(0,0);
		}

		&::before {
			opacity: 1;
		}
	}

</style>