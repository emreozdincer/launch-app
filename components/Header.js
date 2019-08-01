import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button, Icon } from 'react-native-elements'

export default Header = props => {
  const { title, currentUser, backHandler, logOutHandler } = props

  return (
    <View style={styles.headerRow}>
      {backHandler !== undefined &&
        <Icon
          name="back"
          type="antdesign"
          color="white"
          onPress={backHandler}
          containerStyle={styles.iconContainer}
        />
      }
      <Text style={styles.headerText} numberOfLines={1}>{title}</Text>
      <View style={styles.headerRightCol}>
        {currentUser &&
          <Text style={styles.currentUserText} numberOfLines={1}>
            {currentUser.email}
          </Text>
        }
        {logOutHandler && <Button
          onPress={logOutHandler}
          icon={<Icon
            name="log-out"
            type="feather"
            color="white"
          />}
          title="Log out"
          type="clear"
          titleStyle={{ color: 'white', marginLeft: 5 }}
        />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexGrow: 1,
  },
  headerRightCol: {
    flex: .25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginRight: 15,
    marginBottom: 5,
  },
  currentUserText: {
    color: 'white',
    fontStyle: 'italic',
  },
  iconContainer: {
    marginLeft: 10,
    marginRight: 40,
  }
})