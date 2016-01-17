'use strict';

require('file?name=[path][name].[ext]!./Font-Awesome/fonts/fontawesome-webfont.eot');
require('file?name=[path][name].[ext]!./Font-Awesome/fonts/fontawesome-webfont.svg');
require('file?name=[path][name].[ext]!./Font-Awesome/fonts/fontawesome-webfont.ttf');
require('file?name=[path][name].[ext]!./Font-Awesome/fonts/fontawesome-webfont.woff');
require('file?name=[path][name].[ext]!./Font-Awesome/fonts/fontawesome-webfont.woff2');
require('file?name=[path][name].[ext]!./Font-Awesome/fonts/FontAwesome.otf');

require('file?name=[path][name].[ext]!./Font-Awesome/css/font-awesome.min.css');

require('file?name=[path][name].[ext]!./icons/font-awesome.png');

var plugin = require('./lib/plugin.js');

CKEDITOR.plugins.add('font-awesome', plugin);

