// configfile.js



const MetaData = require("../metadata/metadata").MetaData;

const Nss = require("./nss").Nss;
const fsutils = require("./fsutils");

const Table = require("./table").Table;

function ConfigFile(site, dirpath) {
	this.site = site;
	this.dirpath = dirpath;
	this.pages = [];

	if (this.dirpath === undefined) {
		this.configDirpath = site.GetInputDirectory();
	} else {
		this.configDirpath = site.GetInputDirectory() + "/" + dirpath;
	}

	let configFileName = site.GetNestedValueFromCascade("filenames", "config");
	this.configFilePath = this.configDirpath + "/" + configFileName;
	this.root = null;
	this.parent = null;
	this.children = [];
	this.metaData = new MetaData(this.site, this.configFilePath);
}

ConfigFile.prototype.SetParent = function (configFileParentObject) {
	if (configFileParentObject) {
		this.parent = configFileParentObject;
	} else {
		this.parent = null;
	}
}

ConfigFile.prototype.AddChild = function (configFileChildObject) {
	this.children.push(configFileChildObject);
}

ConfigFile.prototype.Exists = function () {
	if (fsutils.IsFile(this.configFilePath)) {
		return true;
	}
	return false;
}

ConfigFile.prototype.GetEntries = function () {
	this.nss = new Nss(this.configFilePath);
	return this.nss.GetBodyLines();
}

ConfigFile.prototype.GetPages = function () {
	return this.pages;
}

ConfigFile.prototype.NumberOfPages = function () {
	return this.pages.length;
}

ConfigFile.prototype.NumberOfChildren = function () {
	return this.children.length;
}

ConfigFile.prototype.NumberOfEntriesString = function () {
	let noeString;
	if (this.root) {
		noeString =  "@ + " + this.NumberOfPages() + "p";
	} else {
		noeString = this.NumberOfPages() + "p";
	}

	if (this.NumberOfChildren() > 0) {
		noeString += " + " + this.NumberOfChildren() + "d";
	}
	return noeString;
}

ConfigFile.prototype.GetStringValue = function (propertyName) {
	return this.metaData.GetValue(propertyName);
}

ConfigFile.prototype.GetTable = function () {
	let table = new Table();
	table.AddColumn("Path");
	table.AddColumn("N");
	table.AddColumn("Props");
	return table;
}

ConfigFile.prototype.Row = function () {
	return [
		this.configFilePath,
		this.NumberOfEntriesString(),
		this.metaData.NumberOfProperties()
	];
}

module.exports = {
	ConfigFile: ConfigFile
};


