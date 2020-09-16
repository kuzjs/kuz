// jsfile.js

const ProtoFile = require("./protofile").ProtoFile;



function JsFile (theme, data) {
	this.SetupProto(theme, data);
}

JsFile.prototype = new ProtoFile("js");
JsFile.prototype.typeName = "JavaScript";

JsFile.prototype.IsJsFile = function () {
	return true;
}



module.exports = {
	JsFile: JsFile
};


