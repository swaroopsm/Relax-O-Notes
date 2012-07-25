function(doc){
	if(doc.uploaded_by){
		emit(doc._id,{"user": doc.uploaded_by,"avatar": doc.gravatar_url,"uploader_msg": doc.uploader_msg,"created_at":doc.created_at,"tags":doc.tags});
	}
}
