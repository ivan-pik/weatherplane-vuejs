export const placeSorter = function(a, b) {
	const orderA = a.listOrder;
	const orderB = b.listOrder;
	
	let comparison = 0;
	if (orderA > orderB) {
		comparison = 1;
	} else if (orderA < orderB) {
		comparison = -1;
	}
	return comparison;
}
