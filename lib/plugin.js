'use strict';

require('./style.scss');

var iconList = require('./icons/icons-4.5.json');
var fontAwesomeDialog = require('./dialogs/font-awesome.js');

var sizeClasses = ['fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x'];

module.exports = {
  requires: 'widget',
  icons: 'font-awesome',
  init: function(editor) {
    var fontAwesomeCssPath = CKEDITOR.plugins.getPath('font-awesome') + 'Font-Awesome/css/font-awesome.min.css';
    CKEDITOR.document.appendStyleSheet(fontAwesomeCssPath);
    CKEDITOR.config.contentsCss = fontAwesomeCssPath;

    CKEDITOR.dialog.add('font-awesome-dialog', fontAwesomeDialog);

    CKEDITOR.dtd.$removeEmpty['span'] = false;

    editor.widgets.add('font-awesome', {
      button: 'Insert Font Awesome icon',

      template: '<span class="fa"></span>',

      allowedContent: 'span(!fa,*){style}',

      dialog: 'font-awesome-dialog',

      upcast: function(element) {
        return element.hasClass('fa');
      },

      init: function() {
        this._initId(this.element);
        this._initSize(this.element);
      },

      data: function() {
        if (this.data.id) {
          this._setIconClass(this.element, this.data);
          this._setSizeClass(this.element, this.data);
        }
      },

      _initId: function(element) {
        var classes = this._getClassNames(element);
        for (var i = 0; i < classes.length; i++) {
          if (classes[i].startsWith('fa-')) {
            var potentialId = classes[i].substring(3);
            var icon = iconList.find(function(icon) {
              return icon.id === potentialId;
            });
            if (icon) {
              this.setData('id', icon.id);
              return;
            }
          }
        }
      },

      _initSize: function(element) {
         var classes = this._getClassNames(element);
         for (var i = 0; i < classes.length; i++) {
           var cls = classes[i];
           if (sizeClasses.indexOf(cls) > -1) {
             var size = cls.substring(3);
             this.setData('size', size);
             return;
           }
         }
      },

      _getClassNames: function(element) {
        var className = this.element.$.className;
        return className.split(' ');
      },

      _setIconClass: function(element, data) {
        iconList.forEach(function(icon) {
          element.removeClass('fa-' + icon.id);
        });
        element.addClass('fa-' + this.data.id);
      },

      _setSizeClass: function(element, data) {
        sizeClasses.forEach(function(cls) {
          this.element.removeClass(cls);
        }, this);
        if (this.data.size && this.data.size !== 'normal') {
          var sizeClass = 'fa-' + this.data.size;
          this.element.addClass(sizeClass);
        }
      }
    });
  }
}

