// jsfile.js



function JsFile (theme, data) {
	this.SetupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
JsFile.prototype = new ProtoFile("js");
JsFile.prototype.typeName = "JavaScript";

JsFile.prototype.IsJsFile = function () {
	return true;
}



module.exports = {
	JsFile: JsFile
};


