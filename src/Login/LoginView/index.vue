<template>
    <div>
        <component v-bind:is="currentView">
        </component>
        <div>
            <a @click="currentView = 'lost-password-input'" v-if="currentView != 'lost-password-input'">Forgot your password?</a>
            <a @click="currentView = 'lost-username-input'" v-if="currentView != 'lost-username-input'">Forgot your username?</a>
        </div>
    </div>
</template>
<script>
    import bus from '../../bus'
    import Vue from 'vue'

    import LoginInput from '../LoginInput/index.vue'
    import LostPasswordInput from '../LostPasswordInput/index.vue'
    import LostUsernameInput from '../LostUsernameInput/index.vue'

    export default {
        name: 'LoginView',
        components: {
            'login-input': LoginInput,
            'lost-password-input': LostPasswordInput,
            'lost-username-input': LostUsernameInput
        },
        data() {
            return {
                currentView: 'login-input'
            }
        }
    }

</script>
<style scoped src="./style.css"></style>
