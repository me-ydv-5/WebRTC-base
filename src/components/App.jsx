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

  render () {

    return (

        <ReflexContainer orientation="vertical">

            <ReflexElement className="left-pane" minSize={800}>
            </ReflexElement>
                <ClientVideoFeed/>
            <ReflexSplitter>
                <div className="drag-handle">
                    <Button circular icon='arrows alternate horizontal'/>
                </div>
            </ReflexSplitter>

            <ReflexElement className="right-pane" minSize={400}>
                <OthersVideoFeed />
            </ReflexElement>

        </ReflexContainer>


    )
  }
}

export default ReflexBasicDemo


