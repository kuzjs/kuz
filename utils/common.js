// common.js

const fsutils = require("./fsutils");



const dataDirectory = "kzapp/data/";

const helpDocDirectory = fsutils.JoinPath(dataDirectory, "help");
const jsonDirectory = fsutils.JoinPath(dataDirectory, "json");

const defaultText = {
	description: "---",
	documentation: "----",
	title: "---",
	zzz: "---"
};



module.exports = {
	defaultText: defaultText,
	helpDocDirectory: helpDocDirectory,
	jsonDirectory: jsonDirectory,
	zzz: false
};


