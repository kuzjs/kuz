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

function getAppropriateValue (value) {
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
			valueArray.push(getAppropriateValue(item));
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
			valueObject[propertyName] = getAppropriateValue(propertyValue);
		}
		return valueObject;
	} else if (IsQuoted(value)) {
		value = value.slice(1, -1);
		return value;
	} else {
		return value;
	}
}

function KuzProperty (textLine) {
	this.setup(textLine);
}

KuzProperty.prototype = {
	get name () {
		return this.nameX;
	},
	get value () {
		return this.valueX;
	}
};

KuzProperty.prototype.setup = function (textLine) {
	textLine = textLine.trim();
	let separatorIndex = textLine.length;
	let colonIndex = textLine.indexOf(":");
	if (colonIndex > 0) {
		separatorIndex = colonIndex;
	}

	let equalsIndex = textLine.indexOf("=");
	if (equalsIndex > 0 && equalsIndex < separatorIndex) {
		separatorIndex = equalsIndex;
	}

	if (separatorIndex > 0 && separatorIndex < textLine.length) {
		this.nameX = textLine.slice(0, separatorIndex).trim();
		let value = textLine.slice(separatorIndex + 1).trim();
		this.valueX = getAppropriateValue(value);
		this.badInput = false;
	} else {
		this.badInput = true;
	}
}

KuzProperty.prototype.ok = function () {
	if (this.badInput) {
		return false;
	}
	if (this.getName().length === 0) {
		return false;
	}
	return true;
}

KuzProperty.prototype.getName = function () {
	return this.name;
}

KuzProperty.prototype.getValue = function () {
	return this.value;
}

KuzProperty.prototype.getValueString = function () {
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

KuzProperty.prototype.IsOn = KuzProperty.prototype.IsTrue = function () {
	return (this.value === true) ? true : false;
}

KuzProperty.prototype.IsOff = KuzProperty.prototype.IsFalse = function () {
	return (this.value === false) ? false : true;
}

KuzProperty.prototype.getBooleanValue = function () {
	return (this.value === "false") ? false : true;
}

KuzProperty.prototype.getIntegerValue = function () {
	return 0;
}

KuzProperty.prototype.getStringValue = function () {
	return this.value;
}

KuzProperty.prototype.getTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("Property");
	table.addColumn("Value");
	return table;
}

KuzProperty.prototype.getRow = function () {
	return [this.Name(), this.getValueString()];
}

module.exports = KuzProperty;


