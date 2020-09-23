// utils.js



function getReadableTime (big_nano) {
	const seconds = (big_nano / BigInt(1e9));
	const milliseconds = (big_nano / BigInt(1e6)) % BigInt(1000);
	const microseconds = (big_nano / BigInt(1e3)) % BigInt(1000);
	const nanoseconds = big_nano % BigInt(1000);

	const s_string = (seconds + "").padStart(4);
	const ms_string = (milliseconds + "").padStart(4);
	const us_string = (microseconds + "").padStart(4);
	const ns_string = (nanoseconds + "").padStart(4);

	const bigzero = BigInt(0);
	if (seconds === bigzero && milliseconds === bigzero && microseconds === bigzero) {
		return `${ns_string}`;
	} else if (seconds === bigzero && milliseconds === bigzero) {
		return `${us_string} ${ns_string}`;
	} else if (seconds === bigzero) {
		return `${ms_string} ${us_string} ${ns_string}`;
	} else {
		return `${s_string} ${ms_string} ${us_string} ${ns_string}`;
	}
}



module.exports = {
	getReadableTime: getReadableTime
};


