// Create Workbox service worker instance
workbox.skipWaiting();
workbox.clientsClaim();

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precacheAndRoute(self.__precacheManifest);



self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
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


function send_message_to_client(client, msg){
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

function send_message_to_all_clients(msg){
    console.log('Call all client');
    clients.matchAll().then(clients => {
        clients.forEach(client => {
        send_message_to_client(client, msg).then(m => console.log("SW Received Message: "+m));
});
});
}

function startTimer(){
    console.log('Timer start in service worker');
    var counter = 10;
    var autolockCountDown = setInterval(() => {
        console.log(counter);
    counter--;
    var autolockModelCount = {
        "state": "countdown",
        "data": counter
    };
    var dataCount = JSON.stringify(autolockModelCount);
    send_message_to_all_clients(dataCount);
    if (counter === 0) {
        console.log("Logout");
        var autolockModel = {
            "state": "logout"
        };
        var data = JSON.stringify(autolockModel);
        send_message_to_all_clients(data);
        clearInterval(autolockCountDown);
    }
}, 1000);
}

function resetTimer(){
    for (var i = 0; i < 100; i++) {
        console.log('clear : ' + i);
        clearInterval(i);
    }
    startTimer();
}
