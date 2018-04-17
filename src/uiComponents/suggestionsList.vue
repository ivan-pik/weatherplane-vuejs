<template>
<div class="uiSuggestions">
	<ul class="uiSuggestions" v-if="visible">
		<li
			class="uiSuggestions__item"
			v-for="(suggestion, key) in suggestions" 
			:key="key"
		>
			<a 
				class="uiSuggestions__link"
				v-bind:class="{active : checkIfActive(key)}" 
				@click.stop="clickSelection(key)">
				{{suggestion}}
			</a>
		</li>
	</ul>
</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'ui-suggestions-list',
		props: {
			suggestions: {
				type: Array,
				required: true
				// Array of strings ['suggest1','suggest2']
			},
		},
		created () {
			document.addEventListener('keyup', this.keyUpHandler);
			
		},
		beforeDestroy () {
			document.removeEventListener('keyup', this.keyUpHandler);
		},

		watch: {
			currentPosition (currentPosition) {
				if (currentPosition == -1) {
					return;
				}
				this.$emit('suggestionHighlighted', this.currentPosition);
			},
			suggestions () {
				this.visible = true;
				this.currentPosition = -1;
			}
		},
	 
		methods: {
			keyUpHandler (event) {
				if(event.key == 'ArrowDown') {
					this.moveSelection(+1);
				} else if (event.key == 'ArrowUp') {
					this.moveSelection(-1);
				} else if(event.keyCode == 27) {
					this.visible = false;
				} 

				

			},
			moveSelection(position) {
				let newPosition = position + this.currentPosition;
				if (newPosition < 0 || newPosition > (this.suggestions.length - 1)) {
					return;
				}

				this.currentPosition = newPosition;
			},
			clickSelection(position) {
				this.currentPosition = position;
				this.visible = false;
			},
			checkIfActive (key) {
				if (key == this.currentPosition) {
					return true;
				} else {
					return false;
				}
			}
		},
		
		data () {
			return {
				visible: true,
				currentPosition: -1
			}
		}

	}

</script>

<style lang="scss">
	@import '~globalVars';

	.uiSuggestions {
		display: block;
		position: relative;
	}

	.uiSuggestions_list {
		display: block;
		position: absolute;
		z-index: 1;
		background: #fff;
		font-size: 0.8rem;
		width: 100%;
	}

	.uiSuggestions__item {
		display: block;
	}

	.uiSuggestions__link {
		display: block;
		height: 50px;
		line-height: 50px;
		padding: 0 0.7rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		&.active {
			background-color: $uiInputSelected;
		}

		&:hover {
			background-color: $uiInputHover;
		}
	}
</style>


