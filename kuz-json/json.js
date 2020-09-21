// KuzJson.js

const fs = require('fs');



let numberOfKuzJsons = 0;

function KuzJson (filepath) {
	this.filepath = filepath;
	this.id = numberOfKuzJsons++;
	this.forcedUpdateJson();
}

KuzJson.prototype.getId = function () {
	return this.id;
}

KuzJson.prototype.ok = function () {
	return this.okay;
}

KuzJson.prototype.needsUpdate = function () {
	let new_mtimeMs = fs.statSync(this.filepath).mtimeMs;
	if (new_mtimeMs != this.mtimeMs) {
		return true;
	}
	return false;
}

KuzJson.prototype.isUpToDate = function () {
	return !this.needsUpdate();
}

KuzJson.prototype.getUpdatedJson = function () {
	return this.updateJson();
}

KuzJson.prototype.updateJson = function () {
	if (this.needsUpdate()) {
		this.forcedUpdateJson();
	}
	return this.json;
}

KuzJson.prototype.forcedUpdateJson = function () {
	try {
		this.mtimeMs = fs.statSync(this.filepath).mtimeMs;
		this.json = JSON.parse(fs.readFileSync(this.filepath));
		this.okay = true;
		return this.json;
	} catch {
		this.okay = false;
		return null;
	}
}

KuzJson.prototype.getPropertyValueFromName = function (name) {
	if (this.json.hasOwnProperty(name)) {
		return {
			found: true,
			value: this.json[name]
		};
	}

	return {
		found: false
	};
}

KuzJson.prototype.getConfigurationValue = function () {
	return this.getPropertyValueFromName("configuration");
}

KuzJson.prototype.getNestedValueFromName = function (parent, child) {
	if (this.json.hasOwnProperty(parent)) {
		if (this.json[parent].hasOwnProperty(child)) {
			return {
				found: true,
				value: this.json[parent][child]
			};
		}
	}

	return {
		found: false
	};
}

KuzJson.prototype.getVisibilityFromName = function (name) {
	return this.getNestedValueFromName("visibility", name);
}

KuzJson.prototype.getBackgroundFromName = function (name) {
	return this.getNestedValueFromName("backgrounds", name);
}



module.exports = {
	KuzJson: KuzJson
};


