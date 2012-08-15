var page=$("#page_name").attr('data-page');

twttr.anywhere(function (T) {
	if(T.isConnected()){
		show_dropdown(T);
	}
	else{
		$("#peepin").html('<a id="login" class="btn btn-success">Login &raquo;</a>').show();
	}
  $("#login").live("click",function(){
  	if(T.isConnected()){
  		show_dropdown(T);
  	}
  	else{
  		T.signIn();
  	}
  });
  $("#logout").live("click",function(){
  	twttr.anywhere.signOut();
  	window.location="index.html";
  });
  
  
});

function user_details(arg){
 	twttr.anywhere(function(Te) {
  	if(Te.isConnected()){
  		var t_user=Te.currentUser;
  		console.log(t_user.data(arg));
  	}
  });
}


function show_dropdown(T){
		var user=T.currentUser;
		var p=user.data('profile_image_url');
		var a=p.split('_');
		p=a[0]+"_"+a[1]+"_"+"mini.jpeg";
		$("#peepin").html('<li id="fat-menu" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="'+p+'" ></img> '+user.data("screen_name")+'<b class="caret"></b></a><ul class="dropdown-menu"><li><a href="index.html">Home<a></li><li><a href="discussion.html">Discussions</a></li><li><a href="files.html">Files</a></li><li class="divider"></li><li><a href="#" id="logout">Log out!</a></li></ul></li>').hide().fadeIn('fast');
		if(page==="index.html"){
			$("#main-menu").hide();
			$("#tweet_div").html('<a data-toggle="modal" href="#uploadModal" style="" class="btn btn-success">Tweet &raquo;</a>').hide().fadeIn(500);
		}
}
