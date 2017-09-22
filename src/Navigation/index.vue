<template>
    <nav class="main-navigation">
        <button class="main-navigation__toggler" @click="navOpened=!navOpened">B</button>
        <div v-if="navOpened" class="main-navigation__panel">
            <router-link  to="/">Home</router-link>
            <router-link v-if="!loggedIn" to="/login">Login</router-link>
            <router-link v-if="!loggedIn" to="/signup">Signup</router-link>
            <a v-if="loggedIn" @click="logOut">Logout</a>
            <span v-if="loggedIn" class="username">{{ username }}</span>
        </div>
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
        },
       data() {
        return {
          navOpened: false
        }
      }
    }
</script>
