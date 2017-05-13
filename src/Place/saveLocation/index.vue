<template>
  <div class="">
    <button v-if="!openSaveOptions" type="button" name="button" @click="saveThisPlace">Save this location</button>

    <div v-if="openSaveOptions">
      <h5>Save this location</h5>
      <form  v-on:submit.prevent="onSubmit">




        <label class="label" for="username">Location Name</label>
        <br>
        <input
          v-validate="{ rules: { required: true } }"
          :class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
          name="placeName"
          v-model="placeName"
          type="text"
          placeholder="Location name here"
          autofocus
        >
        <br>
        <span
          v-show="validationErrors.has('placeName')"
          class="help is-danger">{{ validationErrors.first('placeName') }}
        </span>
        <br>

        <p>You will be able to access the place quickly via</p>
        <p>{{newPlaceURL}}</p>

        <br>

        <label for="placeIsPublic">
        <input
        id="placeIsPublic"
          name="placeIsPublic"
          type="checkbox"
          v-model="placeIsPublic"
        />
        Make this place URL public
        </label>
        <br>
        <small>
          This means you (and anyone) can access this place and its settings on URL {{newPlaceURL}} weather without having to log-in to this app.
        </small>

        <br>


        <button type="submit">Save</button>
      </form>
    </div>
  </div>


</template>
<script>
    import Vue from 'vue'


    export default {
        name: 'saveLocation',
        computed: {
            activeLocation() {
                return this.$store.state.placeSearch.selectedLocation;
            },
            loggedIn() {
                return this.$store.state.user.loggedIn;
            },
            userName() {
              return this.$store.state.user.name;
            },
            placeNameURL() {
              return this.placeName
                .toLowerCase()
                .replace(/ /g,'-')
                .replace(/[^\w-]+/g,'')
                ;

            },
            newPlaceURL () {
              return "www.weatherplane.com/" + this.userName + '/' + this.placeNameURL;
            }
        },
        methods: {
          saveThisPlace () {
            if (this.loggedIn) {
              this.openSaveOptions = true;
            }
          },
          onSubmit(event) {
            this.$validator.validateAll().then(() => {

            let newPlace = this.activeLocation;

            // @todo: @next Save this place in the back end
            this.$http.post('place', newPlace)
                .then(response => {
                    if (response.body.success) {
                      console.log("place saved")
                        // this.$router.push(credentials.userID);
                    }
                }).catch(err => {
                if(err.body.errors) {
                    this.onFailedLogin();
                }
            });
            }).catch(() => {
                // when form is invalid
            });
          },
          onFailedLogin() {
             Vue.set(this.errors, 'placeNotSaved', true)
          }
        },
        data () {
          return {
            openSaveOptions: false,
            errors: null,
            placeName: '',
            placeIsPublic: false,
          }
        }

    }



</script>
<style scoped>

</style>
