var hashes = window.location.href;
var url = hashes.substring(0, hashes.length - 10);//these 2 are so that the website can be on any host i.e. localhost, soft355.herokuapp.com
var userDetails;
var sessionID = null;

$(document).ready(function() {
    $("#addBTN").click( function(e){
        e.preventDefault();
        var name = $("#name").val();
        var description = $("#description").val();
        var filename = $("#filename").val();
        var price = $("#price").val();
        var quantity = $("#quantity").val();
        var category = $("#category").val();

        if(name.length === 0 || description.length === 0 || filename.length === 0 || price.length === 0 || quantity.length === 0 || category.length === 0){
            $("#addOutput").html("<p id='outputText' style='color: #ffa500;'>All inputs need to be filled in</p>");
        } else{
            var uri = url+"additem";
            $.post(uri, {
                sessionID: sessionID,
                name: name,
                description: description,
                filename: filename,
                price: price,
                quantity: quantity,
                category: category
            }, function(data, status) { 
                $("#addOutput").html("<p id='outputText' style='color: #ffa500;'>Added Successfully</p>");
            }).fail(function(xhr, status, error) {
                $("#addOutput").html("<p id='outputText' style='color: #ffa500;'>Try again</p>");
            });
        }
    });

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
            $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Try again</p>");
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
            $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Try again</p>");
        });
    });
    

    function search(){  //gets the url and does a get request
        var query = $("#querystr").val();
        var uri = url + "searchitems/" + query;
        $.get(uri, {}, function(res) {
            appendText(res);
        });
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
                    $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Try again</p>");
                });
            });
        }
        
        $("#searchResultsOutput").html(text);
    }

    $("#searchBTN").click(function(e) {
        e.preventDefault();
        search();
    });
});
