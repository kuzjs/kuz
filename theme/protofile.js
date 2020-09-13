// protofile.js

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");
const Table = require("../utils/table").Table;



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

ProtoFile.prototype.GetTable = function () {
	let table = new Table();
	table.AddColumn("Path");
	table.AddColumn("Title");
	table.AddColumn("Description");
	return table;
}

ProtoFile.prototype.Row = function () {
	return [this.path, this.title, this.description];
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


