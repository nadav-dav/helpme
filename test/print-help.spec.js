var rek = require('rekuire');
var clc = require('cli-color');
var HelpPrinter = rek('HelpPrinter');

describe("print help", function(){
    var out, helpPrinter;

    /**
     * @param {string} content
     * @param {int} [answer]
     * @returns {HelpPrinter}
     */
    function aHelpPrinter(content, answer){
        function writeToOut(data){
            out+=data+"\n";
        }
        function autoAnswer(callback){
            callback(answer);
        }
        function dontExit(){

        }
        return new HelpPrinter(content,autoAnswer, writeToOut, dontExit);
    }
    beforeEach(function(){
        out = "";
    });

    it("should print a simple line", function(){
        helpPrinter = aHelpPrinter("Hello");
        helpPrinter.start();
        expect(out ).toEqual("Hello\n");
    });
    it("should respond to user input, and follow redirects", function(){
        var content = "" +
            "Choose:" + "\n" +
            "#? 1: foo, 2:bar" + "\n" +
            "#foo" + "\n" +
            "you chose foo" + "\n" +
            "#bar" + "\n" +
            "you chose bar";
        helpPrinter = aHelpPrinter(content,2);
        helpPrinter.start();

        var expectedOutput = "Choose:"+"\n" +
            clc.green("[1,2]")+"\n" +
            "you chose bar"+"\n"
        expect(out ).toEqual(expectedOutput);
    });

    it("should be able to jump lines", function(){
        var content = "" +
            "hello" + "\n" +
            "#> jumpOver" + "\n" +
            "foo bar" + "\n" +
            "#jumpOver" + "\n" +
            "world"
        helpPrinter = aHelpPrinter(content,2);
        helpPrinter.start();
        expect(out ).toEqual("hello\nworld\n");
    });

    it("should be able to jump to end", function(){
        var content = "" +
            "hello" + "\n" +
            "#> end" + "\n" +
            "foo bar"
        helpPrinter = aHelpPrinter(content);
        helpPrinter.start();
        expect(out ).toEqual("hello\n");
    });
});

process.on('uncaughtException', function(err) {
    console.log(err);
});