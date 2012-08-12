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
					$("#all_discussions").append("<tr id="+data.rows[i].id+"><td class='span1'><a href='http://twitter.com/"+val.author+"' id='t"+data.rows[i].id+"' rel='tooltip' data-original-title='by "+val.author+"' target='_BLANK'><img class='thumbnail' src='"+val.avatar+"'></img></a><td><a href='#"+data.rows[i].id+"' data-scroll='' class='discuss_main_title'>"+val.title+"</a><p>"+val.content+"<br><span id='' title='"+val.created_at+"' class='date_time-block'></span><a  href='#comments_modal' data-discuss_title='"+data.rows[i].value.title+"' data-id='#t"+data.rows[i].id+"' class='discuss_comments' data-toggle='modal' style='display:block;color: #08c;margin-top: -8px;'>View Comments</a></p></td></tr>");
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
				$("#all_discussions").prepend("<tr id="+id+"><td class='span1'><a href='http://twitter.com/"+obj.author+"' id='t"+id+"' rel='tooltip' data-original-title='by "+obj.author+"' target='_BLANK'><img class='thumbnail' src='"+obj.author_pic+"'></img></a><td><a href='#"+id+"' data-scroll='' class='discuss_main_title'>"+obj.title+"</a><p>"+obj.content+"<br><span id='' title='"+obj.date+"' class='date_time-block'></span><a  href='#comments_modal' data-discuss_title='"+obj.title+"' data-id='#t"+data.id+"'  class='discuss_comments' data-toggle='modal' style='display:block;color: #08c;margin-top: -8px;'>View Comments</a></p></td></tr>");
					$(".date_time-block").timeago();
					$("#t"+id).tooltip('hide');
			},
			error: function(data2){
				if(data2==404){
					$("#"+id).fadeOut(500);
				}
			}
		});
		}
		else if(sub=="comment"){
			var change_id;
			$.couch.db($db).openDoc(id,{
				success: function(data){
					$("#comments_main").prepend("<tr id="+data.id+"><td class='span1'><a href='http://twitter.com/"+data.author+"' id='c"+id+"' rel='tooltip' data-original-title='by "+data.author+"' target='_BLANK'><img class='thumbnail' src='"+data.author_pic+"'></img></a><td><a href='#'>"+data.author+"</a><p>"+data.comment+"<br><span id='timeago' title='"+data.date+"' class='date_time-block'></span></p></td></tr>");
					$(".date_time-block").timeago();
					$.couch.db($db).view("app/get_discussid",{
						success: function(data2){
							$("#notify").prepend("<span class='alert fade in' data-dismiss='alert'><a class='discuss_main_title' data-scroll='my_"+id+"' href='#"+data2.rows[0].value.discuss_id+"'>New Comment</a></span><br><br><br>").hide().fadeIn(500);
						},
						error: function(err2){
							console.log(err2);
						},
						key: id
					});
				},
				error: function(err){
					console.log(err);
				}
			});
		}
		else if(sub="up_file"){
			$.couch.db($db).openDoc(id,{
				success: function(data){
					var abc=data._rev.split('-');
					if(abc[0]>1){
						var val,filename;
						console.log(data);
					val=data;
					for(var j in val._attachments){
						filename=j;
					}
					$("#all_files").prepend("<tr id="+data._id+"><td class='span1'><a href='http://twitter.com/"+val.author+"' id='t"+data._id+"' rel='tooltip' data-original-title='by "+val.author+"' target='_BLANK'><img class='thumbnail' src='"+val.author_pic+"'></img></a><td><a href='#"+data._id+"' data-scroll='' class='files_main_title'>"+val.title+"</a><p>"+val.description+"<br><span id='' title='"+val.date+"' class='date_time-block'></span><a href='/"+$db+"/"+data._id+"/"+filename+"' target='_BLANK' title='"+filename+"' style='display:block;color: #08c;margin-top: -8px;'> <i class='icon-download-alt'></i> Download</a></p></td></tr>");
					$(".date_time-block").timeago();
					$("#t"+data._id).tooltip('hide');
				$("#all_files").hide().fadeIn(500);
					}
				},
				error: function(err){
					console.log(err);
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
		var discuss_title=$(this).attr("data-discuss_title");
		id=id.substring(2);
		$("#comment_on_id").val(id);
		$.couch.db($db).view("app/comments/",{
			success: function(data){
				for(var i=0;i<data.rows.length;i++){
					$("#comments_main").prepend("<tr id="+data.rows[i].id+"><td class='span1'><a href='http://twitter.com/"+data.rows[i].value.author+"' id='c"+id+"' rel='tooltip' data-original-title='by "+data.rows[i].value.author+"' target='_BLANK'><img class='thumbnail' src='"+data.rows[i].value.avatar+"'></img></a><td><a href='#'>"+data.rows[i].value.author+"</a><p>"+data.rows[i].value.comment+"<br><span id='timeago' title='"+data.rows[i].value.created_at+"' class='date_time-block'></span></p></td></tr>");
					$(".date_time-block").timeago();
				}
				$("#comments_main").append("<span><br><a href='#"+id+"' data-scroll='' class='discuss_main_title'><button class='btn btn-danger' style='width: 70px;'>More &raquo;</button></a></span>");
			},
			error: function(err){
				console.log(err);
			},
			key: id,
			limit: 4
		});
		$("#comments_main").html('').show();
		$("#comments_title").html("Comments for: "+discuss_title+"&nbsp;&nbsp;&nbsp;(<a href='#' id='toggle_comment_box'>Add Comment</a>)").hide().show();
		$("#comments_main").show();
	});
	
	$("#toggle_comment_box").live("click",function(){
		$("#my_comment_box").slideToggle(500);
	});
	
	$("#add_comment").live("click",function(){
		var did=$("#comment_on_id").val();
		var d=new Date();
		d=d.toISOString();
		var uid=$.couch.newUUID();
		uid="comment_"+uid;
		var doc={
			"_id": uid,
			"type": "comment",
			"author": $("#comment_by").val(),
			"author_pic": "http://api.twitter.com/1/users/profile_image/"+$("#comment_by").val(),
			"comment": $("#comment_msg").val(),
			"date": d,
			"discussion": did
		}
		$.couch.db($db).saveDoc(doc,{
			success: function(data){
				console.log(data);
			},
			error: function(err){
				console.log(err);
			}
		});
		$("#my_comment_box").slideUp(500);
	});
	
	$(".discuss_main_title").live("click",function(){
		var id=$(this).attr('href');
		id=id.substring(1);
		var com_id=$(this).attr('data-scroll');
		$("#comments_modal").modal('hide');
		get_all_comments(id,com_id);
		return false;
	});
	
	function get_all_comments(id,com_id){
		$.couch.db($db).view("app/single_discuss",{
			success: function(data){
				$("#toggle-main").html("<table class='table'><tr id="+data.rows[0].id+"><td class='span1'><a href='http://twitter.com/"+data.rows[0].value.author+"' id='t"+data.rows[0].id+"' rel='tooltip' data-original-title='by "+data.rows[0].value.author+"' target='_BLANK'><img class='thumbnail' src='"+data.rows[0].value.avatar+"'></img></a><td><a href='#' class='discuss_main_title'>"+data.rows[0].value.title+"</a><p>"+data.rows[0].value.content+"<br><span id='' title='"+data.rows[0].value.created_at+"' class='date_time-block'></span></p></td></tr></table>");
				$(".date_time-block").timeago();
				$("#t"+data.rows[0].id).tooltip('hide');
				$.couch.db($db).view("app/comments",{
					success: function(data2){
						$("#comments_header").html('<h4>Comments('+data2.rows.length+'): </h4>');
						for(var i=0;i<data2.rows.length;i++){
					$("#my_comments").append("<table class='table' id='my_"+data2.rows[i].id+"'><tr id="+data2.rows[i].id+"><td class='span1'><a href='http://twitter.com/"+data2.rows[i].value.author+"' id='c"+id+"' rel='tooltip' data-original-title='by "+data2.rows[i].value.author+"' target='_BLANK'><img class='thumbnail' src='"+data2.rows[i].value.avatar+"'></img></a><td><a href='http://twitter.com/"+data2.rows[i].value.author+"' target='_BLANK'>"+data2.rows[i].value.author+"</a><p>"+data2.rows[i].value.comment+"<br><span id='timeago' title='"+data2.rows[i].value.created_at+"' class='date_time-block'></span></p></td></tr></table>");
					$(".date_time-block").timeago();
				}
				if(com_id!=''){
					$('html, body').animate({ scrollTop: $("#"+com_id).offset().top -60 }, 'slow');
					$("#"+com_id).css("background","#FCF8E3");
				}
					},
					error: function(err2){
						console.log(err);
					},
					key: id
				});
				$("#toggle-main").hide().fadeIn(500);
				$("#comments_header").hide().fadeIn(500);
				$("#all_comments").hide().fadeIn(500);
			},
			error: function(err){
				console.log(err);
			},
			key: id
		});
	}
	
	$("#upload_next_btn").live("click",function(){
		var fauthor=$.trim($("#file_author").val());
		var ftitle=$.trim($("#file_title").val());
		var fdesc=$.trim($("#file_description").val());
		if(fauthor=='' || ftitle=='' || fdesc==''){
			if(fauthor==''){
				$("#file_author").focus();
			}
			else if(ftitle==''){
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
			"author": fauthor,
			"title": ftitle,
			"description": fdesc,
			"type": "file",
			"author_pic": "http://api.twitter.com/1/users/profile_image/"+fauthor,
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
    	$("#uploadModal").modal('toggle');
    	$("#second_upload_body").hide();
    	$("#file_author").val('');
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
	
	if(p=='files.html'){
		$.couch.db($db).view("app/files",{
			success: function(data){
				$("#all_files").html('');
				var val,filename;
				for(var i=0;i<data.total_rows;i++){
					val=data.rows[i].value;
					for(var j in val.file){
						filename=j;
					}
					$("#all_files").append("<tr id="+data.rows[i].id+"><td class='span1'><a href='http://twitter.com/"+val.author+"' id='t"+data.rows[i].id+"' rel='tooltip' data-original-title='by "+val.author+"' target='_BLANK'><img class='thumbnail' src='"+val.avatar+"'></img></a><td><a href='#"+data.rows[i].id+"' data-scroll='' class='files_main_title'>"+val.title+"</a><p>"+val.description+"<br><span id='' title='"+val.created_at+"' class='date_time-block'></span><a href='/"+$db+"/"+data.rows[i].id+"/"+filename+"' target='_BLANK' title='"+filename+"' style='display:block;color: #08c;margin-top: -8px;'> <i class='icon-download-alt'></i> Download</a></p></td></tr>");
					$(".date_time-block").timeago();
					$("#t"+data.rows[i].id).tooltip('hide');
				}
				$("#all_files").hide().fadeIn(500);
			},
			error: function(err){
				console.log(err);
			}
		})
	}
	
});
