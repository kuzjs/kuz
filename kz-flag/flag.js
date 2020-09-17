// flag.js

const fs = require("fs");

const KZTable = require("../kz-table/table").KZTable;

const fsutils = require("../utils/fsutils");
const helpDocDirectory = require("../base/common").helpDocDirectory;



function KZFlag (flagObject) {
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

KZFlag.prototype.IsSet = function () {
	return (this.count > 0) ? true : false;
}

KZFlag.prototype.Code = function () {
	return "-" + this.code;
}

KZFlag.prototype.Name = function () {
	return this.name;
}

KZFlag.prototype.FullName = function () {
	return "--" + this.Name();
}

KZFlag.prototype.Description = function () {
	return this.description;
}

KZFlag.prototype.Disk = function () {
	return (this.disk) ? "Disk" : "";
}

KZFlag.prototype.Status = function () {
	return (this.implemented) ? "Working" : "Dev";
}

KZFlag.prototype.Type = function () {
	if (this.major) {
		return "Major";
	} else if (this.modifier) {
		return "Modifier";
	} else {
		return "Independent";
	}
}

KZFlag.prototype.Attributes = function () {
	let attributes = [];
	if (this.Disk() != "") {
		attributes.push(this.Disk());
	}
	attributes.push(this.Status());
	attributes.push(this.Type());
	return attributes.join(" | ");
}

KZFlag.prototype.State = function () {
	return "".padStart(this.count, "+");
}

KZFlag.prototype.HasParams = function () {
	return this.hasParams;
}

KZFlag.prototype.AddParam = function (param) {
	if (this.HasParams()) {
		this.params.push(param);
	}
}

KZFlag.prototype.Params = function () {
	return this.params;
}

KZFlag.prototype.ParamsString = function () {
	if (this.HasParams()) {
		if (this.params.length == 0) {
			return "[]"
		}
		return "[" + this.params + "]";
	}
	return "---";
}

KZFlag.prototype.FileName = function () {
	return this.Name() + ".txt";
}

KZFlag.prototype.FilePath = function () {
	return fsutils.JoinPath(helpDocDirectory, this.FileName());
}

KZFlag.prototype.GetDoc = function () {
	return fs.readFileSync(this.FilePath(), "utf8");
}

KZFlag.prototype.PrintDoc = function () {
	console.log(this.GetDoc());
}

KZFlag.prototype.Row = function () {
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

KZFlag.prototype.GetTable = function () {
	let table = new KZTable();
	table.HideIndex().HideHeader();
	table.AddColumn("Code");
	table.AddColumn("Name");
	table.AddColumn("Description");
	table.AddColumn("Attributes");
	table.AddColumn("Path");
	table.AddColumn("State");
	table.AddColumn("Params");
	return table;
}



module.exports = {
	KZFlag: KZFlag
};


