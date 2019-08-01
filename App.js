import { createSwitchNavigator, createAppContainer } from 'react-navigation'
// import the different screens
import AuthLoading from './screens/AuthLoading'
import SignUp from './screens/SignUp'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import LaunchDetail from "./screens/LaunchDetail"

// Unfortunately stack navigator with RNv0.60 is broken and cumbersome to fix so I fake implement it my own way.
// const DashboardStack = createStackNavigator({ Dashboard, LaunchDetail })

// create our app's navigation stack
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading,
    SignUp,
    Login,
    Dashboard,
    LaunchDetail
  },
  {
    initialRouteName: 'AuthLoading'
  }
))