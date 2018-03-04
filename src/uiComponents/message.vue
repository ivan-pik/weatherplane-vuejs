<template>
	<div
		class="uiMessage"
		:class="type"
	>
		<div class="uiMessage__text">
			{{text}}
		</div>
		
		<button class="uiMessage__dismiss"
			@click="dismissMessage"
		>
			<svg class="uiMessage__dismissIcon"
				width="14" height="14"
				viewBox="0 0 14 14"
			>
				<path class="uiMessage__dismissIconPath" d="M0,0 14,14" />
				<path class="uiMessage__dismissIconPath" d="M0,14 14,0" />	
			</svg>
		</button>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'message',
		props: {
			type: {
				type: String
			}, 
			text: {
				type: String
			},
			dismiss: {
				type: String
			},
			messageID: {
				type: String
			}
		},
		mounted () {
			if (this.dismiss == 'auto') {
				this.timer = setTimeout(this.dismissMessage, this.DISMISS_TIMEOUT);
			}
		},
		methods: {
			dismissMessage () {
				clearTimeout(this.timer);
				debugger;
				this.$emit('dismiss', this.messageID);
			}
		},
		data () {
			return {
				DISMISS_TIMEOUT: 2500,
				timer: null
			}
		}
	}

</script>

<style lang="scss">
	@import '~globalVars';

	.uiMessage {
		margin: 0 0 0.5rem 0;
		font-size: 13px;
		padding: 0 1em;
		position: relative;
		border-radius: 2px;
		box-shadow: inset 0 -1px 0 rgba(#000, 0.1);
		height: 40px;

		
		&.success {
			background-color: $messageSuccessBackground;
			color: $messageSuccessText;
			.uiMessage__dismissIconPath {
				stroke: $messageSuccessText;
			}
		}
		&.warning {
			background-color: $messageWarningBackground;
			color: $messageWarningText;
			.uiMessage__dismissIconPath {
				stroke: $messageWarningText;
			}
		}
		&.error {
			background-color: $messageErrorBackground;
			color: $messageErrorText;
			.uiMessage__dismissIconPath {
				stroke: $messageErrorText;
			}
		}
		&.info {
			background-color: $messageInfoBackground;
			color: $messageInfoText;
			.uiMessage__dismissIconPath {
				stroke: $messageInfoText;
			}
		}
	}

	.uiMessage__text {
		line-height: 40px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uiMessage__dismiss {
		position: absolute;
		top: 0;
		right: 0;
		width: 40px;
		height: 40px;
	}

	.uiMessage__dismissIcon {}

	.uiMessage__dismissIconPath {
		stroke: red;
		stroke-width: 2px;
	}
</style>
