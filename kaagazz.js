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
	this.implemented = (flagObject.implemented === undefined) ? false : flagObject.implemented;
	this.major = (flagObject.major === undefined) ? false : flagObject.major;
	this.modifier = (flagObject.modifier === undefined) ? false : flagObject.modifier;
	this.independent = !this.major && !this.modifier;
	this.isset = false;
}

Flag.prototype.Code = function () {
	return "-" + this.code;
}

Flag.prototype.Name = function () {
	return this.name;
}

Flag.prototype.FullName = function () {
	return "--" + this.Name();
}

Flag.prototype.Description = function () {
	return this.description;
}

Flag.prototype.Status = function () {
	return (this.implemented) ? "Working" : "Dev";
}

Flag.prototype.Type = function () {
	if (this.major) {
		return "M";
	} else if (this.modifier) {
		return "mod";
	} else {
		return "I";
	}
}

Flag.prototype.State = function () {
	return (this.isset) ? "SET" : "---";
}

Flag.prototype.Row = function () {
	return [this.Code(), this.FullName(), this.Description(), this.Status(), this.Type(), this.State()];
}

Flag.prototype.GetTable = function () {
	let table = new Table();
	table.AddColumn("Code");
	table.AddColumn("Name", 16);
	table.AddColumn("Description", 32);
	table.AddColumn("Status", 8);
	table.AddColumn("Type", 8);
	table.AddColumn("State", 10);
	return table;
}



function KaagazzApp () {
	this.meta = new JsonFile(kaagazzJsonPath);
	this.blackadder = new JsonFile(blackadderJsonPath);
	this.ipsum = new JsonFile(loremIpsumJsonPath);

	this.SetupFlags();

	if (this.AllIsWell()) {
		this.site = new Site(this);
	} else {
		this.site = null;
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

	if (!this.CheckForModule("pug")) {
		log.Red("Module NOT found: pug");
		return false;
	}

	if (!this.CheckForModule("express")) {
		log.Red("Module NOT found: express");
		return false;
	}

	return true;
}

KaagazzApp.prototype.SetupFlags = function () {
	let flags = this.meta.json.flags;
	this.flags = [];
	this.args = [];

	for (let index in flags) {
		let flagObject = flags[index];
		let flag = new Flag(flagObject);
		this.flags.push(flag);
	}

	let argv = process.argv;
	for (let i=2; i<argv.length; i++) {
		let argument = argv[i];
		if (argument.startsWith("--")) {
			let flagName = argument.slice(2).toLowerCase();
			for (let flagIndex in this.flags) {
				let currentFlag = this.flags[flagIndex];
				if (currentFlag.name == flagName) {
					currentFlag.isset = true;
				}
			}
		} else if (argument.startsWith("-")) {
			for (let j=1; j<argument.length; j++) {
				let letter = argument[j];
				for (let k in this.flags) {
					let currentFlag = this.flags[k];
					if (currentFlag.code == letter) {
						currentFlag.isset = true;
					}
				}
			}
		} else {
			this.args.push(argument);
		}
	}

	this.numberOfFlags = {
		independent: 0,
		major: 0,
		modifier: 0,
		total: 0
	};

	for (let index in this.flags) {
		let flag = this.flags[index];
		if (flag.isset) {
			this.numberOfFlags.total++;
			if (flag.independent) {
				this.numberOfFlags.independent++;
			} else if (flag.major) {
				this.numberOfFlags.major++;
			} else if (flag.modifier) {
				this.numberOfFlags.modifier++;
			}
		}
	}

	this.simpleFlags = {};
	for (let index in this.flags) {
		let flag = this.flags[index];
		this.simpleFlags[flag.name] = flag.isset;
	}

	if (this.simpleFlags.debug) {
		log.DebugOn();
	}
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

KaagazzApp.prototype.toString = function () {
	return this.meta.json.meta.name;
}

KaagazzApp.prototype.ShowSomeHelp = function () {
	log.Green("Kaagazz help.");
	let table = this.flags[0].GetTable();

	for (let index in this.flags) {
		let flag = this.flags[index];
		if (!flag.modifier) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowFullHelp = function () {
	let table = this.flags[0].GetTable();

	for (let index in this.flags) {
		let flag = this.flags[index];
		table.Add(flag);
	}

	table.Print();
}

KaagazzApp.prototype.ShowIndependentFlags = function () {
	let table = this.flags[0].GetTable();

	for (let index in this.flags) {
		let flag = this.flags[index];
		if (!flag.modifier && !flag.major) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowModifierFlags = function () {
	let table = this.flags[0].GetTable();

	for (let index in this.flags) {
		let flag = this.flags[index];
		if (flag.modifier) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowMajorFlags = function () {
	let table = this.flags[0].GetTable();

	for (let index in this.flags) {
		let flag = this.flags[index];
		if (flag.major) {
			table.Add(flag);
		}
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

KaagazzApp.prototype.ListThings = function (flags) {
	if (flags.all) {
		this.site.PrintAll();
	} else if (flags.entities) {
		this.site.PrintEntities();
	} else if (flags.authors) {
		this.site.PrintAuthors();
	} else if (flags.categories) {
		this.site.PrintCategories();
	} else if (flags.collections) {
		this.site.PrintCollections();
	} else if (flags.pages) {
		this.site.PrintPages();
	} else if (flags.tags) {
		this.site.PrintTags();
	} else {
		//
	}
}

KaagazzApp.prototype.UpdateThings = function (flags) {
	if (flags.all) {
		this.site.UpdateAll();
	} else if (flags.entities) {
		this.site.UpdateEntities();
	} else if (flags.authors) {
		this.site.UpdateAuthors();
	} else if (flags.categories) {
		this.site.UpdateCategories();
	} else if (flags.collections) {
		this.site.UpdateCollections();
	} else if (flags.pages) {
		this.site.UpdatePages();
	} else if (flags.tags) {
		this.site.UpdateTags();
	} else {
		//this.site.UpdateAll();
	}
}

KaagazzApp.prototype.ForcedUpdateThings = function (flags) {
	if (flags.all) {
		this.site.ForcedUpdateAll();
	} else if (flags.entities) {
		this.site.ForcedUpdateEntities();
	} else if (flags.authors) {
		this.site.ForcedUpdateAuthors();
	} else if (flags.categories) {
		this.site.ForcedUpdateCategories();
	} else if (flags.collections) {
		this.site.ForcedUpdateCollections();
	} else if (flags.pages) {
		this.site.ForcedUpdatePages();
	} else if (flags.tags) {
		this.site.ForcedUpdateTags();
	} else {
		//this.site.ForcedUpdateAll();
	}
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
	if (this.site == null) {
		log.BadNews("Site not initialized.");
		return;
	}

	let flags = this.simpleFlags;

	if (flags.help) {
		this.ShowSomeHelp();
	} else if (flags.helpfull) {
		this.ShowFullHelp();
	} else if (flags.independent) {
		this.ShowIndependentFlags();
	} else if (flags.modifier) {
		this.ShowModifierFlags();
	} else if (flags.major) {
		this.ShowMajorFlags();
	} else if (flags.version) {
		this.ShowVersion();
	} else if (flags.build) {
		//
	} else if (flags.list) {
		this.ListThings(flags);
	} else if (flags.forced) {
		this.ForcedUpdateThings(flags);
	} else if (flags.serve) {
		//
	} else if (flags.update) {
		this.UpdateThings(flags);
	} else if (flags.watch) {
		//
	} else if (flags.experiment) {
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


