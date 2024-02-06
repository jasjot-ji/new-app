import React, {Component} from 'react';
import {ActivityIndicator, BackHandler, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import logo from '../Assets/images/logo.png';
import {TextInput} from 'react-native-gesture-handler';
import {baseUrl} from '../baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginCustomer} from '../Actions';
import {connect} from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      password: '',
      otpButtonDisabled: false,
      accountButtonDisabled: false,
      submitButtonDisabled: false,
      credentialsAdded: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    return true;
  }
  componentDidUpdate() {
    if (this.props.token && this.props.seller_info) {
      if (!this.props.seller_info.gst_tax_status || !this.props.seller_info.bank_details_status || !this.props.seller_info.billing_address_status || !this.props.seller_info.shipping_address_status || !this.props.seller_info.return_address_status || !this.props.seller_info.verified) {
        this.props.navigation.navigate('Onboarding');
      } else {
        this.props.navigation.navigate('Dashboard');
      }
    }
  }
  render() {
    const storeToken = async token => {
      const getData = async () => {
        try {
          let dukkandaar = await AsyncStorage.getItem('DukkandaarSeller');
          if (dukkandaar) {
            dukkandaar = JSON.parse(dukkandaar);
            if (dukkandaar) {
              dukkandaar.token = token;
            } else {
              dukkandaar = {
                token: token,
              };
            }
          } else {
            dukkandaar = {
              token: token,
            };
          }
          try {
            await AsyncStorage.setItem('DukkandaarSeller', JSON.stringify(dukkandaar));
            this.props.setLoginToken(token);
            this.props.alert('Signed In Sucessfully !', 'success');
            this.setState({
              mail: '',
              password: '',
              otpButtonDisabled: false,
              accountButtonDisabled: false,
              submitButtonDisabled: false,
              credentialsAdded: false,
            });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      };
      getData();
    };
    const signin = () => {
      if (this.state.mail === '' || this.state.password === '') {
        this.props.alert('Please enter credentials', 'info');
      } else {
        this.setState({
          submitButtonDisabled: true,
        });
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          email: this.state.mail,
          password: this.state.password,
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch(`${baseUrl}/seller_login`, requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.status === 'success') {
              storeToken(result.token);
            } else {
              this.setState({
                submitButtonDisabled: false,
              });
              this.props.alert(result.msg, 'error');
            }
          })
          .catch(error => console.log('error', error));
      }
    };
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.innerContainer}>
            {!this.state.credentialsAdded ? (
              <>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.welcomeText}>Accelerate your business on the online platform built just for you.</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput style={styles.input} value={this.state.mail} onChangeText={e => this.setState({mail: e.toLowerCase()})} placeholder="Enter your mail address" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true} value={this.state.password} onChangeText={e => this.setState({password: e})} />
                </View>
                <Pressable onPress={() => signin()}>
                  <View style={styles.submitButton}>{this.state.submitButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Sign In</Text>}</View>
                </Pressable>
                <View style={styles.border}></View>
                <View style={styles.field}>
                  <Text style={{textAlign: 'center', color: 'black', fontSize: 16}}>Don't have an account ?</Text>
                  <Pressable onPress={() => this.props.navigation.navigate('Signup')}>
                    <View style={styles.submitButton}>{this.state.accountButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Create New Account</Text>}</View>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.heading}>Enter OTP</Text>
                <Text style={styles.welcomeText}>Please enter the OTP recieved on your mail.</Text>
                <View style={styles.field}>
                  <View style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: 5}}>
                    <Text style={styles.label}>Email : jasjot@gmail.com</Text>
                    <Text style={[styles.label, {color: '#059CA6', marginRight: 5}]}>Change</Text>
                  </View>
                  <TextInput style={styles.input} keyboardType="numeric" maxLength={6} placeholder="Enter OTP Recieved" />
                  <Text style={[styles.label, {color: '#059CA6', marginTop: 5}]}>Resend OTP</Text>
                </View>
                <Pressable>
                  <View style={styles.submitButton}>{this.state.submitButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Submit</Text>}</View>
                </Pressable>
              </>
            )}
          </View>
          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              <Text style={styles.link}>Conditions of Use</Text>
              <Text style={styles.link}>Privacy Policy</Text>
              <Text style={styles.link}>Help</Text>
            </View>
            <Text style={{textAlign: 'center', color: '#697475', marginTop: 10}}>© 1996-2023, Dukkandaar.com, Inc. or its affiliates</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: '100%',
  },
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 134,
    height: 40,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#00000070',
    lineHeight: 20,
    marginBottom: 10,
  },
  field: {
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: '#00000080',
    fontFamily: 'Roboto-Bold',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginTop: 2,
    fontSize: 14,
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#FFD814',
    borderRadius: 100,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
  },
  border: {
    width: '100%',
    height: 1,
    backgroundColor: '#697475',
    marginVertical: 10,
  },
  footer: {
    marginBottom: 50,
    marginTop: 10,
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  link: {
    color: '#059CA6',
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
export default connect(mapStateToProps, mapDispatchToProps)(Signin);
