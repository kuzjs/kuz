// resfile.js

const ProtoFile = require("./protofile").ProtoFile;



function ResFile (theme, data) {
	this.SetupProto(theme, data);
}

ResFile.prototype = new ProtoFile("res");



module.exports = {
	ResFile: ResFile
};


