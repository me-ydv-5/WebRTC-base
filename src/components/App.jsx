import React from 'react'
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
import { Button } from 'semantic-ui-react'
import ClientVideoFeed from './ClientVideoFeed'
import OthersVideoFeed from './OthersVideoFeed'

import '../assets/css/app.css'
import '../assets/css/styles.css'
import '../assets/css/canvas.css'

class ReflexBasicDemo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            ids: []
        }
        this.getIds = this.getIds.bind(this)
    }

    getIds(id){
        // document.getElementById(`video${id}`).style.objectFit = 'contain'
    }
  render () {

    return (
        <ReflexContainer orientation="vertical">

            <ReflexElement className="left-pane" minSize={800}>
                <ClientVideoFeed getFeed={this.getIds}/>
            </ReflexElement>
            <ReflexSplitter>
                <div className="drag-handle">
                    <Button circular icon='arrows alternate horizontal'/>
                </div>
            </ReflexSplitter>
            <ReflexElement className="right-pane" minSize={400}>
                <OthersVideoFeed ids={this.state.ids}/>
            </ReflexElement>
        </ReflexContainer>

    )
  }
}

export default ReflexBasicDemo
