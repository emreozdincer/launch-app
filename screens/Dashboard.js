import React from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'
import firebase from 'react-native-firebase'

import { API_LAUNCHES } from "../Constants"

export default class Dashboard extends React.Component {
  state = {
    currentUser: null,
    errorMessage: null,

    // launch data
    launches: [],
    launchOffset: 0,
    launchCount: 0
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    this.getFirst10Launches()
  }

  getFirst10Launches() {
    const today = new Date()
    let threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3))
    let sixMonthsEarlier = new Date(today.setMonth(today.getMonth() - 9)) // -9 because the prev line's mutation

    threeMonthsLater = threeMonthsLater.toISOString().slice(0, 10);
    sixMonthsEarlier = sixMonthsEarlier.toISOString().slice(0, 10);

    const dateParams = `?startdate=${sixMonthsEarlier}&enddate=${threeMonthsLater}`

    fetch(API_LAUNCHES + dateParams, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => this.setState({
        launches: response.launches,
        launchOffset: response.offest,
        launchCount: response.count
      }))
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => this.props.navigation.navigate('Login'))
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  render() {
    const { currentUser } = this.state
    return (
      <View style={styles.container}>
        {/* HEADER ROW*/}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Launch List</Text>
        </View>

        {/* MAIN VIEW */}
        <View style={styles.main}>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>
          }
          <Text>
            Hi {currentUser && currentUser.email}!
          </Text>
          <Button title="Sign Out" onPress={this.handleSignOut} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerRow: {
    flex: 0.1,
    backgroundColor: 'red',
    width: '100%',
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    margin: 5,
  },
  main: {
    flex: 0.9,
    justifyContent: 'center'
  }
})