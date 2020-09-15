// flag.js

const KZTable = require("./table").KZTable;



function KZFlag (flagObject) {
	this.code = flagObject.code;
	this.name = flagObject.name;
	this.description = flagObject.description;
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

KZFlag.prototype.Status = function () {
	return (this.implemented) ? "Working" : "Dev";
}

KZFlag.prototype.Type = function () {
	if (this.major) {
		return "M";
	} else if (this.modifier) {
		return "mod";
	} else {
		return "I";
	}
}

KZFlag.prototype.State = function () {
	return (this.isset) ? "SET" : "---";
}

KZFlag.prototype.Row = function () {
	return [this.Code(), this.FullName(), this.Description(), this.Status(), this.Type(), this.State()];
}

KZFlag.prototype.GetTable = function () {
	let table = new KZTable();
	table.AddColumn("Code");
	table.AddColumn("Name", 16);
	table.AddColumn("Description", 32);
	table.AddColumn("Status", 8);
	table.AddColumn("Type", 8);
	table.AddColumn("State", 10);
	return table;
}



module.exports = {
	KZFlag: KZFlag
};


