<template>
	<div class="e404">
		<h2 class="e404__title">
			<slot name="title"></slot>
		</h2>
		<p class="e404__note">
			<slot name="note"></slot>
		</p>
	</div>
</template>
<script>

	export default {
		name: 'e404',

		created () {
		},
		computed: {
		},
	}

</script>

<style lang="scss">
.e404 {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	text-align: center;
}

.e404__title {
	font-size: 1.5rem;
	margin: 0 0 1em 0;
}

.e404__note {
	font-size: 0.8rem;
}
</style>

