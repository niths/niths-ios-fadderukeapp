/**
 * REST CLIENT
 * Class that handles ajax calls to the API
 * 
 * HOW TO:
 * $("#your-page-id").live('pageshow', function() {
 *  
 *    var restClient = new RestHandler();
 *    
 *    restClient.find('someUrl', 
 *          function(data, status, e) {}, //Success callback
 *          function(jqXHR, textStatus, errorThrown){} //Error callback
 *    );
 *
 * });
 */
function RestHandler(){
    // change to https
    this.baseUrl2 = 'http://ec2-46-137-46-84.eu-west-1.compute.amazonaws.com:8080/niths/';
    // temp url for filuploader since it needs verifide ssl certificatet.
    this.baseUrl = 'http://ec2-46-137-46-84.eu-west-1.compute.amazonaws.com:8080/niths/';
    this.find = function(modelUrl, callbackSuccess, callbackError) {
        $.ajax({
               type: 'GET',
               url: this.baseUrl2 + modelUrl,
               contentType: 'application/json',
               cache: false,
               success: callbackSuccess,
               error: callbackError,
               timeout:10000
               });
    }; //End find
    
    this.findRestricted = function(modelUrl, callbackSuccess, callbackError) {
        $.ajax({
               type: 'GET',
               url: this.baseUrl2 + modelUrl,
               contentType: 'application/json',
               cache: false,
               beforeSend: function(xhr) {
               
               xhr.setRequestHeader("Application-token", applicationToken);
              
               xhr.setRequestHeader("Developer-token", developerToken);
               xhr.setRequestHeader("Session-token", sessionToken);
               
               },
               success: callbackSuccess,
               error: callbackError,
               timeout:10000
               });
    }; //End find
    
    this.remove = function(modelUrl, callbackSuccess) {
        $.mobile.showPageLoadingMsg();
        $.ajax({
               type: 'DELETE',
               url: this.baseUrl2 + modelUrl,
               cache: false,
               beforeSend: function(xhr) {
               xhr.setRequestHeader("Application-token", applicationToken);
               xhr.setRequestHeader("Developer-token", developerToken);
               xhr.setRequestHeader("Session-token", sessionToken);
               },
               success: callbackSuccess,
               error: function(jqXHR, textStatus, errorThrown){
               handleError(errorThrown, jqXHR);
               },
               timeout:10000
               });
    }; //End remove
    
    this.update = function(modelUrl, dataJ, callbackSuccess) {
        $.mobile.showPageLoadingMsg();
        $.ajax({
               type: 'PUT',
               url: this.baseUrl2 + modelUrl,
               cache: false,
               contentType: 'application/json',
               data: dataJ,
               beforeSend: function(xhr) {
               xhr.setRequestHeader("Application-token", applicationToken);
               xhr.setRequestHeader("Developer-token", developerToken);
               xhr.setRequestHeader("Session-token", sessionToken);
               },
               success: callbackSuccess,
               error: function(jqXHR, textStatus, errorThrown){
               handleError(errorThrown, jqXHR);
               },
               timeout:10000
               });
    }; //End update
    this.updateURL = function(modelUrl, callbackSuccess) {
        $.mobile.showPageLoadingMsg();
        $.ajax({
               type: 'POST',
               url: this.baseUrl2 + modelUrl,
               cache: false,
               contentType: 'application/json',
               beforeSend: function(xhr) {    
               xhr.setRequestHeader("Application-token", applicationToken);
               xhr.setRequestHeader("Developer-token", developerToken);
               xhr.setRequestHeader("Session-token", sessionToken);
               },
               success: callbackSuccess,
               error: function(jqXHR, textStatus, errorThrown){
               handleError(errorThrown, jqXHR);
               },
               timeout:10000
               });
    }; //End update
    this.updateWithCallbacks = function(modelUrl, json, callbackSuccess, callbackError) {
        $.mobile.showPageLoadingMsg();
        $.ajax({
               type: 'POST',
               url: this.baseUrl2 + modelUrl,
               cache: false,
               data: json,
               contentType: 'application/json',
               beforeSend: function(xhr) {
               xhr.setRequestHeader("Application-token", applicationToken);
               xhr.setRequestHeader("Developer-token", developerToken);
               xhr.setRequestHeader("Session-token", sessionToken);
               },
               success: callbackSuccess,
               error: callbackError,
               timeout:10000
               });
    }; //End update
    
    this.create = function(modelUrl, dataJ, callbackSuccess) {
        $.mobile.showPageLoadingMsg();
        $.ajax({
               type: 'POST',
               url: this.baseUrl2 + modelUrl,
               cache: false,
               contentType: 'application/json',
               data: dataJ,
               beforeSend: function(xhr) {
               xhr.setRequestHeader("Application-token", applicationToken);              
               xhr.setRequestHeader("Developer-token", developerToken);
               xhr.setRequestHeader("Session-token", sessionToken);
               },
               success: callbackSuccess,
               error: function(jqXHR, textStatus, errorThrown){
               handleError(errorThrown, jqXHR);
               },
               timeout:10000
               });
    }; //End update
    
    
    
    function handleError(errorThrown, jqXHR){
        $.mobile.hidePageLoadingMsg();
        if (errorThrown == 'Unauthorized') {
            showErr(
                    'Beklager, du har vært inaktiv for lenge, logg inn igjen',
                    function() {
                    sessionToken = '';
                    $.mobile.changePage('#dashboard-page');
                    }
                    );
        } else {
            showErr(
                    "Beklager, en feil oppsto: " + jqXHR.getResponseHeader('error'),
                    null
                    );
        }
    }
} //End class