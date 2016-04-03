# in-memory-database
1. How to run this code
  You will need node.js. From the command line, type:
  node database.js
  to run the program interactively.
  Alternately
  node database.js < sample.txt
  to run the program on the file of commands contained in sample.txt

2. Design choices and time complexity
 The data store is implemented using 3 collections: storage (hash table), valueCounters (hash table), and transactionStack (array, being used as a poor man's stack).

 Hash tables allow O(1) insertion, deletion, and retrieval, so GET and SET are O(1), interacting with storage. BEGIN adds an element to a stack, which is also O(1). In order to implement a fast NUMEQUALTO, I used a third collection, valueCounters. I get a sublinear (in fact, O(1)) implementation of NUMEQUALTO, but there is a tradeoff: I use as much as double the memory, compared to a solution where I iterate over storage to compute NUMEQUALTO.

 The difference between a permanent change to the data store and a change contained within a transaction is precisely that the transaction can be undone. When SET and UNSET are called, I add their inverse operations (RSET, RUNSET) [named for 'Rollback SET' and 'Rollback UNSET'] with appropriate arguments to the transaction stack. If I'm not within a transaction, then there is no such record, which makes the change permanent.

 Notice that the inverse operations of SET and UNSET are not SET and UNSET! In my implementation, SET and UNSET called within a transaction add a record of their inverse operations to the transaction stack. But ROLLBACK removes entries from the transaction stack and calls each entry in turn. There are a couple ways I could handle this, and I chose to write versions of SET and UNSET that do not interact with the transaction stack. The advantage is that I can invoke each entry of the stack in turn without storing any extra variables in memory.

 As a final point, I use parseTransaction rather than parseLine. Users should not be able to circumvent the transaction stack by calling RSET and RUNSET from the command line.