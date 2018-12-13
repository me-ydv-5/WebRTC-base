import React from 'react'
import {Button} from 'semantic-ui-react'
import ClientVideoFeed from './ClientVideoFeed'
import OthersVideoFeed from './OthersVideoFeed'

import '../assets/css/app.css'
import '../assets/css/styles.css'
import '../assets/css/canvas.css'
import {AGORA_API_KEY} from "../constants/keys";
import {handleFail} from "../helpers/helper";

//TODO Clear styles

const app = {
    app: {display: 'flex', height: '100vh'},
    currentRemote: {height: '100%', width: '70%'},
    dash: {height: '100%', width: '30%'},
    client: {height: '300px', borderBottom: '2px solid yellow'},
    remote: {height: 'calc(100% - 300px)', overflowY: 'scroll'}

}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            battery: 0,
            current: null
        }
        // this.getCurrentId = this.getCurrentId.bind(this);
        this.state = {update:false}
    }

    componentDidMount() {

        //Defines a client for RTC
        let client = window.agora

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
            console.log('enters the volume indicator', evt.attr)
            evt.attr.forEach(function (volume, index) {
                console.log(`#${index} UID ${volume.uid} Level ${volume.level}`);
            });
        });
    }


    // getCurrentId(video, streamIds) {
    //     window.stream.stop()
    //     console.log(streamIds)
    //     if(video) {
    //         video.style.height = '100vh'
    //         video.style.width = '100%'
    //         video.removeEventListener('click', () => {
    //         })
    //         document.getElementById('current').appendChild(video)
    //     }
    //     window.stream.play(video.id,{fit:'content'})
    //
    // }

    render() {

        return (
            <div style={app.app}>
                <div style={app.currentRemote}>
                    <div id={'current'}/>
                </div>
                <div style={app.dash}>
                    <div style={app.client}>
                        <ClientVideoFeed battery={this.state.battery}/>
                    </div>
                    <div style={app.remote}>
                        <OthersVideoFeed feeds={this.state.feeds}/>
                    </div>
                </div>
            </div>

        )
    }
}

export default App
