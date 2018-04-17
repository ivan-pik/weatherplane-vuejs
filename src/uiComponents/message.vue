<template>
	<div
		class="uiMessage"
		:class="'uiMessage--' + type"
	>
		<div class="uiMessage__text">
			<slot />
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'message',
		props: {
			type: {
				type: String
			}
		},
		data () {
			return {
				
			}
		}
	}

</script>

<style lang="scss">
	@import '~globalVars';

	.uiMessage {
		margin: 0 0 0.5rem 0;
		font-size: 13px;
		
		&.uiMessage--success {
			color: $messageSuccessBackground;
		}
		&.uiMessage--warning {
			color: $messageWarningBackground;
		}
		&.uiMessage--error {
			color: $messageErrorBackground;
		}
		&.uiMessage--info {
			color: $messageInfoBackground;
		}
		&.uiMessage--prompt {
			color: $messagePromptBackground;
		}
	}

	.uiMessage__text {
		line-height: 50px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

</style>
