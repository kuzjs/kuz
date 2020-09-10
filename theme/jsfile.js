// jsfile.js

const ProtoFile = require("./protofile").ProtoFile;



function JsFile (theme, fileName) {
	this.theme = theme;
	this.fileName = fileName;
}

JsFile.prototype = new ProtoFile("js");



module.exports = {
	JsFile: JsFile
};


