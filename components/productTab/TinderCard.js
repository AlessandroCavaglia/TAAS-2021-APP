import React from "react";
import {View, StyleSheet, Text  } from "react-native";

/* Propos:
    elem : the product
    panResponder : the panresponder
    elemIndex : the index of this card
    actualIndex : the actualIndex

 */
const SHOWABLE_CARDS = 3
const styles=StyleSheet.create({
    card:{
        flex:1,
        alignContent:"center",
        height: "100%",
        width: "100%",
        backgroundColor:'#fafafa',
        borderWidth:3,
        borderColor:"black",
        borderRadius:25,
        position:'absolute'
    },
    imgBar:{
        height:"5%"
    },
    img:{
        height:"80%",
        backgroundColor:"black"
    },
    cardTitleView:{
        flexDirection:"row",
        height:"18%",
        borderWidth:3,
        borderColor:"black",
        borderRadius:25,
        width: "104%",
        position: "absolute",
        bottom:0,
        left:"-2%",
        backgroundColor:"#ffffff",
        paddingTop:"5%",
        paddingLeft:"3%",
        paddingRight:"3%"
    },
    userCircleContainer:{
        height:"80%",
        justifyContent:"center",
        alignContent: "center",
        flexDirection: "column",
        flex:2,
    },
    userCircle:{
        width:50,
        height:50,
        borderRadius:25,
        borderWidth:2,
        backgroundColor:"#d6d4d4",
    },
    cardTitleContainer:{
        flex:7,
        paddingLeft: "3%",
        height:"80%",
        justifyContent:"center",
        flexDirection: "column"
    },
    cardTitle:{
        fontSize:20,
        fontWeight:"bold",
    },
    productValueContainer:{
        height:"80%",
        flex:2,
        justifyContent:"center",
        flexDirection: "column"
    },
    productValue:{
        fontSize:15,
    }
})


export default class TinderCard extends React.Component {
    constructor() {
        super();
        this.calculateOffset = (index)=>{
            let  distance=(Math.abs(index-this.props.actualIndex))
                return ((15 * distance));
        }
    }


    render(){
        return <View style={this.props.actualIndex!==this.props.elem.id ? [styles.card,{marginTop:this.calculateOffset(this.props.elem.id)}]:styles.card}>
                <View style={styles.imgBar}>{/*Barra immagini*/}</View>
                <View style={styles.img}>{/*Immagine*/}</View>
                <View style={styles.cardTitleView}>
                    <View style={styles.userCircleContainer}>
                        <View style={styles.userCircle}/>
                    </View>
                    <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>{this.props.elem.title}</Text>
                    </View>
                    <View style={styles.productValueContainer}>
                        <Text style={styles.productValue}>
                            $$$$$
                        </Text>
                    </View>
                </View>
            </View>
    }
}
