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
        var uri = url+"getorders";
        $.post(uri, {
            sessionID: sessionID
        }, function(res, status) {
            appendText(res);
        }).fail(function(xhr, status, error) {
            
        });
    }
    function appendText(res){   //turns the get requests response into html
        var text = "";
        for (var i = 0; i < res.length; i++){
            var id = res[i]._id;

            text += '<li class="list-group-item">' +
            '<div class="media align-items-lg-center flex-column flex-lg-row p-3">' +
            '<div class="searchResultText" class="media-body order-2 order-lg-1">' +
            '<h5 class="mt-0 font-weight-bold mb-2">ID: '+id+'</h5>' +
            '<p class="font-italic text-muted mb-0 small">User: '+res[i].userID+'</p>' +
            '<p class="font-italic text-muted mb-0 small">£: '+res[i].cost+'</p>' +
            '<p class="font-italic text-muted mb-0 small">Time - h:'+res[i].hour+' d:'+res[i].day+'/'+(res[i].month+1)+'/'+res[i].year+'</p>' +
            '<div class="d-flex align-items-center justify-content-between mt-1">' +
            '<h6 class="font-weight-bold my-2">Dispatched: '+res[i].dispatched+'</h6>' +
            '</div>' +
            '<button id="'+id+'" class="btn btn-dark rounded-pill py-2 btn-block site-btn sb-white">Mark As Dispatched</button>' +
            '</li>';
            
            $("#searchResultsOutput").on("click", "#"+id, function(){
                var orderID = event.target.id;
                var uri = url+"updatedispatchment";
                $.post(uri, {
                    sessionID: sessionID,
                    orderID: orderID
                }, function(data, status) { 
                    
                }).fail(function(xhr, status, error) {
                    
                });
            });
        }
        
        $("#searchResultsOutput").html(text);
    }

    search();
    


    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        console.log('Sorry, but your browser doesn\'t support WebSocket.');
    }
    var uri = "ws://"+window.location.hostname+":9000/";
    // open connection
    var connection = new WebSocket(uri);
    connection.onopen = function () {
        console.log('WebSocket Client Connected');
    };
    connection.onerror = function (error) {
        console.log("Connection Error: " + error.toString());
    };
    // most important part - incoming messages
    connection.onmessage = function (message) {
        console.log("Received: '" + message.data + "'");
        if(message.data === "change"){
            search();
        }
    };
});
