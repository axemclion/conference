# The Conference

> A project by [Parashuram](http://nparashuram.com) ([github](http://github.com/axemclion), [twitter](http://twitter.com/axemclion), [blog](http://blog.nparashuram.com))

This [application](#home) is a helper website for developer conferences. The application shows schedules, sessions, speakers for conferences. 

Load the conference site _once_ before the conference. All data becomes available _offline_. Use the website even during the flaky internet connection at the conference, not only for viewing schedules, but also taking notes and rating the sessions. 

> ### [Visit the website](#home) or continue reading how it was built

## Features

* Conference Wifi is usually bad, don't depend on it. This website works offline too !! 
* Go green - no printing schedules on paper. View schedules on the site without needing a working internet connection at the conference. 
* Bookmark and plan sessions you want to attend. These are also available offline, and sync to a server when internet connection in the conference finally works !
* Take notes on your computer and sync them to a server, read them later. 
* Socialize with other participants, note down their details and see what sessions are getting interesting. 
* Responsive with Bootstrap - works on your computer, tablets of phone - take any of them to the conference with you


## Technology

* Uses IndexedDB for storing data (including images and optional attachments) offline.
* Automatically uses WebSQL when IndexedDB is not available (using the IndexedDB Shim)
* Appcache for caching the HTML, CSS and Javascript files
* Uses CouchDB to sync data remotely. 
* Easy to customize - built with bootstrap, supports theming. 

### Source Code
The source is on [github](http://github.com/axemclion/conference). Since couchDB does not support CORS yet, a simple cors-server is running on appfog.

### Libraries

* [Jquery](http://jquery.com), [Underscore](http://underscorejs.org/) and [Backbone](http://backbonejs.org/)
* [Bootstrap](http://twitter.github.com/bootstrap/) for styling
* [PouchDB](http://pouchdb.com/) for IndexedDB related stuff !! 
* [Pagedown](http://code.google.com/p/pagedown/) for displaying this page
* [Moment.js](http://momentjs.com/) for date manipulation
* [Grunt](http://gruntjs.com/) for building
* [IndexedDB Shim](http://nparashuram.com/IndexedDBShim) got make IndexedDB work where it does not !! 

## Using it for your conference

Clone the project, edit sessions.js and theme it to suit the look of your conference !! 
