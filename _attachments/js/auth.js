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
	
	$("#upload_next_btn").live("click",function(){
		var ftitle=$.trim($("#file_title").val());
		var fdesc=$.trim($("#file_description").val());
		if(ftitle=='' || fdesc==''){
			if(ftitle==''){
				$("#file_title").focus();
			}
			else if(fdesc==''){
				$("#file_description").focus();
			}
			else{
					
			}
			return;
		}
		var uid=$.couch.newUUID();
		var my_rev;
		uid="up_file_"+uid;
		var d=new Date();
		d=d.toISOString();
		var doc={
			"_id": uid,
			"author": user_name,
			"title": ftitle,
			"description": fdesc,
			"type": "file",
			"author_pic": "http://api.twitter.com/1/users/profile_image/"+user_name,
			"date": d
		};
		$.couch.db($db).saveDoc(doc,{
			success: function(data){
				my_rev=data.rev;
				$("#first_upload_body").hide();
				$("#second_upload_body").html("<form class='form form-horizontal' id='attachment_form' name='attachment_form' content-type='multipart/form-data'><div class='control-group'><div class='controls'><input class='span' id='_attachments' name='_attachments' type='file'></div><input type='hidden' name='_id' value='"+uid+"'><input type='hidden' name='_rev' value='"+my_rev+"'><br><div class='controls'><input type='submit' class='btn btn-success' value='Upload &raquo;' id='file_btn'></div></div></form>").hide().fadeIn(500);
				$("#upload_modal_footer").hide();
			},
			error: function(data){
				console.log(data);
			}
		});
	});
	
	$("#attachment_form").live("submit",function(e) { // invoke callback on submit
  e.preventDefault();
  var data = {};
  $.each($("form :input").serializeArray(), function(i, field) {
    data[field.name] = field.value;
  });
  $("form :file").each(function() {
    data[this.name] = this.value; // file inputs need special handling
  });
  if (!data._attachments || data._attachments.length == 0) {
    alert("Please select a file to upload.");
    return;
  }
  $("#second_upload_body").prepend("<center><img id='loader' src='img/loader.gif'/></center>").hide().show();
  $("#file_btn").attr("disabled","disabled");
  $(this).ajaxSubmit({
    url:  "../../"+data._id,
    success: function(resp) {
    	$("#loader").hide();
    	$("#file_btn").attr("disabled",false);
    	$("#uploadFileModal").modal('hide');
    	$("#second_upload_body").hide();
    	$("#file_title").val('');
    	$("#file_description").val('');
    	$("#_attachments").val('');
    	$("#first_upload_body").show();
    	$("#upload_modal_footer").show();
    },
    error: function(err){
    	$("#loader").hide();
    	console.log("id "+data._id);
    	console.log(err);
    }
  });
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
		$("#uploadFileModal").on("shown",function(){
			$("#upload_next_btn").live("click", function(){
				if(T.isConnected()){
				
				}else{
					$("#uploadFileModal").modal('hide');
					$("#messages").html("<div class='alert alert-danger'><a class='close' data-dismiss='alert' href='#'>&times;</a><center>You need to be logged in!</center></div>").hide().fadeIn(500);
				}
			});
			$("#attachment_form").live("submit",function() { 
				if(T.isConnected()){
				
				}else{
					$("#uploadFileModal").modal('hide');
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
  	window.location=window.location.href;
  });
  
  
});

function show_dropdown(T){
		var user=T.currentUser;
		var p=user.data('profile_image_url');
		var a=p.split('_');
		var ext=a[2].split('.')
		p=a[0]+"_"+a[1]+"_mini."+ext[1];
		$("#peepin").html('<li id="fat-menu" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="'+p+'" ></img> '+user.data("screen_name")+'<b class="caret"></b></a><ul class="dropdown-menu"><li><a href="index.html">Home<a></li><li><a href="discussion.html">Discussions</a></li><li><a href="files.html">Files</a></li><li class="divider"></li><li><a href="#" id="logout">Log out!</a></li></ul></li>').hide().fadeIn('fast');
		if(page==="index.html"){
			$("#main-menu").hide();
			$("#tweet_div").html('<a data-toggle="modal" href="#uploadModal" style="" class="btn btn-success">Tweet &raquo;</a>').hide().fadeIn(500);
		}
		if(page==="discussion.html"){
			$("#main-menu").hide();
			$("#discuss_btn_div").html('<a data-toggle="modal" href="#discussModal" style="" class="btn btn-success">Discuss &raquo;</a>').hide().fadeIn(500);
		}
		if(page==="files.html"){
			$("#main-menu").hide();
			$("#upload_btn_div").html('<a data-toggle="modal" href="#uploadFileModal" class="btn btn-success">Upload File &raquo;</a>').hide().fadeIn(500);
		}
}
