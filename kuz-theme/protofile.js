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

ProtoFile.prototype.OutputDirectoryPath = function () {
	return fsutils.JoinPath(this.theme.OutputDirectory(), this.dirName);
}

ProtoFile.prototype.OutputFileName = function () {
	return this.Path();
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.InputFilePath() + " --> " + this.OutputFilePath();
}

ProtoFile.prototype.updatable = function () {
	this.PrintInputFilePath();
}

ProtoFile.prototype.update = function () {
	this.forcedUpdate();
}

ProtoFile.prototype.forcedUpdate = function () {
	let contents = fs.readFileSync(this.InputFilePath());
	fsutils.CreateDirectory(this.OutputDirectoryPath());
	fs.writeFileSync(this.OutputFilePath(), contents);
	this.log.green("Updated: " + this.OutputFilePath());
}

ProtoFile.prototype.log = function () {
	this.log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


