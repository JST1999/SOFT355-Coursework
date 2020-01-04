var hashes = window.location.href;
var url = hashes.substring(0, hashes.length - 11);//these 2 are so that the website can be on any host i.e. localhost, soft355.herokuapp.com
var userDetails;
var sessionID = null;

$(document).ready(function() {
    function getAdminDetails(){
        var uri = url+"getadmindetails";
        $.post(uri, {
            sessionID: sessionID
        }, function(data, status) { 
            userDetails = data;
        }).fail(function(xhr, status, error) {
            Cookies.remove('adminSessionID');
            window.location.replace("./admin.html");
        });
    }
    sessionID = Cookies.get('adminSessionID');
    if(sessionID){
        getAdminDetails();
    } else{
        window.location.replace("./admin.html");
    }


    $("#logoutBTN").click( function(e){
        e.preventDefault();
        var uri = url+"logout";
        $.post(uri, {
            sessionID: sessionID
        }, function(data, status) {
            Cookies.remove('adminSessionID');
            window.location.replace("./admin.html");
        }).fail(function(xhr, status, error) {
            
        });
    });
    $("#logoutBTNslicknav").click( function(e){
        e.preventDefault();
        var uri = url+"logout";
        $.post(uri, {
            sessionID: sessionID
        }, function(data, status) {
            Cookies.remove('adminSessionID');
            window.location.replace("./admin.html");
        }).fail(function(xhr, status, error) {
            
        });
    });
    

    function search(){
            //appendText(res);
    }
    function appendText(res){   //turns the get requests response into html
        var text = "";
        for (var i = 0; i < res.length; i++){
            var id = res[i]._id;

            text += '<li class="list-group-item">' +
            '<div class="media align-items-lg-center flex-column flex-lg-row p-3">' +
            '<div class="searchResultText" class="media-body order-2 order-lg-1">' +
            '<h5 class="mt-0 font-weight-bold mb-2">'+res[i].name+'</h5>' +
            '<p class="font-italic text-muted mb-0 small">'+res[i].description+'</p>' +
            '<div class="d-flex align-items-center justify-content-between mt-1">' +
            '<h6 class="font-weight-bold my-2">£'+res[i].price+'</h6>' +
            '</div>' +
            '</div>' +
            '<img class="searchResultImage" src="product-images/'+res[i].filename+'" alt="Generic placeholder image" width="100" class="ml-lg-5 order-1 order-lg-2">' +
            '</div>' +
            '<button id="'+id+'" class="btn btn-dark rounded-pill py-2 btn-block site-btn sb-white">Remove</button>' +
            '</li>';
            
            $("#searchResultsOutput").on("click", "#"+id, function(){
                var itemID = event.target.id;
                var uri = url+"removeitem";
                $.post(uri, {
                    sessionID: sessionID,
                    id: itemID
                }, function(data, status) { 
                    window.location.replace("./items.html");
                }).fail(function(xhr, status, error) {
                    
                });
            });
        }
        
        $("#searchResultsOutput").html(text);
    }

    $("#searchBTN").click(function(e) {
        e.preventDefault();
        //search();
        console.log("searchbtn clicked");
    });



    // var WebSocketClient = require('websocket').client;
    // var client = new WebSocketClient();
    
    // client.on('connectFailed', function(error) {
    //     console.log('Connect Error: ' + error.toString());
    // });
    
    // client.on('connect', function(connection) {
    //     console.log('WebSocket Client Connected');
    //     connection.on('error', function(error) {
    //         console.log("Connection Error: " + error.toString());
    //     });
    //     connection.on('close', function() {
    //         console.log('echo-protocol Connection Closed');
    //     });
    //     connection.on('message', function(message) {
    //         if (message.type === 'utf8') {
    //             console.log("Received: '" + message.utf8Data + "'");
    //             $("#searchResultsOutput").html('<h5 class="mt-0 font-weight-bold mb-2">'+message.utf8Data+'</h5>');
    //         }
    //     });
    // });
    
    // client.connect('ws://localhost:9000/', 'echo-protocol');

    
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        console.log('Sorry, but your browser doesn\'t support WebSocket.');
    }
    // open connection
    var connection = new WebSocket('ws://localhost:9000/');
    connection.onopen = function () {
        console.log('WebSocket Client Connected');
    };
    connection.onerror = function (error) {
        console.log("Connection Error: " + error.toString());
    };
    // most important part - incoming messages
    connection.onmessage = function (message) {
        console.log("Received: '" + message.data + "'");
        $("#searchResultsOutput").html('<h5 class="mt-0 font-weight-bold mb-2">'+message.data+'</h5>');
    };
});
