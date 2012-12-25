# Conference

An application to fight the flaky internet connections at conferences. 

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