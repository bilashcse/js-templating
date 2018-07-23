var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var misc = require('./replace.js');


function goToTemplateEngine(data, htmlUrl) {

    var htmlTemplate = fs.readFileSync(path.join(__dirname, htmlUrl), 'utf8');
    var reg = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    var match, arrValues = [],
        templateMap = {};

    for (var key in data) {
        if ((typeof data[key]) == 'object') {
            arrValues.push({
                key: key,
                values: data[key]
            });
        }
    }

    while (match = reg.exec(htmlTemplate)) {
        var templateName = (((/({{.*}})/).exec(match[1]))[0].replace(/{{|}}/g, '')).split(".")[0];
        templateMap[templateName] = match[1];

    }

    arrValues.forEach(function (val) {
        var tempHtml = templateMap[val.key].trim();
        val.values.forEach(function (data) {
            for (var key in data) {
                tempHtml = tempHtml.replace('{{' + val.key + '.' + key + '}}', data[key]);
            }
        });

        data[val.key] = tempHtml;
    });



    return misc.replaceKeysInHtml(htmlTemplate, data);
}



app.listen('3000', function () {
    console.log("Server running . .");
    goToTemplateEngine(data, './template.html')
    .then(function (html) {
        console.log(html);
    });
});