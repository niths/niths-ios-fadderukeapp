$("#fadderchildren-pagen").live('pageshow', function() {
	 $('#fadder-children-collection').html('');
	 var restClient = new RestHandler();
 
	var fadderGroupId = sessionStorage.getItem('fadder_group_id');
	var fadderChildren = {};

	getOnlyFadderChildren();

	function getOnlyFadderChildren() {
	  
	  restClient.findRestricted('fadder/' + fadderGroupId + '/children',  function(data) {  
		  	fadderChildren = data;
		  	traverseAllFadderChildren();		
		},function(req, status, ex) {
			alert('Greide ikke hente fadderbarn');
	    	history.back();
		});
  }
    function traverseAllFadderChildren() {
      $.each(fadderChildren, function(i, fadderChild) {
        $('#fadder-children-collection').append(
            '<input type="checkbox" id="' + fadderChild.id +
              '" name="index" value="' + i + '" />' +
            '<label for="' + fadderChild.id + '">' + 
              fadderChild.firstName + ' ' +
              fadderChild.lastName +
            '</label>' 
        );
      });
      $('input:checkbox').checkboxradio();
    }

  $('#radio-delete').click(function() {
    $('#fadder-children-form').attr('action', '#confirm-dialog-page');
  });

  $('#radio-send-email').click(function() {
    $('#fadder-children-form').attr('action', '#send-an-email-page');
  });

  $('#fadder-children-form').live('submit', function() {
    var vals = $(this).serialize();
    validateForm();

    return false;

    function validateForm() {
      var index = vals.match(/index=\w+/g);

      if (index != null) {

        // Replace the index with the given object at that index
        var objs = index.join(',').replace(/index=/g, '').replace(/(\d+)/g,
            function(match) { return JSON.stringify(fadderChildren[match]); });

        sessionStorage.setItem('fadder_children_objs', '[' + objs + ']');

        var method = vals.match(/radio-method=[\w-]+/g).toString().replace(
            /radio-method=/g, '');

        if (method == 'delete') {
         // $.mobile.changePage('#confirm-dialog-page', 'pop');
                                 ///----------
                                 
     
         $('<div>').simpledialog2({
         mode: 'button',
            headerText: 'Slett event',
    headerClose: true,
        buttonPrompt: 'Er du sikker?',
        buttons : {
            'OK': {
             click: function () { 
               $('#buttonoutput').text('Ok');
               deleteStudents();
             }
            },
            'Avbryt': {
              click: function () { 
               $('#buttonoutput').text('Avbry');
              },
              icon: "delete",
              theme: "c"
            }
        }
        });
    
                      
        } else if (method == 'send-email') {
          $.mobile.changePage('#send-an-email-page');
        }
      }
    }
  });
 function deleteStudents(){
   // var restClient = new RestHandler();
                                
    var fadderChildren = JSON.parse(
            sessionStorage.getItem('fadder_children_objs'));
    var ids = '';
                    
    $.each(fadderChildren, function(i, fadderChild) {
                    ids += fadderChild.id + ',';
    });
                            
restClient.remove('fadder/' + sessionStorage.getItem('fadder_group_id') +
        '/children/' + ids.slice(0, -1),  
                  function(data, status, xhr) {  
                        if(xhr.status== 200){
                            alert('Sletting vellykket');
                  
                  $('#fadder-children-collection').empty();
                  getOnlyFadderChildren();
                        }else{
                            alert(xhr.status + ': Sletting feilet');
                        }
                            $.mobile.hidePageLoadingMsg();
                          
                        });
                        }                             
                            
                                
});