function(doc){
 if(doc.type==='file'){
		var d=new Date();
		var t=d-Date.parse(doc.date);
		emit(t,{"title": doc.title, "author": doc.author, "description": doc.description,"avatar": doc.author_pic, "created_at": doc.date,"file": doc._attachments});
	}
}
