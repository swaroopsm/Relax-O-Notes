function(doc){
		if(doc.created_at){
			var d=new Date();
			var t=d-Date.parse(doc.created_at);
			emit(t,{"user": doc.uploaded_by,"avatar": doc.gravatar_url,"uploader_msg": doc.uploader_msg,"created_at":doc.created_at,"tags":doc.tags});
		}
}
