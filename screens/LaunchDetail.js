import React from 'react'
import { ActivityIndicator, BackHandler, Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native'
import { ButtonGroup, Image, Overlay, Text } from 'react-native-elements'
import firebase from 'react-native-firebase'

import Header from '../components/Header'
import { API_LAUNCH_STATUS } from '../Constants'

export default class LaunchDetail extends React.Component {
  state = {
    selectedIndex: 0,
    showOverlay: false,
    launchStatusDescription: null,
    errorMessage: null,
    isLiked: null,
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    this.collection = firebase.firestore().collection('likes')

    const userEmail = this.props.navigation.getParam('userEmail')
    const launch = this.props.navigation.getParam('launch')
    const docRef = this.collection.doc(userEmail)

    docRef.get()
      .then(doc => {
        if (doc.exists && doc.data()[launch.id]) {
          this.setState({ isLiked: true })
        } else {
          this.setState({ isLiked: false })
        }
      })
      .catch(errorMessage => this.setState({ errorMessage, isLiked: false }))
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  fetchLaunchStatusDescription(statusCode) {
    const idParam = `?id=${statusCode}`

    fetch(API_LAUNCH_STATUS + idParam, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(response => response.json())
      .then(response => this.setState({
        launchStatusDescription: response.types && response.types[0] && response.types[0].description
      }))
      .catch(errorMessage => this.setState({ errorMessage }))
  }

  // Normally I'd just use a stack navigator, but it's very cumbersome due to a version error
  handleBackPress = () => {
    this.props.navigation.navigate('Dashboard')
    return true
  }

  handleLikeLaunch(launch, userEmail) {
    this.setState({ isLiked: !this.state.isLiked })

    this.collection.doc(userEmail).update({
      [launch.id]: !this.state.isLiked
    })
  }

  renderInformation(launch) {
    return (
      <>
        <Text style={styles.tag}>Launch ID</Text>
        <Text style={styles.description}>{launch.id}</Text>

        <Text style={styles.tag}>Hashtag</Text>
        <Text style={styles.description}>{launch.hashtag ? launch.hashtag : 'None'}</Text>

        <Text style={styles.tag}>Status</Text>
        <Text style={styles.description}>{this.state.launchStatusDescription}</Text>
      </>
    )
  }

  renderMissions(launch) {
    // TODO: Map over missions and list their results. Use placeholders while fetching
    return (
      <>
        <Text style={styles.tag}>Mission Name</Text>
        <Text style={styles.description}>Epic Mission #26</Text>

        <Text style={styles.tag}>Type</Text>
        <Text style={styles.description}>{launch.hashtag ? launch.hashtag : 'None'}</Text>

        <Text style={styles.tag}>description</Text>
        <Text style={styles.description}>Going to space with {launch.name}</Text>
      </>
    )
  }

  render() {
    const { selectedIndex, showOverlay, launchStatusDescription, errorMessage, isLiked } = this.state
    const launch = this.props.navigation.getParam('launch')
    const rocketImage = this.props.navigation.getParam('rocketImage')
    const userEmail = this.props.navigation.getParam('userEmail')

    if (launchStatusDescription === null) {
      this.fetchLaunchStatusDescription(launch.status)
    }

    return (
      <View style={styles.container}>
        {/* Image overlay if long pressed */}
        {showOverlay &&
          <Overlay
            isVisible={showOverlay}
            onBackdropPress={() => this.setState({ showOverlay: false })}
          >
            <Image source={{ uri: rocketImage }} style={styles.overlayImage} resizeMode="contain" />
          </Overlay>
        }

        <Header title={launch.name} backHandler={this.handleBackPress} />

        {/* Main View */}
        <View style={styles.mainView}>
          {/* Cover Image */}
          <View style={styles.coverImageView}>
            <TouchableOpacity onPress={() => this.setState({ showOverlay: true })}>
              <Image source={{ uri: rocketImage }} style={styles.coverImage} />
            </TouchableOpacity>
          </View>

          {/* Menu */}
          <View style={styles.menuView}>
            {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
            <ButtonGroup
              onPress={(selectedIndex) => this.setState({ selectedIndex })}
              selectedIndex={selectedIndex}
              buttons={['Information', 'Missions']}
              selectedButtonStyle={styles.selectedButton}
            />
            <View style={styles.menuDetails}>
              {
                selectedIndex === 0 && this.renderInformation(launch) ||
                selectedIndex === 1 && this.renderMissions(launch)
              }
            </View>
            <View style={styles.heartView}>
              {isLiked === null ? <ActivityIndicator size="large" /> :
                <>
                  <TouchableOpacity onPress={() => this.handleLikeLaunch(launch, userEmail)}>
                    <Image
                      source={require('../assets/heart.png')}
                      style={styles.heartImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text style={styles.heartViewText}>{isLiked ? 'You liked this!' : ' '}</Text>
                </>
              }

            </View>
          </View>
        </View>
      </View>
    )
  }
}

const win = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    fontFamily: 'sans-serif',
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
  },
  coverImageView: {
    flex: .4,
    alignItems: 'center',
  },
  coverImage: {
    flex: 1,
    width: win.width,
  },
  overlayImage: {
    width: '100%',
    height: '100%'
  },
  menuView: {
    flex: .6,
    zIndex: 2,
  },
  menuDetails: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  selectedButton: {
    backgroundColor: '#8ecccc'
  },
  tag: {
    color: '#77898F',
    fontSize: 18,
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    color: 'black',
  },
  heartView: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 120,
  },
  heartViewText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#f76299',
  },
  heartImage: {
    height: 40,
    width: 40,
    alignSelf: 'center',
  }
})