'use strict';


fp = require('filepay');

var pk = ''


function send(){
    fp.send({
        safe: true,
        data: [Math.round(Date.now() / 1000).toString()],
        pay: {
            key: pk,
            feeb:0.7
        }
    });
}



setInterval(send,60000)