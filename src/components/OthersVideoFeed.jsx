import React from 'react'
import {handleFail} from "../helpers/helper";

export default class OthersVideoFeed extends React.Component{
    constructor(props){
        super(props)
        this.state= {
            removed: null
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
        //Logic to render back the feed from current to remote-feeds
        let id = evt.target.id
        console.log(evt.target.id)
        let _id = evt.target.id.split('video')[1]
        let {removed} = this.state
        if(removed && removed !== _id){
            let videofeed = document.getElementById('video' + removed)
            let audiofeed = document.getElementById('audio' + removed)
            let remoteNode = document.getElementById('remote-container')
            remoteNode.appendChild(videofeed)
            remoteNode.appendChild(audiofeed)
            videofeed.play()
            audiofeed.play()
            videofeed.addEventListener('click',this.handleClick)
        }

        //Add video to the left
        let videofeed = document.getElementById(id)
        videofeed.style.position = 'initial'
        let audiofeed = document.getElementById('audio' + _id)
        let currentNode = document.getElementById('current')
        currentNode.classList.add('remote-feeds-current')
        currentNode.appendChild(videofeed)
        currentNode.appendChild(audiofeed)
        videofeed.play()
        audiofeed.play()
        if(document.getElementById(_id)) document.getElementById(_id).remove()
        this.setState({removed:_id})

    }

    addVideoStream(streamId) {
        let remoteContainer = document.getElementById('remote-container')
        let streamDiv = document.createElement("div");
        streamDiv.classList.add('remote-feeds')
        // Assigning id to div
        streamDiv.id = streamId;
        streamDiv.addEventListener('click',this.handleClick)
        // Add new div to container
        remoteContainer.appendChild(streamDiv);
    }

    removeVideoStream(evt) {
        console.log("RERMEORMEORMEOMROEMRO")
        let stream = window.stopStream = evt.stream;
        stream.stop();
        let id = stream.getId()
        if(id.toString() === this.state.removed) this.setState({removed:null})
        if(document.getElementById('video' + id)) document.getElementById('video' + id).remove()
        if(document.getElementById('audio' + id)) document.getElementById('audio' + id).remove()
        if(document.getElementById(stream.getId())) document.getElementById(stream.getId()).remove()
    }

    render() {
        return(
            <div id="remote-container"/>
        )
    }
}