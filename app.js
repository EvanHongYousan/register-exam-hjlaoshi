/**
 * Created by yantianyu on 2016/3/1.
 */

var express = require('express');

var app = express();

var port = process.env.PORT || 3002;

app.use(express.static(__dirname+'/app'));

app.all('/*', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname+'/app'
    });
});
app.listen(port);
console.log('server on port ' + port);