var readline = require('readline');

var storage = {};
var valueCounters = {};

var set = function(name, value) {
  if (!storage.hasOwnProperty(name)) {
    storage[name] = value;
    if (valueCounters.hasOwnProperty(value)) {
      valueCounters[value]++;
    }
    else {
      valueCounters[value] = 1;
    }
  }
  else {
    var oldValue = storage[name];
    storage[name] = value;
    valueCounters[oldValue]--;
    if (valueCounters.hasOwnProperty(value)) {
      valueCounters[value]++;
    }
    else {
      valueCounters[value] = 1;
    }
  }
};

var get = function(name) {
  if (storage.hasOwnProperty(name)) {
    process.stdout.write(storage[name] + "\n");
  }
  else {
    process.stdout.write("NULL\n");
  }
};

var unset = function(name) {
  if (storage.hasOwnProperty(name)) {
    if (valueCounters[storage[name]] === 1) {
      delete valueCounters[storage[name]];
      delete storage[name];
    }
    else {
      valueCounters[storage[name]]--;
      delete storage[name];
    }
  }
};

var numequalto = function(value) {
  if (valueCounters.hasOwnProperty(value)) {
    process.stdout.write(valueCounters[value] + "\n");
  }
  else {
    process.stdout.write("0\n");
  }
};

var parseLine = function(str) {
  var words = str.split(' ');
  var funcWord = words[0];
  words.shift();
  var func;
  if (funcWord === 'SET') {
    func = set;
  }
  else if (funcWord === 'GET') {
    func = get;
  }
  else if (funcWord === 'UNSET') {
    func = unset;
  }
  else if (funcWord === 'NUMEQUALTO') {
    func = numequalto;
  }
  func.apply(null, words);
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line) {
  if (line === 'END') {
    rl.close();
  }
  else {
    parseLine(line);
  }
});