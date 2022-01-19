import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, Text, View, Button, TouchableOpacity, TextInput} from 'react-native';
import generalStyleSheet from "../general/GeneralStyleSheet";
import Constants from "../constants";
import * as Facebook from 'expo-facebook';
import { AsyncStorage } from 'react-native';


export default class ProfileTab extends React.Component {

    constructor(props) {
        super(props);
        this.state={user:null,loginPhase:0,username:""}
        this.props.navigation.addListener('focus',()=>{
            this.loadUser();
        });
    }

    token=null;

    async storeUser(userObject,tokenObject){
        await AsyncStorage.setItem("user",JSON.stringify({userObject:userObject,tokenObject:tokenObject}));
    }

    async loadUser(){
        const value = await AsyncStorage.getItem("user");
        if(value!=null)
            this.setState({user:JSON.parse(value)})
        else
            this.setState({user:null})
    }

    async removeUser(){
        await  AsyncStorage.removeItem("user");
        this.setState({user:null});
    }

    async facebookLogin() {
        try {
            await Facebook.initializeAsync({
                appId: '451106016421871',
            });
            const {type, token} = await Facebook.logInWithReadPermissionsAsync(
                {
                    permissions: ["public_profile"]
                },
            );
            if (type === 'success') {
                this.token=token;
                const body = {token: token, username: ""}
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
                    body: JSON.stringify(body)
                };
                const response = await fetch(Constants.serverIp + Constants.userMicroserviceName + "user",requestOptions)
                    if(response.ok){
                        response.text().then((text)=>{
                            let fields=text.split("AccessToken");
                            let userObjectString=fields[0].substr(6)
                            let userObject = JSON.parse(userObjectString);
                            let tokenObject = JSON.parse(fields[1])
                            this.setState({user:{userObject:userObject,tokenObject:tokenObject}});
                            this.storeUser(userObject,tokenObject);
                        })
                    }else{
                        this.setState({loginPhase:1});
                        console.log("nessun utente trovato")
                    }
            }
        } catch ({message}) {
            console.log(`Facebook Login Error `+message);
        }
    }

    async completeLogin() {
        const username = this.state.username;
        if(new RegExp('^[a-zA-Z0-9._-]{3,}$').test(username) && username !== undefined && username !== null){ //Test username if is correct
            const body = {token: this.token, username: username}
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'  },
                body: JSON.stringify(body)
            };
            const response=await fetch(Constants.serverIp + Constants.userMicroserviceName + "loginFB",requestOptions)
                if(response.ok){
                    response.text().then((text)=>{
                        let fields=text.split("AccessToken");
                        let userObjectString=fields[0].substr(6)
                        let userObject = JSON.parse(userObjectString);
                        let tokenObject = JSON.parse(fields[1])
                        this.setState({user:{userObject:userObject,tokenObject:tokenObject}});
                        this.storeUser(userObject,tokenObject);
                    })
                }else{
                    console.log("error");
                    this.setState({loginPhase:0});
                }
        }else{
            console.log(username);
            this.setState({loginPhase:0});
        }

    }

    render() {
        return (
            <View style={generalStyleSheet.viewContainer}>
                <Text style={generalStyleSheet.bigTitle }>Profilo</Text>
                <View style={[style.profileContainer,generalStyleSheet.bigBorder]}>
                    <View style={style.leftColumn}>
                        <View style={style.firstProfileRow}>
                            <Icon name="user-circle" size={100}/>
                            <Text style={[style.usernameText,generalStyleSheet.mediumTitle]}>{(this.state.user!=null) ? this.state.user.userObject.username : "Username"}</Text>
                        </View>
                        <View style={style.profileRow}>
                            <Text style={[generalStyleSheet.normalText,style.profileText]}>Nome: {(this.state.user!=null) ? this.state.user.userObject.firstName : "FirstName"}</Text>
                            <Text style={[generalStyleSheet.normalText,style.profileText]}>Cognome: {(this.state.user!=null) ? this.state.user.userObject.lastName : "LastName"}</Text>
                            <Text style={[generalStyleSheet.normalText,style.profileText]}>DataNascita: {(this.state.user!=null) ? this.state.user.userObject.birthday : "Birthday"}</Text>
                            <Text style={[generalStyleSheet.normalText,style.profileText]}>Email: {(this.state.user!=null) ? this.state.user.userObject.email : "Email"}</Text>
                            <Button onPress={()=>this.removeUser()} style={style.logOut} title="LogOut"/>
                        </View>
                    </View>
                </View>
                {this.renderBlockingView()}
            </View>
        );
    }
    renderBlockingView(){
        if(this.state.user==null){
            if(this.state.loginPhase===0){
                return <View style={[style.notLoggedTab,generalStyleSheet.bigBorder]}>
                    <View>
                        <Text style={generalStyleSheet.bigTitle}>Sembrerebbe che tu non sia loggato</Text>
                        <Button title="Login con Facebook" onPress={()=>this.facebookLogin()}/>
                    </View>
                </View>
            }else{
                return <View style={[style.notLoggedTab,generalStyleSheet.bigBorder]}>
                    <View>
                        <Text style={generalStyleSheet.bigTitle}>Inserisci il tuo username</Text>
                        <TextInput style={style.textInput} onChangeText={(text)=>this.setState({username:text})}/>
                        <Button title="Completa login" onPress={()=>this.completeLogin()}/>
                    </View>
                </View>
            }

        }
    }

}
const style=StyleSheet.create({
    profileContainer:{
        display:"flex",
        flexDirection:"row",
        width:"100%",
        marginTop:"3%",
        height:"75%",
    },
    notLoggedTab:{
        width:"100%",
        marginTop:"-1%",
        height:"115%",
        position:"absolute",
        backgroundColor:"white",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:"2%"
    },
    textInput:{
        borderRadius:5,
        borderWidth:1,
        borderColor:"black",
        marginTop:"4%",
        marginBottom:"4%"
    },
    leftColumn:{
        display:"flex",
        flexDirection:"column",
        width:"100%",
    },
    rightColumn:{
        display:"flex",
        flexDirection:"column",
        width:"75%"
    },
    firstProfileRow:{
        display:"flex",
        flexDirection:"row",
        width:"100%",
        paddingLeft:"10%",
        paddingTop:"10%",
        borderBottomWidth:1,
    },
    profileRow:{
        display:"flex",
        flexDirection:"column",
        width:"100%",
    },
    usernameText:{
        paddingLeft:"12%",
        height:"100%",
        lineHeight:100,
        paddingTop:"4%",
        textAlign:"center"
    },
    profileText:{
        paddingLeft:"10%",
        paddingBottom:"5%",
        paddingTop:"5%",
        borderBottomWidth:1,
        fontSize:15,
    },
    productTitle:{
        textAlign:"center",
        marginTop:"6%",
        flex:0.1
    },
    productsView:{
        display:"flex",
        flex:0.9,
        width:"100%",
        marginTop:"2%"
    },
    logOut:{
        backgroundColor:"white",
        color:"black",
        borderWidth:2,
        borderColor:"black",
        borderRadius:5
    }
})
