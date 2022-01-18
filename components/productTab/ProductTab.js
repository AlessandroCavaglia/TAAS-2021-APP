import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Button, Animated, Dimensions, PanResponder, AsyncStorage} from 'react-native';
import TinderCard from "./TinderCard";

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const SHOWABLE_CARDS = 3
const styles = StyleSheet.create({
    animatedView:{
        height: SCREEN_HEIGHT -200,
        width: SCREEN_WIDTH-120,
        padding: 10,
        backgroundColor:'#fa0000',
        position:'absolute',
    },
    cardView:{
        height: "100%",
        width: "100%",
        position:'absolute'
    },
    viewContainer:{
        flex:1,
        paddingLeft:"7%",
        paddingRight:"7%",
    },
    topText:{
        paddingTop:"8%",
        paddingBottom:"3%",
        fontSize:30,
        fontWeight:"bold",
    },
    cardContainer:{
        flex:1,
        height: "60%",
        maxHeight:"60%"
    }
})
const Cards = [
    { id: "1", color: '#00ffcc',title: 'Xbox' },
    { id: "2", color: '#ffd500',title: 'Bicicletta'  },
    { id: "3", color: '#08ff00',title: 'laptop HP'  },
    { id: "4", color: '#1a0dd2',title: 'Stereo'  },
    { id: "5", color: '#ff0000',title: 'Monitor Dell'  },
]

export default class ProductTab extends React.Component {

    async loadUser(){
        const value = await AsyncStorage.getItem("user");
        if(value!=null)
            this.setState({user:JSON.parse(value)})
    }

    constructor() {
        super();
        this.state={user:null,loginPhase:0,username:"",currentIndex:0}
        this.loadUser();
        this.position = new Animated.ValueXY();
        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        })
        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
                ...this.position.getTranslateTransform()
            ]
        }
        this.nextCardPosition = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [-15, 0, -15],
            extrapolate: 'clamp'
        })
        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        })
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > 120) {
                    //Swipe A Destra
                    console.log("Swipe a Destra")
                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                        useNativeDriver: true
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                } else if (gestureState.dx < -120) {
                    //Swipe A Sinistra
                    console.log("Swipe a Sinistra")
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                        useNativeDriver: true
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                }else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: true
                    }).start()
                }
            }
        })
    }





    renderCards = () =>{
        return Cards.map((item,i) => {
            if (i < this.state.currentIndex) {
                return null;
            } else if (Math.abs(this.state.currentIndex -i) < SHOWABLE_CARDS) //Se è una card nel range di quelle da visualizzare
                return<Animated.View key={i} style={ i===this.state.currentIndex ?      //La stampiamo visibile e traslata un pelo verso il basso
                                                [styles.cardView, this.rotateAndTranslate] :
                                                [styles.cardView,{marginTop:this.nextCardPosition}]}/*opacity: this.nextCardOpacity,*/ /*,*/
                                                {...this.PanResponder.panHandlers}>
                        <TinderCard elem={item} actualIndex={this.state.currentIndex}/>
                    </Animated.View>
            else if (Math.abs(this.state.currentIndex -i) === SHOWABLE_CARDS)   //Se è la prima card che non visualizziamo
                return <Animated.View key={i} style={ i===this.state.currentIndex ?         //La stampiamo con animazione
                    [styles.cardView, this.rotateAndTranslate] :
                    [styles.cardView,{marginTop:this.nextCardPosition,opacity: this.nextCardOpacity}]}
                                      {...this.PanResponder.panHandlers}>
                    <TinderCard elem={item} actualIndex={this.state.currentIndex}/>
                </Animated.View>
        }).reverse()
    }

    render() {
        return (
            <View style={styles.viewContainer}>
                <Text style={styles.topText}>Scopri</Text>
                <View style={{ height:"10%" }}>{/* Filter bar */}</View>
                <View style={styles.cardContainer}>
                    {this.renderCards()}
                </View>
            </View>
        );
    }
}
