import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'

export default class AuthLoading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      // Navigates to Login screen or Dashboard whenever user changes
      this.props.navigation.navigate(user ? 'Dashboard' : 'Login')
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>AuthLoading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})