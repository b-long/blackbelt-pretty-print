/*
json-pretty-printer
(c) 2015 b-long http://github.com/b-long/blackbelt-pretty-print
License: MIT
*/

var fs = require('fs');
var readlineSync = require('readline-sync');
// Arguments parser
var argv = require('yargs')
.usage('Usage: $0 [input file path] [output file path]')
.argv;

var inputPath, outputPath, fileContent;
function testPath(path){
	if (typeof path !== 'string' || path.indexOf ("~") >= 0){
		throw new Error ("Path to file is incorrect, ensure you're using an absolute path");
	}
}

function setInputPath(){
	// Get input file
	inputPath = readlineSync.question("Please provide the absolute path to your input JSON file: ");
}

function setOutputPath(){
	// Get output file
	outputPath = readlineSync.question("Please provide the absolute path to your output file (leave blank to print to STDOUT): ");
	console.info("Got answer: %s", outputPath);
}

if (Array.isArray(argv._)){
	console.log("You passed the following Arguments: %s", JSON.stringify(argv._));
	console.log("# arguments = " + argv._.length);
}

if (argv._.length === 0){
	setInputPath();
	setOutputPath();
}
else if (argv._.length == 1){
	inputPath = argv._[0];
	setOutputPath();
}
else if (argv._.length == 2){
	inputPath = argv._[0];
	outputPath = argv._[1];
}
else {
	throw new Error ("Too many arguments!");
	// TODO: print usage
}

testPath(inputPath);

// Read and prettify JSON
console.info("Attempting to read file '%s'", inputPath);
try {
	fileContent = fs.readFileSync(inputPath, 'utf8');
}
catch(err){
	console.error("An error occurred reading the file provided: \n%s", err);
}
var jsonAsObject = JSON.parse(fileContent);
var prettyJson = JSON.stringify(jsonAsObject, null, 4);

if (outputPath === null || outputPath.length === 0){
	console.trace("Printing to STDOUT");
	console.log(prettyJson);
}
else {
	testPath(outputPath);
	if (inputPath === outputPath){
		throw new Error ("Can't overwrite input file");
	}

	fs.writeFile(outputPath, prettyJson, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Prettified JSON saved to " + outputPath);
		}
	});
}
