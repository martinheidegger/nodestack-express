'use strict';


var Type = require('js-yaml/lib/js-yaml/type'),
    marked = require('marked'),
    path = require('path'),
    fs = require('fs'),
    jsyaml = require('js-yaml');

module.exports = function (directory) {
    var importer;

    function importFile(state) {
        try {
            var file = path.resolve(directory, state.result),
                content;
            /*jslint stupid: true */
            if (fs.existsSync(file)) {
                content = fs.readFileSync(file).toString();
                /*jslint stupid: false */
                if (path.extname(file) === ".json") {
                    state.result = JSON.parse(content);
                } else if (path.extname(file) === ".md" || path.extname(file) === ".markdown") {
                    state.result = marked(content);
                } else if (path.extname(file) === ".yml" || path.extname(file) === ".yaml") {
                    state.result = jsyaml.load(content, {schema: importer.schema});
                } else {
                    state.result = content;
                }
            } else {
                state.result = "File not found: " + file;
            }
        } catch (e) {
            state.result = e.stack;
        }
        return true;
    }

    importer = new Type('tag:yaml.org,2002:import', {
        loadKind: 'scalar',
        loadResolver: importFile
    });

    return importer;
};