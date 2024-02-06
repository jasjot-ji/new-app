import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable, TextInput} from 'react-native';
import logo from '../Assets/images/logo.png';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import FIcon from 'react-native-vector-icons/Foundation';
import Sidebar from '../Components/Common/Sidebar';
import {baseUrl} from '../baseUrl';

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitButtonDisabled: false,
      otpSent: false,
      sidebarOpened: false,
      otp: '',
      new_password: '',
      confirm_password: '',
    };
  }
  render() {
    const closeSideBar = () => {
      this.setState({sidebarOpened: false});
    };
    const sendOTP = () => {
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/pass_send_otp`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.setState({otpSent: true});
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => console.log('error', error));
    };
    const changePassword = () => {
      if (this.state.otp === '' || this.state.new_password === '' || this.state.confirm_password === '') {
        this.props.alert('Please enter OTP and Password!', 'info');
      } else {
        if (this.state.new_password !== this.state.confirm_password) {
          this.props.alert('Passwords do not match!', 'info');
        } else {
          var myHeaders = new Headers();
          myHeaders.append('token', this.props.token);
          myHeaders.append('Content-Type', 'application/json');

          var raw = JSON.stringify({
            password: this.state.new_password,
            OTP: this.state.otp,
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };

          fetch(`${baseUrl}/editpassword`, requestOptions)
            .then(response => response.json())
            .then(result => {
              if (result.status === 'success') {
                this.props.alert(result.msg, 'success');
                this.props.navigation.navigate('Settings');
              } else {
                this.setState({otpSent: false});
                this.props.alert(result.msg, 'error');
              }
            })
            .catch(error => console.log('error', error));
        }
      }
    };
    return (
      <SafeAreaView style={styles.container}>
        {this.state.sidebarOpened && <Sidebar navigation={this.props.navigation} alert={this.props.alert} closeSideBar={closeSideBar} />}
        <View style={styles.logoContainer}>
          <Pressable style={{position: 'absolute', left: 0, top: 0, width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={() => this.setState({sidebarOpened: !this.state.sidebarOpened})}>
            <FIcon name="list" size={25} color="black" />
          </Pressable>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.innerContainer}>
          <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF'}}>Change Password</Text>
          <ScrollView>
            {!this.state.otpSent ? (
              <View style={{paddingHorizontal: 20}}>
                <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, fontSize: 16}}>We'll send you a code to your email address</Text>
                <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14}}>We can send a login code to:</Text>
                <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14, marginVertical: 5}}>{this.props.seller_info && this.props.seller_info.email}</Text>
                <Pressable style={{display: 'flex', flexDirection: 'row'}} onPress={() => sendOTP()}>
                  <View style={styles.submitButton}>{this.state.submitButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Submit</Text>}</View>
                </Pressable>
              </View>
            ) : (
              <View style={{paddingHorizontal: 20}}>
                <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, fontSize: 16}}>Enter OTP and New Password</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>OTP</Text>
                  <TextInput style={styles.input} placeholder="Enter OTP recieved" value={this.props.otp} onChangeText={e => this.setState({otp: e})} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput style={styles.input} placeholder="Enter New Password" value={this.props.new_password} onChangeText={e => this.setState({new_password: e})} secureTextEntry={true} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput style={styles.input} placeholder="Enter Confirm Password" value={this.props.confirm_password} onChangeText={e => this.setState({confirm_password: e})} secureTextEntry={true} />
                </View>
                <Pressable onPress={() => changePassword()}>
                  <View style={styles.submitButton}>{this.state.submitButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Submit</Text>}</View>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  innerContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 10,
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD814',
    borderRadius: 100,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 7,
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
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(Security);
