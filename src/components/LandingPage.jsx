import React from 'react'
import {withRouter} from 'react-router-dom'
import styled from 'styled-components'
import request from 'request'

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
        event.preventDefault()
        const gCaptcha = event.target[1].value;
        var options = {
            uri: 'https://www.google.com/recaptcha/api/siteverify',
            headers:{
               'content-type' : 'application/x-www-form-urlencoded'
            },
            body: require('querystring').stringify({
               secret: '6LdSmH8UAAAAAH7Gcm5hDTWD2dqLVR95WEVqoS75',
               response: gCaptcha
            })
        };
      
        request.post(options, (err, response, body) => {
            if (err){
                console.log("Error: ", err);
            }else{
                var values = JSON.parse(body);
                if(values['success'] !== true){
                console.log('Error in processing captcha! Entry Denied.');
                }else{
                    this.props.history.push(`/app?room=${this.state.value}`)
                }
            }
        });
        // const body = {
        //     secret: '6LdSmH8UAAAAAH7Gcm5hDTWD2dqLVR95WEVqoS75',
        //     response: gCaptcha
        // }
        // axios.post('https://www.google.com/recaptcha/api/siteverify', {body})
        // .then(result => {
        //     console.log(result);
        // })
        // .then(data => console.log("data is ", data))
        // .catch(error => console.log("Error: ", error));
        // fetch('https://www.google.com/recaptcha/api/siteverify', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: {
        //       secret: '6LdSmH8UAAAAAH7Gcm5hDTWD2dqLVR95WEVqoS75',
        //       response: gCaptcha
        //     }
        //   })
        //   .then(response => response.json())
        //   .then(data => {
        //         console.log(data);
        //         if(data['success'] !== true){
        //             console.log('Error in processing captcha! Entry Denied.');
        //             // this.props.history.push('../404.html')
        //         }else{
        //             this.props.history.push(`/app?room=${this.state.value}`)
        //         }
        //   })
        //   .catch(error => {
        //       console.log('Error: ', error);
        //   })
        
        
    }


    render() {
        return (
            <LandingPageWrapper>
                <form onSubmit={this.handleSubmit} style={{alignSelf: 'center',padding: '30px'}}>
                    <label>
                        <p style={{marginBottom:15, color:'white'}}>Channel Name:</p>
                        <input type="text" value={this.state.value} onChange={this.handleChange} required/>
                        <div class="g-recaptcha" data-theme="dark" data-sitekey="6LdSmH8UAAAAAIeebu--oN0YSQlM-Z7MvvbuHX2b">
                        </div>
                    </label>
                    <input type="submit" className={'button-primary'} value="Submit" style={{color:'white'}}/>
                </form>
            </LandingPageWrapper>
        )
    }

}

export default withRouter(LandingPage)