import React from 'react'
import {withRouter} from 'react-router-dom'
import styled from 'styled-components'

const LandingPageWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #000000;
  justify-content: center;
  align-content: center;
`

class LandingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state ={value: 'default-channel'}
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }

    handleSubmit(event){
        // window.location = `/app?channel=${this.state.value}`
        this.props.history.push(`/app?room=${this.state.value}`)
        event.preventDefault()
    }


    render() {
        return (
            <LandingPageWrapper>
                <form onSubmit={this.handleSubmit} style={{alignSelf: 'center',padding: '30px'}}>
                    <label>
                        <p style={{marginBottom:15, color:'white'}}>Channel Name:</p>
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" className={'button-primary'} value="Submit" style={{color:'white'}}/>
                </form>
            </LandingPageWrapper>
        )
    }

}

export default withRouter(LandingPage)