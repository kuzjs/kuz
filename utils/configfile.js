// configfile.js



const MetaData = require("../metadata/metadata").MetaData;

const Nss = require("./nss").Nss;
const fsutils = require("./fsutils");

const KZTable = require("./table").KZTable;
const KZBaseObject = require("../base/baseobject").KZBaseObject;

function ConfigFile(site, dirpath, entity=false) {
	this.site = site;
	this.dirpath = dirpath;
	this.pages = [];

	if (this.dirpath === undefined) {
		this.configDirpath = site.GetInputDirectory();
	} else {
		this.configDirpath = site.GetInputDirectory() + "/" + dirpath;
	}

	if (entity) {
		this.configFilePath = dirpath;
	} else {
		let configFileName = site.GetNestedValueFromCascade("filenames", "config");
		this.configFilePath = this.configDirpath + "/" + configFileName;
	}

	this.root = null;
	this.parent = null;
	this.children = [];
	this.index = 0;
	this.metaData = new MetaData(this.site, this.configFilePath);
	this.props = this.metaData.Props();
}

ConfigFile.prototype = new KZBaseObject();
ConfigFile.prototype.codeLetter = "g";

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

ConfigFile.prototype.AddPage = function (page) {
	this.pages.push(page);
}

ConfigFile.prototype.Props = function () {
	return this.props;
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

ConfigFile.prototype.ParentString = function () {
	if (this.parent) {
		return this.parent.CodeName();
	} else {
		return "";
	}
}

ConfigFile.prototype.RootString = function () {
	if (this.root) {
		return "@";
	} else {
		return "";
	}
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
	let table = new KZTable();
	table.AddColumn("CodeName");
	table.AddColumn("Path");
	table.AddColumn("Parent");
	table.AddColumn("@");
	table.AddColumn("D");
	table.AddColumn("P");
	table.AddColumn("Props");
	return table;
}

ConfigFile.prototype.Row = function () {
	return [
		this.CodeName(),
		this.configFilePath,
		this.ParentString(),
		this.RootString(),
		this.NumberOfPages(),
		this.NumberOfChildren(),
		this.metaData.NumberOfProperties()
	];
}

module.exports = {
	ConfigFile: ConfigFile
};


