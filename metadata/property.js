// property.js



function GetAppropriateValue (value) {
	value = value.trim();
	if (value.startsWith("[") && value.endsWith("]")) {
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
	} else if (value == "false") {
		return false;
	} else if (value == "true") {
		return true;
	} else if (value == "null") {
		return null;
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

module.exports = {
	Property: Property
};


