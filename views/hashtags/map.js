function(doc){
		if(doc.tags){
			emit(null,doc.tags);
		}
}
