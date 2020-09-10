// resfile.js

const ProtoFile = require("./protofile").ProtoFile;



function ResFile (theme, fileName) {
	this.theme = theme;
	this.fileName = fileName;
}

ResFile.prototype = new ProtoFile("res");



module.exports = {
	ResFile: ResFile
};


