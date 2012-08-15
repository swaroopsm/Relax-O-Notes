var page=$("#page_name").attr('data-page');

twttr.anywhere(function (T) {
	if(T.isConnected()){
		show_dropdown(T);
		var user_name=T.currentUser.data('screen_name');
		$("#upload_file_btn").live("click", function(){
		var d=new Date();
		d=d.toISOString();
		var tags=$("#upload_message").val().split(" ");
		var act_tags="", k=0;
		for(var j=0;j<tags.length;j++){
			if(tags[j].indexOf('#') == 0){
				act_tags=act_tags+" "+tags[j];
				act_tags=act_tags.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
				k++;
			}
		}
		act_tags=act_tags.substring(1,act_tags.length);
		var uid=$.couch.newUUID();
		uid="mytweet_"+uid;
		var doc={
			"_id": uid,
			"uploaded_by": user_name,
			"gravatar_url": "http://api.twitter.com/1/users/profile_image/"+user_name,
			"uploader_msg": $("#upload_message").val(),
			"created_at": d,
			"tags": act_tags.split(" ")
		};
		$.couch.db($db).saveDoc(doc,{
			success: function(data){
				var id=data.id;
				var stat=data.ok;
				if(stat){
					$("#uploadModal").modal('hide');
				}
			},
			error: function(data){
				console.log(data);
			}
		});
		return false;
	});
	
	$("#discuss_btn").live("click",function(){
		var dt=$.trim($("#discuss_title").val());
		var dm=$.trim($("#discuss_message").val());
		if(dt=='' || dm==''){
			if(dt==''){
				$("#discuss_title").focus();
			}
			else if(dm==''){
				$("#discuss_message").focus();
			}
			else{
				
			}
		}
		else{
			var d=new Date();
			d=d.toISOString();
			var uid=$.couch.newUUID();
			uid="discuss_"+uid;
			var doc={
				"_id": uid,
				"title": dt,
				"author": user_name,
				"content": dm ,
				"date": d,
				"author_pic": "http://api.twitter.com/1/users/profile_image/"+user_name,
				"type": "discussion"
			};
			$.couch.db($db).saveDoc(doc,{
			success: function(data){
				var id=data.id;
				var stat=data.ok;
				if(stat){
					$("#discussModal").modal('hide');
				}
			},
			error: function(data){
				console.log(data);
			}
		});
		}
		return false;
	});	
	
	}
	else{
		$("#uploadModal").on("shown",function(){
			$("#upload_file_btn").live("click", function(){
				if(T.isConnected()){
				
				}else{
					$("#uploadModal").modal('hide');
					$("#messages").html("<div class='alert alert-danger'><a class='close' data-dismiss='alert' href='#'>&times;</a><center>You need to be logged in!</center></div>").hide().fadeIn(500);
				}
			});
		});
		$("#discussModal").on("shown",function(){
			$("#discuss_btn").live("click", function(){
				if(T.isConnected()){
				
				}else{
					$("#discussModal").modal('hide');
					$("#messages").html("<div class='alert alert-danger'><a class='close' data-dismiss='alert' href='#'>&times;</a><center>You need to be logged in!</center></div>").hide().fadeIn(500);
				}
			});
		});
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
		if(page==="discussion.html"){
			$("#main-menu").hide();
			$("#discuss_btn_div").html('<a data-toggle="modal" href="#discussModal" style="" class="btn btn-success">Discuss &raquo;</a>').hide().fadeIn(500);
		}
}
