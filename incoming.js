var Incoming={
	//Entry Point
    selectAction:function(res,keyword,from,g){
      var nextAction=(g['old_trans']!=null)?
      					(g['old_trans'].f?
      						false:g['old_trans'].n)
      					:false;
      //Help 
      if(keyword.indexOf(g.Actions.HELP)===0){
        if(nextAction){
        	g['cur_trans'].a=g.Actions.INVALID;
            this.markFinished(g);
            this.help(res,g['old_trans'].a);
            return;
        }
        g['cur_trans'].a=g['Actions'].HELP;  
      	this.markFinished(g);
      	if(keyword.length>5)
      		this.help(res,keyword.substring(5));
      	else
      		this.help(res);
      	return;
      }
      //View Last
      var last=keyword.indexOf(g.Actions.LAST);
      var separator=keyword.indexOf(' ');
      if(keyword==g.Actions.LAST||(last===0 && last<((separator==-1)?1:separator))){
    	  g.cur_trans.a=g.Actions.LAST;
    	  this.last(res, g, from, (separator==-1?'':keyword.substring(keyword.lastIndexOf(' ')+1)));
    	  return;
      }
      //Pay
      var isCharge=(keyword.indexOf(g.Actions.CHARGE)===0 && keyword.length>8);
      if(isCharge || (keyword.indexOf(g.Actions.PAY)===0 && keyword.length>5)){
        if(nextAction==g['Actions'].MORE){
          	g['cur_trans'].a=g['Actions'].INVALID;
          	this.markFinished(g);
        }
        g['cur_trans'].a=(isCharge)? g.Actions.CHARGE:g.Actions.PAY;
        this.pay(res,keyword.substring((isCharge)?7:4),from,g,isCharge);
		return;
      }
      //Balance
	  if(keyword.indexOf('balance')===0){
	    if(nextAction){
	       g['cur_trans'].a=g['Actions'].INVALID;
	    }else
		   g['cur_trans'].a=g['Actions'].BALANCE;
		this.balance(res,g,from);
		return;
	  }else{
          //Complete last transaction
          if(nextAction){
        	//More
          	if(nextAction==g['Actions'].MORE)
          		this.selectMore(res,keyword,from,g,g['old_trans'].a);
          	return;
          }
        //Invalid
      	g['cur_trans'].a=g['Actions'].INVALID;
      	this.markFinished(g);
      	this.sendSMS(res,g['Strings'].SMS_SELECTION_INVALID);
	  }
    },
    selectMore:function(res,keyword,from,g,action){
    	var isCharge=(action==g['Actions'].CHARGE);
    	if(isCharge || action==g['Actions'].PAY)
    		this.payMore(res,keyword,from,g,isCharge);
    },
    finishInvalidMessage:function(res,g,msg){//TODO
      	g['cur_trans'].a=g['Actions'].INVALID;
      	this.markFinished(g);
      	this.sendSMS(res,msg);
    },
    markFinished:function(g){
      	g['cur_trans'].f=true;
      	g['transProvider'].save(g['cur_trans'],null);
    },
    saveTransUnfinished:function(g){
      	g['cur_trans'].f=false;
      	g['transProvider'].save(g['cur_trans'],null);
    },
    help:function(res,keyword){
    	var msg;
    	if(keyword){
    		if(keyword=='pay')
    			msg='Use pay action to create an invoice: \'pay "phone/contact" ["amount"] "for" \', send \'more\' for more options.';
    		else if(keyword=='balance')
    			msg='Use banalce action to check current balance and assets.';
    		else if(keyword=='charge')
    			msg='Use charge action to create an invoce: \'charge "phone/contact" "amount" "for" "date", send \'more\' for more options.';
    	    else if(keyword=='find')
    	    	msg='Use find action get see various info: \'find acc "phone"\' to check account info, send \'more\' for more options.';// \'find inv "phone"\' to see your actions with that account 
    	    else if(keyword=='check')
    	        msg='If the last action sent has returned any invoice numbers, check will return the details of it, send \'more\' for more options.';
    	    else if(keyword=='account')
    	    	msg='Use account action to see the current account status, send \'more\' to see the actions that you can use with account';
    		else if(keyword=='feedback')
    			msg='Please feel free to send us any feedbacks using \'feedback "msg"\' action!';
    		else if(keyword=='faq')
    			msg='To get answers for common questions through sms, use \'faq "question"\'';
    		else if(keyword=='contact')
    			msg='Use contact keywords to add/find/delete contacts to your account on the fly, send \'more add/find/delete\' to get details.';
    		else
    			msg='This action is not supported by our system, you may suggest it to us through \'feedback\' action';
    	}else{
    		msg='Use \'help action\' for details: pay;balance;charge;check;account;find;feedback;faq;contact;last if too long attach \'#\' at the end.';
    	}
    	this.sendSMS(res,msg);
    },
    sendSMS:function(res,msg){
    	console.log('Message sent: %s',msg);
		var twiml = '<?xml version="1.0" encoding="UTF-8" ?>\n<Response>\n<Sms>'+msg+'</Sms>\n</Response>';
		res.send(twiml, {'Content-Type':'text/xml'}, 200);
    },
    sendMultiple:function(res,reply,others){
		var twiml = '<?xml version="1.0" encoding="UTF-8" ?>\n<Response>\n<Sms>'+reply+'</Sms>\n';
		var other;
		for(var key in others){
			other=others[key];
			twiml+='<Sms to=\''+other.p+'\'>'+other.m+'</Sms>\n'; 
		}
		twiml+='</Response>';
		console.log(twiml);
		res.send(twiml, {'Content-Type':'text/xml'}, 200);
    },
    pay:function(res,args,from,g,isCharge){
    	var here=this,p,amount,incomplete=false,comment='';
    	var i=args.indexOf(' ');//To amount
    	if(i==-1){
    	//no amount/comment. incomplete post.
    		p=args;
    		if(p.substring(0)!='+')
    			p='+1'+p;
    		incomplete=true;
    	}else{
        	while(args.length>(i+1) && args.charAt(i+1)==' '){
        		i++;
        	}
    	//Has comment but no amount, incomplete post.
    		p=args.substring(0,i);
    		if(p.substring(0)!='+')
    			p='+1'+p;
    		amount=parseFloat(args.substring(i+1));
    		if(isNaN(amount)){
    			comment=amount;
    			incomplete=true;
    		}
    	}
		var b=p,o=from;
		if(isCharge){
			b=from;
			o=p;
		}
    	if(incomplete){
    		g['invoiceProvider'].add({'o':o,'b':b,'t':0,'n':comment,'m':from,'f':false},function(error,result){
    			if(error){
    				console.log(error);
    				here.markFinished(g);
    				here.sendSMS(res,g['Strings'].SMS_ERROR);
    				return;
    			}else{
    				g['cur_trans'].t={'invoice_id':result._id};
    				g['cur_trans'].n=g['Actions'].MORE;
    				here.saveTransUnfinished(g);
    				here.sendSMS(res,g['getString'].SMS_INVOICE_STARTED(p,comment));
    				return;
    			}
    		});
    	}else{
    		var i2=args.indexOf(' ',i+1);
    		if(i2!=-1){
            	while(args.length>(i2+1) && args.charAt(i2+1)==' '){
            		i2++;
            	}
    			amount=args.substring(i+1,i2);
    		}
    		comment=(i2==-1)?'':args.substring(i2);
    		g['invoiceProvider'].add({'o':o,'b':b,'t':amount,'n':comment,'m':from,'f':true},function(error){
    			if(error){
    				console.log(error);
    				here.markFinished(g);
    				here.sendSMS(res,g['Strings'].SMS_ERROR);
    				return;
    			}
    			here.markFinished(g);
    			here.sendMultiple(res,g['getString'].SMS_PAY_FINISH(p),[{'p':p,'m':g['getString'].SMS_PAY_FINISH_OTHER(isCharge,amount,from,comment)}]);
    		});
    	}
    },
	payMore:function(res,args,from,g,isCharge){
    	var here=this;
    	g['step'](
    		function(){
    			g['invoiceProvider'].findById(g['old_trans'].t.invoice_id,this);
    		},
    		function(err,inv){
    			var p;
    			if(inv.m==inv.o)
    				p=inv.b;
    			else
    				p=inv.o;
    			if(args=='#'){
	    			inv.f=true;
	    			g['old_trans'].f=true;
    		      	g['invoiceProvider'].save(inv,function(err){
    		      		if(err){
    		      			console.log(err);
    		      			here.markFinished(g);
    		      			here.sendSMS(res,g['Strings'].SMS_ERROR+': 2- '+err);
    		      		}else{
    		      			g['transProvider'].save(g['old_trans'],null);
    		      			here.markFinished(g);
    		      			
    		      			here.sendMultiple(res,g['getString'].SMS_PAY_FINISH(p),[{'p':p,'m':g['getString'].SMS_PAY_FINISH_OTHER(isCharge,inv.t,from,inv.n)}]);
    		      		}
    		      	});
    		      	return;
    			}
    			if(err){
    				console.log(err);
					here.markFinished(g);
					here.sendSMS(res,g['Strings'].SMS_ERROR+': 1- '+err);
    			}else{
    		    	var units=Number.NaN,unit_price=Number.NaN,total=Number.NaN;
    				var i=args.indexOf(' ');//name*units/unit_price
    				if(i==-1){
    					here.finishInvalidMessage(res,g,g['Strings'].SMS_INVOICE_MORE_INVALID);
    					return;
    				}
    				var name=args.substring(0,i);
    		    	while(args.length>(i+1) && args.charAt(i+1)==' '){
    		    		i++;
    		    	}
    				var i2=args.indexOf(' ',i+1);
    				if(i2==-1){
    					here.finishInvalidMessage(res,g,g['Strings'].SMS_INVOICE_MORE_INVALID);
    					return;
    				}
    		    	if(args.charAt(i+1)=='x'){
    		    		units=parseInt(args.substring(i+2,i2));
    		    	}else{
    		    		unit_price=parseFloat(args.substring(i+1,i2));
    		    	}
    		    	while(args.length>(i2+1) && args.charAt(i2+1)==' '){
    		    		i2++;
    		    	}
    		    	if(args.length>i2+1){
    		    		var last=args.charAt(args.length-1)=='#';
    		    		if(last){
    		    			inv.f=true;
    		    			g['old_trans'].f=true;
    		    		}
    		    		if(isNaN(units)){
    		    			total=parseFloat(args.substring(i2+1));
    		    			if(!isNaN(unit_price) && !isNaN(total)){
    		    				if(unit_price==0)
    		    					units=0;
    		    				else
    		    					units=Math.round(total/unit_price);
    		    			}else{
            					here.finishInvalidMessage(res,g,g['Strings'].SMS_INVOICE_MORE_INVALID);
            					return;
    		    			}
    		    		}else{
    		    			unit_price=parseFloat(args.substring(i2+1));
    		    			total=units*unit_price;
    		    			if(isNaN(unit_price)){
    		    				here.finishInvalidMessage(res,g,g['Strings'].SMS_INVOICE_MORE_INVALID);
    		    				return;
    		    			}
    		    		}
    		    	}else{
    					here.finishInvalidMessage(res,g,g['Strings'].SMS_INVOICE_MORE_INVALID);
    					return;
    		    	}
    		    	inv.i.push({'n':name,'x':units,'u':unit_price});
    		    	inv.t+=total;
    		      	g['invoiceProvider'].save(inv,function(err){
    		      		if(err){
    		      			console.log(err);
    		      			here.markFinished(g);
    		      			here.sendSMS(res,g['Strings'].SMS_ERROR+': 2- '+err);
    		      		}else{
    		      			if(last)
    		      				g['transProvider'].save(g['old_trans'],null);
    		      			here.markFinished(g);
    		      			if(last){
    		      				here.sendMultiple(res,g['getString'].SMS_PAY_FINISH(p),[{'p':p,'m':g['getString'].SMS_PAY_FINISH_OTHER(isCharge,inv.t,from,inv.n)}]);
    		      			}else{
    		      				here.sendSMS(res,g['getString'].SMS_PAY_MORE_OK(name,units,unit_price,total,inv.t));
    		      			}
    		      			
    		      		}
    		      	});
    			}
    		}
    	)
    },
    balance:function(res,g,from){
    	var here=this;
    	g['step'](
    		function(){
    			g['invoiceProvider'].findAllForUser(from,this);
    		},
    		function(err,input){
	      		if(err){
	      			console.log(err);
	      			here.markFinished(g);
	      			here.sendSMS(res,g['Strings'].SMS_ERROR+': b1- '+err);
	      		}else{
	      			if(typeof(input)=='object' &&(input instanceof Array)){
	      				var c=0,n=0;
	      				console.log(input);
	      				for(var i in input){
	      					invoice=input[i];
      						invoice.t=parseFloat(invoice.t);
	      					if(invoice.o==from){
	      						invoice.p=parseFloat(invoice.p);
	      						n-=(invoice.t-invoice.p);
	      						c-=invoice.t;
	      					}else{
	      						n+=invoice.t;
	      						c+=invoice.t;
	      					}
	      				}
		      			here.markFinished(g);
		      			here.sendSMS(res,g['getString'].SMS_SHOW_BALANCE(n,c));
	      			}else{
		      			here.markFinished(g);
		      			here.sendSMS(res,g['getString'].SMS_SHOW_BALANCE(0,0));
	      			}
	      		}
    		}
    	);
      	this.markFinished(g);
    },
    last:function(res,g,from,args){
    	var here=this;
    	if(args=='')
    		p=null;
    	else{
    		p=args;
    		if(args.charAt(0)!='+')
    			p='+1'+p;
    	}	
    	g.step(
    		function(){
    			g.invoiceProvider.findLast(from,this,p);
    		},
    		function(err,inv){
	      		if(err){
	      			console.log(err);
	      			here.markFinished(g);
	      			here.sendSMS(res,g['Strings'].SMS_ERROR+': last1- '+err);
	      		}else{
	      			if(inv){
		      			here.markFinished(g);
		      			here.sendSMS(res,g['getString'].SMS_LAST_INVOICE(inv,from));
	      			}else{
		      			here.markFinished(g);
		      			here.sendSMS(res,g['Strings'].SMS_LAST_INVOICE_EMPTY);
	      			}
	      		}
    		}
    	);
    }
};
exports.Incoming = Incoming;