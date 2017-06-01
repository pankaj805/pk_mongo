# Getting Started

First install the library as below

```
npm install pkmongo
```

In your app.js file intialize the MongoHelper as below:

```javascript
var MongoHelper = require('pkmongo').MongoHelper;
// or
// import {MongoHelper} from 'pkmongo';
MongoHelper.initialize('mongodb://localhost:27017/test');
```

Then wherever you need to run some mongo query, use it as below:

Add the module dependency

```
var MongoHelper = require('pkmongo').MongoHelper;
or
import {MongoHelper} from 'pkmongo';
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

# 



