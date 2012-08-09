$(document).ready(function(){
	$db="relax-o-notes";
	$url="http://localhost:5984/"+$db+"/_design/app/";
	$flag=0;
	
	var p=$("#page_name").attr("data-page");
	
	if(p=="index.html"){
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
		var doc={
			"uploaded_by": $("#uploaded_by").val(),
			"gravatar_url": "http://api.twitter.com/1/users/profile_image/"+$("#uploaded_by").val(),
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
		
		$.couch.db($db).view("app/notes/",{
			success: function(data){
				$("#all_notes").html('');
				var val;
				for(var i=0;i<data.total_rows;i++){
					val=data.rows[i].value;
					$("#all_notes").append("<tr id="+data.rows[i].id+"><td class='span1'><img class='thumbnail' src='"+val.avatar+"'></img><td><a href='http://twitter.com/"+val.user+"' target='_BLANK'>"+val.user+"</a><p>"+val.uploader_msg+"<br><span id='timeago' title='"+val.created_at+"' class='date_time-block'></span></p></td></tr>");
					$(".date_time-block").timeago();
				}
				$("#all_notes").hide().fadeIn(500);
			},
			error: function(data){
				console.log(data);
			}
		});
		
		$.couch.db($db).view("app/hashtags/",{
		success: function(data){
			$("#hashtags").html('');
			var val;
			for(var i=0;i<data.total_rows;i++){
				val=data.rows[i].value;
				for(var j=0;j<val.length;j++)
					$("#hashtags").append("<a href='#'>"+val[j]+"</a>&nbsp;&nbsp;");
			}
			$("#hashtags").hide().fadeIn(500);
		},
		error: function(data){
			console.log(data);
		}
	});
	
	}
	
	
	else if(p=="discussion.html"){
	
		$("#discuss_btn").live("click",function(){
		var th=$.trim($("#uploaded_by").val());
		var dt=$.trim($("#discuss_title").val());
		var dm=$.trim($("#discuss_message").val());
		if(th=='' || dt=='' || dm==''){
			if(th==''){
				$("#uploaded_by").focus();
			}
			else if(dt==''){
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
				"author": th,
				"content": dm ,
				"date": d,
				"author_pic": "http://api.twitter.com/1/users/profile_image/"+th,
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
		
		$.couch.db($db).view("app/discuss/",{
			success: function(data){
				console.log(data);
				$("#all_discussions").html('');
				var val;
				for(var i=0;i<data.total_rows;i++){
					val=data.rows[i].value;
					$("#all_discussions").append("<tr id="+data.rows[i].id+"><td class='span1'><a href='http://twitter.com/"+val.author+"' id='t"+data.rows[i].id+"' rel='tooltip' data-original-title='by "+val.author+"' target='_BLANK'><img class='thumbnail' src='"+val.avatar+"'></img></a><td><a href='#'>"+val.title+"</a><p>"+val.content+"<br><span id='' title='"+val.created_at+"' class='date_time-block'></span><a  href='#comments_modal' data-id='#t"+data.rows[i].id+"' class='discuss_comments' data-toggle='modal' style='display:block;color: #08c;margin-top: -8px;'>Comments(0)</a></p></td></tr>");
					$(".date_time-block").timeago();
					$("#t"+data.rows[i].id).tooltip('hide');
				}
				$("#all_discussions").hide().fadeIn(500);
			},
			error: function(data){
				console.log(data);
			}
		});
	}
	
	else{
		
	}
	
	$.couch.db($db).changes().onChange(function(data){
		var id=data.results[0].id;
		var sub=id.substring(0,7);
		if(id=="_design/app"){
			
		}
		else if(sub=="discuss"){
			$.couch.db($db).openDoc(id,{
			success: function(obj){
				console.log(obj);
				$("#all_discussions").prepend("<tr id="+id+"><td class='span1'><a href='http://twitter.com/"+obj.author+"' id='t"+id+"' rel='tooltip' data-original-title='by "+obj.author+"' target='_BLANK'><img class='thumbnail' src='"+obj.author_pic+"'></img></a><td><a href='#'>"+obj.title+"</a><p>"+obj.content+"<br><span id='' title='"+obj.date+"' class='date_time-block'></span><a  href='#t"+id+"' class='discuss_comments' data-toggle='collapse' style='display:block;color: #08c;margin-top: -8px;'>Comments(0)</a></p></td></tr>");
					$(".date_time-block").timeago();
					$("#t"+id).tooltip('hide');
			},
			error: function(data2){
				console.log("Data is:"+data2);
				if(data2==404){
					$("#"+id).fadeOut(500);
				}
			}
		});
		}
		else{
		$.couch.db($db).openDoc(id,{
			success: function(obj){
				$("#all_notes").prepend("<tr id="+id+"><td class='span1'><img class='thumbnail' src='"+obj.gravatar_url+"'></img><td><a href='http://twitter.com/"+obj.uploaded_by+"' target='_BLANK'>"+obj.uploaded_by+"</a><p>"+obj.uploader_msg+"<br><span id='timeago' title='"+obj.created_at+"' class='date_time-block'></span></p></td></tr>").hide().fadeIn(500);
				$(".date_time-block").timeago();
			},
			error: function(data2){
				console.log("Data is:"+data2);
				if(data2==404){
					$("#"+id).fadeOut(500);
				}
			}
		});
	 }
	});
	
	$(".discuss_comments").live("click",function(){
		var id=$(this).attr("data-id");
		id=id.substring(2);
		$.couch.db($db).view("app/comments/",{
			success: function(data){
				for(var i=0;i<data.rows.length;i++){
					$("#comments_main").prepend("<tr id="+data.rows[i].id+"><td class='span1'><a href='http://twitter.com/"+data.rows[i].value.author+"' id='c"+id+"' rel='tooltip' data-original-title='by "+data.rows[i].value.author+"' target='_BLANK'><img class='thumbnail' src='"+data.rows[i].value.avatar+"'></img></a><td><a href='#'>"+data.rows[i].value.author+"</a><p>"+data.rows[i].value.comment+"<br></p></td></tr>");
				}
			},
			error: function(err){
				console.log(err);
			},
			key: id
		});
		$("#comments_main").html('').show();
		$("#comments_title").html("Comments for: blablablah...&nbsp;&nbsp;&nbsp;(<a href='#' id='toggle_comment_box'>Add Comment</a>)").hide().show();
		$("#comments_main").show();
	});
	
	$("#toggle_comment_box").live("click",function(){
		$("#my_comment_box").slideToggle(500);
	});
	
	$("#add_comment").live("click",function(){
		var did=$("#comment_on_id").val();
		console.log(did);
		$("#my_comment_box").slideUp(500);
	});
	
});
