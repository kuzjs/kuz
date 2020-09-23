// utils.js



function getReadableTime (big_nano) {
	const ten_k = BigInt(10000);

	if (big_nano < ten_k) {
		return big_nano + "ns";
	}

	const big_micro = big_nano / BigInt(1000);
	if (big_micro < ten_k) {
		return big_micro + "us";
	}

	const big_milli = big_micro / BigInt(1000);
	if (big_milli < ten_k) {
		return big_milli + "ms";
	}

	const big_seconds = big_milli / BigInt(1000);
	return big_seconds + "s";
}



module.exports = {
	getReadableTime: getReadableTime
};


