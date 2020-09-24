// utils.js



const months = [
	"January", "February", "March",
	"April", "May", "June",
	"July", "August", "September",
	"October", "November", "December"
];

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];



function getDateString (separator = ".") {
	let now = new Date();

	let date = (now.getDate() + "").padStart(2, "0");
	let month = (now.getMonth() + 1 + "").padStart(2, "0");
	let year = (now.getFullYear() + "").padStart(4, "0");

	return `${date}${separator}${month}${separator}${year}`;
}

function getTimeString (separator = ":", septwo = "|") {
	let now = new Date();

	let hours = (now.getHours() + "").padStart(2, "0");
	let minutes = (now.getMinutes() + "").padStart(2, "0");
	let seconds = (now.getSeconds() + "").padStart(2, "0");
	let milliseconds = (now.getMilliseconds() + "ms").padStart(5, "0");

	return `${hours}${separator}${minutes}${separator}${seconds}${septwo}${milliseconds}`;
}



function getLogFileName () {
	let date = getDateString("_");
	let time = getTimeString("_");

	return `log_on_${date}_at_${time}.txt`;
}

function getLogFilePath () {
	return "logs/" + getLogFileName();
}



module.exports = {
	getDateString: getDateString,
	getTimeString: getTimeString,
	getLogFilePath: getLogFilePath
};


