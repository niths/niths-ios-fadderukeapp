
$('#dashboard-page').bind('pageinit', function() {
                          console.log('pageInit');
  var restClient       = new RestHandler();
  var callbackURL      = 'http://niths.no/callback';
  var stateURLFragment = 'state=/profile';
  var isNITHMail       = false;

    
                globalLogin = function() {
                  ChildBrowser.install();
                  if(sessionToken == '') { //Not signed in
                  resetUserValues();
                  signIn();       
                  } else { //Already signed in
                  resetUserValues();
                  configureLocationChanged();
                  window.plugins.childBrowser.showWebPage(
                                                          'https://accounts.google.com/Logout');
                  }
                  }                
                  
                  $('#loginbtn').click(globalLogin);

                  
                  
   $('#profilebtn').click(function() {
    ChildBrowser.install();

     if(sessionToken == '') {
       showMsg('Vennligst logg inn', function() {
         resetUserValues();
         signIn();
       });
     }

     // Sign is succeeded, but not NITH mail: = -1
     else if(sessionToken  != "-1"){
       $.mobile.changePage('#profile-page');
     }
   });

  /**
   * Opens childbrowser with the Google login site
   */
  function signIn() {
    configureLocationChanged();
    window.plugins.childBrowser.showWebPage(
      'https://accounts.google.com/o/oauth2/auth'
      + '?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email'
      + '&' + stateURLFragment
      + '&redirect_uri=' + encodeURIComponent(callbackURL)
      + '&response_type=token'
      + '&client_id=1064171706637-f9efklqg3tbrmu7fctvk8khvc0dqmh5i.apps.googleusercontent.com');
  };

  /**
   * This method runs every time Childbrowser changes page
   */   
  function configureLocationChanged() {
    window.plugins.childBrowser.onLocationChange = function(url) {
      var receiveTokenURL = new RegExp('^' + callbackURL + '%23' +
        stateURLFragment + '&access_token=..*$');

        console.log("location is changing");
      // Triggered if the app is denied access
      if (url == callbackURL + '#error=access_denied' + stateURLFragment) {
        showErr('Fikk ikke tilgang', function() {
          window.plugins.childBrowser.close();
          resetUserValues();
        });
      } else if (receiveTokenURL.test(url)) {
          window.plugins.childBrowser.close();
          onLoggedIn(url.split('=').splice(2, 1)[0].replace('&token_type', ''));
      // Triggered when a user logs out
      } else if (url == 'https://accounts.google.com/Login') {
        window.plugins.childBrowser.close();
        resetUserValues();
      }else if(url == 'http://nith.no/'){
          console.log("--------- is closing");
          window.plugins.childBrowser.close();
          toggleBtnText
      } else{
          toggleBtnText();
      }
    };
  };

  function toggleBtnText(){
    if(sessionToken == ""){
      $("#loginbtn .ui-btn-text").text("Logg inn");
    }else{
      $("#loginbtn .ui-btn-text").text("Logg ut");
    }
  }

  function onLoggedIn(token) {
    resetUserValues();
    $.mobile.showPageLoadingMsg();

    // Send the token to the server
    // We get the session token in the response header
    // If any error occurred, show error.
    restClient.updateWithCallbacks(
        'auth/login/',
        '{"token":"'+token+'"}',
        function(data, textStatus, jqXHR) {
                                   student = data;
                                   sessionToken = jqXHR.getResponseHeader('session-token');
                                   
                                   //If student is leader for a group, show admin btn
                                   if(student.groupLeaders != null){ //NEEDED?
                                   if(student.groupLeaders.length > 0){
                                   $('#adminsectionbtn').css('display', 'block');
                                   }
                                   }
                                   
                                   toggleBtnText();
                                   $.mobile.hidePageLoadingMsg();
        },
        function(xhr, status, ex) {
          if(xhr.getResponseHeader('error') == 'Email not valid') {
            sessionToken = "-1";
            showErr('Bruker har ikke NITH-mail, logg ut og inn igjen', null);
          } else if (status == 'timeout') {
            showErr('Fikk ikke kontakt med serveren, logg inn igjen (timeout)');
          } else {
            showErr('En feil intraff status:' +status + ex);
        }

        toggleBtnText();
        $.mobile.hidePageLoadingMsg();
    });
  }

  //Resets logged in values
  function resetUserValues(){
      sessionToken = '';
      //role = '';
      student= {};
      //groupNumber = 0;
      $('#adminsectionbtn').css('display', 'none');
  }
});

$('#dashboard-page').live('pageshow', function() {
                          
                console.log(sessionToken); 
 if(sessionToken == ''){
 $('#loginbtn .ui-btn-text').text('Logg inn');
 $('#adminsectionbtn').css('display', 'none');
 }else{
 $("#loginbtn .ui-btn-text").text('Logg ut');
 }
                          
 });
 