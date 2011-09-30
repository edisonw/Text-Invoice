var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var Collection='Transaction';
/**
Structure:
{
_id: unique id,
p: phone number. with +country code.
m: message.
f: isFinished. 
c: created date.
a: detrmined action.
n: required next action if not finished.
t:[
keeping track of data.
]
}
*/
TransactionProvider = function(host, port) {
  this.db= new Db('ci-node-mongo', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  //this.db.dropCollection(Collection,function(){});
};

TransactionProvider.prototype.getCollection= function(callback) {
  this.db.collection(Collection, function(error, Transaction_collection) {
    if( error ) callback(error);
    else callback(null, Transaction_collection);
  });
};

TransactionProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, Transaction_collection) {
      if( error ) callback(error)
      else {
        Transaction_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
/**
Find the last valid incomplete transaction
*/
TransactionProvider.prototype.findLast = function(p,callback,action_filter) {
    this.getCollection(function(error, Transaction_collection) {
      if( error ) callback(error)
      else {
        Transaction_collection.find({'p':p,'a':{$ne:action_filter},'f':false}, {'sort':[['c', 'desc']],'limit':1}).toArray(function(error, result) {
          if( error ) callback(error)
          else{ 
           if(result==null || result.length==0)
           		callback(null,null);
           else
           		callback(null, result[0]);
          }
        });
      }
    });
};
TransactionProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, Transaction_collection) {
      if( error ) callback(error)
      else {
        Transaction_collection.findOne({_id: Transaction_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};
TransactionProvider.prototype.save = function(doc,callback){
    this.getCollection(function(error, Transaction_collection) {
    	if( error ){
    		if(callback)
      			callback(error);
      		else
    			console.log('Failed to save transaction: %s',error);
      		return;
    	}else {
			if(callback)
    			Transaction_collection.update({_id:doc._id},doc,null,callback);
    		else{
    			Transaction_collection.update({_id:doc._id},doc,null,function(error,n){
    				//console.log('Transaction saved with error= %s,n=%d',error,n);
				});
			}
		}
	});
};
TransactionProvider.prototype.findByPhoneNumber = function(phone, callback) {
    this.getCollection(function(error, Transaction_collection) {
      if( error ) callback(error)
      else {
        Transaction_collection.findOne({'p': phone}, function(error, result) {
          if( error ) callback(error)
          else callback(null,result)
        });
      }
    });
};

TransactionProvider.prototype.findAllForUser = function(user,callback) {
    this.getCollection(function(error, Transaction_collection) {
      if( error ) callback(error)
      else {
        Transaction_collection.find({p:user}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
//You can only save add Transaction at a time
TransactionProvider.prototype.add = function(Transaction, callback,old) {
	var here=this;
    this.getCollection(function(error, Transaction_collection) {
    	if( error ){
      		callback(error);
      		return;
    	}else {
    		if(typeof Transaction.p == "undefined"){
    			callback("User was not supplied");
    			return;
    		}
    		Transaction.c = new Date();
        	var Transactions=[Transaction];
        	Transaction_collection.insert(Transactions, 
        		function(errors,after) {
          			callback(errors,after[0],old);
          		}
          	);
    	}
    });
}
exports.TransactionProvider = TransactionProvider;