import React from 'react'
import { Button, Card, Icon } from 'react-native-elements'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import firebase from 'react-native-firebase'

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

  handleSignOut = () => {
    firebase
      .auth()
      .signOut() // auto-navigates to login screen via the listener set in AuthLoading
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  renderLaunches() {
    const { launches, rocketImages } = this.state

    const cards = launches.map((launch, i) => {
      const [date, time] = launch.windowstartGMT3String.split(' ')

      return <Card
        key={i}
        image={rocketImages[i] ? { uri: rocketImages[i] } : undefined}
      >
        <Text style={styles.cardTitle}>{launch.name}</Text>
        <View style={styles.cardDescription}>

          <Text style={styles.cardDescriptionDate}>{date}</Text>
          <Text style={styles.cardDescriptionTime}>{time}</Text>
        </View>
      </Card>
    })

    return cards
  }

  // TODO: Add placeholders while fetching
  render() {
    const { currentUser, errorMessage, launches, rocketImages } = this.state
    return (
      <View style={styles.container}>
        {/* HEADER ROW*/}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Launch List</Text>
          <View style={styles.headerRightCol}>
            {currentUser &&
              <Text style={styles.currentUserText} numberOfLines={1}>
                {currentUser.email}
              </Text>
            }
            <Button
              onPress={this.handleSignOut}
              icon={<Icon
                name="log-out"
                type="feather"
                color="white"
              />}
              title="Log out"
              type="clear"
              titleStyle={{color:'white', marginLeft: 5}}
            />

          </View>
        </View>

        {/* MAIN VIEW */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.mainView}>
            {errorMessage &&
              <Text style={{ color: 'red' }}>
                {errorMessage}
              </Text>
            }
            {launches.length > 0 && this.renderLaunches()}
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
  headerRow: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#8ecccc',
    color: 'white',
    width: '100%',
  },
  headerText: {
    flex: .5,
    fontSize: 25,
    marginLeft: 10,
    textAlignVertical: 'center',
    color: 'white',
  },
  headerRightCol: {
    flex: .25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  currentUserText: {
    color: 'white',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 0.9
  },
  main: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'green',
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