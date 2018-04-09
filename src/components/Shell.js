import './styles/Index.css'
import './styles/Shell.css'
import Landing from './Landing'
import Path1 from './Path1'
import React from 'react'
import { Auth } from 'aws-amplify'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
const location = history.location
class Shell extends React.Component{
    enableAuthentication(){
        Auth.configure({identityPoolId:'eu-west-1:25388842-fe3f-47da-b371-8523843a6018',userPoolId:'eu-west-1_CTOnEIecG',userPoolWebClientId:'1f39eiq38scgarj4l6hdnmlqct',mandatorySignIn:true})  
        //window.addEventListener('visibilitychange',e=>{if(!document.hidden){this.evaluateAuthentication()}})
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
        next[name]=states[0]
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
        history.push(next[name],Object.assign({},this.state,next))
    }
    constructor(props){
        super(props)
        //default state
        const navigationalState={
            name:location.state?location.state.name||props.name:props.name
        }
        const logicalState={
            clearance:props.clearance,
            userid:props.userid,
            username:props.username,
        }
        const presentationalState={
            menu:props.menu,
        }
        const defaultState=Object.assign({},navigationalState,logicalState,presentationalState)
        this.state=Object.assign({},defaultState)
        //aws user pool setup
        this.enableAuthentication()
        history.listen((location,action)=>{
            console.log(action)
            if(action==='POP'){
                if(location.state){
                    this.setState(()=>(location.state))
                }
            }
        })
    }
    checkHistory(state){
        //when its a pop event
        //when you are instatntiated
    }
    componentDidMount(){
        // this.evaluateAuthentication()  
        console.log('mounted') 
        if(!history.location.state){
            history.replace('/home',this.state)
        }
        
    }
    shouldComponentUpdate(){
        //if navigational state change, push state
        return true
    }
    getSnapshotBeforeUpdate(prevProps,prevState){
        //history.push('/path1',prevState)
        return null
    }
    componentDidUpdate(prevProps,prevState){
        console.log(this.state)
    }
    render(){
        console.log(history.location)
        const pathFinder = <div className="path-finder">path-finder</div>
        const pathFinderToggle = <div className="toggle-path-finder" onClick={e=>this.cycleState('name',['tich','love','fari'])}></div>
        const viewFinder = <div className="view-finder">{pathFinderToggle}{this.state.name}</div>
        return <div id="Shell" data-state-menu={this.state.menu}>{pathFinder}{viewFinder}</div>
    }
}
Shell.defaultProps={userid:'nouser',username:'anonymous',clearance:0,menu:'default',name:'tich'}
export default Shell