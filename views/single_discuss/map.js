function(doc){
	if(doc.type==='discussion'){
		emit(doc._id,{"author":doc.author, "avatar":doc.author_pic, "content":doc.content, "created_at":doc.date, "title":doc.title});
	}
}
