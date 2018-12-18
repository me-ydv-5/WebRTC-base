import React from 'react'
import {handleFail} from "./helpers/helper";

import {AGORA_API_KEY} from "../constants/keys";

export default class ClientVideoFeed extends React.Component {
    componentDidMount() {
        console.log(this.props)
        //Get channel-name
        const channelName = window.location.search.split('=')[1]
        let client = window.agora
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


    componentWillUnmount() {
        console.log('UNOINOSIDNFSIDF')
        window.localStream.close()
    }


    render() {
        return (
            <div style={{position: 'relative'}}>
                <div id={'me'}/>
                
                {/*<Button onClick={this.setState({})}/>*/}
            </div>
        )
    }
}
