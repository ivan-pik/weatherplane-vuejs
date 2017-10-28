<template>
	<li class="placesList__item">
		<router-link :to="'/' + activeUserName + '/' + place.placeSlug">
			<span class="placesList__name">
				{{place.placeName}}
			</span>
		</router-link>
		<button class="placesList__contextMenuToggler"
			@click.stop="contextMenu"
		>
			...
		</button>
		<div
			v-if="contextMenuOpen"
			class="placesList__contextMenu">
			<button 
				class="placesList__contextLink placesList__contextLink--settings"
				@click="openPlaceSettings"
			>
				Place Settings
			</button>
			<button class="placesList__contextLink placesList__contextLink--move"
				@click="moooveIt"
			>move</button>
		</div>
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
			},
			place: {
				type: Object
			}
		},
		computed: {
			activeUserName () {
				return this.$store.state.user.name;
			}
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
			openPlaceSettings () {
				let placeName = this.place.placeSlug;
				let userName = this.activeUserName;
				this.$router.push({ path: `/${userName}/${placeName}/settings` });
			},
			moooveIt () {
				this.$emit('arrangeItems', this.index);
			},
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