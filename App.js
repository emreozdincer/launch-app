import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
// import the different screens
import Loading from './screens/AuthLoading'
import SignUp from './screens/SignUp'
import Login from './screens/Login'
import Main from './screens/Main'
// create our app's navigation stack
export default createAppContainer(createSwitchNavigator(
  {
  Loading,
  SignUp,
  Login,
  Main
  },
  {
  initialRouteName: 'Loading'
  }
  ))