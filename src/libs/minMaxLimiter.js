export const minMaxLimiter = function(currentValue, minValue, maxValue) {
	return Math.min( Math.max(currentValue, minValue), maxValue );
}