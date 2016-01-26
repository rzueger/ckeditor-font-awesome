'use strict';

const path = require('path');
const iconList = require('../icons/icons-4.5.json');
const IconPicker = require('./IconPicker.js');

module.exports = function(editor) {

  var picker = new IconPicker({
    iconList: iconList,
    selected: iconList[0].id,
    onDblClick: function() {
      CKEDITOR.dialog.getCurrent().click('ok');
    },
    onTabBack: function(e) {
      e.originalEvent.cancel();
      CKEDITOR.dialog.getCurrent().getContentElement('tab-icon', 'search').focus();
    }
  });

  return {
    title: 'Font Awesome',
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: 'tab-icon',
        label: 'Icon',
        elements: [
          {
             type: 'text',
             id: 'search',
             label: 'Search',
             onKeyUp: function(e) {
               picker.filter(e.sender.$.value);
             },
             onKeyDown: function(e) {
               var keyIdentifier = e.data.$.keyIdentifier.toLowerCase();
               if (['up', 'down', 'left', 'right'].indexOf(keyIdentifier) > -1) {
                 picker.selectNext(keyIdentifier);
                 e.data.$.returnValue = false;
               }
             }
           },
           {
             type: 'html',
             className: 'icon-picker',
             html: '<div></div>',
             onLoad: function() {
               CKEDITOR.document.getById(this.domId).append(picker.getDom());
             },
             setup: function(widget) {
               picker.resetFilter();
               picker.select(widget.data.id);
             },
             commit: function(widget) {
               widget.setData('id', picker.getSelected().id);
             }
           }
         ]
       },
       {
         id: 'advanced-settings',
         label: 'Advanced settings',
         elements: [
           {
             type: 'select',
             label: 'Size',
             items: [
               [ 'Normal', 'normal' ],
               [ 'Increase 33%', 'lg' ],
               [ '2x', '2x' ], 
               [ '3x', '3x' ],
               [ '4x', '4x' ],
               [ '5x', '5x' ]
             ],
             'default': 'normal',
             setup: function(widget) {
               if (widget.data.size) {
                 this.setValue(widget.data.size);
               }
             },
             commit: function(widget) {
               widget.setData('size', this.getValue());
             }
           },
         ]
       }
     ]
   };
};

