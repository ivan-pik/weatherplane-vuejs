<template>
	<button
		class="uiButton"
		:class="[
			typeClass,
			{
				'uiButton--disabled' : disabled,
				'uiButton--raised' : raised,
				'uiButton--link' : !raised
			}
		]"
		:type="(submit) ? 'submit' : null"
		:disabled="(disabled) ? 'disabled' : null"
		@click="click"
	>
		{{text}}
	</button>
</template>

<script>
  
	export default {
		name: 'ui-button',
		props: {
			text: {
				type: String,
				required: true,
			},
			submit: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
			},
			disabled: {
				type: Boolean,
				default: false
			},
			raised: {
				type: Boolean,
				default: true
			}
		},
		created () {
			
		},
		computed: {
			typeClass () {
				switch (this.type) {
					case 'primary':
						return 'uiButton--primary'
						break;
					case 'danger':
						return 'uiButton--danger'
						break;
				}
			}
		},
	 
		methods: {
			click (event) {
				this.$emit('click', event);
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

	.uiButton {
		height: 50px;
		font-size: $fontSizeButton;
		text-transform: uppercase;
		text-align: center;
		line-height: 50px;
		white-space: nowrap;
		flex: 0 0 auto;
	}

	.uiButton--link {
		display: inline-block;

		&.uiButton--primary {
			color: $uiButtonPrimary;
		}

		&.uiButton--danger {
			color: red;
		}
	}

	.uiButton--raised {
		color: #fff;
		display: block;
		width: 100%;
		background: #444;
		padding: 0 1em;
		color: #fff;

		&.uiButton--primary {
			background-color: $uiButtonPrimary;
		}

		&.uiButton--danger {
			background-color: red;
		}
	}

	

	.uiButton--disabled {
		opacity: 0.5;
	}
</style>