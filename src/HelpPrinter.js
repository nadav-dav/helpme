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
    this.resume();
}

HelpPrinter.prototype.resume = function(){
    while(true){
        var line = this._content[this._index];
        if (line != undefined){
            if(line.substring(0,2) === "#?"){
                this.ask(line.substring(2),function(){
                    this.resume();
                }.bind(this));
                this._index++;
                break;
            }else if(line.substring(0,2) === "#>"){
                this.jumpToTag(line.substring(2));
            }else if(line.substring(0,6) === "#clear"){
                this._clearScreen(function(){
                    this.resume();
                }.bind(this));
                this._index++;
                break;
            }else if(line.substring(0,1) === "#"){
                this._index++;
            }else{
                this._out(line);
                this._index++;
            }

        }else{
            this._exit();
            break;
        }
    }
};

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