import React from 'react'
import ReactDOM from 'react-dom'
import {AGORA_API_KEY} from "./constants/keys";
import {handleFail} from "./helpers/helper";

export default class ClientVideoFeed extends React.Component{
    constructor(props){
        super(props)
        this.addVideoStream = this.addVideoStream.bind(this)
        this.removeVideoStream = this.removeVideoStream.bind(this)
    }

    componentDidMount() {
        const me = this.refs.me
        console.log(me)

        //Client Setup
        //Defines a client for RTC
        let client = window.AgoraRTC.createClient({
            mode: 'live',
            codec: 'h264'
        })

        //Defines a client for Real Time Communication
        client.init(AGORA_API_KEY,() =>
            console.log("AgoraRTC client initialized") ,handleFail);

        //The Client joins the channel
        client.join(null, 'default-channel', null, (uid) =>{
            //Stream object associated with your web cam is initalized
            let localStream = window.AgoraRTC.createStream({
                streamID: uid,
                audio:true,
                video:true,
                screen: false
            })

            //Associates the stream to the client
            localStream.init(() => {

                //Plays the localVideo
                localStream.play('me')
                //Publishes the stream to the channel
                client.publish(localStream, handleFail)
            },handleFail)
        },handleFail)

        //When a stream is added to a channel
        client.on('stream-added', (evt) => {
            client.subscribe(evt.stream, handleFail)
        })

        //When you subscribe to a stream
        client.on('stream-subscribe', (evt) => {
            let stream = evt.stream
            this.addVideoStream(stream.getId(),me)
            stream.play(stream.getId())
        })

        client.on('stream-subscribed', (value) => {
            console.log('Stream Subscribed')
            var bar = (value) => {
                console.log('Bar value: ', value)
            }

            var foo = client.getRemoteAudioStats(bar)

            setInterval(foo, 5000)
        })

        // Quality Transparency
        client.on('stream-published', val => {
            client.getSystemStats(stats => {
                console.log("Battery level: " + stats.BatteryLevel)
            })

            setInterval(()=>{
                client.getLocalVideoStats(stats => {
                    console.log('Local Video Stats:\n', stats, '\nEnding the video stats')
                })

                client.getLocalAudioStats(stats => {
                    console.log('Local Audio Stats:\n', stats, '\nEnding the audio stats')
                })

            }, 3000)
        })

        // Triggers the "volume-indicator" callback event every two seconds.
        client.enableAudioVolumeIndicator()
        client.on('volume-indicator', (evt) => {
            evt.attr.forEach((vol, index) => {
                console.log('Voliume is: ', vol)
                console.log('Index is: ', index)
            })
        })

        //When a person is removed from the stream
        client.on('stream-removed', this.removeVideoStream)
        client.on('peer-leave', this.removeVideoStream)
    }

    addVideoStream(streamId, node){
        console.lo('Node:\n',node )
        console.log('streamId',streamId)
    }

    removeVideoStream(evt){
        let strea
    }

    render() {
        return(
            <div id={'me'} ref={'me'}/>
        )
    }
}