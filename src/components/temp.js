var AGORA_API_KEY = '4f1b6ead372f4e75bb25ba4ffa5d5beb';
var channelName = '';

/**
 * @name handleFail
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function(err){
    console.log("Error : ", err);
};

async function getChannel() {
    console.log("getting into get channel ");
    await axios.get("/getChannel")
        .then((res) => {
            channelName = res.data.channelName;
            console.log("res is ", res);
            console.log("channel name is ", channelName);
        })
        .catch(handleFail);
}

getChannel();


// Queries the container in which the remote feeds belong
let remoteContainer= document.getElementById("remote-container");
let canvasContainer= document.getElementById("canvas-container");

/**
 * @name addVideoStream
 * @param streamId
 * @description Helper function to add the video stream to "remote-container"
 */
function addVideoStream(streamId){
    // Create a new div for every stream
    let streamDiv=document.createElement("div");

    // Assigning id to div
    streamDiv.id=streamId;

    // Takes care of lateral inversion (mirror image)
    streamDiv.style.transform="rotateY(180deg)";

    // Add new div to container
    remoteContainer.appendChild(streamDiv);
}
/**
 * @name removeVideoStream
 * @param evt - Remove event
 * @description Helper function to remove the video stream from "remote-container"
 */
function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv=document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
    console.log("Remote stream is removed " + stream.getId());
}

function addCanvas(streamId){
    let canvas=document.createElement("canvas");
    canvas.id='canvas'+streamId;
    canvasContainer.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    let video=document.getElementById(`video${streamId}`);

    video.addEventListener('loadedmetadata', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });

    video.addEventListener('play', function() {
        var $this = this; //cache
        (function loop() {
            if (!$this.paused && !$this.ended) {
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000 / 30); // drawing at 30fps
            }
        })();
    }, 0);
}

// Client Setup
// Defines a client for RTC
let client = AgoraRTC.createClient({
    mode: 'live',
    codec: "h264"
});

// Client Setup
// Defines a client for Real Time Communication
client.init(AGORA_API_KEY,() =>
    console.log("AgoraRTC client initialized") ,handleFail);

// The client joins the channel
client.join(null, channelName, null, (uid)=>{

    // Stream object associated with your web cam is initialized
    let localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false
    });

    // Associates the stream to the client
    localStream.init(function() {

        //Plays the localVideo
        localStream.play('me');
        //Publishes the stream to the channel
        client.publish(localStream, handleFail);
    },handleFail);
},handleFail);
//When a stream is added to a channel
client.on('stream-added', function (evt) {
    client.subscribe(evt.stream, handleFail);
});


//When you subscribe to a stream
client.on('stream-subscribed', function (evt) {
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
    // addCanvas(stream.getId());
});

client.on('stream-subscribed', function(value){

    // let audioID = document.getElementById('audio_stats');
    console.log('Stream subscribed');
    var bar = function(value){
        console.log('this should work!');
        console.log(value);
    }
    var foo = client.getRemoteAudioStats(bar);


    setInterval(foo, 5000);

});

// Quality Transparency
client.on('stream-published', function(val){
    client.getSystemStats((stats) => {
        console.log("Battery level : " + stats.BatteryLevel);
    });
    setInterval(() => {
        client.getLocalVideoStats(stats => {
            console.log('Local Video Stats:\n');
            console.log(stats);
            console.log('Ending the video stats');
        });

        client.getLocalAudioStats(stats => {
            console.log('Local Audio Stats:\n');
            console.log(stats);
            console.log('Ending the audio stats');
        });

        console.log("recalling");
    }, 3000);

});

// Triggers the "volume-indicator" callback event every two seconds.
client.enableAudioVolumeIndicator();
client.on("volume-indicator", function(evt){
    evt.attr.forEach(function(volume, index){
        console.log('volume is ');
        console.log(volume);
        console.log('index is');
        console.log(index);
        // console.log(#{index} UID ${volume.uid} Level ${volume.level});
    });
});

//When a person is removed from the stream
client.on('stream-removed',removeVideoStream);
client.on('peer-leave',removeVideoStream);
