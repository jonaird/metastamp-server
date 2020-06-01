


var fp = require('filepay');
var Toychain = require('toychain')

var pk = ''
var xpriv =''

chain = new Toychain({xpriv})
var reset;
if(chain.count('utxo')==0){
    reset = true;
} else{
    reset=false;
}



function broadcast() {
    if (reset) {
        chain.reset()
        fp.build({
            safe: true,
            data: [Math.round(Date.now() / 1000).toString()],
            pay: {
                key: pk,
                feeb: 0.5
            }
        }, function (err, tx) {
            if (err) {
                console.log("error building transaction with filepay: ",err)
                process.exit()
            }
            reset = false
            fp.send({tx}, function(err, res){
                if(err){
                    console.log('error sending tx with filepay: ',err)
                    process.exit()
                }
            })
            chain.clone({tx})

        });
    } else{
        var result = chain.add({
            v:1,
            out: [{
                o0: "OP_0",
                o1: "OP_RETURN",
                s2: Math.round(Date.now() / 1000).toString()
              }],
            edge:{in:1,out:2}
        })
        if(result.error){
            console.log('error adding transaction: ',result.error)
            console.log('trying to merge utxos')
            result = chain.add({
                v:1,
                out: [{
                    o0: "OP_0",
                    o1: "OP_RETURN",
                    s2: Math.round(Date.now() / 1000).toString()
                  }],
                edge:{in:2,out:1}
            })
            if(result.error){
                console.log("merge failed: ", result.error)
                console.log('resetting the server')
                reset= true
                broadcast()
            } else{
                chain.push()
            }
        }else{
            chain.push()
        }
        

    }
}


broadcast()
setInterval(broadcast, 60000);