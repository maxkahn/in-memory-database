var readline = require('readline');

var storage = {};
var valueCounters = {};
var transactionStack = [];

var set = function(name, value) {
  if (!storage.hasOwnProperty(name)) {
    storage[name] = value;
    if (valueCounters.hasOwnProperty(value)) {
      valueCounters[value]++;
    }
    else {
      valueCounters[value] = 1;
    }
    if (transactionStack.length > 0) {
      transactionStack.push('RUNSET ' + name);
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
    if (transactionStack.length > 0) {
      transactionStack.push('RSET ' + name + ' ' + oldValue);
    }
  }
};

var rset = function(name, value) {
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
    var currentValue = storage[name];
    if (valueCounters[currentValue] === 1) {
      delete valueCounters[currentValue];
      delete storage[name];
    }
    else {
      valueCounters[currentValue]--;
      delete storage[name];
    }
    if (transactionStack.length > 0) {
      transactionStack.push('RSET ' + name + ' ' + currentValue);
    }
  }
};

var runset = function(name) {
    if (storage.hasOwnProperty(name)) {
    var currentValue = storage[name];
    if (valueCounters[currentValue] === 1) {
      delete valueCounters[currentValue];
      delete storage[name];
    }
    else {
      valueCounters[currentValue]--;
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

var begin = function() {
  transactionStack.push('BEGIN');
};

var rollback = function() {
  if (transactionStack.length === 0) {
    process.stdout.write("NO TRANSACTION\n");
  }
  else {
    while(transactionStack[transactionStack.length - 1] !== 'BEGIN') {
      parseTransaction(transactionStack[transactionStack.length - 1]);
      transactionStack.pop();
    }
    transactionStack.pop();
  }
};

var commit = function() {
  if (transactionStack.length === 0) {
    process.stdout.write("NO TRANSACTION\n");
  }
  else {
    transactionStack = [];
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
  else if (funcWord === 'BEGIN') {
    func = begin;
  }
  else if (funcWord === 'ROLLBACK') {
    func = rollback;
  }
  else if (funcWord === 'COMMIT') {
    func = commit;
  }
  func.apply(null, words);
};

var parseTransaction = function(str) {
  var words = str.split(' ');
  var funcWord = words[0];
  words.shift();
  var func;
  if (funcWord === 'RSET') {
    func = rset;
  }
  else if (funcWord === 'RUNSET') {
    func = runset;
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