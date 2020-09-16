// common.js



const dataDirectory = "kzapp/data/";

const helpDocDirectory = dataDirectory + "help/";
const jsonDirectory = dataDirectory;

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


