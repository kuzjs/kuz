// protofile.js



function ProtoFile (dirName) {
	this.dirName = dirName;
}

ProtoFile.prototype.toString = function () {
	return "File: " + this.dirName + "/" + this.fileName;
}



module.exports = {
	ProtoFile: ProtoFile
};


