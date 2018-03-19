<template>
	<layout-view-wrapper>
		<place-settings-controls slot="content" />
	</layout-view-wrapper>
</template>

<script>
	import PlaceSettingsControls from 'Place/PlaceSettingsView/placeSettingsControls.vue'

	export default {
		name: 'PlaceSettingsView',
		components: {
			'place-settings-controls': PlaceSettingsControls,
		},
		data() {
			return {

			}
		}
	}
</script>

