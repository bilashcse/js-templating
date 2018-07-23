function replaceKeysInHtml(view, obj) {
    return new Promise(function(resolve) {
        var pattern = new RegExp('{{.*' + Object.keys(obj).join('*.}}|{{.*') + '*.}}', 'gi');
        var html = view.replace(pattern, function(match) {
            return obj[match.replace(new RegExp('}}|{{', 'g'), '').trim()];
        });
        resolve(html);
    });
}

module.exports = {
    replaceKeysInHtml: replaceKeysInHtml
};