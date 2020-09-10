// kaagazz.js

const log = require("./utils/log");
const JsonFile = require("./utils/jsonfile").JsonFile;
const Table = require("./utils/table").Table;
const Site = require("./site").Site;

const jsonDirectory = "kaagazz_app/data/";

const kaagazzJsonPath = jsonDirectory + "kaagazz.json";
const blackadderJsonPath = jsonDirectory + "blackadder.json";
const loremIpsumJsonPath = jsonDirectory + "lorem-ipsum.json";



function Flag (flagObject) {
	this.code = flagObject.code;
	this.name = flagObject.name;
	this.description = flagObject.description;
	this.status = flagObject.status;
	this.isset = false;
}

Flag.prototype.Row = function () {
	if (this.isset) {
		return [this.code, this.name, this.description, this.status, "SET"];
	} else {
		return [this.code, this.name, this.description, this.status, ""];
	}
}



function KaagazzApp () {
	this.meta = new JsonFile(kaagazzJsonPath);
	this.blackadder = new JsonFile(blackadderJsonPath);
	this.ipsum = new JsonFile(loremIpsumJsonPath);

	this.SetupFlags();

	if (this.AllIsWell()) {
		this.site = new Site(this);
	}
}

KaagazzApp.prototype.AllIsWell = function () {
	if (!this.meta.AllIsWell()) {
		return false;
	}

	if (!this.blackadder.AllIsWell()) {
		return false;
	}

	if (!this.ipsum.AllIsWell()) {
		return false;
	}

	return true;
}

KaagazzApp.prototype.SetupFlags = function () {
	let flags = this.meta.json.flags;
	this.flags = [];
	for (let index in flags) {
		let flagObject = flags[index];
		let flag = new Flag(flagObject);
		this.flags.push(flag);
	}

	let argv = process.argv;
	for (let i=2; i<argv.length; i++) {
		let argument = argv[i];
		if (argument[0] == "-") {
			for (let j=1; j<argument.length; j++) {
				let letter = argument[j];
				for (let k in this.flags) {
					let currentFlag = this.flags[k];
					if (currentFlag.code == letter) {
						currentFlag.isset = true;
					}
				}
			}
		}
	}

	if (this.HasFlag("debug")) {
		log.DebugOn();
	}
}

KaagazzApp.prototype.HasFlag = function (flagName) {
	for (let k in this.flags) {
		let currentFlag = this.flags[k];
		if (currentFlag.name == flagName) {
			return currentFlag.isset;
		}
	}

	return false;
}

KaagazzApp.prototype.Blackadder = function () {
	return this.blackadder.json["quotes"];
}

KaagazzApp.prototype.LoremIpsum = function () {
	return this.ipsum.json["lorem-ipsum"];
}

KaagazzApp.prototype.HelloWorld = function () {
	log.Green("Hello, " + this + "!");
}

KaagazzApp.prototype.GetSiteJsonPath = function () {
	return this.meta.json.filenames.siteJson;
}

KaagazzApp.prototype.Update = function () {
	return this.site.Update();
}

KaagazzApp.prototype.toString = function () {
	return this.meta.json.meta.name;
}

KaagazzApp.prototype.ShowHelp = function () {
	log.Green("Kaagazz help.");
	let table = new Table();
	table.AddColumn("Code");
	table.AddColumn("Name", 12);
	table.AddColumn("Description", 32);
	table.AddColumn("Status", 8);
	table.AddColumn("State", 10);

	for (let index in this.flags) {
		let flag = this.flags[index];
		table.Add(flag);
	}

	table.Print();
}

KaagazzApp.prototype.ShowVersion = function () {
	log.Green("Kaagazz version.");
}

KaagazzApp.prototype.ShowList = function () {
	log.Green("Kaagazz list.");
	this.site.PrintPages();
}

KaagazzApp.prototype.Experiment = function () {
	log.Green("Kaagazz experiment.");
}

KaagazzApp.prototype.CheckForModule = function (moduleName) {
	try {
		const mod = require(moduleName);
		return true;
	} catch {
		return false;
	}
}

KaagazzApp.prototype.Run = function () {
	if (!this.AllIsWell()) {
		log.BadNews("All is not well.");
		return;
	}

	if (!this.CheckForModule("pug")) {
		log.Red("Module NOT found: pug");
		return;
	}

	if (!this.CheckForModule("express")) {
		log.Red("Module NOT found: express");
		return;
	}

	if (this.HasFlag("help")) {
		this.ShowHelp();
	} else if (this.HasFlag("version")) {
		this.ShowVersion();
	} else if (this.HasFlag("build")) {
		//
	} else if (this.HasFlag("list")) {
		this.ShowList();
	} else if (this.HasFlag("serve")) {
		//
	} else if (this.HasFlag("update")) {
		this.Update();
	} else if (this.HasFlag("watch")) {
		//
	} else if (this.HasFlag("experiment")) {
		this.Experiment();
	} else {
		//
	}
}

const kaagazz = new KaagazzApp();


module.exports = {
	kaagazz: kaagazz,
	log: log
};


