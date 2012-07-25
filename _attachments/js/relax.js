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
				console.log(data);
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
				$("#all_notes").append("<span class='span10 well'><img class='thumbnail' src='"+val.avatar+"'></img>&nbsp;&nbsp;<a href='mailto:"+val.user+"'>"+user+"</a><span>");
			}
			$("#all_notes").hide().fadeIn(500);
		},
		error: function(data){
			console.log(data);
		}
	});
	
});
