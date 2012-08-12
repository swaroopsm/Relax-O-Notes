## Relax-O-Notes

		Relax-O-Notes is a CouchApp.
		
		Functions:		
		Support of tweets.
		A discussion group with real-time comments system.
		Sharing of files.
		
### Minimal Setup
    
		Create a file called apikey.js in the js/ directory.
		Copy, paste the following code inside this file:
		
`var api_key='YOUR-API-KEY';`
`document.writeln("<script src='http://platform.twitter.com/anywhere.js?id="+api_key+"&v=1'></script>");`
		
		Make sure, you change the variable api_key to your twitter applications' Consumer Key.
