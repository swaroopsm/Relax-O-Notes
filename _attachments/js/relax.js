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
	
});
