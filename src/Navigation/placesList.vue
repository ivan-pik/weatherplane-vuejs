<template>
	<ui-sort-list
		v-if="places"
		:arrangeList="arranging"
		v-on:itemIsDragging="itemIsDragging"
		v-on:dropItem="dropItemHandler"
		v-on:wedgeDraggedItem="wedgeDraggedItem"
		v-on:stopArraning="arranging=false"
		v-on:listScroll="listScrollHandler"
		:items="places"
		:movingItem="movingItem"
		:itemHeight="50"
		:itemDropped="itemDropped"
		
	>
		<ui-sort-list-item
			v-for="(place, index) in places"
			:index="index"
			:key="place._id"
			:arrangeList="arranging"
			:itemHeight="50"
			:moveAway="moveAway"
			:dropItem="dropItem"
			:itemDropped="itemDropped"
			:listScroll="listScroll"
		>
			<places-list-item
				v-on:enterArrangingMode="arranging=true"
				:arrangeList="arranging"

				class="placesList__item"
				:place="place"
			/>

		</ui-sort-list-item>
	</ui-sort-list>
</template>

<script>
	import placesListItem from './placesListItem.vue';
	import {placeSorter} from 'libs/placeSorter.js';

	import uiSortList from 'uiComponents/sortList.vue';
	import uiSortListItem from 'uiComponents/sortListItem.vue';
	

	export default {
		name: 'PlacesList',
		components: {
			'places-list-item' : placesListItem,
			'ui-sort-list': uiSortList,
			'ui-sort-list-item': uiSortListItem
		},
		props: {
			places: {
				type: Array
			}
		},
		methods: {
			dropItemHandler (payload) {
				this.dropItem = payload;
				this.movingItem = {};

				if (payload.change === false) {
					this.itemDropped = true;
					return;
				}
			
				const itemIndex = payload.index;
				const newIndex = this.moveAway.takeSpaceOfIndex;

				const directionDown = (newIndex > itemIndex);

				const newPlaces = this.places.map((place) => {
					if (place.listOrder == itemIndex) {
						place.listOrder = newIndex;
					} else {
						if (directionDown && place.listOrder > itemIndex && place.listOrder <= newIndex) {
							place.listOrder--
						} else if (!directionDown && place.listOrder < itemIndex && place.listOrder >= newIndex) {
							place.listOrder++
						}
					}
					return place;
				});

				newPlaces.sort(placeSorter);

				setTimeout(() => {
					this.itemDropped = true;
					this.$store.dispatch('PLACE_UPDATE_LIST_ORDERS', newPlaces);
				}, this.TRANSITION_TIME);

			},
			wedgeDraggedItem (payload) {
				this.moveAway = payload;
			},
			itemIsDragging (payload) {
				this.itemDropped = false;
				this.movingItem = payload;
			},
			listScrollHandler (top) {
				this.listScroll = top;
			}
	
		},
		data() {
			return {
				movingItem: {},
				arranging: false,
				moveAway: {},
				dropItem: {},
				itemDropped: false,
				TRANSITION_TIME: 200,
				listScroll: 0,
				
			}
		}
	}
</script>

<style lang="scss">

	@import '~globalVars';

	.placesList {
		position: relative;
		display: block;
		padding-bottom: 1px;
		border-top: 1px solid #ddd;
	}

	.placesList__items.arranging {
		display: block;
		margin-bottom: 50px;
	}

	.placesList__exitSorting {
		position: absolute;
		bottom: 0;
	}

	.placesList__itemWrapper {
		display: block;
		height: 50px;
		
	
	}

	.placesList__itemPlaceHolder {
		display: block;
		height: 50px;
	}

	.placesList__item {
		height: 50px;
		line-height: 50px;
		width: 100%;
		display: flex;
		position: relative;
		top: 0;
		
		
		justify-content: space-between;
		
		font-size: 0.9rem;

		&.can-transition {
			transition: all 0.2s ease-in-out;
		}

		&.is-dragging {
			position: absolute;
			left: 0;
			z-index: 1;
		}
	}

	.placesList__itemLink {
		flex: 1 1 auto;
	}

	

	.placesList__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0 0 0 $widthGridLargerSpace;
		width: 100%;
	}

	.placesList__contextMenuToggler {
		position: absolute;
		right: 0;
		top: 0;
		display: block;
		width: 50px;
		height: 50px;
		svg {
			fill: $uiButtonPrimary;
		}
	}

	.placesList__contextMenu {
		position: absolute;
		background: #fff;
		right: 50px;
		top: 0;
		height: 100%;
		bottom: 0;

		.uiLink {
			margin-left: 1em; 
			line-height: 38px;
			height: 38px;
		}
	}

	.placesList__sortingDragger {
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		height: 50px;
		text-align: right;
		&.is-dragging {
			background: rgba(#000, 0.2);
		}

		svg {
			pointer-events: none;
			fill: $uiInputActive;
		}
	}
</style>
