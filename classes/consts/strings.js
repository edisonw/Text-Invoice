CStrings={
	SMS_SIGN_UP_INITIAL:'Welcome to invoice service, we have just created an account for you. Reply confirm to finish your setup'
   ,SMS_SIGN_UP_CONFIRM:'Account confirmed. Happy invocing using \'pay number amount\', \'help\' is also on the way'
   ,SMS_SELECTION_INVALID:'Message not recognized, please use \'help\' command to see a list of supported commands'
   ,SMS_SELECTION_INCOMPLETE:'You have incomplete transaction standing, please complete the previous transaction first. Reply \'incomplete\' to see it.'
   ,SMS_ERROR: 'Error has encountered while running your last command. Please check your message and send it again.'
   ,SMS_INVOICE_MORE_INVALID:'We cannot read your last message, please use the following format: name units unit_price total, in which only 2 of the last 3 elements are required.'
   ,SMS_LAST_INVOICE_EMPTY: 'We cannot locate any invoice with this user.'
};
GStrings={
   SMS_INVOICE_STARTED:function(p,comment){
	   return 'Invoice started for '+p+((comment=='')?'':'('+comment+'),')
			   +' to add items: \'shirt [x12 2.00 24]\', attched \'#\'to finish this invoice.\'help\' can also be used.';
   },
   SMS_PAY_MORE_OK:function(name,units,unit_price,sub_total,total){
	   return name+' added to invoice with x'+units+' priced at $'+unit_price+' and sub total of $'+sub_total+'. Invoice total: $'+total+'.';
   },
   SMS_PAY_FINISH:function(to){
	   return 'Invoice transaction finished and sent to '+to;
   },
   SMS_PAY_FINISH_OTHER:function(isCharge,amount,from,comment){
	   return 'Invoice ('+((isCharge)?'-':'+')+amount+') from '+from+((comment=='')?'':' for '+comment)+', send \'last '+from+'\' to view or pay this invoice.'
   },
   SMS_SHOW_BALANCE:function(net,current){
	   return 'Total Balance: '+current+',Net Balance (do not account for paid payments): '+net;
   },
   SMS_LAST_INVOICE:function(invoice,from){
	   return 'Last Invoice: '+(invoice.o==from?'Payment':'Charge')+' of total: '+invoice.t+', '+invoice.p+',paid so far.'+(invoice.n==''?'':' Notes: '+invoice.n+',')+' Number of Items: '+invoice.i.length;
   }
};
exports.CStrings = CStrings;
exports.GStrings = GStrings;