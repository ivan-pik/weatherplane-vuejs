<template>
<div class="">

<div v-if="weatherData">

  <hourly-view :weather="weatherData" />

</div>

<div v-else>
  loading weather
  </div>


</div>

</template>
<script>
    import Vue from 'vue';
    import hourlyView from '../../Weather/hourlyView/index.vue';
    import {HTTP} from '../../http-common';

    export default {
        name: 'placeDetails',
        created: function () {
          
        },
				components: {
					
          'hourly-view' : hourlyView,
				},

      props: {
        activeLocation: {
          type: Object
        }
      },
     
        computed: {
            weatherData() {
							return this.$store.state.existingPlaceView.weatherData;
						}
        },
        created: function () {
          this.fetchWeather();
        },
        methods: {
          saveThisPlace () {
            if (this.loggedIn) {
              this.openSaveOptions = true;
            }
          },
          fetchWeather () {
            let oid = this.activeLocation.weather[0].oid;

        
            HTTP.get('weather/' + oid)
                .then(response => {
                    if (response.data.success) {
                      console.log(response.data.data);

                      this.$store.commit('PLACE_SAVE_WEATHER_DATA', response.data.data);
                      


                    }
                }).catch(err => {
                  console.log("ooops!")
            });
          
          },
          onSubmit(event) {
            this.$validator.validateAll().then(() => {

            let newPlace = {
							placeName : this.placeName,
							placeSlug : this.placeNameURL,
							userID : this.userName,
							placeLat : this.activeLocation.coordinates.lat,
							placeLng : this.activeLocation.coordinates.lng,
							placeSettings : {
								public : this.placeIsPublic
							}
						}

            HTTP.post('places', newPlace)
                .then(response => {
									console.log(response)
                    if (response.data.success) {
                      console.log("place saved")
                        this.$router.push(this.userName + "/" + newPlace.placeSlug);
                    }
                }).catch(err => {
									console.log(err);
                if(err.response) {
                    this.onFailedPlaceSave();
                }
            });
            }).catch(() => {
                // when form is invalid
            });
          },
          onFailedPlaceSave() {
             Vue.set(this.errors, 'placeNotSaved', true)
          }
        },
        data () {
          return {
            openSaveOptions: false,
            errors: null,
            placeName: '',
            placeIsPublic: false
          }
        }

    }



</script>
<style scoped>

</style>
