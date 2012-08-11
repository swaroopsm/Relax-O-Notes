function(doc){
	if(doc.type==='comment'){
		emit(doc._id,{"discuss_id": doc.discussion});
	}
}
