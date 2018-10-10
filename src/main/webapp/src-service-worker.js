// Create Workbox service worker instance
workbox.skipWaiting();
workbox.clientsClaim();

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precacheAndRoute(self.__precacheManifest);


self.addEventListener('message', function(event){
    var model = JSON.parse(event.data);
    switch(model.state) {
        case 'start':
            startTimer();
            break;
        case 'reset':
            resetTimer();
            break;
    }
});


function sendMessageToClient(client, msg){
    return new Promise(function(resolve, reject){
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage(msg, [msg_chan.port2]);
    });
}

function sendMessageToAllClients(msg){
    clients.matchAll().then(clients => {
        clients.forEach(client => {
        sendMessageToClient(client, msg);
        });
    });
}

function startTimer(){
    var counter = 100;
    var autolockCountDown = setInterval(() => {

    var autolockModelCount = {
        "state": "countdown",
        "data": counter
    };
    var dataCount = JSON.stringify(autolockModelCount);
    sendMessageToAllClients(dataCount);
    if (counter === 0) {
        var autolockModel = {
            "state": "logout"
        };
        var data = JSON.stringify(autolockModel);
        sendMessageToAllClients(data);
        clearInterval(autolockCountDown);
    }
    counter--;
}, 1000);
}

function resetTimer(){
    for (var i = 0; i < 100; i++) {
        clearInterval(i);
    }
    startTimer();
}
