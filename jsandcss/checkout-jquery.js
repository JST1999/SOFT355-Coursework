var hashes = window.location.href;
var num = hashes.length;
var url = hashes.substring(0, num - 13);
var userDetails;
var sessionID;
var cartItems = [];

$(document).ready(function() {
    function getRequest(uri, i){
        $.get(uri, {}, function(res) {
            var textItems = '<tr>'+
                            '<th scope="row" class="border-0">'+
                            '<div class="p-2">'+
                                '<img src="product-images/'+res.filename+'" alt="" width="70" class="img-fluid rounded shadow-sm">'+
                                '<div class="ml-3 d-inline-block align-middle">'+
                                '<h5 class="mb-0">'+res.name+'</h5><span class="text-muted font-weight-normal font-italic d-block">Category: '+res.category[0]+'</span>'+
                                '</div>'+
                            '</div>'+
                            '</th>'+
                            '<td class="border-0 align-middle"><strong>'+res.price+'</strong></td>'+
                            '<td class="border-0 align-middle"><strong>1</strong></td>'+
                        '</tr>';
            $("#cartTableOutput tbody").append(textItems);

            var cost = parseFloat(res.price);
            var total = $("#itemsTotal").text();
            total = parseFloat(total.substring(1));//remove first character
            total += cost;
            var total2 = "£"+total;
            $("#itemsTotal").text(total2);
        });
    }
    function updateCartOutput(){
        $("#cartOutput").empty();
        
        var total = 0.0;
        var total2 = "£"+total;
        $("#itemsTotal").text(total2);
        for(var i = 0; i < cartItems.length; i++){
            var id = cartItems[i];
            var uri = url + "item/" + id;

            getRequest(uri, i);//cant have get req in the loop
        }
    }
    if(localStorage.getItem("items")){
        cartItems = JSON.parse(localStorage.getItem("items"));
        updateCartOutput();
    } else{
        window.location.replace("./");
    }

    
    function getUserDetails(){
        var uri = url+"getuserdetails";
        $.post(uri, {
            sessionID: sessionID
        }, function(data, status) { 
            userDetails = data;
            $("#address").text(userDetails.streetName+",\n"+userDetails.city+",\n"+userDetails.county+",\n"+userDetails.postcode);
        }).fail(function(xhr, status, error) {
            Cookies.remove('sessionID');
            window.location.replace("./");
        });
    }
    sessionID = Cookies.get('sessionID');
    if(sessionID){
        getUserDetails();
    } else{
        window.location.replace("./");
    }

    $("#confirm").click(function(){
        var uri = url+"order";
        $.post(uri, { 
            sessionID: sessionID,
            items: cartItems
        }, function(data, status) {
            localStorage.removeItem("items");
            cartItems = [];
            window.location.replace("./confirmed.html");
        }).fail(function(xhr, status, error) {
            $("#errorOutput").text("Error, try again");
        });
    });
    
    // $("#searchBTN").click(function(e) {
    //     e.preventDefault();
    
    //     var query = $("#searchBar").val();
    //     console.log("query: "+query);
    //     var uri = url + "?querystr=" + query;
    //     console.log("uri: "+uri);
    //     window.location.replace(uri);
    // });
});
