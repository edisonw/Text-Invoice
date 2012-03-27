/**
 * Module dependencies.
 */
var DEBUG=false;
//Libraries 
var express = require('express');
var step = require('step');
//Providers
var UserProvider = require('./classes/providers/userProvider').UserProvider;
var InvoiceProvider = require('./classes/providers/invoiceProvider').InvoiceProvider;
var TransactionProvider = require('./classes/providers/transactionProvider').TransactionProvider;
var userProvider=new UserProvider('127.0.0.1',27017);
var transactionProvider=new TransactionProvider('127.0.0.1',27017);
var invoiceProvider=new InvoiceProvider('127.0.0.1',27017);
//Helpers
var Incoming=require('./incoming').Incoming;
//Constants
var Strings=require('./classes/consts/strings').CStrings;
var getString=require('./classes/consts/strings').GStrings;
var Actions=require('./classes/consts/actions').CActions;
//Others
var app = module.exports = express.createServer();
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

//static files
app.get('/public/*', function(req,res){ 
	  res.sendfile(__dirname + '/public/' + req.params); 
});
//Debugging pages.
app.get('/users', function(req, res){
 userProvider.findAll(function(error, docs){
      res.send(docs, {'Content-Type':'text/html'}, 200);
 });
});
app.get('/transactions', function(req, res){
 transactionProvider.findAll(function(error, docs){
      res.send(docs, {'Content-Type':'text/html'}, 200);
 });
});
app.get('/invoices', function(req, res){
 invoiceProvider.findAll(function(error, docs){
      res.send(docs, {'Content-Type':'text/html'}, 200);
 });
});
//Home page
app.get('/', function(req, res){
 res.render('index',{title:'Dashboard',
	 users:[{"p":"+phonenumber1","c":"2011-08-18T04:35:38.014Z","a":true,"_id":"4e4c969a62a9da4b21000002"},{"p":"+17025180121","c":"2011-08-18T17:51:50.071Z","a":true,"_id":"4e4d51367c7488a223000003"},{"p":"+17708274860","c":"2011-08-18T21:50:35.986Z","a":true,"_id":"4e4d892b8f1e40e327000002"}]
 	,transactions:[{"p":"+phonenumber1","m":"hi.","f":true,"c":"2011-08-18T04:35:38.012Z","_id":"4e4c969a62a9da4b21000001","a":"sign up","n":"confirm"},{"p":"+13476888860","m":"why should i?","f":false,"c":"2011-08-18T04:36:00.565Z","_id":"4e4c96b062a9da4b21000003","a":"-","n":"confirm"},{"p":"+13476888860","m":"confirm","f":true,"c":"2011-08-18T04:36:08.289Z","_id":"4e4c96b862a9da4b21000004","a":"sign upconfirm"},{"p":"+13476888860","m":"pay 123 5.75","f":true,"c":"2011-08-18T04:36:27.143Z","_id":"4e4c96cb62a9da4b21000005","a":"pay"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T04:45:41.323Z","_id":"4e4c98f562a9da4b21000007","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T04:48:29.441Z","_id":"4e4c999d75641a9021000001","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T04:50:29.753Z","_id":"4e4c9a1554d8a9ae21000001","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T04:52:36.952Z","_id":"4e4c9a94ad54b5ea21000001","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T05:00:36.058Z","_id":"4e4c9c745714030822000001","a":"balance"},{"p":"+13476888860","m":"pay 23233 3","f":true,"c":"2011-08-18T05:01:50.838Z","_id":"4e4c9cbe5714030822000002","a":"pay"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T05:13:54.676Z","_id":"4e4c9f92a720005022000001","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T05:18:58.324Z","_id":"4e4ca0c212f9186f22000001","a":"balance"},{"p":"+13476888860","m":"charge 9178219713 293 milk","f":true,"c":"2011-08-18T05:25:42.482Z","_id":"4e4ca256c526d31823000001","a":"charge"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T05:26:31.960Z","_id":"4e4ca287c526d31823000003","a":"balance"},{"p":"+13476888860","m":"charge 9178219713 9178219704.25 milk","f":true,"c":"2011-08-18T05:37:17.307Z","_id":"4e4ca50dc3ec747423000001","a":"charge"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T05:37:59.790Z","_id":"4e4ca537c3ec747423000003","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T05:51:54.576Z","_id":"4e4ca87a7c7488a223000001","a":"balance"},{"p":"+17025180121","m":"This is the start of a clean test.","f":true,"c":"2011-08-18T17:51:50.070Z","_id":"4e4d51367c7488a223000002","a":"sign up","n":"confirm"},{"p":"+17025180121","m":"I don't want to confirm!","f":false,"c":"2011-08-18T17:52:01.088Z","_id":"4e4d51417c7488a223000004","a":"-","n":"confirm"},{"p":"+17025180121","m":"CONFIRm","f":true,"c":"2011-08-18T17:52:18.470Z","_id":"4e4d51527c7488a223000005","a":"sign upconfirm"},{"p":"+17025180121","m":"help","f":true,"c":"2011-08-18T17:52:28.166Z","_id":"4e4d515c7c7488a223000006","a":"help"},{"p":"+17025180121","m":"help pay","f":true,"c":"2011-08-18T17:53:21.374Z","_id":"4e4d51917c7488a223000007","a":"help"},{"p":"+17025180121","m":"help charge","f":true,"c":"2011-08-18T17:53:31.004Z","_id":"4e4d519b7c7488a223000008","a":"help"},{"p":"+17025180121","m":"balance","f":true,"c":"2011-08-18T17:54:00.235Z","_id":"4e4d51b87c7488a223000009","a":"balance"},{"p":"+17025180121","m":"pay 3476888860 300 food","f":true,"c":"2011-08-18T17:54:19.342Z","_id":"4e4d51cb7c7488a22300000a","a":"pay"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T17:55:00.315Z","_id":"4e4d51f47c7488a22300000c","a":"balance"},{"p":"+17025180121","m":"charge 3476888860 1000 rent","f":true,"c":"2011-08-18T17:55:58.145Z","_id":"4e4d522e7c7488a22300000d","a":"charge"},{"p":"+17025180121","m":"balance","f":true,"c":"2011-08-18T17:57:14.406Z","_id":"4e4d527a7c7488a223000010","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T17:56:17.222Z","_id":"4e4d52417c7488a22300000f","a":"balance"},{"p":"+17025180121","m":"balance","f":true,"c":"2011-08-18T18:03:17.925Z","_id":"4e4d53e55689b9f925000001","a":"balance"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T18:03:34.390Z","_id":"4e4d53f65689b9f925000002","a":"balance"},{"p":"+17025180121","m":"pay 3476888860","f":true,"c":"2011-08-18T18:25:26.727Z","_id":"4e4d59165689b9f925000003","a":"pay","t":{"invoice_id":"4e4d59165689b9f925000004"},"n":"*"},{"p":"+17025180121","m":"sleepbot_android x400000 0.99","f":true,"c":"2011-08-18T18:25:55.469Z","_id":"4e4d59335689b9f925000005"},{"p":"+17025180121","m":"sleepbot_web x5000 20","f":true,"c":"2011-08-18T18:26:35.805Z","_id":"4e4d595b5689b9f925000006"},{"p":"+17025180121","m":"sleepbot_gadget x50000 50","f":true,"c":"2011-08-18T18:27:17.132Z","_id":"4e4d59855689b9f925000007"},{"p":"+17025180121","m":"#","f":true,"c":"2011-08-18T18:27:26.785Z","_id":"4e4d598e5689b9f925000008"},{"p":"+17025180121","m":"last","f":true,"c":"2011-08-18T19:44:28.760Z","_id":"4e4d6b9cf91834ae26000001","a":"-"},{"p":"+17025180121","m":"last 3476888860","f":true,"c":"2011-08-18T19:46:23.142Z","_id":"4e4d6c0fa74723b726000001","a":"-"},{"p":"+17025180121","m":"last 3476888860","f":true,"c":"2011-08-18T19:47:35.378Z","_id":"4e4d6c576d4449d526000001","a":"last"},{"p":"+17025180121","m":"last","f":true,"c":"2011-08-18T19:47:49.171Z","_id":"4e4d6c656d4449d526000002","a":"last"},{"p":"+17025180121","m":"last","f":true,"c":"2011-08-18T19:50:20.515Z","_id":"4e4d6cfce1319df326000001","a":"last"},{"p":"+13476888860","m":"balance","f":true,"c":"2011-08-18T19:54:32.613Z","_id":"4e4d6df810cb387727000001","a":"balance"},{"p":"+13476888860","m":"last","f":true,"c":"2011-08-18T19:55:18.188Z","_id":"4e4d6e2610cb387727000002","a":"last"},{"p":"+13476888860","m":"last 7025180121","f":true,"c":"2011-08-18T19:55:37.657Z","_id":"4e4d6e3910cb387727000003","a":"last"},{"p":"+13476888860","m":"last 2323","f":true,"c":"2011-08-18T19:55:49.533Z","_id":"4e4d6e4510cb387727000004","a":"last"},{"p":"+13476888860","m":"last","f":true,"c":"2011-08-18T20:00:18.961Z","_id":"4e4d6f52680f84a727000001","a":"last"},{"p":"+13476888860","m":"last","f":true,"c":"2011-08-18T20:03:44.031Z","_id":"4e4d7020058f78c527000001","a":"last"},{"p":"+17708274860","m":"Sign up","f":true,"c":"2011-08-18T21:50:35.985Z","_id":"4e4d892b8f1e40e327000001","a":"sign up","n":"confirm"},{"p":"+17708274860","m":"Confirmed","f":false,"c":"2011-08-18T21:51:04.673Z","_id":"4e4d89488f1e40e327000003","a":"-","n":"confirm"},{"p":"+17708274860","m":"Confirm","f":true,"c":"2011-08-18T21:51:52.034Z","_id":"4e4d89788f1e40e327000004","a":"sign upconfirm"},{"p":"+17708274860","m":"Balance","f":true,"c":"2011-08-18T21:52:24.358Z","_id":"4e4d89988f1e40e327000005","a":"balance"},{"p":"+17708274860","m":"Pay 3476888860 rice $100","f":true,"c":"2011-08-18T21:55:43.438Z","_id":"4e4d8a5f8f1e40e327000006","a":"pay","t":{"invoice_id":"4e4d8a5f8f1e40e327000007"},"n":"*"},{"p":"+17708274860","m":"Rice x20 .5 10","f":true,"c":"2011-08-18T21:57:29.729Z","_id":"4e4d8ac98f1e40e327000008"},{"p":"+17708274860","m":"veg oil x10 1 10#","f":true,"c":"2011-08-18T22:00:44.784Z","_id":"4e4d8b8c8f1e40e327000009","a":"-"},{"p":"+17708274860","m":"Oil x10 1 10","f":true,"c":"2011-08-18T22:01:50.892Z","_id":"4e4d8bce8f1e40e32700000a"},{"p":"+17708274860","m":"#","f":true,"c":"2011-08-18T22:02:01.708Z","_id":"4e4d8bd98f1e40e32700000b"},{"p":"+13476888860","m":"LAST","f":true,"c":"2011-08-18T22:02:30.411Z","_id":"4e4d8bf68f1e40e32700000c","a":"last"}]
 	,invoices:[{"o":"+phonenumber12","b":"+phonenumber11","t":"300","n":" food","m":"+phonenumber1","f":true,"d":"2011-08-18T17:54:19.344Z","c":"2011-08-18T17:54:19.344Z","i":[],"p":0,"h":[],"_id":"4e4d51cb7c7488a22300000b"},{"o":"+13476888860","b":"+17025180121","t":"1000","n":" rent","m":"+17025180121","f":true,"d":"2011-08-18T17:55:58.146Z","c":"2011-08-18T17:55:58.146Z","i":[],"p":0,"h":[],"_id":"4e4d522e7c7488a22300000e"},{"o":"+17025180121","b":"+13476888860","t":2996000,"n":"","m":"+17025180121","f":true,"d":"2011-08-18T18:25:26.729Z","c":"2011-08-18T18:25:26.729Z","i":[{"n":"sleepbot_android","x":400000,"u":0.99},{"n":"sleepbot_web","x":5000,"u":20},{"n":"sleepbot_gadget","x":50000,"u":50}],"p":0,"h":[],"_id":"4e4d59165689b9f925000004"},{"o":"+17708274860","b":"+13476888860","t":20,"n":"","m":"+17708274860","f":true,"d":"2011-08-18T21:55:43.440Z","c":"2011-08-18T21:55:43.440Z","i":[{"n":"rice","x":20,"u":0.5},{"n":"oil","x":10,"u":1}],"p":0,"h":[],"_id":"4e4d8a5f8f1e40e327000007"}]
 });
});
//Twilio Route
app.post('/incoming', function(req, res) {
	//console.log(req.body);
	var message = req.body.Body;
	var from = req.body.From;
    console.log('From: ' + from + ', Message: ' + message);
	var isEnd = (message.charAt(message.length-1)=='#');
	if(isEnd)
		mssage=message.substring(0,message.length-1);
    step(
    	function(){
    		transactionProvider.findLast(from,this,Actions.INVALID);
    	},
    	function(err,old){
    		if(err) throw err;
    		transactionProvider.add({'p':from,'m':message,'f':isEnd},this,old);
    	},
    	function(err,trans,old){
    		if(err) throw err;
    		userProvider.add({'p':from},this,trans,old);
    	},
    	function(error,result,isNew,trans,old_trans){
    		if(error){
    			console.log(from+' has encountered error: '+error);
    		}else{
				if(isNew){
					trans.f=false;
					trans.a=Actions.SIGN_UP;
					trans.n=Actions.CONFIRM;
					transactionProvider.save(trans,null);
					if(!DEBUG)
						Incoming.sendSMS(res,Strings.SMS_SIGN_UP_INITIAL);
					else{
    					console.log('Sending initial signup message');
    					res.send('Sending inital signup message');
    				}
    			}else{
    				console.log(result);
    				if(!result.a){
    					if(DEBUG){
    						console.log('User not activated');
    						console.log(old_trans);
    					}
    					if(old_trans!=null && old_trans.n==Actions.CONFIRM){
    						if(DEBUG)
    							console.log('Activation is apparently required.');
    						if(message.toLowerCase()==Actions.CONFIRM){
								trans.f=true;
								trans.a=Actions.SIGN_UP+Actions.CONFIRM;
								transactionProvider.save(trans,null);
								old_trans.f=true;
								transactionProvider.save(old_trans,null);
    							result.a=true;
    							userProvider.save(result,function(err){
    								if(err)
    									console.log(from+' has encountered error: '+error);
    								else{
    									if(!DEBUG)
    										Incoming.sendSMS(res,Strings.SMS_SIGN_UP_CONFIRM);
    									else{
    										console.log('Sending account confirmation');
    									}
    								}
    							});
    						}else{
								trans.f=false;
								trans.a=Actions.INVALID;
								trans.n=Actions.CONFIRM;
								transactionProvider.save(trans,null);
								Incoming.sendSMS(res,Strings.SMS_SIGN_UP_INITIAL);
    						}
    					}
    				}else
    					Incoming.selectAction(res,message.toLowerCase(),from,{
    						 'cur_trans':trans
    						,'old_trans':old_trans
    						,'Strings':Strings
    						,'getString':getString
    						,'Actions':Actions
    						,'userProvider':userProvider
    						,'invoiceProvider':invoiceProvider
    						,'transProvider':transactionProvider
    						,'step':step
    					});
    			}
  			}
  		}
  	);
});
//User specific.
app.get('/:phone',function(req,res,next){
	var here=this;
	if(isNaN(parseInt(req.params.phone))){
		next();
	}else{
		step(
			function (){
				userProvider.findByPhoneNumber('+1'+req.params.phone,this);
			},
			function(err,user){
				if(err)
					throw err;
				else{
					if(typeof user==="undefined"){
						next();
						throw "Canno't find user!";
					}else{
						here.user=user;
						invoiceProvider.findAllForUser('+1'+req.params.phone,this);
					}
				}
			},
			function(error,invoices){
				if(error)
					throw error;
				here.invoices=invoices;
				transactionProvider.findAllForUser('+1'+req.params.phone,this);
			},
			function(error,transactions){
				if(typeof here.user==="undefined")
					return;
				if(transactions.p)
					transactions=[transactions];
				if(here.invoices.o)
					here.invoices=[here.invoices];
				console.log(transactions);
				console.log(here.invoices);
				console.log(here.user);
				if(error)
					throw error;
				res.render('index',{title:req.params.phone,
					 users:[here.user]
					,transactions: transactions
					,invoices:here.invoices
				});	
			}
		);
	}
});
//404 Page to catch everything else. 
app.get('*', function(req, res){
	  res.send('I don\'t like you. This page doesn\' exist. ._.', 404);
	});
//
app.listen(80);
console.log("Invoice server listening on port %d in %s mode with db on port %d", app.address().port, app.settings.env,27017);
