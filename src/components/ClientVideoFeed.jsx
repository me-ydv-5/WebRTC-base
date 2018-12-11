import React from 'react'
import {AGORA_API_KEY} from "../constants/keys";
import {handleFail, audioFile} from "../helpers/helper";
import {Progress, Segment, Button} from "semantic-ui-react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";

export default class ClientVideoFeed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            battery: 0,
            mixing: false
        }
        this.addVideoStream = this.addVideoStream.bind(this)
        this.removeVideoStream = this.removeVideoStream.bind(this)
        this.startMixing = this.startMixing.bind(this)
        this.pauseMixing = this.pauseMixing.bind(this)
        this.stopMixing = this.stopMixing.bind(this)
        this.resumeMixing = this.resumeMixing.bind(this)
    }

    componentDidMount() {
        //Client Setup
        //Defines a client for RTC
        const channelName = window.location.search.split('=')[1]
        let client = window.agora = window.AgoraRTC.createClient({
            mode: 'live',
            codec: 'h264'
        })

        //Defines a client for Real Time Communication
        client.init(AGORA_API_KEY, () =>
            console.log("AgoraRTC client initialized"), handleFail);

        //The Client joins the channel
        client.join(null, channelName, null, (uid) => {
            //Stream object associated with your web cam is initalized
            let localStream = window.localStream = window.AgoraRTC.createStream({
                streamID: uid,
                audio: true,
                video: true,
                screen: false
            })

            //Associates the stream to the client
            localStream.init(() => {

                //Plays the localVideo
                localStream.play('me', {fit: 'contain'})
                //Publishes the stream to the channel
                client.publish(localStream, handleFail)
            }, handleFail)
        }, handleFail)

        //When a stream is added to a channel
        client.on('stream-added', (evt) => {
            client.subscribe(evt.stream, handleFail)
        })

        //When you subscribe to a stream
        client.on('stream-subscribed', (evt) => {
            let stream = evt.stream
            this.addVideoStream(stream.getId())
            stream.play(stream.getId(), {fit: 'contain'})

        })

        client.on('stream-subscribed', (evt) => {
            console.log('Stream Subscribed')
            let stream = evt.stream
            var bar = (value) => {
                console.log('Bar value: ', value)
            }

            var foo = client.getRemoteAudioStats(bar)

            setInterval(foo, 5000)
        })


        // Quality Transparency
        client.on('stream-published', val => {
            setInterval(() => {
                client.getSystemStats(stats => {
                    console.log("Battery level: " + stats.BatteryLevel)
                    this.setState({battery: stats.BatteryLevel})
                })
            }, 5000)


            setInterval(() => {
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
        client.on("volume-indicator", function (evt) {
            console.log('enters the volume indicatoe', evt.attr)
            evt.attr.forEach(function (volume, index) {
                console.log(`#${index} UID ${volume.uid} Level ${volume.level}`);
            });
        });


        //When a person is removed from the stream
        client.on('stream-removed', this.removeVideoStream)
        client.on('peer-leave', this.removeVideoStream)

    }


    addVideoStream(streamId) {
        let remoteContainer = document.getElementById('remote-container')
        let streamDiv = document.createElement("div");
        streamDiv.classList.add('remote-feeds')
        // Assigning id to div
        streamDiv.id = streamId;
        // Takes care of lateral inversion (mirror image)
        // Add new div to container
        remoteContainer.appendChild(streamDiv);
        this.props.getFeed(streamId)
    }

    removeVideoStream(evt) {
        let stream = evt.stream;
        stream.stop();
        let remDiv = document.getElementById(stream.getId());
        remDiv.parentNode.removeChild(remDiv);
    }

    startMixing() {
        const options = {
            filePath: audioFile,
            playTime: 0,
            replace: false
        }
        window.localStream.startAudioMixing(options, (err) => {
            if (err === null) {
                this.setState({mixing: true})
            }
        })
    }

    pauseMixing() {
        window.localStream.pauseAudioMixing()
    }

    resumeMixing() {
        window.localStream.resumeAudioMixing()
    }

    stopMixing() {
        window.localStream.stopAudioMixing()
    }

    componentWillUnmount() {
        console.log('UNOINOSIDNFSIDF')
        window.localStream.close()
    }


    render() {
        let status = {success: false, warning: false, error: false}
        if (this.state.battery >= 50) {
            status = {success: true, warning: false, error: false}
        } else if (this.state.battery < 50 && this.state.battery > 10) {
            status = {success: false, warning: true, error: false}
        } else {
            status = {success: false, warning: false, error: true}
        }


        return (
            <div style={{position: 'relative'}}>
                <div id={'me'}/>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <Progress
                        style={{width: '100%'}}
                        percent={this.state.battery}
                        inverted color='black'
                        progress
                        {...status}
                    >
                        Battery
                    </Progress>
                    <Segment inverted>Audio Mixing Controls</Segment>
                    <Segment inverted style={{display:'flex', justifyContent:'center'}}>
                        <Button onClick={this.startMixing} icon={'music'} content={'Start'}  color={'green'} labelPosition={'left'}/>
                        <Button onClick={this.resumeMixing} icon='play' color={'blue'} content={'Resume'} labelPosition={'left'}/>
                        <Button onClick={this.pauseMixing} icon='pause' content='Pause' color={'grey'} labelPosition={'left'}/>
                        <Button onClick={this.stopMixing} icon='stop' color={'red'} content={'Stop'} labelPosition={'left'}/>
                    </Segment>
                </div>
            </div>
        )
    }
}