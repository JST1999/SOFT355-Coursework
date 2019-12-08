var hashes = window.location.href;
var num = hashes.indexOf('?');
var url = hashes.substring(0, num);//these 3 are so that the website can be on any host i.e. localhost, soft355.herokuapp.com

$(document).ready(function() {
    search();

    $("#showLogin").click(function(){
        $("#loginForm").fadeIn();
        $("#loginForm").css({"visibility":"visible","display":"block"});
        console.log("showLogin clicked");
    });
    
    $("#hideLogin").click(function(){
        $("#loginForm").fadeOut();
        $("#loginForm").css({"visibility":"hidden","display":"none"});
    });
});

$("#searchForm").submit(function(e) {	//This and document.ready will use the url query
    e.preventDefault();
    search();
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
                              '<h6 class="font-weight-bold my-2">'+res[i].price+'</h6>' +
                          '</div>' +
                      '</div>' +
                      '<img class="searchResultImage" src="'+'product-images/'+res[i].filename+'" alt="Generic placeholder image" width="100" class="ml-lg-5 order-1 order-lg-2">' +
                  '</div>' +
              '</li>'

    }

    //</li>var text = "<li class='list-group-item'>"+res+"</li>"
    $("#searchResultsOutput").html(text);
}