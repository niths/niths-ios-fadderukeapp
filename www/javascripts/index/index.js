

var defaultTwitterTag = 'http://search.twitter.com/search.json?q=%23nith&rpp=5';
var twitterURLJSON= '';
var restClient = new RestHandler(); //REST CLIENT


$("#dashboard-page").live('pageinit', function() {
   $.mobile.defaultPageTransition = 'none';
   $.mobile.defaultDialogTransition = 'none';
   $.support.cors = true;

    getTweets();
    loadEvents();
                 
                         
   $('#resfresheventsbtn').click(function() {
              showEventsLoading();
                      loadEvents();
    });
                          
 $('#refreshtweetbtn').click(function(data) {
    getTweets()

  });   
  
    $('#tweets2').click(function() {  
         var twitterURL = twitterURLJSON.replace('.json','');  ;
                           
        if(window.plugins.childBrowser != null){
          window.plugins.childBrowser.showWebPage(twitterURL);
        }else{
         ChildBrowser.install()	
         window.plugins.childBrowser.showWebPage(twitterURL);
        }                                              
    });   
      
 });
   
 	
   
   
                          
function getTweets(){
    if(twitterURLJSON == ''){
        restClient.findRestricted('sociallinks?socialCommunity=twitter&category=fadderuka',  function(data) { 

            if(data.length >= 1){
                console.log('found url');
                twitterURLJSON = data[0].address;
            }else {
                console.log('using standard');
                twitterURLJSON = defaultTwitterTag;
            }
            console.log(twitterURLJSON);
            showTweetLoading();
            loadTweets(); 
    
        }, function(req, status, ex) {
            console.log(status + ' ' + ex + ' using standar url');
                                  twitterURLJSON = defaultTwitterTag;
            showTweetLoading();
            loadTweets(); 
        });
    
    }else {
        console.log('got twitter url');
        showTweetLoading();
        loadTweets(); 
    }
} // end get tweet
   
                          
                                                 
                          
                   
                          
                          
                          function showEventsLoading(){
                          var theHTML = '<li class="li-first" id="eventloader"><h3>Laster events...</h3></li>';
                          $('#eventlist').html(theHTML);
                          $('#eventlist').listview('refresh');	
                          }
                          
                          function showTweetLoading(){
                          $('#loadingfortwitterfeed').css('display', 'block');
                          $('#tweets2').css('display', 'none');
                          }
                          
/**
 * Load the tweets
 */
                          //TODO: Change url to match all with a certain hashtag, ex #fadderuka
                          function loadTweets(){
                          var response;
                          response = $.ajax({
                                            url : twitterURLJSON,
                                            type : 'get',
                                            cache : false,
                                            contentType : 'application/json',
                                            timeout : 2000,
                                            success : function(data) {
                                            printTweets(data);
                                            },
                                            error : function(xhr, status) {
                                            printErrorTweet();
                                            }
                                            });
                          }
/**
 * Helper function that returns the date today and the date in five days
 * Used to limit the events from the API
 */
                          function getDatesBetweenUrlParam(){
                          var today = new Date();
                          var dd = today.getDate();
                          var mm = today.getMonth()+1; //January is 0!
                          var yyyy = today.getFullYear();
                          if(dd<10){
                          dd='0'+dd
                          } 
                          if(mm<10){
                          mm='0'+mm
                          } 
                          var today = dd+'/'+mm+'/'+yyyy + '-00:00';
                          var inFiveDays = (dd + 4) + '/'+mm+'/'+yyyy + '-23:59';
                          var param = '?tag=fadderuka12,public&startTime='+today + '&endTime=' + inFiveDays;
                          return param;
                          }
                          
/**
 * Loads all events the next five days
 */
                          function loadEvents(){
                          
                          restClient.findRestricted('events/tags-and-dates' + getDatesBetweenUrlParam(),  function(data) {  
                                          var theHTML = '';
                                          var num = 0;
                                          
                                          if(data.length < 1){
                                          theHTML = '<li class="li-first" id="eventloader"><h3 style="white-space:normal">Ingen de neste 5 dagene...</h3></li>';
                                          }else{
                                          for(var i=0;i<data.length && num < 2;i++){
                                          num++;
                                          theHTML += ['<li class="li-first"><a href="#event-page?event-id='+data[i].id+'">',
                                                      '<h3>'+data[i].name+'</h3>',
                                                      '<p><strong>Beskrivelse: </strong>'+data[i].description+'</p>',
                                                      '<p><strong>Start: </strong>'+data[i].startTime+'</p>',
                                                      '</a></li>'].join('');
                                          }
                                          }  
                                          $('#eventlist').html(theHTML);
                                          $('#eventlist').listview('refresh');
                                          }, function(req, status, ex) {
                                          var theHTML = '<li class="li-first" id="eventloader"><h3>Ikke kontakt med server...</h3></li>';
                                          $('#eventlist').html(theHTML);
                                          $('#eventlist').listview('refresh');
                                          }); 
                          }
                          
                          $('#tweets2').click(function() {  
                                              
                                              if(window.plugins.childBrowser != null){
                                                window.plugins.childBrowser.showWebPage(twitterURL);
                                              }else{
                                                ChildBrowser.install()
                                                window.plugins.childBrowser.showWebPage(twitterURL);

                                              }                                              
                                              
                                              });   
                          
                          
/**
 * Prints a list of tweets
 */
                          function printTweets(data){
                          var theResults = data.results;
                          var theHTML = '';
                          $('#tweets2').html('');
                          for(var i=0;i<theResults.length;i++){
                          $('#tweets2').append(
                                               '<li border>'+
                                               '<p class="tweetlink"><img src="'+theResults[i].profile_image_url+'" alt="'+theResults[i].from_user+'">'+
                                               '<h2>' + theResults[i].from_user +'</h2></p>'+ 
                                               '<span class="details">'+theResults[i].text+'</span>'+
                                               '</li>');
                          }
                          
                          $('#loadingfortwitterfeed').css('display', 'none');
                          $('#tweets2').css('display', 'block');
                          }
                          
                          
                          function printErrorTweet(){
                          $('#tweets2').html('<h3>Ikke kontakt med twitter</h3>');
                          $('#loadingfortwitterfeed').css('display', 'none');
                          $('#tweets2').css('display', 'block');
                          }