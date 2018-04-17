<template>
	<ui-text-input-group>
		<ui-label v-if="label">
			{{label}}
		</ui-label>
		<div class="uiTextWrapper">
			<input
				class="uiTextInput"
				:class="{'input': true, 'is-danger': validationErrors.has('username') }"
				:name="name"
				v-bind:value="value"
				:placeholder="placeholder"
				:autofocus="autofocus"
				:type="type"
				v-on:input="updateValue($event.target.value)"
				:autocomplete="autocomplete"
			>
			<div class="availability"
				v-if="available!==null"
				:class="{
					'availability--yes' : available,
					'availability--no' : (available === false),
				}"
			>
			</div>
		</div>
		<ui-help
			v-if="help"
			:text="help"
		/>

	</ui-text-input-group>
</template>

<script>
  
	export default {
		name: 'ui-text-input',
		props: {
			value: {
				type: [String, Number]
			},
			name: {
				type: String
			},
			label: {
				type: String
			},
			placeholder: {
				type: String
			},
			autofocus: {
				type: Boolean,
				default: false
			},
			autocomplete: {
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: 'text'
			},
			help: {
				type: String,
			},
			available: {
				type: Boolean,
				default: null
			}
		},
		computed: {
			availableText () {
				return (this.available === true) ? 'Available' : 'Not available'
			}
		},
		methods: {
			updateValue (value) {
				this.$emit('input', value);
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

	.uiTextInput {
		display: block;
		height: $uiInputHeight;
		border-bottom: 1px solid $uiInputBorderColor;
		padding: 0 0;
		width: 100%;

		&:focus {
			border-bottom-color: $uiInputBorderColor--active;
			border-width: 2px;
		}
	}

	.uiTextInputGroup.is-invalid:not(.is-untouched) {
		.uiTextInput {
			border-bottom-color: red;
			background: #fdebee;
			color: #c70000;
		}
	}

	.uiTextInput {
		position: relative;
	}

	.availability {
		position: absolute;
		width: 40px;
		height: 50px;
		right: 0;
		bottom: 0;

		&.availability--yes {
			background: green;
		}
		&.availability--no {
			background: red;
		}
	}
	
</style>