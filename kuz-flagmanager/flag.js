// flag.js

const fs = require("fs");

const fsutils = require("../kuz-fsutils");
const helpDocDirectory = require("../kuz-common").helpDocDirectory;



function KuzFlag (flagObject) {
	this.code = flagObject.code;
	this.name = flagObject.name;
	this.description = flagObject.description;
	this.disk = (flagObject.disk === undefined) ? false : flagObject.disk;
	this.major = (flagObject.major === undefined) ? false : flagObject.major;
	this.modifier = (flagObject.modifier === undefined) ? false : flagObject.modifier;
	this.touchmenot = (flagObject.touchmenot === undefined) ? false : flagObject.touchmenot;
	this.independent = (flagObject.independent === undefined) ? false : flagObject.independent;

	this.has_params = (flagObject.params === undefined) ? false : flagObject.params;
	this.count = 0;
	this.params = [];
}

KuzFlag.prototype.isSet = function () {
	return (this.count > 0) ? true : false;
}

KuzFlag.prototype.getCode = function () {
	return "-" + this.code;
}

KuzFlag.prototype.getName = function () {
	return this.name;
}

KuzFlag.prototype.getFullName = function () {
	return "--" + this.getName();
}

KuzFlag.prototype.getDescription = function () {
	return this.description;
}

KuzFlag.prototype.getDisk = function () {
	return (this.disk) ? "Disk" : "";
}

KuzFlag.prototype.getType = function () {
	if (this.major) {
		return "Major";
	} else if (this.modifier) {
		return "Modifier";
	} else if (this.touchmenot) {
		return "Touch-me-not";
	} else {
		return "Independent";
	}
}

KuzFlag.prototype.getAttributes = function () {
	let attributes = [];
	if (this.getDisk() != "") {
		attributes.push(this.getDisk());
	}
	attributes.push(this.getType());
	return attributes.join(" | ");
}

KuzFlag.prototype.getState = function () {
	return "".padStart(this.count, "+");
}

KuzFlag.prototype.hasParams = function () {
	return this.has_params;
}

KuzFlag.prototype.addParam = function (param) {
	if (this.hasParams()) {
		this.params.push(param);
	}
}

KuzFlag.prototype.getParams = function () {
	return this.params;
}

KuzFlag.prototype.getParamsString = function () {
	if (this.hasParams()) {
		if (this.params.length === 0) {
			return "[]"
		}
		return "[" + this.params + "]";
	}
	return "---";
}

KuzFlag.prototype.getFileName = function () {
	return this.getName() + ".txt";
}

KuzFlag.prototype.getFilePath = function () {
	return fsutils.JoinPath(helpDocDirectory, this.getFileName());
}

KuzFlag.prototype.getDoc = function () {
	return fs.readFileSync(this.getFilePath(), "utf8");
}

KuzFlag.prototype.printDoc = function () {
	console.log(this.getDoc());
}

KuzFlag.prototype.getTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("Code");
	table.addColumn("Name");
	table.addColumn("Description");
	table.addColumn("Attributes");
	table.addColumn("Path");
	table.addColumn("State");
	table.addColumn("Params");
	return table;
}

KuzFlag.prototype.getRow = function () {
	return [
		this.getCode(),
		this.getFullName(),
		this.getDescription(),
		this.getAttributes(),
		this.getFilePath(),
		this.getState(),
		this.getParamsString()
	];
}



module.exports = KuzFlag;


