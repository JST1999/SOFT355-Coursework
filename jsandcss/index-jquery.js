var hashes = window.location.href;
var num = hashes.indexOf('?');
var url = hashes.substring(0, num);//these 3 are so that the website can be on any host i.e. localhost, soft355.herokuapp.com
var userDetails;
var sessionID;

$(document).ready(function() {
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
                    console.log(data);
                    Cookies.set('sessionID', data.message);
                    sessionID = Cookies.get("sessionID");
                    console.log(sessionID);
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
            text += '<li class="list-group-item">' +
            '<div class="media align-items-lg-center flex-column flex-lg-row p-3">' +
            '<div class="searchResultText" class="media-body order-2 order-lg-1">' +
            '<h5 class="mt-0 font-weight-bold mb-2">'+res[i].name+'</h5>' +
            '<p class="font-italic text-muted mb-0 small">'+res[i].description+'</p>' +
            '<div class="d-flex align-items-center justify-content-between mt-1">' +
            '<h6 class="font-weight-bold my-2">£'+res[i].price+'</h6>' +
            '</div>' +
            '</div>' +
            '<img class="searchResultImage" src="'+'product-images/'+res[i].filename+'" alt="Generic placeholder image" width="100" class="ml-lg-5 order-1 order-lg-2">' +
            '</div>' +
            '</li>'
            
        }
        
        //</li>var text = "<li class='list-group-item'>"+res+"</li>"
        $("#searchResultsOutput").html(text);
    }
    $("#searchForm").submit(function(e) {
        e.preventDefault();
        search();
    });
});