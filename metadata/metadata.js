// metadata.js



const Property = require("./property").Property;

const Nss = require("../utils/nss").Nss;
const fsutils = require("../utils/fsutils");

function MetaData(site, path) {
	this.site = site;
	this.path = path;
	this.Setup();
}

MetaData.prototype.Setup = function () {
	this.properties = [];
	if (this.Exists()) {
		let metaNss = new Nss(this.path);
		let headerLines = metaNss.GetHeaderLines();
		for (let index in headerLines) {
			let headerLine = headerLines[index];
			let property = new Property(headerLine);
			this.properties.push(property);
		}
	} else {
		//
	}
}

MetaData.prototype.Exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

MetaData.prototype.GetValue = function (propertyName) {
	for (let index in this.properties) {
		let property = this.properties[index];
		if (propertyName == property.Name()) {
			return {
				found: true,
				value: property.Value()
			}
		}
	}

	return {
		found: false
	};
}

MetaData.prototype.NumberOfProperties = function () {
	return this.properties.length;
}

module.exports = {
	MetaData: MetaData
};


