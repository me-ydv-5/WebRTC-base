import React from 'react'
import {handleFail, audioFile,audioFile2} from "../helpers/helper";
import {Progress, Segment, Button} from "semantic-ui-react";
import {AGORA_API_KEY} from "../constants/keys";

export default class ClientVideoFeed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mixing: false,
            hide: false
        }
        this.startMixing = this.startMixing.bind(this)
        this.pauseMixing = this.pauseMixing.bind(this)
        this.stopMixing = this.stopMixing.bind(this)
        this.resumeMixing = this.resumeMixing.bind(this)
    }

    componentDidMount() {
        console.log(this.props)
        //Get channel-name
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

    }

    startMixing() {
        const options = {
            filePath: audioFile2,
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
        const {battery} = this.props
        let status = {success: false, warning: false, error: false}
        if (battery >= 50) {
            status = {success: true, warning: false, error: false}
        } else if (battery < 50 && battery > 10) {
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
                        percent={battery}
                        inverted
                        color='black'
                        progress
                        {...status}
                    >
                        Battery
                    </Progress>
                </div>
                {/*<Button onClick={this.setState({})}/>*/}
                <div style={{position: 'absolute', bottom: '0', width: '100%'}}>
                    <Button onClick={() => this.setState({hide: !this.state.hide})}
                            content={this.state.hide ? 'Close Audio Mixing Controls' : 'Open Audio Mixing controls'}
                            color={this.state.hide ? 'grey' : 'black'}/>
                    {this.state.hide &&
                    <Segment inverted style={{margin: 0, display: 'flex', justifyContent: 'center', zIndex: 2}}>
                        <Button onClick={this.startMixing} icon={'music'} content={'Start'} color={'green'}
                                labelPosition={'left'}/>
                        <Button onClick={this.resumeMixing} icon='play' color={'blue'} content={'Resume'}
                                labelPosition={'left'}/>
                        <Button onClick={this.pauseMixing} icon='pause' content='Pause' color={'grey'}
                                labelPosition={'left'}/>
                        <Button onClick={this.stopMixing} icon='stop' color={'red'} content={'Stop'}
                                labelPosition={'left'}/>
                    </Segment>}

                </div>
            </div>
        )
    }
}