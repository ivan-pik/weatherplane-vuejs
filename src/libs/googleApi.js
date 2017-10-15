import loadGoogleMapsAPI from 'load-google-maps-api';

export const loadGoogleApi = function() {
	return new Promise(function(resolve, reject) {
		if((typeof window.google !== 'undefined') && google.maps ) {
			resolve (google.maps);
		} else {
			// @todo: Something is wrong below, it breaks the build
			// loadGoogleMapsAPI(
			// 	// @todo: Key in some config
			// 	{
			// 		key: 'AIzaSyBTL50DdKgmlhWvZ7b-kbCFt4N1hdZ7EvY',
			// 		libraries: 'places'
			// 	}
			// ).then(
			// 	function(googleMaps) {
			// 		console.log("Google Maps API loaded");
			// 		resolve(googleMaps);
			// 	}
			// ).catch((err) => {
			// 	console.error(err);
			// 	reject(err);
			// });
		}
	});
}
