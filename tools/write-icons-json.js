var yaml = require('js-yaml');
var fs = require('fs');
var jsonfile = require('jsonfile');
var mkdirp = require('mkdirp');

var args = process.argv.slice(2);

if (args.length === 3) {
  var yamlInputFile = args[0];
  var outputDir = args[1];
  var outputPrefix = args[2];

  outputDir = outputDir.replace(/\/$/, '');

  splitToJson(yamlInputFile, outputDir, outputPrefix);
} else {
  console.log('args: yamlInputFile outputDir outputPrefix');
}

function splitToJson(yamlInputFile, outputDir, outputPrefix) {
  var doc = yaml.safeLoad(fs.readFileSync(yamlInputFile, 'utf8'));
  var icons = doc.icons;

  var byVersion = {};

  for (var i = 0; i < icons.length; i++) {
    byVersion[icons[i].created] = [];
  }

  for (var i = 0; i < icons.length; i++) {
    var icon = icons[i];
    for (var version in byVersion) {
      if (byVersion.hasOwnProperty(version)) {
        if (icon.created <= version) {
          byVersion[version].push(icon);
        }
      }
    }
  }
 
  mkdirp(outputDir, function(err) {
    if (!err) {
      for (var version in byVersion) {
        if (byVersion.hasOwnProperty(version)) {
          var filePath = outputDir + '/' + outputPrefix + '-' + version + '.json';
          jsonfile.writeFile(filePath, byVersion[version], function(err) {
            if (err) {
              console.error(err);
            }
          });
        }
      }
    }
  });
}

