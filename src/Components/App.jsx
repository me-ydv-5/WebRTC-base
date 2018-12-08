import React from 'react'

import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import 'react-reflex/styles.css'

class ReflexBasicDemo extends React.Component {

  render () {

    return (
      <ReflexContainer orientation="vertical">

         <ReflexElement className="left-pane">
           <div className="pane-content">
             Left Pane (resizeable)
           </div>
         </ReflexElement>

         <ReflexSplitter/>

         <ReflexElement className="right-pane">
           <div className="pane-content">
             Right Pane (resizeable)
           </div>
         </ReflexElement>

       </ReflexContainer>
   )
  }
}

export default ReflexBasicDemo
