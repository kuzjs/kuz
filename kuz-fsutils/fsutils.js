// fsutils.js

const fs = require('fs');



function trimSlashes (text) {
	let firstNonSlash = 0;
	let lastNonSlash = text.length - 1;

	for (let index = 0; index < text.length; index++) {
		if (text[index] != "/") {
			firstNonSlash = index;
			break;
		}
	}

	for (let index = 0; index < text.length; index++) {
		if (text[index] != "/") {
			lastNonSlash = index;
		}
	}

	return text.slice(firstNonSlash, lastNonSlash+1);
}

function FileExists (path) {
	if (fs.existsSync(path)) {
		return true;
	}
	return false;
}

function FileDoesNotExist (path) {
	return !FileExists(path);
}

function createDirectory (path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, {
			recursive: true
		});
	}
}

function getFileMTime (path) {
	if (fs.existsSync(path)) {
		return fs.statSync(path).mtimeMs;
	}
	return 0;
}

function JoinPath () {
	let path = "";

	if (arguments.length > 0) {
		for (let argument of arguments) {
			let arg = trimSlashes(argument.trim());
			if (arg != undefined && arg.length != 0) {
				if (path === "") {
					path = arg;
				} else {
					path = path + "/" + arg;
				}
			}
		}
	}

	return path;
}

function isFileOrDirectory (filepath) {
	if (fs.existsSync(filepath)) {
		return true;
	}
	return false;
}

function isDirectory (dirpath) {
	if (isFileOrDirectory(dirpath) && fs.lstatSync(dirpath).isDirectory()) {
		return true;
	}
	return false;
}

function isFile (filepath) {
	if (isFileOrDirectory(filepath) && fs.lstatSync(filepath).isFile()) {
		return true;
	}
	return false;
}

function IsNewerThan (f1, f2) {
	if (isFile(f1) && isFile(f2)) {
		if (fs.statSync(f1).mtimeMs > fs.statSync(f2).mtimeMs) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function DirectoryHasNewerFiles (dirpath, filepath) {
	let directoryHasNewerFiles = false;
	if (isFile(filepath)) {
		if (isDirectory(dirpath)) {
			fs.readdirSync(dirpath).forEach(file => {
				let newfilepath = dirpath + "/" + file;
				if (isFile(newfilepath)) {
					if (fs.statSync(newfilepath).mtimeMs > fs.statSync(filepath).mtimeMs) {
						directoryHasNewerFiles = true;
						return;
					}
				} else {
					if (DirectoryHasNewerFiles(newfilepath, filepath)) {
						directoryHasNewerFiles = true;
						return;
					}
				}
			});

			return directoryHasNewerFiles;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

function deleteDirectory (dirpath) {
	if (isDirectory(dirpath)) {
		fs.readdirSync(dirpath).forEach((file, index) => {
			const filepath = dirpath + "/" + file;
			if (fs.lstatSync(filepath).isDirectory()) {
				deleteDirectory(filepath);
			} else {
				fs.unlinkSync(filepath);
			}
		});
		fs.rmdirSync(dirpath);
	}
}

function deleteAllButIndexHtml (dirpath) {
	fs.readdirSync(dirpath).forEach((file, index) => {
		let filepath = dirpath + "/" + file;
		if (isDirectory(filepath)) {
			deleteDirectory(filepath);
		} else {
			if (file === "index.html") {
			} else {
				fs.unlinkSync(filepath);
			}
		}
	});
}



module.exports = {
	trimSlashes: trimSlashes,
	createDirectory: createDirectory,
	FileExists: FileExists,
	FileDoesNotExist: FileDoesNotExist,
	getFileMTime: getFileMTime,
	JoinPath: JoinPath,
	isFileOrDirectory: isFileOrDirectory,
	isDirectory: isDirectory,
	isFile: isFile,
	IsNewerThan: IsNewerThan,
	DirectoryHasNewerFiles: DirectoryHasNewerFiles,
	deleteDirectory: deleteDirectory,
	deleteAllButIndexHtml: deleteAllButIndexHtml
};


