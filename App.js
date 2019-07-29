import { createSwitchNavigator, createAppContainer } from 'react-navigation'
// import the different screens
import Loading from './screens/AuthLoading'
import SignUp from './screens/SignUp'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
// create our app's navigation stack
export default createAppContainer(createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Dashboard
  },
  {
    initialRouteName: 'Loading'
  }
))