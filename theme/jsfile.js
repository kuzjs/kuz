// jsfile.js

const ProtoFile = require("./protofile").ProtoFile;



function JsFile (theme, data) {
	this.SetupProto(theme, data);
}

JsFile.prototype = new ProtoFile("js");



module.exports = {
	JsFile: JsFile
};


