#!/usr/bin/env node

var rek = require( 'rekuire' );
var exec = require('child_process').exec;
var util = require('util');
var package = rek( 'package.json' )
var fs = rek('fs');
var ask = rek('ask');
var HelpPrinter = rek('HelpPrinter');
var file = process.cwd()+"/HELPME";

if (~process.argv.indexOf("-h") || ~process.argv.indexOf("--help") ){
    file = __dirname+"/../HELPME";
}

if (!fs.existsSync(file)){
    console.log("Can't find HELPME file :_(");
}else{
    var content = fs.readFileSync(file,'utf8');
    content = content.replace(/\r\n/g,"\n");
    var helpPrinter = new HelpPrinter(content,ask, console.log, process.exit);
    helpPrinter.start();
}