import React, {Component} from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';
import logo from '../Assets/images/logo.png';
import {connect} from 'react-redux';
import {loginCustomer} from '../Actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
  }
  componentDidMount() {
    if (this.props.token && this.props.seller_info && this.props.navigation.isFocused('Splash')) {
      if (!this.props.seller_info.gst_tax_status || !this.props.seller_info.bank_details_status || !this.props.seller_info.billing_address_status || !this.props.seller_info.shipping_address_status || !this.props.seller_info.return_address_status) {
        this.props.navigation.navigate('Onboarding');
      } else {
        this.props.navigation.navigate('Dashboard');
      }
    } else {
      const getData = async () => {
        try {
          let dukkandaar = await AsyncStorage.getItem('DukkandaarSeller');
          dukkandaar = JSON.parse(dukkandaar);
          if (dukkandaar) {
            let token = dukkandaar.token;
            if (token) {
              this.props.setLoginToken(token);
            }
          } else {
            this.props.navigation.navigate('Signin');
          }
        } catch (e) {
          console.log(e);
        }
      };
      getData();
    }
  }
  componentDidUpdate() {
    if (this.props.token && this.props.seller_info && this.props.navigation.isFocused('Splash')) {
      if (!this.props.seller_info.gst_tax_status || !this.props.seller_info.bank_details_status || !this.props.seller_info.billing_address_status || !this.props.seller_info.shipping_address_status || !this.props.seller_info.return_address_status) {
        this.props.navigation.navigate('Onboarding');
      } else {
        this.props.navigation.navigate('Dashboard');
      }
    } else if (!this.props.token && !this.props.seller_info) {
      this.props.navigation.navigate('Signin');
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={logo} style={styles.logo} />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 60,
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
const mapDispatchToProps = dispatch => {
  const setLoginToken = token => {
    dispatch(loginCustomer(token));
  };
  return {
    setLoginToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
