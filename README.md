## Relax-O-Notes

		Relax-O-Notes is a CouchApp.
				
		It supports only posting of tweets that gets updated in real-time.
		Also a discussion group with real-time update of comments
		
### Minimal Setup
    
		Create a file called apikey.js in the js/ directory.
		Copy, paste the following code inside this file:
		
> var api_key='YOUR-API-KEY';
> document.writeln("<script src='http://platform.twitter.com/anywhere.js?id="+api_key+"&v=1'></script>");
		
		Make sure, you change the variable api_key to your twitter applications' Consumer Key.
