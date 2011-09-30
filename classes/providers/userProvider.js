var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var Collection='User';
/**
Structure:
{
_id: unique id,
p: phone number. with +country code.
c: created_date.
l: last modified date.
a: isActivated.
}
*/
UserProvider = function(host, port) {
  this.db= new Db('ci-node-mongo', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  //this.db.dropCollection(Collection,function(){});
};

UserProvider.prototype.getCollection= function(callback) {
  this.db.collection(Collection, function(error, User_collection) {
    if( error ) callback(error);
    else callback(null, User_collection);
  });
};

UserProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, User_collection) {
      if( error ) callback(error)
      else {
        User_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
UserProvider.prototype.save = function(doc,callback){
    this.getCollection(function(error, User_collection) {
    	if( error ){
      		callback(error);
      		return;
    	}else {
			User_collection.save(doc,{safe:true}, callback);
		}
	});
};
UserProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, User_collection) {
      if( error ) callback(error)
      else {
        User_collection.findOne({_id: User_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

UserProvider.prototype.findByPhoneNumber = function(phone, callback) {
    this.getCollection(function(error, User_collection) {
      if( error ) callback(error)
      else {
        User_collection.findOne({'p': phone}, function(error, result) {
          if( error ) callback(error)
          else callback(null,result)
        });
      }
    });
};
//You can only save one user at a time
UserProvider.prototype.add = function(User, callback,trans,old) {
	var here=this;
    this.getCollection(function(error, User_collection) {
    	if( error ){
      		callback(error)
    	}else {
    		if(typeof User.p == "undefined"){
    			callback('User was not supplied');
    			return;
    		}
			here.findByPhoneNumber(User.p,function(error,result){
        		if(error){
           			callback(error);
				}else{
    	   			if(typeof result == "undefined"){
    	   				User.c = new Date();
    	   				User.a = false;
        				var Users=[User];
        				User_collection.insert(Users, function(errors,after) {
          					callback(errors,after,true,trans,old);
          				});
          			}else{
          				callback(null,result,false,trans,old);
          			}
        		}
        	});
    	}
	});
};
exports.UserProvider = UserProvider;