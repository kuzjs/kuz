// protofile.js

const log = require("../kz-log/log");
const fsutils = require("../kz-fs");



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

ProtoFile.prototype.InputDirectory = function () {
	return fsutils.JoinPath(this.theme.InputDirectory(), this.dirName);
}

ProtoFile.prototype.InputFilePath = function () {
	return fsutils.JoinPath(this.InputDirectory(), this.Path());
}

ProtoFile.prototype.OutputDirectory = function () {
	return fsutils.JoinPath(this.theme.OutputDirectory(), this.dirName);
}

ProtoFile.prototype.OutputFilePath = function () {
	return fsutils.JoinPath(this.OutputDirectory(), this.Path());
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.InputFilePath() + " --> " + this.OutputFilePath();
}

ProtoFile.prototype.Updatable = function () {
	log.Green("File updatable: " + this.InputFilePath() + " --> " + this.OutputFilePath());
}

ProtoFile.prototype.Update = function () {
	log.Green("File updated: " + this.InputFilePath() + " --> " + this.OutputFilePath());
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


