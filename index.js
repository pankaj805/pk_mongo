let MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    Promise = require('bluebird'),
    _ = require('underscore');

let MONGO_CONNECT_STR;

let db = null;

export const initialize = (mongoConnStr) => {
    MONGO_CONNECT_STR = mongoConnStr;
    console.log('connecting to Mongo: ' + MONGO_CONNECT_STR);
    MongoClient.connect(MONGO_CONNECT_STR, function (err, dbConn) {
        if (err) throw err;
        console.log('Established Mongo Connection!');
        db = dbConn;
    });
}


export const findOneByCriteria = (collectionName, criteria) => {
    transformIdToObjectId(criteria);
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(criteria).toArray()
            .then((results) => {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });
    });
}

export const findByCriteria = (collectionName, criteria) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(criteria).toArray()
            .then((results) => {
                resolve(results);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const deleteByCriteria = (collectionName, criteria) => {
    return db.collection(collectionName).deleteOne(criteria);
}

export const findAndProject = (collectionName, criteria, projectionFields) => {
    console.log(collectionName, criteria, projectionFields);
    let projectionObj = {_id: 0};

    for (let field of projectionFields) {
        projectionObj[field] = 1;
    }

    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(criteria).project(projectionObj).toArray()
            .then((results) => {
                resolve(results);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const findCountByCriteria = (collectionName, criteria) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(criteria).count()
            .then((count) => {
                resolve(count);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    });
}

export const findNearbyDocs = (collectionName, latitude, longitude, maxDistance, projectionFields) => {
    let projectionObj = {_id: 0};

    for (let field of projectionFields) {
        projectionObj[field] = 1;
    }

    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            }
        }).project(projectionObj).toArray()
            .then((zipprs) => {
                resolve(zipprs);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const findNearbyDocsWithCriteria = (collectionName, latitude, longitude, maxDistance, criteria, projectionFields) => {

    let projectionObj = {_id: 0};

    for (let field of projectionFields) {
        projectionObj[field] = 1;
    }

    if (!criteria)
        criteria = {};

    criteria.location = {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
        }
    };

    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(criteria).project(projectionObj).toArray()
            .then((zipprs) => {
                resolve(zipprs);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const addToSet = (collectionName, criteria, fieldName, valueToAdd) => {
    let addToSetObj = {};
    addToSetObj[fieldName] = valueToAdd;
    return new Promise((resolve, reject) => {
        db.collection(collectionName).updateOne(criteria, {$addToSet: addToSetObj}, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const findIntersectingDocs = (collectionName, polygonField, latitide, longitude, additionalCriteria) => {
    let criteria = {};

    if (additionalCriteria) {
        criteria = additionalCriteria;
    }
    criteria[polygonField] = {
        $geoIntersects: {
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitide]
            }
        }
    };
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(criteria).toArray()
            .then((results) => {
                if (results && results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const findIntersectingDoc = (collectionName, polygonField, latitude, longitude, additionalCriteria) => {
    return findIntersectingDocs(collectionName, polygonField, latitude, longitude, additionalCriteria)
        .then((docs) => {
            if (docs && docs.length > 0) {
                return Promise.resolve(docs);
            } else {
                return Promise.resolve(null);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

export const create = (collectionName, data) => {
    return db.collection(collectionName).insertOne(data)
        .then((r) => {
            console.log('inserting >>>');
            console.log(JSON.stringify(r));
            return Promise.resolve(r.insertedId);
        })
        .catch((err) => {
            console.log('error', err);
            return Promise.reject(err);
        });
}

export const update = (collectionName, criteria, dataToUpdate) => {
    transformIdToObjectId(criteria);
    return db.collection(collectionName).updateOne(criteria, {$set: dataToUpdate})
        .then((r) => {
            return Promise.resolve(r.matchedCount);
        })
        .catch((err) => {
            return Promise.reject(err);
        })
}

function incrementByVal(collectionName, criteria, fieldToIncrement, incrementByVal) {
    transformIdToObjectId(criteria);
    return db.collection(collectionName).updateOne(criteria, {$inc: {[fieldToIncrement]: incrementByVal}})
        .then((r) => {
            return Promise.resolve(r.matchedCount);
        })
        .catch((err) => {
            return Promise.resject(err);
        })
}

export const getBoundingPolygons = (collectionName, polygonField, lat, lng, projectionFields) => {
    let projectionObj = {};

    for (let field of projectionFields) {
        projectionObj[field] = 1;
    }
    let geoQuery = {
        [polygonField]: {
            $geoIntersects: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            }
        }
    };
    return db.collection(collectionName).find(geoQuery).project(projectionObj).toArray()
        .then(docs => {
            return Promise.resolve(docs);
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

export const incrementField = (collectionName, criteria, fieldToIncrement) => {
    return incrementByVal(collectionName, criteria, fieldToIncrement, 1);
}

export const decrementField = (collectionName, criteria, fieldToIncrement) => {
    return incrementByVal(collectionName, criteria, fieldToIncrement, -1);
}

export const findSorted = (collectionName, criteria, sortObj, pageNo, pageSize) => {
    return db.collection(collectionName).find(criteria).sort(sortObj).skip((pageNo - 1) * pageSize).limit(pageSize).toArray();
}

export const findOneAndDelete = (collectionName, criteria) => {
    return db.collection(collectionName).findOneAndDelete(criteria)
        .then(r => {
            return Promise.resolve(r.value);
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

const transformIdToObjectId = (criteria) => {
    if (criteria._id) {
        criteria._id = ObjectId(criteria._id);
    }
}

export const pullFromSet = (collectionName, criteria, fieldName, valueToRemove) => {
    transformIdToObjectId(criteria);
    let removeFromSet ={};
    removeFromSet[fieldName]= valueToRemove;

    console.log(removeFromSet);

    return new Promise((resolve, reject) => {
        db.collection(collectionName).updateOne(criteria, {$pull: removeFromSet}, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}