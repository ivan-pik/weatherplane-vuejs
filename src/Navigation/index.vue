<template>
    <nav>
        <router-link  to="/">Home</router-link>
        <router-link v-if="!loggedIn" to="/login">Login</router-link>
        <router-link v-if="!loggedIn" to="/signup">Signup</router-link>
        <a v-if="loggedIn" @click="logOut">Logout</a>
        <span v-if="loggedIn" class="username">{{ username }}</span>
    </nav>
</template>



<script>
    export default {
        name: 'Navigation',
        data() {
            return {

            }
        },
        computed: {
            username() {
                return this.$store.state.user.name;
            },
            loggedIn() {
                return this.$store.state.user.loggedIn;
            }
        },
        methods: {
            logOut() {
                localStorage.removeItem('id_token');
                this.$store.commit('USER_LOG_OUT');
            }
        }
    }
</script>
<style scoped src="./style.scss" lang="scss"></style>
