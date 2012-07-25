function(doc){
	if(doc.uploaded_by){
		emit(doc._id,{"user": doc.uploaded_by,"avatar": doc.gravatar_url});
	}
}
