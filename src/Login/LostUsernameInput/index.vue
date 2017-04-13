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

                <label class="label" for="email">Please enter the email address you used for registration</label>
                <br>
                <input
                        v-validate="{ rules: { required: true, email: true } }"
                        :class="{'input': true, 'is-danger': validationErrors.has('email') }"
                        type="email"
                        name="email"
                        v-model="email"
                        placeholder="Enter your email here"
                        data-vv-delay="1000"

                />
                <span v-show="validationErrors.has('email')" class="help is-danger">{{ validationErrors.first('email') }}</span>
                <br>

                <br>
                <button type="submit">Continue</button>
            </form>

        </transition>
    </div>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: 'LostUsernameInput',
        methods: {
            onSubmit(event) {
                this.$validator.validateAll().then(() => {
                    let payload = {
                        email :  this.email,
                    };
                    this.$http.post('login/forgot-user-name', payload)
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
                email: '',
                passwordResetSent: false,
                wrongUsername: false
            }
        }
    }

</script>
<style scoped></style>