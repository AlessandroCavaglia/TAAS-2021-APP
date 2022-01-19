import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Button, Animated, Dimensions, PanResponder, AsyncStorage} from 'react-native';
import TinderCard from "./TinderCard";
import Constants from "../constants";

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const SHOWABLE_CARDS = 3
const styles = StyleSheet.create({
    animatedView:{
        height: SCREEN_HEIGHT - 200,
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
        marginTop:"15%",
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
        marginTop:"-25%",
        height: "60%",
        maxHeight:"60%"
    }
})
const Cards = [
    { id: "1",title: 'Xbox',description:'Descrizione',categories:'category1,category2',priceRange:1,images:[] },
    { id: "2",title: 'Xbox1',description:'Descrizione',categories:'category1,category2',priceRange:1,images:[] },
    { id: "3",title: 'Xbox2',description:'Descrizione',categories:'category1,category2',priceRange:1,images:[] },
    { id: "4",title: 'Xbox3',description:'Descrizione',categories:'category1,category2',priceRange:1,images:[] },
]

export default class ProductTab extends React.Component {

    async loadUser(){
        const value = await AsyncStorage.getItem("user");
        if(value!=null)
            this.setState({user:JSON.parse(value)})
    }

    async createAction(type,id){
        const body = {like_action:type,
            timestamp:"2021-10-10 22:22:22",
            product_id: this.state.products[id].id}
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*','access-token':this.state.user.tokenObject.token },
            body: JSON.stringify(body)
        };
        const response=await fetch(Constants.serverIp + Constants.productMicroserviceName + "actions/create",requestOptions)
        console.log(response.ok)
    }

    async removeUser(){
        await  AsyncStorage.removeItem("user");
        this.setState({user:null});
    }

    async loadProducts() {
        if (this.state.user !== null) {
            const body = {
                latitudePoint: 44.8980033,
                longitudePoint: 8.2064966,
                radius: 500,
                categoryNumber: "1",
                category1: "%",
                category2: "",
                category3: ""
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'access-token': this.state.user.tokenObject.token
                },
                body: JSON.stringify(body)
            };
            const response = await fetch(Constants.serverIp + Constants.productMicroserviceName + "products/filter", requestOptions)
                if (response.ok) {
                    response.json().then((obj) => {
                        obj.forEach((elem) => {
                            elem.selected_img = 0
                            elem.images = []
                            if (elem.image1 != null) {
                                elem.images.push("data:image/png;base64,"+elem.image1.toString())
                            }
                            if (elem.image2 != null) {
                                elem.images.push("data:image/png;base64,"+elem.image2.toString())
                            }
                            if (elem.image3 != null) {
                                elem.images.push("data:image/png;base64," + elem.image3.toString())
                            }
                        })
                        console.log(obj.length)
                        this.setState({products: obj})
                        this.setState({currentIndex: 0})
                    })
                } else {
                    if (response.status === 401) {
                        this.removeUser();
                    }
                }
        }
    }

    constructor(props) {
        super(props);
        this.state={user:null,products:[],currentIndex:0}
        this.loadUser().then(()=>{this.loadProducts()});
        this.props.navigation.addListener('focus',()=>{
            this.loadUser().then(()=>{this.loadProducts()});
        });
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
                    this.createAction(true,this.state.currentIndex);
                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                        useNativeDriver: false
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                } else if (gestureState.dx < -120) {
                    //Swipe A Sinistra
                    console.log("Swipe a Sinistra")
                    this.createAction(false,this.state.currentIndex);
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                        useNativeDriver: false
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                }else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: false
                    }).start()
                }
            }
        })
    }





    renderCards = () =>{
        return this.state.products.map((item,i) => {
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
                <View style={styles.cardContainer}>
                    {this.renderCards()}
                </View>
            </View>
        );
    }
}
