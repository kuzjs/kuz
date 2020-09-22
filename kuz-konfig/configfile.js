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
	this.path = fsutils.JoinPath(this.configDirpath, this.site.filenames.konfig);

	this.log = this.site.log.getChild(this.path);

	this.root = null;
	this.parent = null;
	this.children = [];
	this.index = 0;

	if (this.exists()) {
		const KuzFile = require("../kuz-kuzfile").KuzFile;
		this.kuzFile = new KuzFile(this, this.path);

		this.metaData = this.kuzFile.getMetaData();
		this.props = this.metaData.getProps();
	} else {
		this.log.badNews("KuzKonfig not found: " + this.path);
	}
}

const KuZBaseObject = require("../kuz-baseobject").KuZBaseObject;
KuzKonfig.prototype = new KuZBaseObject();
KuzKonfig.prototype.codeLetter = "g";

KuzKonfig.prototype.setParent = function (configFileParentObject) {
	if (configFileParentObject) {
		this.parent = configFileParentObject;
	} else {
		this.parent = null;
	}
}

KuzKonfig.prototype.addChild = function (configFileChildObject) {
	this.children.push(configFileChildObject);
}

KuzKonfig.prototype.addPage = function (page) {
	this.pages.push(page);
}

KuzKonfig.prototype.getDirPath = function () {
	return this.configDirpath;
}

KuzKonfig.prototype.getProps = function () {
	return this.props;
}

KuzKonfig.prototype.getPath = function () {
	return this.path;
}

KuzKonfig.prototype.exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

KuzKonfig.prototype.doesNotExist = function () {
	return !this.exists();
}

KuzKonfig.prototype.getEntriesObject = function () {
	let lines = this.kuzFile.getContentLines();
	let entries = {
		root: false,
		nonroot: []
	};
	for (let line of lines) {
		let lineNumber = line[0];
		let lineText = line[1].trim();
		if (lineText.startsWith("[") && lineText.endsWith("]")) {
			if (entries.root) {
				this.log.red(`Multiple roots specified on L${lineNumber}: ${lineText}`);
			} else {
				entries.root = lineText.slice(1, -1);
			}
		} else {
			entries.nonroot.push(lineText);
		}
	}
	return entries;
}

KuzKonfig.prototype.getPages = function () {
	return this.pages;
}

KuzKonfig.prototype.numberOfPages = function () {
	return this.pages.length;
}

KuzKonfig.prototype.numberOfChildren = function () {
	return this.children.length;
}

KuzKonfig.prototype.parentString = function () {
	if (this.parent) {
		return this.parent.CodeName();
	} else {
		return "";
	}
}

KuzKonfig.prototype.rootString = function () {
	if (this.root) {
		return "@";
	} else {
		return "";
	}
}

KuzKonfig.prototype.getStringValue = function (propertyName) {
	return this.metaData.getValue(propertyName);
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
		this.path,
		this.parentString(),
		this.rootString(),
		this.numberOfChildren(),
		this.numberOfPages(),
		this.metaData.numberOfProperties()
	];
}

module.exports = {
	KuzKonfig: KuzKonfig
};


