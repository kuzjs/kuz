// protofile.js

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");



function ProtoFile (dirName) {
	this.dirName = dirName;
}

ProtoFile.prototype.SetupProto = function (theme, data) {
	this.theme = theme;
	this.path = data.path;
	this.title = data.title;
	this.description = data.description;
}

ProtoFile.prototype.InputDirectory = function () {
	return fsutils.JoinPath(this.theme.InputDirectory(), this.dirName);
}

ProtoFile.prototype.InputFilePath = function () {
	return fsutils.JoinPath(this.InputDirectory(), this.path);
}

ProtoFile.prototype.OutputDirectory = function () {
	return fsutils.JoinPath(this.theme.OutputDirectory(), this.dirName);
}

ProtoFile.prototype.OutputFilePath = function () {
	return fsutils.JoinPath(this.OutputDirectory(), this.path);
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.InputFilePath() + " --> " + this.OutputFilePath();
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


