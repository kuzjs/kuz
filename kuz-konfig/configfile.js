// configfile.js



const fsutils = require("../kuz-fs");



function KuzKonfig (site, dirpath, entity=false) {
	this.site = site;
	this.dirpath = dirpath;
	this.pages = [];

	if (entity) {
		this.configDirpath = dirpath;
	} else {
		if (this.dirpath === undefined) {
			this.configDirpath = site.GetInputDirectory();
		} else {
			this.configDirpath = site.GetInputDirectory() + "/" + dirpath;
		}
	}
	this.configFilePath = fsutils.JoinPath(this.configDirpath, this.site.filenames.konfig);

	this.log = this.site.log.getChild(this.configFilePath);

	this.root = null;
	this.parent = null;
	this.children = [];
	this.index = 0;

	if (this.Exists()) {
		const KuzMetaData = require("../kuz-metadata").KuzMetaData;
		this.metaData = new KuzMetaData(this, this.configFilePath);
		this.props = this.metaData.getProps();

		const Nss = require("../kuz-nss/nss").Nss;
		this.nss = new Nss(this.configFilePath);
	} else {
		this.log.badNews("KuzKonfig not found: " + this.configFilePath);
	}
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
KuzKonfig.prototype = new KZBaseObject();
KuzKonfig.prototype.codeLetter = "g";

KuzKonfig.prototype.SetParent = function (configFileParentObject) {
	if (configFileParentObject) {
		this.parent = configFileParentObject;
	} else {
		this.parent = null;
	}
}

KuzKonfig.prototype.AddChild = function (configFileChildObject) {
	this.children.push(configFileChildObject);
}

KuzKonfig.prototype.AddPage = function (page) {
	this.pages.push(page);
}

KuzKonfig.prototype.DirPath = function () {
	return this.configDirpath;
}

KuzKonfig.prototype.getProps = function () {
	return this.props;
}

KuzKonfig.prototype.Exists = function () {
	if (fsutils.IsFile(this.configFilePath)) {
		return true;
	}
	return false;
}

KuzKonfig.prototype.DoesNotExist = function () {
	return !this.Exists();
}

KuzKonfig.prototype.GetEntries = function () {
	return this.nss.GetContentLines();
}

KuzKonfig.prototype.GetEntriesObject = function () {
	let lines = this.nss.GetContentLines();
	let entries = {
		root: false,
		nonroot: []
	};
	for (let line of lines) {
		trimmedLine = line.trim();
		if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
			entries.root = trimmedLine.slice(1, -1);
		} else {
			entries.nonroot.push(trimmedLine);
		}
	}
	return entries;
}

KuzKonfig.prototype.getPages = function () {
	return this.pages;
}

KuzKonfig.prototype.NumberOfPages = function () {
	return this.pages.length;
}

KuzKonfig.prototype.NumberOfChildren = function () {
	return this.children.length;
}

KuzKonfig.prototype.ParentString = function () {
	if (this.parent) {
		return this.parent.CodeName();
	} else {
		return "";
	}
}

KuzKonfig.prototype.RootString = function () {
	if (this.root) {
		return "@";
	} else {
		return "";
	}
}

KuzKonfig.prototype.NumberOfEntriesString = function () {
	let noeString;
	if (this.root) {
		noeString = "@ + " + this.NumberOfPages() + "p";
	} else {
		noeString = this.NumberOfPages() + "p";
	}

	if (this.NumberOfChildren() > 0) {
		noeString += " + " + this.NumberOfChildren() + "d";
	}
	return noeString;
}

KuzKonfig.prototype.GetStringValue = function (propertyName) {
	return this.metaData.GetValue(propertyName);
}

KuzKonfig.prototype.getTable = function () {
	const KZTable = require("../kuz-table/table").KZTable;
	let table = new KZTable();
	table.addColumn("CodeName");
	table.addColumn("Path");
	table.addColumn("Parent");
	table.addColumn("@");
	table.addColumn("Dirs");
	table.addColumn("Pages");
	table.addColumn("Props");
	return table;
}

KuzKonfig.prototype.getRow = function () {
	return [
		this.CodeName(),
		this.configFilePath,
		this.ParentString(),
		this.RootString(),
		this.NumberOfChildren(),
		this.NumberOfPages(),
		this.metaData.NumberOfProperties()
	];
}

module.exports = {
	KuzKonfig: KuzKonfig
};


