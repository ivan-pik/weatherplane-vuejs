<template>
    <div class="modal">

        <div v-if="tokenInvalid">
            The password reset link has expired.
        </div>

        <div v-if="passwordResetSent">
            Your password has been reset
        </div>

        <transition name="fade">

            <form v-if="!passwordResetSent && !tokenInvalid" v-on:submit.prevent="onSubmit">

                <label class="label" for="password">Password</label>
                <br>
                <input
                        v-validate="{ rules: { required: true } }"
                        :class="{'input': true, 'is-danger': validationErrors.has('password') }"
                        name="password"
                        v-model="password"
                        type="password"
                        placeholder="Enter your password here"
                        autofocus
                        data-vv-delay="1000"
                >
                <br>
                <span
                        v-show="validationErrors.has('password')"
                        class="help is-danger">{{ validationErrors.first('password') }}
                </span>



                <br>

                <!-- @todo: Delay the validation till the first field is filled -->

                <label class="label" for="confirmPassword">Confirm Password</label>
                <br>
                <input
                        v-validate="{ rules: { required: true, confirmed:'password' } }"
                        :class="{'input': true, 'is-danger': validationErrors.has('confirmPassword') }"
                        name="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Enter your password here"
                        autofocus
                        data-vv-delay="1000"
                >
                <br>
                <span
                        v-show="validationErrors.has('confirmPassword')"
                        class="help is-danger">
                    {{ validationErrors.first('confirmPassword') }}

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
        name: 'ResetPassword',
        methods: {
            onSubmit(event) {
                this.$validator.validateAll().then(() => {
                    console.log(this.$route);
                    let payload = {
                        userID :  this.$route.query.userID,
                        password: this.password,
                        token : this.$route.query.token
                    };
                    this.$http.post('login/reset-password/', payload)
                        .then(response => {
                            if (response.body.success) {

                                this.passwordResetSent = true;
                                this.tokenInvalid = false;

                            }
                        }).catch(err => {
                        if(err.body.errors) {
                            this.tokenInvalid = true;
                        }
                    });
                }).catch(() => {
                    // when form is invalid
                });
            }
        },
        data() {
            return {
                password: '',
                confirmPassword: '',
                passwordResetSent: false,
                tokenInvalid: false
            }
        }
    }

</script>
<style scoped></style>
