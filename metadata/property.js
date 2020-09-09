// property.js



function GetAppropriateValue (value) {
	value = value.trim();
	if (value.startsWith("[") && value.endsWith("]")) {
		value = value.slice(1, -1);

		let valueArray = [];
		let arrayItems = value.split(",");
		for (let index in arrayItems) {
			valueArray.push(GetAppropriateValue(arrayItems[index]));
		}
		return valueArray;
	} else if (value.startsWith("{") && value.endsWith("}")) {
		value = value.slice(1, -1);

		let valueObject = {};
		let objectPropertyArray = value.split(",");
		for (let index in objectPropertyArray) {
			let objectPropertyText = objectPropertyArray[index];
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
	this.name = textLine.slice(0, colonIndex).trim();
	this.value = textLine.slice(colonIndex + 1).trim();
	this.value = GetAppropriateValue(this.value);
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


