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

ProtoFile.prototype.OutputDirectory = function () {
	return fsutils.JoinPath(this.theme.OutputDirectory(), this.dirName);
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.InputFilePath() + " --> " + this.OutputFilePath();
}

ProtoFile.prototype.Updatable = function () {
	this.PrintInputFilePath();
}

ProtoFile.prototype.Update = function () {
	this.PrintInputFilePath();
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


