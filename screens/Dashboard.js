import React from 'react'
import { Card } from 'react-native-elements'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native'
import firebase from 'react-native-firebase'
import { Placeholder, PlaceholderMedia, Fade } from "rn-placeholder"

import Header from '../components/Header'
import { API_LAUNCHES, API_ROCKETS, URL_DEFAULT_ROCKET_IMG } from "../Constants"
import parseDate from '../util/parseDate'
import prettifyDate from '../util/prettifyDate'

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

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    this.initializeData()
  }

  async initializeData() {
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
      .then(response => {
        // Parse dates into specified GMT+3 format for display.
        response.launches = response.launches.map(launch => {
          let date = new Date(...parseDate(launch.windowstart))
          date.setHours(date.getHours() + 3)
          launch.windowstartGMT3String = prettifyDate(date)
          return launch
        })

        this.setState({
          launches: response.launches,
          launchOffset: response.offest,
          launchCount: response.count,
          fetchingLaunches: false,
        })
      })
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

  handleLogOut = () => {
    firebase
      .auth()
      .signOut() // auto-navigates to login screen via the listener set in AuthLoading
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  handleCardPress(launchId) {
    const { launches, rocketImages, currentUser } = this.state

    this.props.navigation.navigate('LaunchDetail', {
      launch: launches[launchId],
      rocketImage: rocketImages[launchId],
      userEmail: currentUser.email
    })
  }

  renderLaunches() {
    const { launches, rocketImages } = this.state

    const cards = launches.map((launch, i) => {
      const [date, time] = launch.windowstartGMT3String.split(' ')
      return (
        <TouchableOpacity key={i}
          // only enable press when images are loaded
          onPress={rocketImages[i] ? () => this.handleCardPress(i) : undefined}
        >
          <Card
            image={rocketImages[i] ? { uri: rocketImages[i] } : undefined}
          >
            {!rocketImages[i] ?
              <Placeholder Animation={Fade}>
                <PlaceholderMedia style={{ height: 150, width: '100%' }} />
              </Placeholder>
              : undefined // added the else statement because otherwise compiler complains about bad children
            }
            <Text style={styles.cardTitle}>{launch.name}</Text>
            <View style={styles.cardDescription}>
              <Text style={styles.cardDescriptionDate}>{date}</Text>
              <Text style={styles.cardDescriptionTime}>{time}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      )
    })

    return cards
  }

  render() {
    const { currentUser, errorMessage, fetchingLaunches } = this.state
    return (
      <View style={styles.container}>
        <Header currentUser={currentUser} title={'Launch List'} logOutHandler={this.handleLogOut} />

        {/* MAIN VIEW */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.mainView}>
            {errorMessage &&
              <Text style={{ color: 'red' }}>
                {errorMessage}
              </Text>
            }
            {fetchingLaunches ? <ActivityIndicator size="large" style={{marginTop: 40}}/> : this.renderLaunches()}
          </View>

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    fontFamily: 'sans-serif',
  },
  scrollView: {
    flex: 0.9
  },
  main: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})