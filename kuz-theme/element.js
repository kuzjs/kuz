// element.js

const common = require("../kuz-common");
const defaultText = common.defaultText;



function ThemeElement (dirName) {
	this.dirName = dirName;
}

const KuzBaseObject = require("../kuz-baseobject");
ThemeElement.prototype = new KuzBaseObject();
ThemeElement.prototype.typeName = "ThemeElement";

ThemeElement.prototype.setupThemeElement = function (theme, data) {
	this.theme = theme;
	this.data = data;
	this.log = this.theme.log;
	this.default = data.default ? data.default : false;
}

ThemeElement.prototype.elementIsValid = function () {
	return this.doesInputFileExist();
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

ThemeElement.prototype.getInputFileName = function () {
	return this.getPath();
}

ThemeElement.prototype.getInputDirectoryName = function () {
	return this.theme.site.input_dirs[this.dirName];
}

ThemeElement.prototype.getInputDirectoryPath = function () {
	return this.theme.InputDirectory() + "/" + this.getInputDirectoryName();
}

ThemeElement.prototype.printInputFilePath = function () {
	this.log.green("Input file path: " + this.getInputFilePath());
}

ThemeElement.prototype.getTable = function () {
	const KuzTable = require("../kuz-table/table").KuzTable;
	let table = new KuzTable();
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



module.exports = ThemeElement;


