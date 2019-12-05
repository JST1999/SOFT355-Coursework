var hashes = window.location.href;
var num = hashes.indexOf('?');
var url = hashes.substring(0, num);//these 3 are so that the website can be on any host i.e. localhost, soft355.herokuapp.com

$(document).ready(function() {
    search();
});

$("#searchForm").submit(function(e) {	//This and document.ready will use the url query
    e.preventDefault();
    search();
});

function search(){
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
        var text = "<li class='list-group-item'>"+res+"</li>"
        $("#searchResultsOutput").html(text);
    });
}