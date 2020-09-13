// cssfile.js

const ProtoFile = require("./protofile").ProtoFile;



function CssFile (theme, data) {
	this.SetupProto(theme, data);
}

CssFile.prototype = new ProtoFile("css");



module.exports = {
	CssFile: CssFile
};


