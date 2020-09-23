// utils.js



function getReadableTime (big_nano) {
	const seconds = (big_nano / BigInt(1e9));
	const milliseconds = (big_nano / BigInt(1e6)) % BigInt(1000);
	const microseconds = (big_nano / BigInt(1e3)) % BigInt(1000);
	const nanoseconds = big_nano % BigInt(1000);

	return `${seconds}s ${milliseconds}ms ${microseconds}us ${nanoseconds}ns`;
}



module.exports = {
	getReadableTime: getReadableTime
};


