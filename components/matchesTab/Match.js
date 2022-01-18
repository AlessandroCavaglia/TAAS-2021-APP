import * as React from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from "../constants";

export default class Match extends React.Component{
    async loadUser(){
        const value = await AsyncStorage.getItem("user");
        if(value!=null)
            this.setState({user:JSON.parse(value)})
    }
    constructor(props) {
        super(props);
        this.state={user:null,match:this.props.match}
        this.loadUser();
    }

    async removeUser(){
        await  AsyncStorage.removeItem("user");
        this.setState({user:null});
    }

    async removeMatch() {
        let match = this.state.match;
        match.enabled = false;
        if (this.state.user !== null) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'access-token': this.state.user.tokenObject.token,},
                body: JSON.stringify(match)
            };
            const response = await fetch(Constants.serverIp + Constants.productMicroserviceName + "matches/edit-match", requestOptions)
            if (response.ok) {
                response.json().then((obj) => {
                    this.setState({match: match})
                })
            } else {
                if(response.status===401){
                    this.removeUser();
                }
            }
        }
    }
    render(){
        if(this.state.match.enabled){
            return <View style={styles.matchRow}>
                <View style={styles.matchElement}>
                    <Icon name="user-circle" size={25}/>
                    <Text style={styles.matchUsernameText} >{this.state.match.username1}</Text>
                </View>
                <View style={styles.matchElement}>
                    <Icon name="arrow-right" size={25}/>
                </View>
                <View style={styles.matchElement}>
                    <Icon name="user-circle" size={25}/>
                    <Text style={styles.matchUsernameText} >{this.state.match.username2}</Text>
                </View>
                <View style={styles.matchElement}>
                    <Icon name="trash" size={25} onPress={()=>this.removeMatch()}/>
                </View>
            </View>
        }else{
            return <View style={styles.matchRowDisabled}>
                <View style={styles.matchElement}>
                    <Icon style={styles.colorDisabled} name="user-circle" size={25}/>
                    <Text style={styles.matchUsernameTextDisabled} >{this.state.match.username1}</Text>
                </View>
                <View style={styles.matchElement}>
                    <Icon style={styles.colorDisabled} name="arrow-right" size={25}/>
                </View>
                <View style={styles.matchElement}>
                    <Icon style={styles.colorDisabled} name="user-circle" size={25}/>
                    <Text style={styles.matchUsernameTextDisabled} >{this.state.match.username2}</Text>
                </View>
                <View style={styles.matchElement}>
                </View>
            </View>
        }
    }
}

const styles=StyleSheet.create({
    matchRow:{
        display:"flex",
        flexDirection:"row",
        borderBottomWidth:1,
        borderColor:"black",
        paddingTop:"3%",
        paddingBottom:"3%",
    },
    matchRowDisabled:{
        display:"flex",
        flexDirection:"row",
        borderBottomWidth:1,
        borderColor:"gray",
        color:"gray",
        paddingTop:"3%",
        paddingBottom:"3%",
    },
    matchElement:{
        flex:1,
        maxWidth: "25%",
        display: "flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
    matchUsernameText:{
        fontSize: 20,
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    colorDisabled:{
        color:"gray"
    },
    matchUsernameTextDisabled:{
        fontSize: 20,
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        color:"gray"
    }
})
