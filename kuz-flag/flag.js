// flag.js

const fs = require("fs");

const KuZTable = require("../kuz-table/table").KuZTable;

const fsutils = require("../kuz-fs");
const helpDocDirectory = require("../kuz-common").helpDocDirectory;



function KuzFlag (flagObject) {
	this.code = flagObject.code;
	this.name = flagObject.name;
	this.description = flagObject.description;
	this.disk = (flagObject.disk === undefined) ? false : flagObject.disk;
	this.implemented = (flagObject.implemented === undefined) ? false : flagObject.implemented;
	this.major = (flagObject.major === undefined) ? false : flagObject.major;
	this.modifier = (flagObject.modifier === undefined) ? false : flagObject.modifier;
	this.touchmenot = (flagObject.touchmenot === undefined) ? false : flagObject.touchmenot;
	this.independent = !this.major && !this.modifier && !this.touchmenot;

	this.hasParams = (flagObject.params === undefined) ? false : flagObject.params;
	this.count = 0;
	this.params = [];
}

KuzFlag.prototype.IsSet = function () {
	return (this.count > 0) ? true : false;
}

KuzFlag.prototype.Code = function () {
	return "-" + this.code;
}

KuzFlag.prototype.Name = function () {
	return this.name;
}

KuzFlag.prototype.FullName = function () {
	return "--" + this.Name();
}

KuzFlag.prototype.Description = function () {
	return this.description;
}

KuzFlag.prototype.Disk = function () {
	return (this.disk) ? "Disk" : "";
}

KuzFlag.prototype.Status = function () {
	return (this.implemented) ? "Working" : "Dev";
}

KuzFlag.prototype.Type = function () {
	if (this.major) {
		return "Major";
	} else if (this.modifier) {
		return "Modifier";
	} else {
		return "Independent";
	}
}

KuzFlag.prototype.Attributes = function () {
	let attributes = [];
	if (this.Disk() != "") {
		attributes.push(this.Disk());
	}
	attributes.push(this.Status());
	attributes.push(this.Type());
	return attributes.join(" | ");
}

KuzFlag.prototype.State = function () {
	return "".padStart(this.count, "+");
}

KuzFlag.prototype.HasParams = function () {
	return this.hasParams;
}

KuzFlag.prototype.AddParam = function (param) {
	if (this.HasParams()) {
		this.params.push(param);
	}
}

KuzFlag.prototype.Params = function () {
	return this.params;
}

KuzFlag.prototype.ParamsString = function () {
	if (this.HasParams()) {
		if (this.params.length == 0) {
			return "[]"
		}
		return "[" + this.params + "]";
	}
	return "---";
}

KuzFlag.prototype.FileName = function () {
	return this.Name() + ".txt";
}

KuzFlag.prototype.FilePath = function () {
	return fsutils.JoinPath(helpDocDirectory, this.FileName());
}

KuzFlag.prototype.GetDoc = function () {
	return fs.readFileSync(this.FilePath(), "utf8");
}

KuzFlag.prototype.PrintDoc = function () {
	console.log(this.GetDoc());
}

KuzFlag.prototype.getRow = function () {
	return [
		this.Code(),
		this.FullName(),
		this.Description(),
		this.Attributes(),
		this.FilePath(),
		this.State(),
		this.ParamsString()
	];
}

KuzFlag.prototype.getTable = function () {
	let table = new KuZTable();
	table.HideIndex().HideHeader();
	table.addColumn("Code");
	table.addColumn("Name");
	table.addColumn("Description");
	table.addColumn("Attributes");
	table.addColumn("Path");
	table.addColumn("State");
	table.addColumn("Params");
	return table;
}



module.exports = {
	KuzFlag: KuzFlag
};


