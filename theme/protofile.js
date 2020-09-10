// protofile.js

const log = require("../utils/log");



function ProtoFile (dirName) {
	this.dirName = dirName;
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.dirName + "/" + this.fileName;
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


