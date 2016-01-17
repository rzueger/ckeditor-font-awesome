'use strict';

require('./style.scss');

var fontAwesomeDialog = require('./dialogs/font-awesome.js');

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

      allowedContent: 'span(!fa){style}',

      dialog: 'font-awesome-dialog',

      upcast: function(element) {
        return element.hasClass('fa');
      },

      init: function() {
        var className = this.element.$.className;
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
          if (classes[i].startsWith('fa-')) {
            var id = classes[i].substring(3);
            this.setData('id', id);
          }
        }
      },

      data: function() {
        if (this.data.id) {
          var iconClass = this.element.$.className.split(' ').find(function(cls) {
            return cls.startsWith('fa-');
          });
          if (iconClass) {
            this.element.removeClass(iconClass);
          }
          this.element.addClass('fa-' + this.data.id);
        }
      }
    });
  }
}

