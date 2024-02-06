import React, {Component} from 'react';
import {Animated, StatusBar, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Signin from './Screens/Signin';
import Signup from './Screens/Signup';
import Onboarding from './Screens/Onboarding';
import Dashboard from './Screens/Dashboard';
import Settings from './Screens/Settings';
import Listings from './Screens/Listings';
import SplashScreen from './Screens/SplashScreen';
import Security from './Screens/Security';
import Address from './Screens/Address';
import BankDetails from './Screens/BankDetails';
import GstDetails from './Screens/GSTDetails';
import Inventory from './Screens/Inventory';
import {connect} from 'react-redux';
import {getSellerInfo} from './Actions';
import EditBankDetails from './Screens/EditBankDetails';
import EditAddress from './Screens/EditAddress';
import Orders from './Screens/Orders';
import AddPickupAddress from './Screens/AddPickupAddress';
const Stack = createStackNavigator();

class AppRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toasterTop: new Animated.Value(-100),
      toasterMessage: '',
      toasterColor: '#ff0000',
    };
  }
  componentDidUpdate() {
    if (this.props.token && !this.props.seller_info) {
      this.props.getSellerDetails(this.props.token);
    }
    // console.log(this.props);
  }
  render() {
    const alert = (msg, type) => {
      let color;
      if (type === 'error') color = '#ff0000';
      else if (type === 'warning') color = '#ffff00';
      else if (type === 'info') color = '#0000ff';
      else if (type === 'success') color = '#00ff00';
      this.setState({toasterMessage: msg, toasterColor: color});
      Animated.timing(this.state.toasterTop, {
        toValue: 40,
        duration: 200,
        useNativeDriver: true,
      }).start(finished => {
        setTimeout(() => {
          Animated.timing(this.state.toasterTop, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }, 2000);
      });
    };
    return (
      <>
        <StatusBar backgroundColor="#000" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Signin">{props => <Signin {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Signup">{props => <Signup {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Onboarding">{props => <Onboarding {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Dashboard">{props => <Dashboard {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Settings">{props => <Settings {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Security">{props => <Security {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="BankDetails">{props => <BankDetails {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="EditBankDetails">{props => <EditBankDetails {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Address">{props => <Address {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="EditAddress">{props => <EditAddress {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Listings">{props => <Listings {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="GSTDetails" component={GstDetails} />
            <Stack.Screen name="Inventory">{props => <Inventory {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="Orders">{props => <Orders {...props} alert={alert} />}</Stack.Screen>
            <Stack.Screen name="AddPickupAddress">{props => <AddPickupAddress {...props} alert={alert} />}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
        <Animated.View style={{position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, transform: [{translateY: this.state.toasterTop}]}}>
          <Text style={{backgroundColor: 'white', fontSize: 14, fontFamily: 'Roboto-Medium', padding: 10, textAlign: 'center', width: 250, borderColor: this.state.toasterColor, borderBottomWidth: 1, elevation: 10, shadowColor: this.state.toasterColor}}>{this.state.toasterMessage}</Text>
        </Animated.View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state,
    token: state.token,
    seller_info: state.seller_info,
  };
};
const mapDispatchToProps = dispatch => {
  const getSellerDetails = token => {
    dispatch(getSellerInfo(token));
  };
  return {
    getSellerDetails,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
