"use strict";

var rek = require('rekuire');
var ask = rek('ask');
var clc = rek('cli-color')
var _ = rek('lodash');
var child = rek('child_process');

/**
 * @param {string} content
 * @param {function} inFunc
 * @param {function} outFunc
 * @param {function} exitFunc
 * @constructor
 */
function HelpPrinter(content, inFunc, outFunc, exitFunc){
    this._content = content.split("\n");
    this._out = outFunc;
    this._in = inFunc;
    this._exit = exitFunc;
    this._index = 0;
};


HelpPrinter.prototype.start = function(){
    this.next();
}
HelpPrinter.prototype.next = function(){
    var line = this._content[this._index];
    if (line != undefined){
        this._index++;
        if(line.substring(0,2) === "#?"){
            this.ask(line.substring(2),function(){
                this.next();
            }.bind(this));

        }else if(line.substring(0,2) === "#>"){
            this.jumpToTag(line.substring(2));
            this.next();

        }else if(line.substring(0,3) === "#.."){
            this._out(clc.green("[ENTER]"));
            ask(function(){
                this.next();
            }.bind(this));

        }else if(line.substring(0,6) === "#clear"){
            this._clearScreen(function(){
                this.next();
            }.bind(this));

        }else if(line.substring(0,1) === "#"){
            this.next();
        }else{
            this._out(line);
            this.next();
        }
    }else{
        this._exit();
    }
}

HelpPrinter.prototype.ask = function(line, callback){
    var options = line.split(",");
    var index = {};
    _.each(options,function(option){
        var key = option.split(":" )[0].trim();
        var value = option.split(":")[1].trim();
        index[key] = value;
    })
    this._out(clc.green("[" + Object.keys(index ).toString()+ "]"))
    this._in(function(choice){
        if (index[choice]){
            this.jumpToTag(index[choice]);
            callback();
        }else{
            this._out(clc.red("Not a valid answer! ["+Object.keys(index)+"]"));
            this.ask(line, callback);
        }
    }.bind(this))
}

HelpPrinter.prototype.jumpToTag = function(tag){
    this._index = this._content.indexOf("#"+tag.trim());
}

HelpPrinter.prototype._clearScreen = function clearScreen(done){
    if(process.platform === "win32"){
        process.stdout.write('\x1Bc');
    }
    else{
        var ps = child.spawn('clear');
        ps.stdout.on('data',function(data){
            process.stdout.write(data);
            done();
        })
        ps.stdin.end();
    }
}

module.exports = HelpPrinter;