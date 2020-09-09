// fsutils.js

const fs = require('fs');

const log = require("./log");



function JoinPath () {
	let path = "";

	if (arguments.length > 0) {
		for (let index = 0; index < arguments.length; index++) {
			let argument = arguments[index];
			if (argument != undefined && argument.length != "") {
				if (path == "") {
					path = argument;
				} else {
					path = path + "/" + argument;
				}
			}
		}
	}

	return path;
}

function IsFileOrDirectory (filepath) {
	if (fs.existsSync(filepath)) {
		log.Yellow("Link exists: " + filepath);
		return true;
	}
	log.Yellow("Link does NOT exist: " + filepath);
	return false;
}

function IsDirectory (dirpath) {
	if (IsFileOrDirectory(dirpath) && fs.lstatSync(dirpath).isDirectory()) {
		log.Yellow("Directory exists: " + dirpath);
		return true;
	}
	log.Yellow("Directory does NOT exist: " + dirpath);
	return false;
}

function IsFile (filepath) {
	if (IsFileOrDirectory(filepath) && fs.lstatSync(filepath).isFile()) {
		log.Yellow("File exists: " + filepath);
		return true;
	}
	log.Yellow("File does NOT exist: " + filepath);
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
		log.Yellow("File exists: " + filepath);
		if (IsDirectory(dirpath)) {
			log.Yellow("Directory exists: " + dirpath);
			fs.readdirSync(dirpath).forEach(file => {
				let newfilepath = dirpath + "/" + file;
				if (IsFile(newfilepath)) {
					if (fs.statSync(newfilepath).mtimeMs > fs.statSync(filepath).mtimeMs) {
						log.Yellow(newfilepath + " is newer than " + filepath);
						directoryHasNewerFiles = true;
						return;
					}
				} else {
					if (DirectoryHasNewerFiles(newfilepath, filepath)) {
						log.Yellow(newfilepath + " contains files newer than " + filepath);
						directoryHasNewerFiles = true;
						return;
					}
				}
			});

			log.Yellow(dirpath + " has no files newer than " + filepath);
			return directoryHasNewerFiles;
		} else {
			log.Yellow("Directory does NOT exist: " + dirpath);
			return false;
		}
	} else {
		log.Yellow("File does NOT exist: " + filepath);
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
				log.Green("Deleted file: " + filepath);
			}
		});
		fs.rmdirSync(dirpath);
	}

	log.Green("Deleted directory: " + dirpath);
}

function DeleteAllButIndexHtml (dirpath) {
	fs.readdirSync(dirpath).forEach((file, index) => {
		let filepath = dirpath + "/" + file;
		if (IsDirectory(filepath)) {
			DeleteDirectory(filepath);
			log.Green("Deleted extra directory: " + filepath);
		} else {
			if (file == "index.html") {
				log.Yellow("File allowed: " + filepath);
			} else {
				fs.unlinkSync(filepath);
				log.Green("File deleted: " + filepath);
			}
		}
	});
}



module.exports = {
	JoinPath: JoinPath,
	IsFileOrDirectory: IsFileOrDirectory,
	IsDirectory: IsDirectory,
	IsFile: IsFile,
	IsNewerThan: IsNewerThan,
	DirectoryHasNewerFiles: DirectoryHasNewerFiles,
	DeleteDirectory: DeleteDirectory,
	DeleteAllButIndexHtml: DeleteAllButIndexHtml
};


