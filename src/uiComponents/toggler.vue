<template>
	<div class="uiToggler" ref="slider">
		<div class="uiToggler__track"
			@click="trackClickHandler"
		></div>
		<div class="uiToggler__knob"
			ref="knob"
			v-bind:style="[leftStyle,transitionStyle,knobWidthStyle]"
		></div>

		<div class="uiToggler__values">
			<div v-for="option in options"
				class="uiToggler__value">
				{{option.label}}
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';

	//@todo: Make the size calculations responsive
	
	export default {
		name: 'uiToggler',
		 model: {
			prop: 'modelValue',
			event: 'change'
		},
		props: {
			options: {
				type: Array
				// {
				//	label: 'Both',
				// 				value: 'both',
				// 				default: true
				// 	},
			},
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
			
			// check for value input
			
			this.moveKnobToValue(this.currentValue);
		},
		computed: {
			currentValue () {
				var i = 0;
				var activeI = 0;
				this.options.forEach(function (item) {
					if (item.default) {
						activeI = i;
					} else {
						i++;
					}
					
				});
				
				return activeI;
			},
			leftStyle () {
				return {
					left: `${this.left}px`
				}
			},
			sliderWidth () {
				return (this.posRight - this.posLeft) - ((this.posRight - this.posLeft) / this.nOfSteps - 1);
			},
			progress () {
				return this.left / this.sliderWidth;
			},
			returnedValue () {
				let notSteppedValue = this.nOfSteps * this.progress;
				return Math.floor(notSteppedValue);
			},
			nOfSteps () {
				return this.options.length;
			},
			stepSize () {
				return this.sliderWidth / (this.nOfSteps - 1);
			},
			knobWidth () {
				return (this.posRight - this.posLeft) / (this.nOfSteps );
			},
			knobWidthStyle () {
				return {
					width : `${this.knobWidth}px`
				}
			}
		},
		watch: {
			currentValue (val) {
				if (!this.isKnob) {
					this.moveKnobToValue(val);
				}
			}
		},
		methods: {
			trackClickHandler () {
				// @todo: this is broken
				let newValue = Math.min(Math.round(event.offsetX / (
					(this.posRight - this.posLeft) / this.nOfSteps)
					), this.nOfSteps - 1);
				this.moveKnobToValue(newValue);
			},
			moveKnobToValue (val) {
				let newLeft = val * this.stepSize;
				this.moveKnob(newLeft);

			},
			moveKnob(distance) {
				if(this.left != distance) {
					let knobOffset = Math.abs(this.left - distance);

					let transitionTime = 200;

					this.transitionStyle = {
						transition: `all ${transitionTime}ms ease-in-out;`
					}
					
					this.left = distance;
					
					setTimeout(() => {
						this.transitionStyle = {};
					}, transitionTime);
				}
			},
			updateInput() {
				// use 'change' event when v-model is used
				// this.$emit('change', this.returnedValue);
				// use 'update' when value is returned in an event
				// this.$emit('update', {
				// 	value: this.returnedValue,
				// 	name: this.name
				// });
			},
			alignKnobToStep () {
				let newLeft = ((this.returnedValue)) * this.stepSize;
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
					let movement = Math.min(Math.max(event.clientX - this.offset, 0), this.posRight - this.stepSize);
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
				transitionStyle: '',
				minValue: 0,

			}
		}
	}
</script>

<style lang="scss">
	.uiToggler {
		position: relative;
		min-height: 40px;
	}
	.uiToggler__track {
		margin: 0 0;
		height: 40px;
		position: relative;
		&::after {
			content: '';
			display: block;
			height: 20px;
			width: 100%;
			position: absolute;
			top: 10px;
			background-color: #ccc;
			border-radius: 20px;
		}
	}
	.uiToggler__knob {
		position: absolute;
		top: 0;
		width: 40px;
		height: 40px;
		cursor: pointer;
		transition: all 0s ease-in-out;
		
		&::after {
			position: absolute;
			top: 10px;
			left: 0;
			content: '';
			display: block;
			right: 0;
			height: 20px;
			border-radius: 20px;
			background-color: black;
		}
	}

	.uiToggler__values {
		margin: 5px 0 0 0;
		display: flex;
		justify-content: space-between;
		
	}

</style>