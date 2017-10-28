<template>
	<li class="placesList__item">
		<span class="placesList__name">
			Woodspring Wings {{index}} / {{contextMenuClose}}
		</span>
		<button class="placesList__contextMenuToggler"
			@click.stop="contextMenu"
		>
			...
		</button>
		<ul
			v-if="contextMenuOpen"
			class="placesList__contextMenu">
			<li>Place Settings</li>
			<li>move</li>
		</ul>
	</li>
</template>

<script>
	export default {
		name: 'PlacesListItem',
		props: {
			contextMenuClose: {
				type: Number
			},
			index: {
				type: Number
			}
		},
		computed: {
		
		},
		watch: {
			contextMenuClose (value) {
				if (value != -1 && value != this.index) {
					this.contextMenuOpen = false;
				}
			}
		}
		,
		methods: {
			contextMenu () {
				this.$emit('contextMenuTriggered');
				this.contextMenuOpen=!this.contextMenuOpen;
			}
		},
		data() {
			return {
				contextMenuOpen: false
			}
		}
	}
</script>