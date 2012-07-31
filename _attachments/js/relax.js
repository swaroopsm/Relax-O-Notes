$(document).ready(function(){
	$db="relax-o-notes";
	$url="http://localhost:5984/"+$db+"/_design/app/";
	$flag=0;
	
	var p=$("#page_name").attr("data-page");
	
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
		console.log(act_tags);
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
	
	if(p=="index.html"){
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
	
	$.couch.db($db).changes().onChange(function(data){
		var id=data.results[0].id;
		if(id=="_design/app"){
			
		}
		else{
		$.couch.db($db).openDoc(id,{
			success: function(obj){
				$("#all_notes").prepend("<tr id="+id+"><td class='span1'><img class='thumbnail' src='"+obj.gravatar_url+"'></img><td><a href='http://twitter.com/"+obj.uploaded_by+"' target='_BLANK'>"+obj.uploaded_by+"</a><p>"+obj.uploader_msg+"<br><span id='timeago' title='"+obj.created_at+"' class='date_time-block'></span></p></td></tr>").hide().fadeIn(500);
				$(".date_time-block").timeago();
			},
			error: function(data2){
				if(data2==404){
					$("#"+id).fadeOut(500);
				}
			}
		});
	 }
	});
	}
	
	$("#discuss_btn").click(function(){
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
			console.log("OKAY!!");
		}
		return false;
	});
});
