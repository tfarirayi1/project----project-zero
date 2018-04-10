import './styles/Index.css'
import './styles/Shell.css'
import Landing from './Landing'
import Path1 from './Path1'
import React from 'react'
import { Auth } from 'aws-amplify'
const $context='Shell'
const location=window.history
class Shell extends React.Component{
    cycleState(property,states){
        //update the state of a property
        let nextState={}
        let currentState=this.state
        nextState[property]=states[0]
        for(var i=0;i<states.length;i++){
            if(currentState[property]===states[i]){
                if(i===states.length-1){
                    nextState[property]=states[0]
                    break 
                }else{
                    nextState[property]=states[i+1]
                    break
                }
            }
        }
        this.setState(()=>(nextState))
        //notify history
        let newHistory=Object.assign({},window.history.state)
        Object.assign(newHistory[$context],nextState)
        window.history.pushState(newHistory,$context,$context)
    }
    enableAuthentication(){
        Auth.configure({identityPoolId:'eu-west-1:25388842-fe3f-47da-b371-8523843a6018',userPoolId:'eu-west-1_CTOnEIecG',userPoolWebClientId:'1f39eiq38scgarj4l6hdnmlqct',mandatorySignIn:true})  
    }
    evaluateAuthentication(){
        Auth.currentSession()
            .then(result=>this.evaluateAuthenticationSuccess(result))
            .catch(error=>this.evaluateAuthenticationException(error))
    }
    evaluateAuthenticationException(error){
        const setNoUser=()=>{
            const currentUser={userid:this.props.userid,username:this.props.username,clearance:this.props.clearance}
            this.setState(()=>(currentUser))
        };setNoUser()
    }
    evaluateAuthenticationSuccess(session){
        const setCurrentUser=()=>{
            const currentUser={username:session.idToken.payload['email'],userid:session.idToken.payload['cognito:username'],clearance:1}
            this.setState(()=>(currentUser))
        };setCurrentUser()
    }
    loadHistory(){
        if(window.history.state){
            if(window.history.state[$context]){
                this.setState(()=>(window.history.state[$context]))
            }
        }
    }
    setupHistory(){
        window.addEventListener('popstate',e=>{
            this.loadHistory()  
        })
        const newHistory={}
        newHistory[$context]=this.state
        if(!window.history.state){
            //no location history available
            window.history.replaceState(newHistory,$context,$context)
        }else{
            if(!window.history.state[$context]){
                //location history available but none for our context
                const locationHistory=window.history.state
                const newHistoryEntry=Object.assign({},locationHistory,newHistory)
                window.history.replaceState(newHistoryEntry,$context,$context)
            }
        }
    }
    signIn(){
        Auth.signIn('tfarirayi1@gmail.com','Farirayi1')
            .then(result=>this.signInSuccess(result))
            .catch(error=>this.signInException(error))
    }
    signInException(error){
        //try again
    }
    signInSuccess(result){
        this.evaluateAuthentication()
    }
    signOut(){
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
    constructor(props){
        super(props)
        //build memory
        this.state={}
        this.state['name']=(location.state?(location.state[$context]?location.state[$context]['name']||props.name:props.name):props.name),
        this.enableAuthentication()
        this.setupHistory()
    }
    render(){
        const pathFinder = <div className="path-finder">path-finder</div>
        const pathFinderToggle = <div className="toggle-path-finder" onClick={e=>this.cycleState('name',['love','fari','tich'])}></div>
        const viewFinder = <div className="view-finder">{pathFinderToggle}{this.state.name}<br/><Landing/></div>
        return <div id="Shell" data-state-menu={this.state.menu}>{pathFinder}{viewFinder}</div>
    }
}
Shell.defaultProps={userid:'nouser',username:'anonymous',clearance:0,menu:'default',name:'tich'}
//two types pf properties
//external properties
//internal properties
//hybrid properies
//history is saved by specific functions, not on update
//two main components
//the shell and its children
export default Shell