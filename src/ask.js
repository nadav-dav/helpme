var exec = require('child_process').exec;

module.exports = ask;

function ask(callback) {
    var stdin = process.stdin, stdout = process.stdout;
    stdin.resume();
    stdin.once('data', function(data) {
        data = data.toString().trim();
        callback(data);
    });
}