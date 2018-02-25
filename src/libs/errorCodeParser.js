export const errorCodeParser = function(
	code, // error code to find
	errors // array of errors
) {
	return new Promise(
		function(resolve, reject) {
		
			let check = errors.filter(function( obj ) {
				return obj.code == code;
			});

			if (check.length > 0) {
				resolve(true);
			}
			reject(false);
		}
	);
}
