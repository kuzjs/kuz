// codefile.js

const fs = require('fs');

const log = require("../kuz-log/log");



function KuzCodeFile (kuz, path) {
	this.kuz = path;
	this.path = path;
}



module.exports = {
	KuzCodeFile: KuzCodeFile
};


