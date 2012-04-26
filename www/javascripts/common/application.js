address = 'http://ec2-46-137-44-111.eu-west-1.compute.amazonaws.com:8080/niths/';

student = {};
sessionToken = '';

applicationKey = 'NH3E5WANTJ';
applicationToken = 'JJbOUVRgFzOvGGUicKnuhB+fXeyvEnJYpl514ar3nU91brUX1EgisRWwEdj1Byw3CeKjPSnqSSO70xwxmupwjw==';
developerToken = 'Q9WduujDMII1vTqpnoefwSx7HWkuqOmtdure1g8BCWA1EGN6nPCNQj4KjtuYwIA0j1CnoC5OQE5UvAfq2tFylw==';
developerKey = 'sob8gvpyk2';


htmlEncode = function(s) {
    encodedHtml = escape(s);
    encodedHtml = encodedHtml.replace(/%20/g," "); // white space
    encodedHtml = encodedHtml.replace(/%E5/g,"æ"); // æ
    encodedHtml = encodedHtml.replace(/%F8/g,"ø"); // ø
    encodedHtml = encodedHtml.replace(/%E6/g,"å"); // å
    
    encodedHtml = encodedHtml.replace(/%C6/g,"Æ"); // Æ
    encodedHtml = encodedHtml.replace(/%D8/g,"Ø"); // Ø
    encodedHtml = encodedHtml.replace(/%C5/g,"Å"); // Å
    
      
    encodedHtml = encodedHtml.replace(/\//g,"%2F");
    encodedHtml = encodedHtml.replace(/\?/g,"%3F");
    encodedHtml = encodedHtml.replace(/=/g,"%3D");
    encodedHtml = encodedHtml.replace(/&/g,"%26");
    encodedHtml = encodedHtml.replace(/@/g,"%40");
    return encodedHtml;
 }