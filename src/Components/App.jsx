import React from 'react'
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
import { Button } from 'semantic-ui-react'

import '../assets/css/app.css'
import '../assets/css/styles.css'


class ReflexBasicDemo extends React.Component {

  render () {

    return (
      <ReflexContainer orientation="vertical">

         <ReflexElement className="left-pane" minSize={800}>
           <div className="pane-content">
             Left Pane (resizeable)
           </div>

         </ReflexElement>

         <ReflexSplitter>
         <div className="drag-handle">
         <Button circular icon='arrows alternate horizontal'/>
         </div>
         </ReflexSplitter>

         <ReflexElement className="right-pane" minSize={400}>
           <div className="pane-content">
             Right Pane (resizeable)
           </div>
         </ReflexElement>

       </ReflexContainer>
   )
  }
}

export default ReflexBasicDemo
