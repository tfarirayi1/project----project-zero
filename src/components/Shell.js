import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom' //eslint-disable-line
import { Auth } from 'aws-amplify'
import './styles/Index.css'
import './styles/Shell.css'
import Path1 from './Path1'
class Shell extends React.Component{
    enableAuthentication(){
        Auth.configure({identityPoolId:'eu-west-1:25388842-fe3f-47da-b371-8523843a6018',userPoolId:'eu-west-1_CTOnEIecG',userPoolWebClientId:'1f39eiq38scgarj4l6hdnmlqct',mandatorySignIn:true})  
        window.addEventListener('visibilitychange',e=>{if(!document.hidden){this.evaluateAuthentication()}})
    }
    getState(){
        console.log(this.state)
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
        const setNoUser=()=>{
            const currentUser = {userid:this.props.userid,username:this.props.username,clearance:this.props.clearance}
            this.setState(()=>(currentUser))
        };setNoUser()
    }
    evaluateAuthenticationSuccess(session){
        //update state
        const setCurrentUser=()=>{
            const currentUser = {username:session.idToken.payload['email'],userid:session.idToken.payload['cognito:username'],clearance:1}
            this.setState(()=>(currentUser))
        };setCurrentUser()
    }
    signIn(){
        //on user command
        Auth.signIn('tfarirayi1@gmail.com','Farirayi1')
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
    cycleState(name,states){
        let next = {}
        let current = this.state
        for(var i=0;i<states.length;i++){
            if(current[name]===states[i]){
                if(i===states.length-1){
                    next[name]=states[0]
                }else{
                    next[name]=states[i+1]
                }
            }
        }
        this.setState(()=>(next))
    }
    constructor(props){
        super(props)
        this.enableAuthentication()
        this.state={
            userid:props.userid,
            username:props.username,
            clearance:props.clearance,
            menu:props.menu
        }
    }
    render(){
        const pathFinder = <div className="path-finder" onClick={e=>this.setState(()=>({menu:'default'}))}><Link to="/path1">path-finder</Link></div>
        const pathFinderToggle = <div className="toggle-path-finder" onClick={e=>this.cycleState('menu',['default','state2'])}></div>
        const viewFinder = <div className="view-finder">{pathFinderToggle}<Route path="/path1" component={Path1}/></div>

        return <Router><div id="Shell" data-state-menu={this.state.menu}>{pathFinder}{viewFinder}</div></Router>
    }
    componentDidMount(){
        this.evaluateAuthentication()   
        console.log(this)
    }
    componentDidUpdate(){
    }
}
Shell.defaultProps={userid:'nouser',username:'anonymous',clearance:0,menu:'default'}
export default Shell