<template>
	<div
		class="uiNote"
	>
		<slot />
	</div>
</template>

<script>
	export default {}
</script>

<style lang="scss">
.uiNote {
	display: block;
	font-size: 0.7rem;
	border-left: 2px solid #5da5e6;
	padding: 0 0 0 0.5em;
	margin: 1em 0;
}
</style>
