twttr.anywhere(function (T) {
	if(T.isConnected()){
		$("#peepin").html('<a data-toggle="modal" href="#uploadModal" class="btn btn-success">Tweet &raquo;</a>').hide().fadeIn('fast');
	}
	else{
		$("#peepin").html('<a id="login" class="btn btn-success">Login &raquo;</a>').show();
	}
  $("#login").live("click",function(){
  	if(T.isConnected()){
  		$("#peepin").html('<a data-toggle="modal" href="#uploadModal" class="btn btn-success">Tweet &raquo;</a>').hide().fadeIn(500);
  	}
  	else{
  		T.signIn();
  	}
  });
});
