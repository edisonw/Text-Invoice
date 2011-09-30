var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var Collection='Invoice';
/**
Structure:
{
_id: unique_id,
b: reference of user that gets paid, phone number
c: created date.
d: due date.
f: isFinishedEditing. *only one item per m.
h: { //Payment history for this invoice
	....
}
l: last phone number that has modified this entry.
m: maker phone number.
n: note
o: reference of user, payer, phone number
t: total.
i: { 
	//items
	n: name
	x: units.
	u: unit price.
	c: comments
	a:  {
			//Additional Attributes.
		}
	}
}
p: amount paid so far
*/
InvoiceProvider = function(host, port) {
  this.db= new Db('ci-node-mongo', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  //this.db.dropCollection(Collection,function(){});
};

InvoiceProvider.prototype.getCollection= function(callback) {
  this.db.collection(Collection, function(error, Invoice_collection) {
    if( error ) callback(error);
    else callback(null, Invoice_collection);
  });
};

InvoiceProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, Invoice_collection) {
      if( error ) callback(error)
      else {
        Invoice_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

InvoiceProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, Invoice_collection) {
      if( error ) callback(error)
      else {
        Invoice_collection.findOne({'_id':id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

InvoiceProvider.prototype.findAllForUser = function(user,callback) {
    this.getCollection(function(error, Invoice_collection) {
      if( error ) callback(error)
      else {
        Invoice_collection.find({  $or:[
                                        {o:user},
                                        {b:user}
                                    ]
        					   }).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
/**
Find the last valid incomplete transaction
*/
InvoiceProvider.prototype.findLast = function(self,callback,target) {
    this.getCollection(function(error, Invoice_collection) {
      if( error ) callback(error)
      else {
    	  var query;
    	  if(target)
    		  query={$or:[
    	               {o:self,  b:target},
    	               {o:target,b:self}
    	             ],f:true};
    	  else
    		  query={$or:[
                         {o:self},
                         {b:self}
                     ],f:true};
    	  Invoice_collection.find(query, {'sort':[['_id', 'desc']],'limit':1,'safe':true}).toArray(function(error, result) {
          if( error ) callback(error)
          else{
        	  if(result && result.length)
        		  callback(null, result[0]);
        	  else 
        		  callback(null,null);
          }
        });
      }
    });
};
InvoiceProvider.prototype.findByTargetPhone = function(phone, callback) {//TODO
    this.getCollection(function(error, Invoice_collection) {
      if( error ) callback(error)
      else {
        Invoice_collection.findOne({'p': phone}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};
InvoiceProvider.prototype.findByOwnerPhone = function(phone, callback) {//TODO
    this.getCollection(function(error, Invoice_collection) {
      if( error ) callback(error)
      else {
        Invoice_collection.findOne({'p': phone}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};
InvoiceProvider.prototype.save = function(doc,callback){
    this.getCollection(function(error, Invoice_collection) {
    	if( error ){
    		if(callback)
      			callback(error);
      		else
    			console.log('Failed to save invoice: %s',error);
      		return;
    	}else {
			if(callback)
				Invoice_collection.update({_id:doc._id},doc,{safe: true},callback);
    		else{
    			console.log(doc);
    			Invoice_collection.update({_id:doc._id},doc,{safe: true},function(error,n){
    				console.log('Invoice saved with error= %s,n=%d',error,n);
				});
			}
		}
	});
}
//You can only save one Invoice at a time
InvoiceProvider.prototype.add = function(Invoice, callback) {
	var here=this;
    this.getCollection(function(error, Invoice_collection) {
    	if( error ){
      		callback(error)
    	}else {
    		if(!Invoice.m || !Invoice.b || !Invoice.o){
    			callback('User was not supplied.');
    			return;
    		}
     	    if(!Invoice.d || Invoice.d=='now')
				Invoice.d = new Date();
    	    if(!Invoice.c)
				Invoice.c = new Date();   
    	   	if(!Invoice.i)
    	   		Invoice.i= new Array();
    	   	if(!Invoice.t)
    	   		Invoice.t=0;
    	   	if(!Invoice.p)
    	   		Invoice.p=0;
    	   	if(!Invoice.h)
    	   		Invoice.h= new Array();
    	   	if(!Invoice.n)
    	   		Invoice.n='';
        	Invoice_collection.insert(Invoice, {safe: true},function(errors,after) {
          		callback(errors,after[0]);
          	});
        }
	});
}
exports.InvoiceProvider = InvoiceProvider;