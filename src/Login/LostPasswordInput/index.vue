<template>
    <div class="modal">

        <div v-if="wrongUsername">
            This user doesn't exist
        </div>

        <div v-if="passwordResetSent">
            Check your mail for new password
        </div>

        <transition name="fade">

            <form v-if="!passwordResetSent" v-on:submit.prevent="onSubmit">

                <label class="label" for="username">Username</label>
                <br>
                <input
                        v-validate="{ rules: { required: true, alpha_dash: true } }"
                        :class="{'input': true, 'is-danger': validationErrors.has('username') }"
                        name="username"
                        v-model="username"
                        type="text"
                        placeholder="Enter your username here"
                        autofocus
                >
                <br>
                <span
                        v-show="validationErrors.has('username')"
                        class="help is-danger">{{ validationErrors.first('username') }}
    </span>

                <br>
                <button type="submit">Continue</button>
            </form>

        </transition>
    </div>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: 'LostPasswordInput',
        methods: {
            onSubmit(event) {
                this.$validator.validateAll().then(() => {
                    let payload = {
                        userID :  this.username,
                    };
                    this.$http.post('login/forgot-password', payload)
                        .then(response => {
                            if (response.body.success) {

                                this.passwordResetSent = true;
                                this.wrongUsername = false;

                            }
                        }).catch(err => {
                        if(err.body.errors) {
                            this.wrongUsername = true;
                        }
                    });
                }).catch(() => {
                    // when form is invalid
                });
            }
        },
        data() {
            return {
                username: '',
                passwordResetSent: false,
                wrongUsername: false
            }
        }
    }

</script>
<style scoped></style>
