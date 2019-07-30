import React from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'
import firebase from 'react-native-firebase'

import { API_LAUNCHES, API_ROCKETS, URL_DEFAULT_ROCKET_IMG } from "../Constants"

export default class Dashboard extends React.Component {
  state = {
    currentUser: null,
    errorMessage: null,

    // launch data
    fetchingLaunches: true,
    launches: [],
    launchOffset: 0,
    launchCount: 0,

    // rocket data
    fetchingRocketImages: true,
    rocketImages: [],
  }

  async componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    await this.getFirst10Launches()
    this.getRocketImages()
  }

  async getFirst10Launches() {
    const today = new Date()
    let threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3))
    let sixMonthsEarlier = new Date(today.setMonth(today.getMonth() - 9)) // -9 because the prev line's mutation

    threeMonthsLater = threeMonthsLater.toISOString().slice(0, 10)
    sixMonthsEarlier = sixMonthsEarlier.toISOString().slice(0, 10)

    const dateParams = `?startdate=${sixMonthsEarlier}&enddate=${threeMonthsLater}`

    await fetch(API_LAUNCHES + dateParams, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(response => response.json())
      .then(response => this.setState({
        launches: response.launches,
        launchOffset: response.offest,
        launchCount: response.count,
        fetchingLaunches: false,
      }))
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  async getRocketImages() {
    // Get rocket names from launches
    const originalNames = this.state.launches.map(launch => {
      const endIndex = launch.name.indexOf('|')
      return launch.name.slice(0, endIndex - 1)
    })

    // Encode rocket names, while keeping the originals
    const encodedNames = originalNames.map(name => {
      // Handle Edge Cases
      const firstParanthesisIndex = name.indexOf('(')
      if (firstParanthesisIndex !== -1) {
        name = name.slice(0, firstParanthesisIndex)
      }
      // Encode
      return encodeURIComponent(name)
    })

    // Get rocket images for launches
    const rocketImages = []
    for (let index = 0; index < encodedNames.length; index++) {
      const nameParam = `?name=${encodedNames[index]}`
      await fetch(API_ROCKETS + nameParam, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then(response => response.json())
        .then(response => {
          if (Array.isArray(response.rockets)) {
            const rocket = response.rockets.filter(rocket => rocket.name === originalNames[index])[0]
            if (!rocket.imageURL) { // no rocket image exists
              rocketImages.push(URL_DEFAULT_ROCKET_IMG)
            } else if (!rocket.imageSizes) { // only 1 img exists
              rocketImages.push(rocket.imageURL)
            } else { // various img sizes exist
              const smallRocketImageUrl = rocket.imageURL.replace(
                rocket.imageSizes[rocket.imageSizes.length - 1],
                rocket.imageSizes[0]
              )
              rocketImages.push(smallRocketImageUrl)
            }
          } else { // Bad response from api for the specific call
            rocketImages.push(URL_DEFAULT_ROCKET_IMG)
          }
        })
        .catch(errorMessage => this.setState({ errorMessage }))
    }

    this.setState({ rocketImages, fetchingRocketImages: false })
  }

  handleSignOut = () => {
    firebase
      .auth()
      .signOut() // auto-navigates to login screen via the listener set in AuthLoading
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  // TODO: Add placeholders while fetchnig
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