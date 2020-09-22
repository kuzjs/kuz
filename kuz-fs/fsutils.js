// fsutils.js

const fs = require('fs');



function TrimSlashes (text) {
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

function CreateDirectory (path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, {
			recursive: true
		});
	}
}

function GetFileMTime (path) {
	if (fs.existsSync(path)) {
		return fs.statSync(path).mtimeMs;
	}
	return 0;
}

function JoinPath () {
	let path = "";

	if (arguments.length > 0) {
		for (let argument of arguments) {
			let arg = TrimSlashes(argument.trim());
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

function IsFileOrDirectory (filepath) {
	if (fs.existsSync(filepath)) {
		return true;
	}
	return false;
}

function IsDirectory (dirpath) {
	if (IsFileOrDirectory(dirpath) && fs.lstatSync(dirpath).isDirectory()) {
		return true;
	}
	return false;
}

function IsFile (filepath) {
	if (IsFileOrDirectory(filepath) && fs.lstatSync(filepath).isFile()) {
		return true;
	}
	return false;
}

function IsNewerThan (f1, f2) {
	if (IsFile(f1) && IsFile(f2)) {
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
	if (IsFile(filepath)) {
		if (IsDirectory(dirpath)) {
			fs.readdirSync(dirpath).forEach(file => {
				let newfilepath = dirpath + "/" + file;
				if (IsFile(newfilepath)) {
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

function DeleteDirectory (dirpath) {
	if (IsDirectory(dirpath)) {
		fs.readdirSync(dirpath).forEach((file, index) => {
			const filepath = dirpath + "/" + file;
			if (fs.lstatSync(filepath).isDirectory()) {
				DeleteDirectory(filepath);
			} else {
				fs.unlinkSync(filepath);
			}
		});
		fs.rmdirSync(dirpath);
	}
}

function DeleteAllButIndexHtml (dirpath) {
	fs.readdirSync(dirpath).forEach((file, index) => {
		let filepath = dirpath + "/" + file;
		if (IsDirectory(filepath)) {
			DeleteDirectory(filepath);
		} else {
			if (file === "index.html") {
			} else {
				fs.unlinkSync(filepath);
			}
		}
	});
}



module.exports = {
	TrimSlashes: TrimSlashes,
	CreateDirectory: CreateDirectory,
	FileExists: FileExists,
	FileDoesNotExist: FileDoesNotExist,
	GetFileMTime: GetFileMTime,
	JoinPath: JoinPath,
	IsFileOrDirectory: IsFileOrDirectory,
	IsDirectory: IsDirectory,
	IsFile: IsFile,
	IsNewerThan: IsNewerThan,
	DirectoryHasNewerFiles: DirectoryHasNewerFiles,
	DeleteDirectory: DeleteDirectory,
	DeleteAllButIndexHtml: DeleteAllButIndexHtml
};


