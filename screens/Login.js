import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import firebase from 'react-native-firebase'
import LinearGradient from 'react-native-linear-gradient'
import { Image } from 'react-native-elements'

import { ERROR_MSG_EMPTY_FIELDS } from "../Constants"

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {
    const { email, password } = this.state

    if (email === '' || password === '') {
      this.setState({ errorMessage: ERROR_MSG_EMPTY_FIELDS })
      return
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Dashboard'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#64D5FF', '#00C4FF']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.centeredRow}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.headerText}>RocketCo.</Text>
          </View>
          <View style={styles.inputBoxEmail}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor='rgba(24, 106, 106, .4)'
              autoCapitalize="none"
              placeholder="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </View>
          <View style={styles.inputBoxPassword}>
            <TextInput
              secureTextEntry
              style={styles.textInput}
              placeholderTextColor='rgba(24, 106, 106, .4)'
              autoCapitalize="none"
              placeholder="Password"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>
          {this.state.errorMessage &&
            <Text style={styles.error}>
              {this.state.errorMessage}
            </Text>}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={styles.text} >Don't have an account?{"\n"}Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleLogin}>
              <Text style={styles.text} >Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 54,
  },
  centeredRow: {
    alignItems: 'center'
  },
  logo: {
    marginTop: 100,
    marginHorizontal: 42,
    height: 139 * 1.05,
    width: 148 * 1.05,
  },
  headerText: {
    fontFamily: 'ProximaNova-Bold',
    color: 'white',
    fontSize: 34,
    marginTop: 15,
  },
  inputBoxEmail: {
    height: 38,
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#F0FFFF',
    marginTop: 12,
    marginBottom: 9,
    paddingHorizontal: 10,
  },
  inputBoxPassword: {
    height: 38,
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#F0FFFF',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  placeholderText: {
    fontFamily: 'ProximaNova-Regular',
    color: '#186A6A',
    fontSize: 16,
  },
  textInput: {
    fontFamily: 'ProximaNova-Regular',
    color: 'rgba(24, 106, 106, 1)',
    fontSize: 17,
  },
  text: {
    fontFamily: 'ProximaNova-SemiBold',
    color: 'white',
    fontSize: 17,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  error: {
    color: '#BD0000',
    fontFamily: 'ProximaNova-Bold',
    marginBottom: 10,
    marginTop: -6,
    fontSize: 16,
  }
})