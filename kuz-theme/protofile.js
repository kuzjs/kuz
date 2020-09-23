// protofile.js

const fs = require("fs");

const fsutils = require("../kuz-fs");



function ProtoFile (dirName) {
	this.dirName = dirName;
}

const ThemeElement = require("./element").ThemeElement;
ProtoFile.prototype = new ThemeElement();
ProtoFile.prototype.typeName = "ProtoFile";

ProtoFile.prototype.isProtoFile = function () {
	return true;
}

ProtoFile.prototype.setupProto = function (theme, data) {
	this.setupThemeElement(theme, data);
}

ProtoFile.prototype.getOutputDirectoryPath = function () {
	return fsutils.JoinPath(this.theme.OutputDirectory(), this.dirName);
}

ProtoFile.prototype.getOutputFileName = function () {
	return this.getPath();
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.getInputFilePath() + " --> " + this.getOutputFilePath();
}

ProtoFile.prototype.updatable = function () {
	this.printInputFilePath();
}

ProtoFile.prototype.update = function () {
	this.forcedUpdate();
}

ProtoFile.prototype.forcedUpdate = function () {
	let contents = fs.readFileSync(this.getInputFilePath());
	fsutils.CreateDirectory(this.getOutputDirectoryPath());
	fs.writeFileSync(this.getOutputFilePath(), contents);
	this.log.green("Updated: " + this.getOutputFilePath());
}

ProtoFile.prototype.log = function () {
	this.log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


