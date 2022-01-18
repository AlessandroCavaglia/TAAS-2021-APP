# react-native-css-vh-vw

A ditto of CSS `vw` and `vh` units - returns, in pixels, a percentage of the device's 
viewport width or height. 

## Install
`npm install react-native-css-vh-vw`

## Dependencies
`react-native-css-vh-vw` itself has no dependencies, but it _must_ be used within a
React Native project. The only React Native API that it relies on is [`Dimensions`](https://reactnative.dev/docs/dimensions), which has support all the way back to React Native's [first release](https://reactnative.dev/docs/0.5/dimensions).

## Usage

#### Simply pass a value between 1 and 1000 to `vh()` or `vw()` to style React Native components.

##### 50% of your device's viewport height: `vh(50)`.

##### 33.3% of your device's viewport width: `vw(33.3)`.

##### Examples

- Using `vh()` and `vw()` to set dimensions of `<View>`:
Component:
```javascript
const VhVwDemo = (props) => {

  return (
    <View style={{
      height: vh(60),
      width: vw(50),
      backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ color: 'white' }}>height: vh(60)</Text>
      <Text style={{ color: 'white' }}>width: vh(50)</Text>
    </View>
  );
}

export default VhVwDemo;
```

Output:  
![vh() and vw() <View> example](https://res.cloudinary.com/munsch-creative/image/upload/v1585928961/vh-vw-demo-view_jwpva3.png "vh() and vw() <View> example")



- Using `vh()` and `vw()` to set dimensions of `<Text>`:
```javascript
const VhVwDemo = (props) => {

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: vw(10) }}>fontSize: vw(10)</Text>
      <Text style={{ fontSize: vh(5) }}>fontSize: vh(5)</Text>
    </View>
  );
}

export default VhVwDemo;
```

Output:  
![vh() and vw() <Text> example](https://res.cloudinary.com/munsch-creative/image/upload/v1585928966/vh-vw-demo-text_uua0n9.png "vh() and vw() <Text> example")
