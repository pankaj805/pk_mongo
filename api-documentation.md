# API Documentation

### create

`MongoHelper.create(collectionName<String>, data<Object>)`  
This function is used to insert a record into the given collection.  
It takes two arguments, the first being the collection name and the second being the data to be inserted.

### update

`MongoHelper.update(collectionName<String>, criteria<Object>, dataToUpdate<Object>)`  
This function is used to update a record in a given collection based on certain criteria.  
It takes three arguments, the first being the collection name and the second being conditional criteria and the third being the data to be inserted.

### findOneByCriteria

`MongoHelper.findOneByCriteria(collectionName, criteria<Object>)`  
This function is used to find a particular record based on a criteria.  
It takes two arguments, the first being the collection name and the second being the conditional criteria. It returns only one record.

### findByCriteria

`MongoHelper.findByCriteria(collectionName<String>, criteria<Object>)`  
This function is used to find some records based on a criteria.  
It takes two arguments, the first being the collection name and the second being the conditional criteria. It returns more than one record if available.

### deleteByCriteria

`MongoHelper.deleteByCriteria(collectionName<String>, criteria<Object>)`  
This function is used to delete a record based on some criteria.  
It takes two arguments, the first being the collection name and the second being the conditional criteria. It deletes only one record

### findAndProject

`MongoHelper.findAndProject(collectionName<String>, criteria<Object>, projectionFields[Array])`  
This function is used to find records based on certain criteria and project specific fields in the result set.  
It takes three arguments, the first being the collection name, the second being the conditional criteria and the third being the fields which you want to be projected in the resultset. It returns more than one record if available.

### findCountByCriteria

`MongoHelper.findCountByCriteria(collectionName<String>, criteria<Object>)`  
This function is used to calculate the count of records based on certain search criteria.  
It takes two arguments, the first being the collection name and the second being the conditional criteria. It returns the count of the result set.

### addToSet

`MongoHelper.addToSet(collectionName<String>, criteria<Object>, fieldName<String>, valueToAdd<Any>`  
This function is to push a value to an array of values of a particular field in the collection.  
It takes four arguments, the first being the collection name, the second being the conditional criteria, the third being the field name where you have to push the value and the fourth being the value to be pushed.

### pullFromSet

`MongoHelper.pullFromSet(collectionName<String>, criteria<Object>, fieldName<String>, valueToRemove<Any>`  
This function is to delete/pull a value from an array of values of a particular field in the collection.  
It takes four arguments, the first being the collection name, the second being the conditional criteria, the third being the field name where you want the value to be deleted and fourth being the value to be pulled/deleted.

### incrementField

`MongoHelper.incrementField(collectionName<String>, criteria<Object>,fieldToIncrement<String>)`  
This function is used to increment the value of a particular field by 1 in a given collection based on certain criteria  
It takes three arguments, the first being the collection name and the second being the conditional criteria and the third being the field which needs to be incremented.

### decrementField

`MongoHelper.decrementField(collectionName<String>, criteria<Object>,fieldToIncrement<String>)`  
This function is used to decrement the value of a particular field by 1 in a given collection based on certain criteria  
It takes three arguments, the first being the collection name and the second being the conditional criteria and the third being the field which needs to be decremented.

