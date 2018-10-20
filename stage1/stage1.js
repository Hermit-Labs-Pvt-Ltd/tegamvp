var panel_id, cell_id,info;
$( ".cell_input" ).on( "click", function() {
  $(this).css( "cursor", "text");
console.log($(this).attr("id"));
});

$( ".cell_input" ).on( "focusout", function() {		
	cell_id=$(this).attr("id").substring(5);
	panel_id = $(this).val();
	if (window.confirm("You have assigned the id " + panel_id + " to cell " + cell_id + ". Confirm?")) {
    var data = {
    	panel_id:panel_id,
    	cell_id:cell_id
    }

    info = JSON.stringify(data);
    console.log(info);
	$.ajax({
 url: "http://www.mqtest.cf:4000",
 contentType: "application/json",
 data:info,
 type:'POST',
 crossDomain:true,
 error: function (xhr, status, error) {
 			console.log(xhr.responseText);
 			console.log(status);
           	console.log('Error: ' + error.message);
       }
}).done(function(data){
console.log("success");
console.log(data);
})
.fail(function(data){
	console.log("some error occured");
});	

	console.log($(this).val());
 //	$(this).css('background-color','green');	
	}
	else{
		$(this).val("");
	}
});


//Websocket Client configuration

	    var ws;
	    //Starting of the websocket function
		function startsocket(){
		ws = new WebSocket("wss://www.mqtest.cf:3000");//Address of the socket server
		//On sucessful connection with socket server 
		ws.onopen = function() {
			console.log("Connected with socket");
		};
		//Message received from socket server
		ws.onmessage = function(payload) {
			console.log(payload.data);
		};
		//Trying to reconnect if the connection in down for some reason or has been severed 
		ws.onclose = function() {
			console.log("Disconnected");
			console.log("Trying again");
	    //Trying to reconnect in 5 seconds after the connection is lost
        setTimeout(function(){startsocket()}, 5000);//recursively calling the function durring connection loss

		}; }
		startsocket();//Calling the Socket Client function
