<template>
	<div class="navigationHeader">
		<div class="navigationHeader__title">
			<slot name="title">
				<svg class="appLogo" width="100%" height="100%" viewBox="0 0 177 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g><g transform="matrix(1.07965,0,0,1.07965,-340.856,-277.352)"><text x="342.383px" y="270.085px" style="font-family:'Interface-Bold', 'Interface';font-weight:700;font-size:15.746px;fill:#ff4e00;">w<tspan x="354.865px 363.768px 372.672px 378.713px 387.616px 396.52px 402.56px 411.464px 416.073px 424.977px 434.596px " y="270.085px 270.085px 270.085px 270.085px 270.085px 270.085px 270.085px 270.085px 270.085px 270.085px 270.085px ">eatherplane</tspan></text><text x="443.499px" y="270.085px" style="font-family:'Interface-Regular', 'Interface';font-size:15.746px;fill:#ff4e00;">.<tspan x="448.109px 457.37px 466.989px " y="270.085px 270.085px 270.085px ">com</tspan></text></g><path d="M3.573,3.573c1.971,0 3.573,1.603 3.573,3.573c0,0.494 -0.399,0.894 -0.893,0.894c-0.494,0 -0.893,-0.4 -0.893,-0.894c0,-0.985 -0.802,-1.786 -1.787,-1.786c-0.985,0 -1.786,0.801 -1.786,1.786c0,0.986 0.801,1.787 1.786,1.787l20.548,0c0.494,0 0.893,0.4 0.893,0.893c0,0.494 -0.399,0.893 -0.893,0.893l-20.548,0c-1.97,0 -3.573,-1.602 -3.573,-3.573c0,-1.97 1.603,-3.573 3.573,-3.573Z" style="fill:#ff4e00;fill-rule:nonzero;"/><path d="M13.377,0c1.971,0 3.574,1.603 3.574,3.573c0,0.493 -0.4,0.893 -0.894,0.893c-0.493,0 -0.893,-0.4 -0.893,-0.893c0,-0.985 -0.802,-1.786 -1.787,-1.786c-0.984,0 -1.786,0.801 -1.786,1.786c0,0.986 0.802,1.787 1.786,1.787l9.613,0c0.494,0 0.894,0.4 0.894,0.893c0,0.493 -0.4,0.893 -0.894,0.893l-9.613,0c-1.97,0 -3.573,-1.603 -3.573,-3.573c0,-1.97 1.603,-3.573 3.573,-3.573Z" style="fill:#09ac31;fill-rule:nonzero;"/><path d="M9.591,12.426l15.186,0c0.494,0 0.893,0.4 0.893,0.894c0,0.493 -0.399,0.893 -0.893,0.893l-15.186,0c-0.985,0 -1.787,0.801 -1.787,1.786c0,0.986 0.802,1.787 1.787,1.787c0.985,0 1.786,-0.801 1.786,-1.787c0,-0.493 0.4,-0.893 0.894,-0.893c0.494,0 0.893,0.4 0.893,0.893c0,1.971 -1.602,3.574 -3.573,3.574c-1.971,0 -3.573,-1.603 -3.573,-3.574c0,-1.97 1.602,-3.573 3.573,-3.573Z" style="fill:#09ac31;fill-rule:nonzero;"/></g></svg>
			</slot>
		</div>
	</div>
</template>

<script>
	import Navigation from './index.vue'

	export default {
		name: 'MainNav',
		components: {
			'navigation': Navigation,
		},
		props: {
			title: {
				type: String
			}
		},
		computed: {
			
		},
		methods: {
			
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
.navigationHeader {
	display: block;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 40px;
	padding: 0 40px;
}

.navigationHeader__title {
	height: 40px;
	line-height: 40px;
	text-align: center;
}
</style>
