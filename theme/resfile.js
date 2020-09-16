// resfile.js

const ProtoFile = require("./protofile").ProtoFile;



function ResFile (theme, data) {
	this.SetupProto(theme, data);
}

ResFile.prototype = new ProtoFile("res");
ResFile.prototype.typeName = "Resource";

ResFile.prototype.IsResFile = function () {
	return true;
}



module.exports = {
	ResFile: ResFile
};


