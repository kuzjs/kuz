// common.js

const fsutils = require("../kuz-fsutils");

const dataDirectory = "kuz/data/";
const helpDocDirectory = fsutils.JoinPath(dataDirectory, "help");

const defaultText = {
	description: "---",
	documentation: "----",
	title: "---",
	zzz: "---"
};



module.exports = {
	defaultText: defaultText,
	helpDocDirectory: helpDocDirectory,
	zzz: false
};


