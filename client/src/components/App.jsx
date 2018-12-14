import React from 'react'
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex'
import {Button} from 'semantic-ui-react'
import ClientVideoFeed from './ClientVideoFeed'
import OthersVideoFeed from './OthersVideoFeed'

import '../assets/css/app.css'
import '../assets/css/styles.css'
import '../assets/css/canvas.css'
import {AGORA_API_KEY} from "../constants/keys";
import {handleFail} from "../helpers/helper";

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            battery: 0
        }
    }

    componentDidMount() {
        //Client Setup
        //Defines a client for RTC
        let client = window.agora = window.AgoraRTC.createClient({
            mode: 'live',
            codec: 'h264'
        })

        //Defines a client for Real Time Communication
        client.init(AGORA_API_KEY, () =>
            console.log("AgoraRTC client initialized"), handleFail);

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


        //When a person is removed from the stream
        client.on('stream-removed', this.removeVideoStream)
        client.on('peer-leave', this.removeVideoStream)
    }

    render() {

        return (
            <ReflexContainer orientation="vertical">

                <ReflexElement className="left-pane" minSize={800}>
                    <OthersVideoFeed ids={this.state.ids}/>
                </ReflexElement>
                <ReflexSplitter>
                    <div className="drag-handle">
                        <Button circular icon='arrows alternate horizontal'/>
                    </div>
                </ReflexSplitter>
                <ReflexElement className="right-pane" minSize={400}>
                    <ClientVideoFeed battery={this.state.battery} getFeed={this.getIds}/>
                </ReflexElement>
            </ReflexContainer>

        )
    }
}

export default App
