$.ajax({
	url : "https://api.pushshift.io/reddit/search?q=microsoft",
  context: document.body
}).done(function(response) {
	var data =	response.data;
  var i = 1;
  $(data).each(function(){
  	$("#result").append("<p>" + i + ": " + this.body_html + "</p>");	
    i++;
  });
});