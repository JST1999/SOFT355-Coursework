var hashes = window.location.href;
var num = hashes.indexOf('?');
var url = hashes.substring(0, num);//these 3 are so that the website can be on any host i.e. localhost, soft355.herokuapp.com
var userDetails;
var sessionID = null;
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
                            '<td class="border-0 align-middle"><button class="removeItem" id="Cart'+i+'"><img src="./images/bin-icon.jpg" alt=""></button></td>'+
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
        $("#shoppingCartTableOutput").empty();

        var numberOfItems = cartItems.length;
        $("#cartNumberOfItems").text(numberOfItems);
        
        var total = 0.0;
        var total2 = "£"+total;
        $("#itemsTotal").text(total2);
        if(numberOfItems === 0){
            var textNothingHere = '<tr><th scope="row" class="border-0">Nothing here yet</th></tr>';
            $("#shoppingCartTableOutput").append(textNothingHere);
        } else{
            for(var i = 0; i < numberOfItems; i++){
                var id = cartItems[i];
                var uri = url + "item/" + id;

                getRequest(uri, i);//cant have get req in the loop
            }
        }
    }
    function addToCart(itemID){
        cartItems.push(itemID);
        localStorage.setItem("items", JSON.stringify(cartItems));
        updateCartOutput();
    }
    function removeFromCart(index){
        for (var i = 0; i < cartItems.length; i++){
            $("#Cart"+i).unbind("click");
        }
        cartItems.splice(index, 1);
        console.log(cartItems);
        if(cartItems.length === 0){
            localStorage.removeItem("items");
        } else{
            localStorage.setItem("items", JSON.stringify(cartItems));
        }
        updateCartOutput();
    }
    if(localStorage.getItem("items")){
        cartItems = JSON.parse(localStorage.getItem("items"));
        updateCartOutput();
    }
    $("#cartTableOutput").on("click", "button", function(){//all the bin buttons have this click event
        var id = event.target.id;
        id = id.substring(id.length - 1, id.length);//remove 'cart' from the end
        removeFromCart(id);
    });
    
    function addLoginSignupDiv(){
        var text = '<img src="./images/person-icon.png" alt="">Sign In or Create Account';
        $("#showLogin").empty();
        $("#showLogin").append(text);
        var text2 = '<button id="hideLogin">X</button>'+
  '<form id="signIn">'+
'    <p>Login</p>'+
'    <input type="text" class="inputBox" id="emailLI" name="email" placeholder="Email">'+
'    <input type="password" class="inputBox" id="passwordLI" name="password" placeholder="********">'+
'  </form>'+
'  <button class="signInUpBTNs" id="loginBTN">Login</button>'+
' <br />'+
'  <form id="signUp">'+
'      <p>Sign Up</p>'+
'      <input type="text" class="inputBox" id="emailSU" name="email" placeholder="Email">'+
'      <input type="password" class="inputBox" id="passwordSU" name="password" placeholder="********">'+
'      <input type="password" class="inputBox" id="confirmPasswordSU" name="confirmPassword" placeholder="Confirm ********">'+
'      <input type="text" class="inputBox" id="streetNameSU" name="streetName" placeholder="Street Name">'+
'      <input type="text" class="inputBox" id="citySU" name="city" placeholder="City">'+
'      <input type="text" class="inputBox" id="countySU" name="county" placeholder="County">'+
'      <input type="text" class="inputBox" id="postcodeSU" name="postCode" placeholder="Post Code">'+
'      <input type="text" class="inputBox" id="firstnameSU" name="firstname" placeholder="Firstname">'+
'      <input type="text" class="inputBox" id="lastnameSU" name="lastname" placeholder="Lastname">'+
'  </form>'+
'  <button class="signInUpBTNs" id="signUpBTN">Create</button>'+
'  </br></br>'+
'  <div id="loginFormOutput"></div>';
        $("#loginForm").empty();
        $("#loginForm").append(text2);
    }
    function outputLogoutDiv(){
        var text = '<img src="./images/person-icon.png" alt="">'+userDetails.firstname+' | Logout';
        $("#showLogin").empty();
        $("#showLogin").append(text);
        var text2 = '<button id="hideLogin">X</button>'+
'    <p>Do you want to logout</p>'+
'    <button class="signInUpBTNs" id="logoutBTN">Logout</button>'+
' <br />'+
'  <div id="loginFormOutput"></div>';
        $("#loginForm").empty();
        $("#loginForm").append(text2);
    }
    function getUserDetails(){
        var uri = url+"getuserdetails";
        $.post(uri, {
            sessionID: sessionID
        }, function(data, status) { 
            userDetails = data;
            outputLogoutDiv();
        }).fail(function(xhr, status, error) {
            Cookies.remove('sessionID');
        });
    }
    sessionID = Cookies.get('sessionID');
    if(sessionID){
        getUserDetails();
    } else{
        addLoginSignupDiv();
    }

    search();

    $("#showLogin").click(function(){
        $("#loginForm").fadeIn();
        $("#loginForm").css({"visibility":"visible","display":"block"});
    });
    
    $("#loginForm").on("click", "#hideLogin", function(){//on("click", will work on future elements created by the script
        $("#loginForm").fadeOut();
        $("#loginForm").css({"visibility":"hidden","display":"none"});
    });

    $("#showShoppingCart").click(function(){
        $("#shoppingCart").fadeIn();
        $("#shoppingCart").css({"visibility":"visible","display":"block"});
    });
    
    $("#shoppingCart").on("click", "#hideShoppingCart", function(){
        $("#shoppingCart").fadeOut();
        $("#shoppingCart").css({"visibility":"hidden","display":"none"});
    });

    $("#loginForm").on("click", "#signUpBTN", function(){
        var email = $("#emailSU").val();
        var password = $("#passwordSU").val();
        var conPassword = $("#confirmPasswordSU").val();
        var streetName = $("#streetNameSU").val();
        var city = $("#citySU").val();
        var county = $("#countySU").val();
        var postcode = $("#postcodeSU").val();
        var firstname = $("#firstnameSU").val();
        var lastname = $("#lastnameSU").val();

        if(email.length === 0 || password.length === 0 || conPassword.length === 0 || streetName.length === 0 || city.length === 0 || county.length === 0 || postcode.length === 0 || firstname.length === 0 || lastname.length === 0){
            $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>All inputs need to be filled in</p>");
        } else{
            if(password != conPassword){
                $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Passwords don't match</p>");
            } else{
                if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
                    $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Invalid email</p>");
                } else{
                    $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Waiting</p>");
                    var uri = url+"signup";
                    $.post(uri, { 
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password,
                        streetName: streetName,
                        city: city,
                        county: county,
                        postcode: postcode
                    }, function(data, status) { 
                        $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>"+data.message+"</p>");
                    }).fail(function(xhr, status, error) {
                        $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>An account with that email already exists</p>");
                    });
                }
            }
        }
    });

    $("#loginForm").on("click", "#loginBTN", function(){
        var email = $("#emailLI").val();
        var password = $("#passwordLI").val();

        if(email.length === 0 || password.length === 0){
            $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>All inputs need to be filled in</p>");
        } else{
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
                $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Invalid email</p>");
            } else{
                $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Waiting</p>");
                var uri = url+"login";
                $.post(uri, {
                    email: email,
                    password: password
                }, function(data, status) { 
                    $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Logged In</p>");
                    Cookies.set('sessionID', data.message);
                    sessionID = Cookies.get("sessionID");
                    getUserDetails();
                    outputLogoutDiv();
                }).fail(function(xhr, status, error) {
                    $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Invalid Credentials</p>");
                });
            }
        }
    });

    $("#loginForm").on("click", "#logoutBTN", function(){
        var uri = url+"logout";
        $.post(uri, { 
            sessionID: sessionID
        }, function(data, status) {
            Cookies.remove('sessionID');
            addLoginSignupDiv();
        }).fail(function(xhr, status, error) {
            $("#loginFormOutput").html("<p id='outputText' style='color: #ffa500;'>Try again</p>");
        });
    });
    
    
    $("#goToCheckoutBTN").click(function(){
        if(sessionID != null){
            if(cartItems.length != 0){
                var uri = url+"checkout.html";
                window.location.href = uri;//user can get back to home by hitting back in their browser
            } else{
                $("#cartErrorOutput").text("Cart Empty");
            }
        } else{
            $("#cartErrorOutput").text("Sign In");
        }
    });


    function search(){  //gets the url and does a get request
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        
        var query = vars.querystr;
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
            '<button id="'+id+'" class="btn btn-dark rounded-pill py-2 btn-block site-btn sb-white">Add To Cart</button>' +
            '</li>';
            
            $("#searchResultsOutput").on("click", "#"+id, function(){
                addToCart(event.target.id);
            });
        }
        
        //</li>var text = "<li class='list-group-item'>"+res+"</li>"
        $("#searchResultsOutput").html(text);
    }
});

$("#searchForm").submit(function(e) {
    e.preventDefault();
    search();
});