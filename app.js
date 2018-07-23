var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var misc = require('./replace.js');


var demoData = {
    shopName: 'BD Shop',
    shopPhone: '01717000111',
    invoiceId: '12001',
    adjustedNote: 'This is test adjustment.',
    adjustedAmount: 120,
    total: 1500,
    parcel: [{
        id: 123,
        cash: 1200,
        charge: 50,
        amount: 1150
    }, {
        id: 125,
        cash: 500,
        charge: 50,
        amount: 450
    }],
    loan: [{
        id: 222,
        amount: 1200,
        charge: 50,
        total: 1150
    }, {
        id: 333,
        amount: 500,
        charge: 50,
        total: 450
    }]
};



function goToTemplateEngine(data, htmlUrl) {

    var htmlTemplate = fs.readFileSync(path.join(__dirname, htmlUrl), 'utf8');
    var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
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

    while (match = re.exec(htmlTemplate)) {
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
    goToTemplateEngine(demoData, './template.html')
    .then(function (html) {
        console.log(html);
    });
});