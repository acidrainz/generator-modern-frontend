'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });

  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay("I've heard you need a flexible project setup, right?"));

    var prompts = [{
      type: 'list',
      name: 'cssPreprocessor',
      message: 'Which CSS preprocessor would you like to use?',
      choices: [{
        name: 'Stylus',
        value: 'stylus',
        checked: true
      }, {
        name: 'Sass',
        value: 'sass'
      }, {
        name: 'Less',
        value: 'less'
      }, {
        name: 'None (plain css)',
        value: 'none'
      }]
    }, {
      type: 'list',
      name: 'htmlTemplateExtension',
      message: 'Which HTML template engine would you like to use?',
      choices: [{
        name: 'None (plain html)',
        value: 'html',
        checked: true
      }, {
        name: 'Handlebars',
        value: 'hbs'
      }, {
        name: 'Twig',
        value: 'twig'
      }
      // , {
      //    name: '',
      //    value: 'none'
      //  }
      ]

    }];

    this.prompt(prompts, function (props) {
      this.cssPreprocessor = props.cssPreprocessor;
      this.htmlTemplateExtension = props.htmlTemplateExtension;

      var cssExtensions = {
        "none": ".css",
        "stylus": ".styl",
        "sass": ".scss",
        "less": ".less"
      };
      this.cssExtension = cssExtensions[this.cssPreprocessor];

      done();
    }.bind(this));

  },

  writing: {
    app: function () {
      this.mkdir('app');
      this.mkdir('app/js');
      this.mkdir('app/css');
      this.mkdir('app/images');
      this.mkdir('app/fonts');
      this.copy('main.js', 'app/js/main.js');

      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );

      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html')
      );

      this.fs.copy(
        this.templatePath('main' + this.cssExtension),
        this.destinationPath('app/css/main' + this.cssExtension)
      );

      this.fs.copy(
        this.templatePath('favicon.ico'),
        this.destinationPath('favicon.ico')
      );
    },

    sprites: function() {
      this.mkdir('app/css/sprites');
      this.mkdir('app/images/sprites');

      this.fs.copy(
        this.templatePath('emptyfile'),
        this.destinationPath('app/css/sprites/index' + this.cssExtension)
      );

      this.fs.copy(
        this.templatePath('emptyfile'),
        this.destinationPath('app/images/sprites/.gitkeep')
      );
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    gulpfile: function () {
      this.template('gulpfile.js', 'gulpfile.js');
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
