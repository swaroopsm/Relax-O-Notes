function(doc){
	if(doc.d_title){
		if(doc.d_date){
			var d=new Date();
			var t=d-Date.parse(doc.d_date);
			emit(t,{"title": doc.d_title, "author": doc.d_author, "message": doc.d_msg,"avatar": doc.author_pic,"comments": doc.d_comments, "created_at": doc.d_date});
		}
	}
}
