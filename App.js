import * as React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductTab from './components/productTab/ProductTab'
import ProfileTab from './components/profileTab/ProfileTab'
import MatchesTab from './components/matchesTab/MatchesTab'

const Stack = createBottomTabNavigator();

const iconSize=30;

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ProductTab" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MatchesTab" component={MatchesTab} options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="exclamation" size={iconSize} color={{color:color}} />
                    )}}/>
                <Stack.Screen name="ProductTab" component={ProductTab} options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="search" size={iconSize} color={{color:color}} />
                    )}}/>
                <Stack.Screen name="ProfileTab" component={ProfileTab} options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="user" size={iconSize} color={{color:color}} />
                    )}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
