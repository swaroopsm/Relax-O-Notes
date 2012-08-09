function(doc){
	if(doc.type==='comment'){
		emit(doc.discussion,{"author":doc.author,"comment":doc.comment,"avatar":doc.author_pic});
	}
}
