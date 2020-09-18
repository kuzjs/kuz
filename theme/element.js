// element.js

const log = require("../kz-log/log");

const common = require("../base/common");
const defaultText = common.defaultText;



function ThemeElement (dirName) {
	this.dirName = dirName;
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
ThemeElement.prototype = new KZBaseObject();
ThemeElement.prototype.typeName = "ThemeElement";

ThemeElement.prototype.SetupThemeElement = function (theme, data) {
	this.theme = theme;
	this.data = data;
	this.default = data.default ? data.default : false;
}

ThemeElement.prototype.ElementIsValid = function () {
	return this.InputFileExists();
}

ThemeElement.prototype.Props = function () {
	return this.data;
}

ThemeElement.prototype.Name = function () {
	return this.data.name;
}

ThemeElement.prototype.Path = function () {
	return this.data.path;
}

ThemeElement.prototype.Description = function () {
	return this.data.description ? this.data.description : defaultText.description;
}

ThemeElement.prototype.Documentation = function () {
	return this.data.documentation ? this.data.documentation : defaultText.documentation;
}

ThemeElement.prototype.Title = function () {
	return this.data.title ? this.data.title : defaultText.title;
}

ThemeElement.prototype.InputFileName = function () {
	return this.Path();
}

ThemeElement.prototype.InputDirectoryName = function () {
	return this.theme.site.input_dirs[this.dirName];
}

ThemeElement.prototype.InputDirectoryPath = function () {
	return this.theme.InputDirectory() + "/" + this.InputDirectoryName();
}

ThemeElement.prototype.PrintInputFilePath = function () {
	log.Green("Input file path: " + this.InputFilePath());
}

ThemeElement.prototype.GetTable = function () {
	const KZTable = require("../kz-table/table").KZTable;
	let table = new KZTable();
	table.AddColumn("Name");
	table.AddColumn("Theme");
	table.AddColumn("Path");
	table.AddColumn("Title");
	table.AddColumn("Description");
	table.AddColumn("Documentation");
	return table;
}

ThemeElement.prototype.Row = function () {
	return [
		this.Name(),
		this.theme.Name(),
		this.Path(),
		this.Title(),
		this.Description(),
		this.Documentation()
	];
}



module.exports = {
	ThemeElement: ThemeElement
};


