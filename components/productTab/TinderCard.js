import React from "react";
import {View, StyleSheet, Text  } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import Icon from 'react-native-vector-icons/FontAwesome';


/* Propos:
    elem : the product
    panResponder : the panresponder
    elemIndex : the index of this card
    actualIndex : the actualIndex

 */


export default class TinderCard extends React.Component {
    constructor() {
        super();
        this.calculateOffset = (index)=>{
            let  distance=(Math.abs(index-this.props.actualIndex))
                return ((15 * distance));
        }
        this.state={width:0}
    }

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };


    render(){
        return <View style={this.props.actualIndex!==this.props.elem.id ? [styles.card,{marginTop:this.calculateOffset(this.props.elem.id)}]:styles.card}>
                <View style={styles.img} onLayout={this.onLayout}>
                    <SliderBox parentWidth={this.state.width} style={styles.sliderBox} images={this.props.elem.images} />
                </View>
                <View style={styles.cardTitleView}>
                    <View style={styles.userCircleContainer}>
                        <View style={styles.userCircle}>
                            <Icon name="user-circle" size={30}/>
                        </View>
                    </View>
                    <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>{this.props.elem.title}</Text>
                    </View>
                    <View style={styles.productValueContainer}>
                        <Text style={styles.prductValueCost}>
                            {this.renderCost()}
                        </Text>
                    </View>
                </View>
            </View>
    }

    renderCost(){
            switch (this.props.elem.priceRange) {
                case 1:
                    return "$"
                case 2:
                    return "$$"
                case 3:
                    return "$$$"
                case 4:
                    return "$$$$"
                default:
                    return "$$"
            }
    }
}

const styles=StyleSheet.create({
    card:{
        flex:1,
        alignContent:"center",
        width: "100%",
        height: "100%",
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
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
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
    },
    prductValueCost:{
        fontSize:15,
        color:"#B8860BFF",
        fontWeight:"bold",
    },
    sliderBox:{
        height:"100%",
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    }
})
