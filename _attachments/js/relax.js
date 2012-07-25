$(document).ready(function(){
	$db="relax-o-notes";
	
	$("#upload_file_btn").live("click", function(){
		console.log("http://api.twitter.com/1/users/profile_image/"+$("#uploaded_by").val());
		var d=new Date();
		d=d.toLocaleString();
		var doc={
			"uploaded_by": $("#uploaded_by").val(),
			"gravatar_url": "http://api.twitter.com/1/users/profile_image/"+$("#uploaded_by").val(),
			"uploader_msg": $("#upload_message").val(),
			"created_at": d
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
				$("#all_notes").append("<tr id="+data.rows[i].id+"><td class='span1'><img class='thumbnail' src='"+val.avatar+"'></img><td><a href='http://twitter.com/"+val.user+"' target='_BLANK'>"+val.user+"</a><p>"+val.uploader_msg+"</p></td></tr>");
			}
			$("#all_notes").hide().fadeIn(500);
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
				$("#all_notes").first().append("<tr id="+id+"><td class='span1'><img class='thumbnail' src='"+obj.gravatar_url+"'></img><td><a href='http://twitter.com/"+obj.uploaded_by+"' target='_BLANK'>"+obj.uploaded_by+"</a><p>"+obj.uploader_msg+"</p></td></tr>").hide().fadeIn(500);
			},
			error: function(data2){
				if(data2==404){
					$("#"+id).fadeOut(500);
				}
			}
		});
	 }
	});
	
});
