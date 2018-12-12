import React from 'react'
import {handleFail} from "../helpers/helper";

export default class OthersVideoFeed extends React.Component{
    constructor(props){
        super(props)
        this.state= {
            removed: null,
            streamIds: [],
            currentNode: null
        }
        this.addVideoStream = this.addVideoStream.bind(this);
        this.removeVideoStream = this.removeVideoStream.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        let client = window.agora
        //When a stream is added
        client.on('stream-added', (evt) => {
            client.subscribe(evt.stream, handleFail)
        })

        //When you subscribe to a stream
        client.on('stream-subscribed', (evt) => {
            let stream = window.stream = evt.stream
            console.log(stream)
            this.addVideoStream(stream.getId())
            window.stream.play(stream.getId(), {fit: 'contain'})
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

        //When a person is removed from the stream
        client.on('stream-removed', this.removeVideoStream)
        client.on('peer-leave', this.removeVideoStream)
    }

    handleClick(evt){
        window.stream.stop()
        console.log(evt.target.id)
        let _id = evt.target.id.split('video')[1]
        let currentNode = document.getElementById(_id)
        this.props.getCurrentId(currentNode, this.state.streamIds)
        if(this.state.currentNode !== currentNode && this.state.currentNode !== null){
            console.log('inside ifffffff', this.state.removed)
            document.getElementById('remote-container').appendChild(this.state.currentNode)
            window.stream.play(this.state.currentNode.id,{fit:'contain'})
        }
        window.stream.play(_id, {fit: 'contain'})

        this.setState({removed: currentNode})
        console.log(this.state.currentNode)

    }

    addVideoStream(streamId) {
        this.setState({streamIds: this.state.streamIds.concat(streamId)})
        let remoteContainer = document.getElementById('remote-container')
        let streamDiv = document.createElement("div");
        streamDiv.classList.add('remote-feeds')
        // Assigning id to div
        streamDiv.id = streamId;
        streamDiv.addEventListener('click',this.handleClick)
        // Takes care of lateral inversion (mirror image)
        // Add new div to container
        remoteContainer.appendChild(streamDiv);
    }

    removeVideoStream(evt) {
        console.log("RERMEORMEORMEOMROEMRO")
        let stream = window.stopStream = evt.stream;
        stream.stop();
        let remDiv = document.getElementById(stream.getId());
        remDiv.parentNode.removeChild(remDiv);
        if(this.state.removed === stream.getId()){
            this.setState({removed:null})
        }
    }

    render() {
        return(
            <div id="remote-container"/>
        )
    }
}