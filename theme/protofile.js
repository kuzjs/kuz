// protofile.js

const fs = require("fs");

const log = require("../kuz-log/log");
const fsutils = require("../kuz-fs");



function ProtoFile (dirName) {
	this.dirName = dirName;
}

const ThemeElement = require("./element").ThemeElement;
ProtoFile.prototype = new ThemeElement();
ProtoFile.prototype.typeName = "ProtoFile";

ProtoFile.prototype.IsProtoFile = function () {
	return true;
}

ProtoFile.prototype.SetupProto = function (theme, data) {
	this.SetupThemeElement(theme, data);
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

ProtoFile.prototype.Updatable = function () {
	this.PrintInputFilePath();
}

ProtoFile.prototype.Update = function () {
	this.ForcedUpdate();
}

ProtoFile.prototype.ForcedUpdate = function () {
	let contents = fs.readFileSync(this.InputFilePath());
	fsutils.CreateDirectory(this.OutputDirectoryPath());
	fs.writeFileSync(this.OutputFilePath(), contents);
	log.Green("Updated: " + this.OutputFilePath());
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


