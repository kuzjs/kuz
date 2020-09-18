// jsonfile.js

const fs = require('fs');

const log = require("../kz-log/log");



let numberOfJsonFiles = 0;

function JsonFile(filepath) {
	this.filepath = filepath;
	this.id = numberOfJsonFiles++;
	this.ForcedUpdateJson();
}

JsonFile.prototype.GetId = function () {
	return this.id;
}

JsonFile.prototype.AllIsWell = function () {
	return this.allIsWell;
}

JsonFile.prototype.NeedsUpdate = function () {
	let new_mtimeMs = fs.statSync(this.filepath).mtimeMs;
	if (new_mtimeMs != this.mtimeMs) {
		return true;
	}
	return false;
}

JsonFile.prototype.IsUpToDate = function () {
	return !this.NeedsUpdate();
}

JsonFile.prototype.GetUpdatedJson = function () {
	return this.UpdateJson();
}

JsonFile.prototype.UpdateJson = function () {
	if (this.NeedsUpdate()) {
		this.ForcedUpdateJson();
	}
	return this.json;
}

JsonFile.prototype.ForcedUpdateJson = function () {
	try {
		this.mtimeMs = fs.statSync(this.filepath).mtimeMs;
		this.json = JSON.parse(fs.readFileSync(this.filepath));
		this.allIsWell = true;
		return this.json;
	} catch {
		log.BadNews("JSON NOT found: " + this.filepath);
		this.allIsWell = false;
		return null;
	}
}

JsonFile.prototype.GetPropertyValueFromName = function (name) {
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

JsonFile.prototype.GetConfigurationValue = function () {
	return this.GetPropertyValueFromName("configuration");
}

JsonFile.prototype.GetNestedValueFromName = function (parent, child) {
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

JsonFile.prototype.GetVisibilityFromName = function (name) {
	return this.GetNestedValueFromName("visibility", name);
}

JsonFile.prototype.GetBackgroundFromName = function (name) {
	return this.GetNestedValueFromName("backgrounds", name);
}



module.exports = {
	JsonFile: JsonFile
};

