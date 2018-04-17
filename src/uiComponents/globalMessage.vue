<template>
	<div
		class="uiGlobalMessage"
		:class="type"
	>
		<div class="uiGlobalMessage__text">
			{{text}}
		</div>
		
		<button class="uiGlobalMessage__dismiss"
			@click="dismissMessage"
		>
			<svg class="uiGlobalMessage__dismissIcon"
				width="14" height="14"
				viewBox="0 0 14 14"
			>
				<path class="uiGlobalMessage__dismissIconPath" d="M0,0 14,14" />
				<path class="uiGlobalMessage__dismissIconPath" d="M0,14 14,0" />	
			</svg>
		</button>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'globalMessage',
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

	.uiGlobalMessage {
		font-size: 13px;
		padding: 0 1em;
		position: relative;
		box-shadow: inset 0 -1px 0 rgba(#000, 0.1);
		height: 50px;

		
		&.success {
			background-color: $messageSuccessBackground;
			color: $messageSuccessText;
			.uiGlobalMessage__dismissIconPath {
				stroke: $messageSuccessText;
			}
		}
		&.warning {
			background-color: $messageWarningBackground;
			color: $messageWarningText;
			.uiGlobalMessage__dismissIconPath {
				stroke: $messageWarningText;
			}
		}
		&.error {
			background-color: $messageErrorBackground;
			color: $messageErrorText;
			.uiGlobalMessage__dismissIconPath {
				stroke: $messageErrorText;
			}
		}
		&.info {
			background-color: $messageInfoBackground;
			color: $messageInfoText;
			.uiGlobalMessage__dismissIconPath {
				stroke: $messageInfoText;
			}
		}
	}

	.uiGlobalMessage__text {
		line-height: 50px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uiGlobalMessage__dismiss {
		position: absolute;
		top: 0;
		right: 0;
		width: 50px;
		height: 50px;
	}

	.uiGlobalMessage__dismissIcon {}

	.uiGlobalMessage__dismissIconPath {
		stroke: red;
		stroke-width: 2px;
	}
</style>
