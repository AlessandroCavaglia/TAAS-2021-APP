import * as React from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import Match from './Match';
import generalStyleSheet from "../general/GeneralStyleSheet";
import Constants from "../constants";



export default class MatchesTab extends React.Component {
    async loadUser(){
        const value = await AsyncStorage.getItem("user");
        if(value!=null)
            this.setState({user:JSON.parse(value)})
        else
            this.setState({user:null})
    }

    async removeUser(){
        await  AsyncStorage.removeItem("user");
        this.setState({user: null});
    }

    async loadMyMatches(){
        if(this.state.user!==null){
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','access-token':this.state.user.tokenObject.token},
            };
            const response= await fetch(Constants.serverIp + Constants.productMicroserviceName + "matches/my-matches",requestOptions)
                if(response.ok){
                    response.json().then((obj)=>{
                        this.setState({matches:obj})
                    })
                }else{
                    if(response.status===401){
                        this.removeUser();
                    }
                }
        }
    }

    constructor(props) {
        super(props);
        this.state={user:null,matches:null}
        this.props.navigation.addListener('focus',()=>{
            this.loadUser().then(()=>{this.loadMyMatches()});
        });
    }


    render() {
        return <View style={generalStyleSheet.viewContainer}>
            <Text style={generalStyleSheet.bigTitle}>I tuoi Match</Text>
            {this.renderMatches()}
        </View>
    }

    renderMatches(){
        if(this.state.user==null){
            return <View style={styles.messageContainer}>
                <View style={styles.messageBox}>
                    <Text style={styles.message} >Non sei loggato, accedi tramite il profilo</Text>
                </View>
            </View>
        }
        if(this.state.matches==null){
            return <View style={styles.messageContainer}>
                <View style={styles.messageBox}>
                    <Text style={styles.message} >Caricamento in corso</Text>
                </View>
            </View>
        }else{
            if(this.state.matches.length===0){
                return <View style={styles.messageContainer}>
                            <View style={styles.messageBox}>
                                <Text style={styles.message} >Nessun Match, swipa su prodotti per ottenere match</Text>
                            </View>
                        </View>
            }else{
                return <View style={styles.matchesContainer}>
                    {this.state.matches.map((match)=>{
                        return <Match match={match}/>
                    })}
                </View>
            }
        }
    }
}
const styles=StyleSheet.create({
    matchesContainer:{
        width:"100%",
        marginTop:"5%"
    },
    messageContainer:{
        height:"90%",
        justifyContent:"center",
    },
    message:{
        fontSize:30,
        fontWeight:"bold",
        textAlign:'center'
    },
    messageBox:{
        display:"flex",
        width:"100%",
        paddingLeft:"3%",
        paddingRight:"3%",
    }
})
