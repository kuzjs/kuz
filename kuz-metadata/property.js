// property.js

const trueStrings = [
	"true", "on", "yes", "ofcourse"
];

const falseStrings = [
	"false", "off", "no", "ofcoursenot"
];

const nullStrings = [
	"null", "none", "nocomments"
];



function IsQuoted (text) {
	let trimmedText = text.trim();
	if (trimmedText.startsWith('"') && trimmedText.endsWith('"')) {
		return true;
	} else if (trimmedText.startsWith("'") && trimmedText.endsWith("'")) {
		return true;
	} else if (trimmedText.startsWith("`") && trimmedText.endsWith("`")) {
		return true;
	}
	return false;
}

function GetAppropriateValue (value) {
	value = value.trim();
	lowered = value.toLowerCase();
	if (trueStrings.includes(lowered)) {
		return true;
	} else if (falseStrings.includes(lowered)) {
		return false;
	} else if (nullStrings.includes(lowered)) {
		return null;
	} else if (value.startsWith("[") && value.endsWith("]")) {
		value = value.slice(1, -1);

		let valueArray = [];
		let arrayItems = value.split(",");
		for (let item of arrayItems) {
			valueArray.push(GetAppropriateValue(item));
		}
		return valueArray;
	} else if (value.startsWith("{") && value.endsWith("}")) {
		value = value.slice(1, -1);

		let valueObject = {};
		let objectPropertyArray = value.split(",");
		for (let objectPropertyText of objectPropertyArray) {
			let parts = objectPropertyText.split(":");
			let propertyName = parts[0].trim();
			let propertyValue = parts[1].trim();
			valueObject[propertyName] = GetAppropriateValue(propertyValue);
		}
		return valueObject;
	} else if (IsQuoted(value)) {
		value = value.slice(1, -1);
		return value;
	} else {
		return value;
	}
}

function Property (textLine) {
	let colonIndex = textLine.indexOf(":");
	this.nameX = textLine.slice(0, colonIndex).trim();
	let value = textLine.slice(colonIndex + 1).trim();
	this.valueX = GetAppropriateValue(value);
}

Property.prototype = {
	get name () {
		return this.nameX;
	},
	get value () {
		return this.valueX;
	}
};

Property.prototype.IsValid = function () {
	if (this.Name().length == 0) {
		return false;
	}
	return true;
}

Property.prototype.Name = function () {
	return this.GetName();
}

Property.prototype.GetName = function () {
	return this.name;
}

Property.prototype.Value = function () {
	return this.GetValue();
}

Property.prototype.GetValue = function () {
	return this.value;
}

Property.prototype.ValueString = function () {
	if (this.value.__proto__ === Array.prototype) {
		return "[" + this.value.join("|") + "]";
	} else if (this.value.__proto__ === Object.prototype) {
		let valueString = "{";
		let properties = [];
		for (let key in this.value) {
			properties.push(key + ": " + this.value[key]);
		}
		valueString += properties.join("|") + "}";
		return valueString;
	} else if (this.value === true) {
		return "true";
	} else if (this.value === false) {
		return "false";
	} else if (this.value === null) {
		return "null";
	}
	return this.value;
}

Property.prototype.IsOn = Property.prototype.IsTrue = function () {
	return (this.value === true) ? true : false;
}

Property.prototype.IsOff = Property.prototype.IsFalse = function () {
	return (this.value === false) ? false : true;
}

Property.prototype.GetBooleanValue = function () {
	return (this.value == "false") ? false : true;
}

Property.prototype.GetIntegerValue = function () {
	return 0;
}

Property.prototype.GetStringValue = function () {
	return this.value;
}

Property.prototype.getTable = function () {
	const KZTable = require("../kuz-table/table").KZTable;
	let table = new KZTable();
	table.AddColumn("Property");
	table.AddColumn("Value");
	return table;
}

Property.prototype.getRow = function () {
	return [this.Name(), this.ValueString()];
}

module.exports = {
	Property: Property
};


