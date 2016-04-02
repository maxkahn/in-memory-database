var readline = require('readline');

var main = function() {
  if (arguments.length === 0) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', function(line) {
      console.log(line);
    });
  }
  else {
    
  }

};

main();