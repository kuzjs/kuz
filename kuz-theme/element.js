// element.js

const common = require("../kuz-common");
const defaultText = common.defaultText;



function ThemeElement (dirName) {
	this.dirName = dirName;
}

const KuZBaseObject = require("../kuz-baseobject").KuZBaseObject;
ThemeElement.prototype = new KuZBaseObject();
ThemeElement.prototype.typeName = "ThemeElement";

ThemeElement.prototype.setupThemeElement = function (theme, data) {
	this.theme = theme;
	this.data = data;
	this.log = this.theme.log;
	this.default = data.default ? data.default : false;
}

ThemeElement.prototype.ElementIsValid = function () {
	return this.InputFileExists();
}

ThemeElement.prototype.getProps = function () {
	return this.data;
}

ThemeElement.prototype.getName = function () {
	return this.data.name;
}

ThemeElement.prototype.getPath = function () {
	return this.data.path;
}

ThemeElement.prototype.getDescription = function () {
	return this.data.description ? this.data.description : defaultText.description;
}

ThemeElement.prototype.getDocumentation = function () {
	return this.data.documentation ? this.data.documentation : defaultText.documentation;
}

ThemeElement.prototype.getTitle = function () {
	return this.data.title ? this.data.title : defaultText.title;
}

ThemeElement.prototype.InputFileName = function () {
	return this.getPath();
}

ThemeElement.prototype.InputDirectoryName = function () {
	return this.theme.site.input_dirs[this.dirName];
}

ThemeElement.prototype.InputDirectoryPath = function () {
	return this.theme.InputDirectory() + "/" + this.InputDirectoryName();
}

ThemeElement.prototype.PrintInputFilePath = function () {
	this.log.green("Input file path: " + this.InputFilePath());
}

ThemeElement.prototype.getTable = function () {
	const KZTable = require("../kuz-table/table").KZTable;
	let table = new KZTable();
	table.addColumn("Name");
	table.addColumn("Theme");
	table.addColumn("Path");
	table.addColumn("Title");
	table.addColumn("Description");
	table.addColumn("Documentation");
	return table;
}

ThemeElement.prototype.getRow = function () {
	return [
		this.getName(),
		this.theme.getName(),
		this.getPath(),
		this.getTitle(),
		this.getDescription(),
		this.getDocumentation()
	];
}



module.exports = {
	ThemeElement: ThemeElement
};


