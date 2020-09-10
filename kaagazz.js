// kaagazz.js

const log = require("./utils/log");
const JsonFile = require("./utils/jsonfile").JsonFile;
const Site = require("./site").Site;

const jsonDirectory = "kaagazz_app/data/";

const kaagazzJsonPath = jsonDirectory + "kaagazz.json";
const blackadderJsonPath = jsonDirectory + "blackadder.json";
const loremIpsumJsonPath = jsonDirectory + "lorem-ipsum.json";

function ParseArguments (argv) {
	let page_name = "";
	let flags = {
		categories_only: false,
		debug: false,
		experiment: false,
		force: false,
		help: false,
		list: false,
		pages_only: false,
		tags_only: false,
		update: false,
		version: false,
		watch: false
	};

	for (let i=2; i<argv.length; i++) {
		let argument = argv[i];
		if (argument[0] == "-") {
			for (let j=1; j<argument.length; j++) {
				let character = argument[j];
				switch(character)
				{
					case "c":
						flags.categories_only = true;
						break;
					case "d":
						flags.debug = true;
						log.DebugOn();
						break;
					case "f":
						flags.force = true;
						break;
					case "h":
						flags.help = true;
						break;
					case "l":
						flags.list = true;
						break;
					case "p":
						flags.pages_only = true;
						break;
					case "t":
						flags.tags_only = true;
						break;
					case "u":
						flags.update = true;
						break;
					case "v":
						flags.version = true;
						break;
					case "w":
						flags.watch = true;
						break;
					case "x":
						flags.experiment = true;
						break;
					default:
						log.Red("Invalid flag: " + character);
						break;
				}
			}
		} else {
			page_name = argument;
		}
	}

	log.Yellow("page_name: " + page_name);
	for(var flag in flags)
	{
		log.Yellow(flag + ": " + flags[flag]);
	}

	return {
		page_name: page_name,
		flags: flags
	};
}



function KaagazzApp () {
	this.meta = new JsonFile(kaagazzJsonPath);
	this.blackadder = new JsonFile(blackadderJsonPath);
	this.ipsum = new JsonFile(loremIpsumJsonPath);

	if (this.AllIsWell()) {
		this.site = new Site(this);
	}

	this.args = ParseArguments(process.argv);
	this.flags = this.args.flags;
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
	let flags = this.meta.json.flags;
	for (let index in flags) {
		let flag = flags[index];
		log.Green(flag.code + " (" + flag.name + ") " + flag.description);
	}
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

	if (this.flags.help) {
		this.ShowHelp();
	} else if (this.flags.update) {
		this.Update();
	} else if (this.flags.version) {
		this.ShowVersion();
	} else if (this.flags.list) {
		this.ShowList();
	} else if (this.flags.experiment) {
		this.Experiment();
	} else if (this.args.page_name == "") {
		//
	}
}

const kaagazz = new KaagazzApp();


module.exports = {
	kaagazz: kaagazz,
	log: log
};


