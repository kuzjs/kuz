


function GetDateString (separator = ".") {
	let now = new Date();

	let date = (now.getDate() + "").padStart(2, "0");
	let month = (now.getMonth() + 1 + "").padStart(2, "0");
	let year = (now.getFullYear() + "").padStart(4, "0");

	return `${date}${separator}${month}${separator}${year}`;
}

function GetTimeString (separator = ":", septwo = "|") {
	let now = new Date();

	let hours = (now.getHours() + "").padStart(2, "0");
	let minutes = (now.getMinutes() + "").padStart(2, "0");
	let seconds = (now.getSeconds() + "").padStart(2, "0");
	let milliseconds = (now.getMilliseconds() + "ms").padStart(5, "0");

	return `${hours}${separator}${minutes}${separator}${seconds}${septwo}${milliseconds}`;
}



function GetLogFileName () {
	let date = GetDateString("_");
	let time = GetTimeString("_");

	return `log_on_${date}_at_${time}.txt`;
}

function GetLogFilePath () {
	return "logs/" + GetLogFileName();
}



module.exports = {
	GetDateString: GetDateString,
	GetTimeString: GetTimeString,
	GetLogFilePath: GetLogFilePath
};


