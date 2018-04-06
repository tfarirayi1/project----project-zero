import React from 'react'
import { Auth } from 'aws-amplify'
import './styles/Index.css'
import './styles/Shell.css'
const username='tfarirayi1@gmail.com'
const password='Farirayi1'
class Shell extends React.Component{
    enableAuthentication(){
        Auth.configure({identityPoolId:'eu-west-1:25388842-fe3f-47da-b371-8523843a6018',userPoolId:'eu-west-1_CTOnEIecG',userPoolWebClientId:'1f39eiq38scgarj4l6hdnmlqct',mandatorySignIn:true})  
        window.addEventListener('visibilitychange',e=>{if(!document.hidden){this.evaluateAuthentication()}})
    }
    evaluateAuthentication(){
        //check for a valid session
        //when component mounts
        //when signIn works
        //when signOut works
        Auth.currentSession()
            .then(result=>this.evaluateAuthenticationSuccess(result))
            .catch(error=>this.evaluateAuthenticationException(error))
    }
    evaluateAuthenticationException(error){
        //update state
        const currentUser = {userid:this.props.userid,username:this.props.username,clearance:this.props.clearance}
        this.setState(()=>(currentUser))
    }
    evaluateAuthenticationSuccess(session){
        //update state
        const currentUser = {username:session.idToken.payload['email'],userid:session.idToken.payload['cognito:username'],clearance:1}
        this.setState(()=>(currentUser))
    }
    signIn(){
        //on user command
        Auth.signIn(username,password)
            .then(result=>this.signInSuccess(result))
            .catch(error=>this.signInException(error))
    }
    signInException(error){
        //try again
    }
    signInSuccess(result){
        //evaluate session
        this.evaluateAuthentication()
    }
    signOut(){
        //on user command
        Auth.signOut()
            .then(result=>this.signOutSuccess(result))
            .catch(error=>this.signOutException(error))
    }
    signOutException(error){
        //try again
    }
    signOutSuccess(result){
        this.evaluateAuthentication()
    }
    traverseStates(stateName,stateList){
        let nextState = {}
        for(var i=0;i<stateList.length;i++){
            if(this.state[stateName]===stateList[i]){
                if(i===stateList.length-1){
                    nextState[stateName]=stateList[0]
                }else{
                    nextState[stateName]=stateList[i+1]
                }
            }
        }
        this.setState(()=>(nextState))
    }
    constructor(props){
        super(props)
        this.enableAuthentication()
        this.state={userid:this.props.userid,username:this.props.username,clearance:this.props.clearance,menu:this.props.menu}
    }
    render(){
        const pathChooser = <div className="path-chooser">menu</div>
        const pathChooserToggle = <div className="toggle-path-chooser" onClick={e=>this.traverseStates('menu',['default','state2'])}></div>
        const pathViewer = <div className="path-viewer">{pathChooserToggle}</div>

        return <div id="Shell" data-state-menu={this.state.menu}>{pathChooser}{pathViewer}</div>
    }
    componentDidMount(){
        this.evaluateAuthentication()   
    }
    componentDidUpdate(){
    }
}
Shell.defaultProps={userid:'nouser',username:'anonymous',clearance:0,menu:'default'}
export default Shell