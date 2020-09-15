// protofile.js

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");
const Table = require("../utils/table").Table;

const KZBaseObject = require("../base/baseobject").KZBaseObject;

const common = require("../utils/common");
const defaultText = common.defaultText;



function ProtoFile (dirName) {
	this.dirName = dirName;
}

ProtoFile.prototype = new KZBaseObject();

ProtoFile.prototype.IsProtoFile = function () {
	return true;
}

ProtoFile.prototype.SetupProto = function (theme, data) {
	this.theme = theme;
	this.data = data;
}

ProtoFile.prototype.Name = function () {
	return this.data.name;
}

ProtoFile.prototype.Path = function () {
	return this.data.path;
}

ProtoFile.prototype.Description = function () {
	return this.data.description ? this.data.description : defaultText.description;
}

ProtoFile.prototype.Documentation = function () {
	return this.data.documentation ? this.data.documentation : defaultText.documentation;
}

ProtoFile.prototype.Title = function () {
	return this.data.title ? this.data.title : defaultText.title;
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

ProtoFile.prototype.GetTable = function () {
	let table = new Table();
	table.AddColumn("Name");
	table.AddColumn("Theme");
	table.AddColumn("Path");
	table.AddColumn("Title");
	table.AddColumn("Description");
	table.AddColumn("Documentation");
	return table;
}

ProtoFile.prototype.Row = function () {
	return [
		this.Name(),
		this.theme.Name(),
		this.Path(),
		this.Title(),
		this.Description(),
		this.Documentation()
	];
}

ProtoFile.prototype.log = function () {
	log.SomeNews(this);
}



module.exports = {
	ProtoFile: ProtoFile
};


