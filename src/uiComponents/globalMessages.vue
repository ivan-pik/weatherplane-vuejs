<template>
	<div 
		class="uiGlobalMessages"
	>
		<transition-group name="list" tag="div">
			<ui-message
				v-for="(message, index) in messages"
				:key="message.id"
				:messageID="message.id"
				:text="message.text"
				:type="message.type"
				:dismiss="message.dismiss"
				v-on:dismiss="dismissMessage(message.id)"
			/>
		 </transition-group>

		 <div
		 	v-if="displayTools"
		 	class="uiGlobalMessages__tools"
		>
			<button
				class="uiButton"
				@click="dismissAll"
			>
				Dismiss All
			</button>
		</div>
	</div>
</template>

<script>

	import message from 'uiComponents/message.vue'
	import {deepCopy} from 'libs/deepCopy.js';
  
	export default {
		name: 'uiGlobalMessages',
		components: {
			'ui-message' : message
		},
		props: {
			messages: {
				type: Array
			}
		},
		mounted () {
			
		},
		computed: {
			displayTools () {
				return (this.messages.length > this.DISMISS_ALL_THRESHOLD);
			}
		},
		watch: {
			messages (messages) {
				if (messages.length == 0) {
					this.time = 0;
				}
			}
		},
		methods: {
			dismissMessage(id) {
				debugger;
				this.$emit('dismissMessage', id);
			},
			dismissAll() {
				this.messages.forEach((message) => {
					this.time = this.time + this.TIME_BETWEEN_DISMISSALS;
					let time = deepCopy(this.time);
					console.log('this.time', this.time);
					let timer = setTimeout(() => {
						this.dismissMessage(message.id);
					}, time)

					
				})
			}
		},
		data () {
			return {
				time: 0,
				TIME_BETWEEN_DISMISSALS: 100,
				DISMISS_ALL_THRESHOLD: 3
			}
		}

	}

</script>

<style lang="scss">
@import '~globalVars';

.uiGlobalMessages {
	position: fixed;
	bottom: 0;
	z-index: $uiPopupIndex;
	width: 100%;
	max-height: 260px; // 6.5 message
	overflow: auto;

	.uiMessage {
		border-radius: 0;
		margin: 0 0 0 0;
	}
}

.uiGlobalMessages__tools {
	position: fixed;
	bottom: 0;
	width: 100%;
}


.list-enter-active, .list-leave-active {
	transition: all 600ms ease-in-out;
}
.list-enter, .list-leave-to {
	overflow: hidden;
	transform: scale(0.9, 1) perspective(1000px) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
	transform-origin: 50% 50%;
	opacity: 0;
	height: 0 !important;
}
.list-leave-to {
	transform: scale(0.9, 1) perspective(1000px) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
}


</style>
