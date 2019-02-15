/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';

import { createBottomTabNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import ListScreen from './ListScreen';
import StationScreen from './StationScreen';


export default class App extends React.Component {
  render() {
    return (
      <TabNavigator />
    );
  }
}
const TabNavigator =  createBottomTabNavigator({
  Home: HomeScreen,
  List: ListScreen,
  Station: StationScreen
});