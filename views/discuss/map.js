function(doc){
		if(doc.type=='discussion'){
			var d=new Date();
			var t=d-Date.parse(doc.date);
			emit(t,{"title": doc.title, "author": doc.author, "content": doc.content,"avatar": doc.author_pic, "created_at": doc.date});
		}
}
