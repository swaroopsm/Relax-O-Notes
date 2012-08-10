twttr.anywhere(function (T) {
	if(T.isConnected()){
		console.log("Connected!");
	}
  $("#test").click(function(){
  	if(T.isConnected()){
  		console.log("Connected!");
  	}
  	else{
  		T.signIn();
  	}
  });
});
