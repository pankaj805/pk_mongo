# pk_mongo
Mongo Helper Library

This is a very simple library intended to write queries efficiently in nodejs if you are using mongodb as database.  

The idealogies which were kept in mind are:
 * Simple and light library
 * No Overkill of features

# Getting Started
First install the library as below
```
npm install pkmongo
```

In your app.js file intialize the MongoHelper as below:

```javascript
var MongoHelper = require('pkmongo').MongoHelper;
MongoHelper.initialize('mongodb://localhost:27017/runtrack');
```

Then wherever you need to run some mongo query, use it as below:

Add the module dependency
```
var MongoHelper = require('pkmongo').MongoHelper;
```
Then use it as below:
The Syntax is:
```
MongoHelper.<methodName>('CollectionName',<Optional Arguments/Criteria>)
```
For eg.

```
 return MongoHelper.findOneByCriteria('user', {"primary_phone" : "9876543210"})
            .then(user => {
               // your code
            })
            .catch(err => {
               // your code
            });
```
