BMK_client
==========

# ATTENTION
BMKernel is still under development.
Code, Documentation and Tests can change without notice.

# Getting Started

## Requirements
- [ExtJS 4.2.1](http://www.sencha.com/products/extjs/download/)
- [Font awesome 3.2.1](http://fontawesome.io/3.2.1/)
- [BMKernel server](https://github.com/WitteStier/BMK_server) (optional)

## Installation
Run:

    $ cd ~/<path-to-your-project>
    $ git clone --recursive https://github.com/WitteStier/BMK_client.git ./public

Unpack ExtJs and Font awesome and move both packages to  
`~/<path-to-your-project>/public/libs/ext/`  
and  
`~/<path-to-your-project>/public/libs/font-awesome/`

---

BMKernel client come with a Grunt build task.  
this build task will

- Validate the source code files using [JSHint](http://www.jshint.com/).
- Test the source code files using [Jasmine](pivotal.github.io/jasmine/).
- Generate a code coverage report, this report show's how many code is tested.
- Generate a code complexity report, this report show's the code
  maintainability, number of code lines, estimated errors and JSLint errors.
- Concatenates & minifies the source code files. This results into one javascript
  file that contains all used ExtJs classes, BMKernel client and all model's,
  store's, view's and controllers.

# Run build task

## Requirements
- [Node.js](http://nodejs.org/)
- [Grunt](http://gruntjs.com/)

Run:

    $ cd ~/<path-to-your-project>/public/
    $ npm install 
    $ grunt

The build result will be stored in `~/<path-to-your-http-www-root>/<project-name>/build`