<template>
<div class="">
<h5>Place details:</h5>
{{activeLocation}}
</div>

</template>
<script>
    import Vue from 'vue';

    export default {
        name: 'placeDetails',
        computed: {
            activeLocation() {
                return this.$store.state.existingPlaceView.place;
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
            placeIsPublic: false,
          }
        }

    }



</script>
<style scoped>

</style>
