'use strict';

const fs = require('fs');
const opentype = require('opentype.js');
const jsonfile = require('jsonfile');

const args = process.argv.slice(2);

if (args.length === 2) {
  let iconListsDir = args[0];
  const fontFile = args[1];

  iconListsDir = iconListsDir.replace(/\/$/, '');

  verifyFontFile(iconListsDir, fontFile, function(results) {
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      let msg = item.iconList + ':\n' +
        'total: ' + item.total + '\n';
      if (item.missing.length > 0) {
        msg += 'missing (' + missing.length + '): ';
        for (let j = 0; j < item.missing.length; j++) {
          msg += item.missing[j].unicode;
          if (j < item.missing.length - 1) {
            msg += ', ';
          }
        }
      } else {
        msg += 'missing: none';
      }
      msg += '\n**************************';
      console.log(msg);
    }
  });
} else {
  console.log('args: iconListsDir fontFile');
}

function verifyFontFile(iconListsDir, fontFilePath, callback) {
  opentype.load(fontFilePath, function(err, font) {
    if (err) {
      console.error('Font could not be loaded: ' + err);
    } else {
      const glyphs = font.glyphs.glyphs;
      const unicodesHex = {};

      for (let key in glyphs) {
        if (glyphs.hasOwnProperty(key)) {
          const glyph = glyphs[key];
          if (typeof glyph.unicode !== 'undefined') {
            unicodesHex[glyph.unicode.toString(16)] = true;
          }
        }        
      }

      const results = [];

      const iconLists = fs.readdirSync(iconListsDir);
      for (var i = 0; i < iconLists.length; i++) {
        const fileName = iconLists[i];
        const filePath = iconListsDir + '/' + fileName;
        const icons = jsonfile.readFileSync(filePath);
        
        const missing = [];

        for (let j = 0; j < icons.length; j++) {
          const icon = icons[j];
          if (unicodesHex[icon.unicode] !== true) {
            missing.push(icon);
          }
        }

        results.push({
          iconList: fileName,
          total: icons.length,
          missing: missing
        });
      }

      callback(results);
    }
  });
}
