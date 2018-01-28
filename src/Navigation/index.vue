<template>
	<nav class="mainNavigation">
		<button
			class="mainNavigation__toggler"
			:class="navOpened ? 'is-open' : 'is-closed'"
			@click="navOpened=!navOpened">
			<span class="mainNavigation__burger mainNavigation__burger--1"></span>
			<span class="mainNavigation__burger mainNavigation__burger--2"></span>
			<span class="mainNavigation__burger mainNavigation__burger--2B"></span>
			<span class="mainNavigation__burger mainNavigation__burger--3"></span>
		</button>

		<transition name="slideNav">
			<div 
				v-if="navOpened"
				class="mainNavigation__panel"
			>
				<button
					class="mainNavigation__toggler mainNavigation__toggler--inPanel"
					:class="navOpened ? 'is-open' : 'is-closed'"
					@click="navOpened=!navOpened">
					<span class="mainNavigation__burger mainNavigation__burger--1"></span>
					<span class="mainNavigation__burger mainNavigation__burger--2"></span>
					<span class="mainNavigation__burger mainNavigation__burger--2B"></span>
					<span class="mainNavigation__burger mainNavigation__burger--3"></span>
				</button>

				<user-bar />

				<div class="mainNavigation__panelScroller">
					<places-list
						:role="'navigation'"
						:userName="username"
					/>
				</div>

				<router-link class="addNewPlace uiButton uiButton--primary" to="/search">Search for an airfield</router-link>
			</div>
		</transition>
		<transition name="fade">
			<button
				v-if="navOpened"
				class="mainNavigation__closer"
				@click="navOpened=!navOpened"
			/>
		</transition>
	</nav>
</template>



<script>
	import placesList from './placesList.vue';
	import userBar from 'Navigation/userBar.vue'

	// @todo: settings to open a panel, not a new view

	export default {
		name: 'Navigation',
		components: {
			'places-list' : placesList,
			'user-bar' : userBar,
		},
		created () {
			document.addEventListener('keyup', this.escKeyHandler);
		},
		beforeDestroy () {
			document.removeEventListener('keyup', this.escKeyHandler);
		},
		computed: {
			username() {
				return this.$store.state.user.name;
			},
			loggedIn() {
				return this.$store.state.user.loggedIn;
			}
		},
		watch: {
			'$route': function (route) {
				this.navOpened = false;
			},
		},
		methods: {
			escKeyHandler (e) {
				if(e.keyCode == 27) {
					this.navOpened = false;
				}
			},
		},
	   data() {
		return {
		  navOpened: false
		}
	  }
	}
</script>

<style lang="scss">

@import '~globalVars';

// ----------------------------
.mainNavigation {
	position: fixed;
	top: 0;
	left: 0;
	z-index: $layer-navigation;
}

// ----------------------------
.mainNavigation__toggler {
	display: block;
	width: 40px;
	height: 40px;
	position: relative;
	cursor: pointer;
	
}

.mainNavigation__toggler--inPanel {
	position: absolute;
	top: 0;
	left: 0;
}

.mainNavigation__burger {
	display: block;
	position: absolute;
	width: 16px;
	height: 2px;
	background: $color-burger;
	left: 12px;
	transition: all 100ms ease-in-out;
}

.mainNavigation__burger--1 {
	top: 14px;
}


.mainNavigation__burger--2{
	top: 19px;
}

.mainNavigation__burger--2B{
	top: 19px;
}

.mainNavigation__burger--3 {
	bottom: 14px;
}

.mainNavigation__toggler.is-closed {
	.mainNavigation__burger--1 {
		transition: all 100ms 80ms ease-in-out;
	}

	.mainNavigation__burger--2{
		transition: all 100ms 0 ease-in-out;
	}

	.mainNavigation__burger--2B{
		transition: all 100ms 0 ease-in-out;
	}

	.mainNavigation__burger--3 {
		transition: all 100ms 80ms ease-in-out;
	}
}

.mainNavigation__toggler.is-open {
	.mainNavigation__burger--1 {
		top: 19px;
		opacity: 0;
	}


	.mainNavigation__burger--2{
		top: 19px;
		transform: rotate(45deg);
		width: 18px;
		left: 11px;
		transition: all 100ms 80ms ease-in-out;
	}

	.mainNavigation__burger--2B{
		top: 19px;
		transform: rotate(-45deg);
		width: 18px;
		left: 11px;
		transition: all 100ms 80ms ease-in-out;
	}

	.mainNavigation__burger--3 {
		bottom: 19px;
		opacity: 0;
	}
}


// ----------------------------
.mainNavigation__panel {
	position: fixed;
	top: 0;
	right: 40px;
	left: 0;
	bottom: 0;
	background: rgb(255, 255, 255);
	height: 100vh;
	z-index: 1;
	display: flex;
	flex-direction: column;
	max-width: 360px;
}

.mainNavigation__panelScroller {
	flex: 1 1 auto;
	overflow: auto;
	display: flex;
	flex-direction: column;
}


.slideNav-enter-active, .slideNav-leave-active {
	transition: all 300ms ease-in-out;
	transform: translate(0,0);
}
.slideNav-enter, .slideNav-leave-to {
	transition: all 160ms ease-in-out;
	transform: translate(-100%,0);
}

.mainNavigation__closer {
	position: fixed;
	display: block;
	background: $background-popup-overlay;
	height: 100vh;
	width: 100vw;
	left: 0;
	top: 0;
	z-index: 0;
}

</style>