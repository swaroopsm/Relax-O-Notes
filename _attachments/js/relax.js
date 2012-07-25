$(document).ready(function(){
	$db="relax-o-notes";
	
	$("#upload_file_btn").live("click", function(){
		var doc={
			"uploaded_by": $("#uploaded_by").val(),
			"gravatar_url": "http://gravatar.com/avatar/"+md5($("#uploaded_by").val())
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
				var user=val.user.substring(0,val.user.indexOf("@"));
				$("#all_notes").append("<tr id="+data.rows[i].id+"><td class='span1'><img class='thumbnail' src='"+val.avatar+"'></img><td><a href='mailto:"+val.user+"'>"+user+"</a></tr>");
			}
			$("#all_notes").hide().fadeIn(500);
		},
		error: function(data){
			console.log(data);
		}
	});
	
	$.couch.db($db).changes().onChange(function(data){
		var id=data.results[0].id;
		$.couch.db($db).openDoc(id,{
			success: function(obj){
				$("#all_notes").first().append("<tr id="+id+"><td class='span1'><img class='thumbnail' src='"+obj.gravatar_url+"'></img><td><a href='mailto:"+obj.uploaded_by+"'>"+obj.uploaded_by+"</a></tr>").hide().fadeIn(500);
			},
			error: function(data2){
				if(data2==404){
					$("#"+id).fadeOut(500);
				}
			}
		});
	});
	
});
