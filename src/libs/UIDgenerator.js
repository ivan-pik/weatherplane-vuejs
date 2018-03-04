// Reasonably unique IDs, wouldn't use for anything critical though

export const UIDgenerator = function() {
	const random = Math.random().toString(36).substr(2, 9);
	const time = (new Date().getUTCMilliseconds()).toString();
	return random + time;
}