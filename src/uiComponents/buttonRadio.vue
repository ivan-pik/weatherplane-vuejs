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
.uiButtonRadio {
	margin: 0 0 1em 0;
}

.uiButtonRadio__items {
	display: flex;
}

.uiButtonRadio__item {
background: #ccc;
padding: 1em;
font-size: 14px;
}

.uiButtonRadio__item--active {
	background: red;
}
</style>