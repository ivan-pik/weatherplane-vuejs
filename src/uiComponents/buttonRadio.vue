<template>
	<div class="uiButtonRadio">
		<slot name="label"></slot>
		<ul
			class="uiButtonRadio__items"
		>
			<li v-for="(radio,index) in radios" class="uiButtonRadio__item"
				:class="{'uiButtonRadio__item--active' : radio.active}"
				@click="activeRadioHandler(index)"
				>
				{{radio.label}}
			</li>
		</ul>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'ui-tabs',
		props: {
			radios: {
				type: Array
				/*
				{
					label: 'Tab Label'
					value:
					active: true
				}
				*/
			}, 
		},
		created () {
			
		},
		computed: {
			
		},
	 
		methods: {
			activeRadioHandler (index) {
				var i = 0;
				this.radios.forEach(radio => {
					if (i==index) {
						if (!radio.active) {
							this.$emit('change', radio);
						}
						radio.active = true;
					} else {
						radio.active = false;
					}
					i++;
				});
			}
		},
		
		data () {
			return {
			
			}
		}

	}

</script>

<style lang="scss">

	@import '~globalVars';

	.uiButtonRadio {
		margin: 0 0 1em 0;

		.uiLabel {
			margin-bottom: 1em;
		}
	}

	.uiButtonRadio__items {
		display: flex;
		
	}

	.uiButtonRadio__item {
		text-align: center;
		min-width: 40px;
		border: 1px solid $uiFrame;
		padding: 0 1em;
		font-size: $fontSizeButton;
		position: relative;
		height: 40px;
		line-height: 38px;
		transition: all 200ms;
		&:not(:last-child) {
			margin-right: -1px;
		}
		&:first-child {
			border-radius: 3px 0 0 3px;
		}
		&:last-child {
			border-radius: 0 3px 3px 0;
		}
	}

	.uiButtonRadio__item--active {
		z-index: 1;
		color: $uiInputActiveFront;
		background: $uiInputActive;
		border-color: $uiInputActive;
	}
</style>