<template>
	<ul class="suggestions" v-if="visible">
		<li
			class="suggestions_item"
			v-for="(suggestion, key) in suggestions" 
			:key="key"
		>
			<a 
				class="suggestion_link"
				v-bind:class="{active : checkIfActive(key)}" 
				@click.stop="clickSelection(key)">
				{{suggestion}}
			</a>
		</li>
	</ul>
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
		computed: {
			
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
	.suggestions {
		background: rgb(202, 202, 202);
		display: block;
		position: absolute;
		z-index: 1;
		width: 100%;
	}
	.suggestions_item {
		display: block;
		
	}
	.suggestion_link {
		padding: 1em;
		display: block;
		&.active {
			background-color: red;
		}
	}
</style>


