// flag.js

const fs = require("fs");

const KZTable = require("./table").KZTable;

const fsutils = require("./fsutils");
const helpDocDirectory = require("./common").helpDocDirectory;



function KZFlag (flagObject) {
	this.code = flagObject.code;
	this.name = flagObject.name;
	this.description = flagObject.description;
	this.disk = (flagObject.disk === undefined) ? false : flagObject.disk;
	this.implemented = (flagObject.implemented === undefined) ? false : flagObject.implemented;
	this.major = (flagObject.major === undefined) ? false : flagObject.major;
	this.modifier = (flagObject.modifier === undefined) ? false : flagObject.modifier;
	this.independent = !this.major && !this.modifier;
	this.isset = false;
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
	return (this.isset) ? "SET" : "";
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
		this.State()
	];
}

KZFlag.prototype.GetTable = function () {
	let table = new KZTable();
	table.AddColumn("Code");
	table.AddColumn("Name", 16);
	table.AddColumn("Description", 32);
	table.AddColumn("Attributes");
	table.AddColumn("Path");
	table.AddColumn("State", 10);
	return table;
}



module.exports = {
	KZFlag: KZFlag
};


