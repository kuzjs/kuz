// jsonfile.js

const fs = require('fs');



let numberOfJsonFiles = 0;

function JsonFile(filepath) {
	this.filepath = filepath;
	this.id = numberOfJsonFiles++;
	this.forcedUpdateJson();
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
	return this.updateJson();
}

JsonFile.prototype.updateJson = function () {
	if (this.NeedsUpdate()) {
		this.forcedUpdateJson();
	}
	return this.json;
}

JsonFile.prototype.forcedUpdateJson = function () {
	try {
		this.mtimeMs = fs.statSync(this.filepath).mtimeMs;
		this.json = JSON.parse(fs.readFileSync(this.filepath));
		this.allIsWell = true;
		return this.json;
	} catch {
		this.allIsWell = false;
		return null;
	}
}

JsonFile.prototype.getPropertyValueFromName = function (name) {
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
	return this.getPropertyValueFromName("configuration");
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


