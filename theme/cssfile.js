// cssfile.js

const ProtoFile = require("./protofile").ProtoFile;



function CssFile (theme, fileName) {
	this.theme = theme;
	this.fileName = fileName;
}

CssFile.prototype = new ProtoFile("css");



module.exports = {
	CssFile: CssFile
};


