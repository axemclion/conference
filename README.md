# Conference

An application to fight the flaky internet connections at conferences. More information at the [blog post](http://blog.nparashuram.com/2013/01/a-website-for-dev-conferences-pouchdb.html) or this [demo video](https://www.youtube.com/embed/4eFPTnMbMDM?list=UU6J8UILu9omULlPQqXvL0Dw)

<iframe width="640" height="360" src="https://www.youtube.com/embed/4eFPTnMbMDM?list=UU6J8UILu9omULlPQqXvL0Dw" frameborder="0" allowfullscreen></iframe>

## Building

The application is a set of static HTML, Javascript and Less files. `Grunt` compiles, converts, concats and makes them available in a servable format. 

### Requirements

* Install [Nodejs](http://nodejs.com)
* Install [Grunt](http://gruntjs.com) 
* A running instance [CouchDB](http://iriscouch.com) 

### Development

Run `npm install` to install all the dependencies required for building the project. Then run `grunt dev` to copy relevant files, start the development server and CORS server. 

### Deployment

This application is currently deployed on github pages. Simply copy the `dist` folder and host it on any web server. 
