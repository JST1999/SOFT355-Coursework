$(document).ready(function() {
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
});