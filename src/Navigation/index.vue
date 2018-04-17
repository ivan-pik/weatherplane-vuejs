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
					<ui-loader
						v-if="loggedIn"
						:loaded="!!places"
						text="Loading Places"
						>
						<places-list
							:places="places"
						/>
					</ui-loader>
					<div v-else>
						@todo: login
					</div>
				</div>

				<ui-button
					text="Add a new place"
					type="primary"
					@click="$router.push('/search');"
					classes="addNewPlace"
				/>
			</div>
		</transition>
		<ui-transition-fade>
			<button
				v-if="navOpened"
				class="mainNavigation__closer"
				@click="navOpened=!navOpened"
			/>
		</ui-transition-fade>
	</nav>
</template>



<script>
	import placesList from './placesList.vue';
	import userBar from 'Navigation/userBar.vue'
	import WPAPI from 'wpapi/index';

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
			},
			places () {
				return this.$store.state.user.places;	
			},	
		},
		watch: {
			'$route': function (route) {
				this.navOpened = false;
			},
			navOpened(state) {
				this.$store.commit('GLOBAL_MAIN_NAV_OPEN_STATE', state);
			},
			loggedIn (loggedIn) {
				if (loggedIn) {
					this.loadPlacesData();
				}
			}
		},
		methods: {
			escKeyHandler (e) {
				if(e.keyCode == 27) {
					this.navOpened = false;
				}
			},
			loadPlacesData () {
				WPAPI.getUserPlaces(this.username)
				.then(places => {
					this.$store.dispatch('USER_GET_PLACES', places);
				});
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
	z-index: 10;
}

// ----------------------------
.mainNavigation__toggler {
	display: block;
	width: var(--layout-header-height);
	height: var(--layout-header-height);
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
	width: 18px;
	height: 2px;
	background: $color-burger;
	left: 12px;
	transition: all 100ms ease-in-out;
}

.mainNavigation__burger--1 {
	top: 19px;
}


.mainNavigation__burger--2{
	top: 24px;
}

.mainNavigation__burger--2B{
	top: 24px;
}

.mainNavigation__burger--3 {
	bottom: 19px;
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
	height: 100%;
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
	height: 100%;
	width: 100vw;
	left: 0;
	top: 0;
	z-index: 0;
}

</style>