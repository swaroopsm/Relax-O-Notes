var p=$("#page_name").attr('data-page');
console.log(p);

twttr.anywhere(function (T) {
	if(T.isConnected()){
		var user=T.currentUser;
		var p=user.data('profile_image_url');
		var a=p.split('_');
		p=a[0]+"_"+a[1]+"_"+"mini.jpeg";
		$("#peepin").html('<li id="fat-menu" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="'+p+'" ></img> '+user.data("screen_name")+'<b class="caret"></b></a><ul class="dropdown-menu"><li><a href="index.html">Home<a></li><li><a href="discussion.html">Discussions</a></li><li><a href="files.html">Files</a></li><li class="divider"></li><li><a href="#" id="logout">Log out!</a></li></ul></li>').hide().fadeIn('fast');
	}
	else{
		$("#peepin").html('<a id="login" class="btn btn-success">Login &raquo;</a>').show();
	}
  $("#login").live("click",function(){
  	if(T.isConnected()){
  		var user=T.currentUser;
		var p=user.data('profile_image_url');
		var a=p.split('_');
		p=a[0]+"_"+a[1]+"_"+"mini.jpeg";
		$("#peepin").html('<li id="fat-menu" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="'+p+'" ></img> '+user.data("screen_name")+'<b class="caret"></b></a><ul class="dropdown-menu"><li><a href="index.html">Home<a></li><li><a href="discussion.html">Discussions</a></li><li><a href="files.html">Files</a></li><li class="divider"></li><li><a href="#" id="logout">Log out!</a></li></ul></li>').hide().fadeIn('fast');
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
