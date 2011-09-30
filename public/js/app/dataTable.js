	$( "#date_dialog" ).dialog({
		autoOpen: false, 
		show: "fade",
		hide: "fade",
		modal: true 
	});
	$( "#date_opener" ).click(function() {
		$( "#date_dialog" ).dialog( "open" ); // the #dialog element activates the modal box specified above
		return false;
	});
	var t1= $('#dt1').dataTable( {
					"bJQueryUI": true,
					"sScrollX": "",
					"bSortClasses": false,
					"aaSorting": [[0,'desc']],
					"bAutoWidth": true,
					"bInfo": true,
					"sScrollY": "100%",	
					"sScrollX": "100%",
					"bScrollCollapse": true,
					"sPaginationType": "full_numbers"
					} );
	var t2= $('#dt2').dataTable( {
		"bJQueryUI": true,
		"sScrollX": "",
		"bSortClasses": false,
		"aaSorting": [[1,'desc']],
		"bAutoWidth": true,
		"bInfo": true,
		"sScrollY": "100%",	
		"sScrollX": "100%",
		"bScrollCollapse": true,
		"sPaginationType": "full_numbers"
		} );
	var t3= $('#dt3').dataTable( {
		"bJQueryUI": true,
		"sScrollX": "",
		"bSortClasses": false,
		"aaSorting": [[0,'desc']],
		"bAutoWidth": true,
		"bInfo": true,
		"sScrollY": "100%",	
		"sScrollX": "100%",
		"bScrollCollapse": true,
		"sPaginationType": "full_numbers"
		} );
	// static tables alternating rows
	$('table.static tr:even').addClass("even");
	
	
	/**
	 * 

	
	$(".tabs").tabs( {
		"select": function(event, ui) {
			$('.tabs div.dataTables_scroll').css({
				"visibility":"hidden" 
		         });
	     },
	     "show": function(event, ui) {
	    	 var oTable = $('div.dataTables_scrollBody > table', ui.panel).dataTable();
	    	 	if ( oTable.length > 0 ) {
	    	 		oTable.fnAdjustColumnSizing();
		                    $(".tabs div.dataTables_scroll").css({
		                        "display":"none",
		                        "visibility":"visible" 
		                    }).fadeIn("fast");
		     }
	     }
	});	
	$( ".content_accordion" ).accordion( {
		"change": function(event, ui) {
				var oTable = $('div.dataTables_scrollBody > table', ui.panel).dataTable();
		              if ( oTable.length > 0 ) {
		                  oTable.fnAdjustColumnSizing();
		                   $(".content_accordion div.dataTables_scroll").css({
		                       "display":"none",
		                       "visibility":"visible" 
		                   }).show();
		                }
						if ( oTable.length > 0 ) {
							oTable.fnAdjustColumnSizing();
						}
					}
	} );

	$(window).bind('resize', function () {
		t1.fnAdjustColumnSizing();
		t3.fnAdjustColumnSizing();
		t2.fnAdjustColumnSizing();
	} );		*/