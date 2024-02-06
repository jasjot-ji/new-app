import React, {Component} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {baseUrl} from '../../baseUrl';

export default class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyButtonDisabled: false,
      otp: '',
      otpButtonDisabled: false,
      otpSent: false,
    };
  }
  render() {
    const verify = () => {
      if (this.state.otp === '' || this.state.otp.length !== 6) {
        this.props.alert('Please Enter Correct OTP!', 'info');
      } else {
        this.setState({verifyButtonDisabled: true});
        var myHeaders = new Headers();
        myHeaders.append('token', this.props.token);
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          OTP: this.state.otp,
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch(`${baseUrl}/signup_verify_otp`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            if (result.status === 'success') {
              this.props.alert("OTP Verified", 'success');
              this.props.changeTab('gst');
            } else {
              this.props.alert(result.msg, 'error');
            }
            this.setState({
              verifyButtonDisabled: false,
              otp: '',
              otpButtonDisabled: false,
              otpSent: false,
            });
          })
          .catch(error => console.log('error', error));
      }
    };
    const sendOTP = () => {
      this.setState({
        otpButtonDisabled: true,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/signup_send_otp`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.setState({
              otpButtonDisabled: false,
              otpSent: true,
            });
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => console.log('error', error));
    };
    return (
      <ScrollView style={{paddingHorizontal: 20, marginTop: 30}}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Verify your Account</Text>
          {!this.state.otpSent ? (
            <View style={styles.field}>
              <Text style={styles.label}>Mobile Number : {this.props.seller_info.number}</Text>
              <Pressable onPress={() => sendOTP()}>
                <View style={styles.submitButton}>{this.state.otpButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Send OTP</Text>}</View>
              </Pressable>
            </View>
          ) : (
            <View style={styles.field}>
              <Text style={styles.label}>Mobile Number : {this.props.seller_info.number}</Text>
              <TextInput style={styles.input} placeholder="Enter OTP Received" value={this.state.otp} onChangeText={e => this.setState({otp: e})} keyboardType="numeric" />
              <Pressable onPress={() => verify()}>
                <View style={styles.submitButton}>{this.state.verifyButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Verify</Text>}</View>
              </Pressable>
            </View>
          )}
          {/* <TextInput style={styles.input} placeholder={this.state.verifyType === 'gst' ? 'Enter your GST Number' : 'Enter your MSME Number'} value={this.state.number} onChangeText={e => this.setState({number: e})} />
            <Pressable
              onPress={() => {
                if (this.state.verifyType === 'gst') {
                  this.setState({verifyType: 'msme'});
                } else {
                  this.setState({verifyType: 'gst'});
                }
              }}>
              <Text style={[styles.label, {color: '#059CA6', marginTop: 5}]}>Verify with {this.state.verifyType === 'gst' ? 'MSME Number' : 'GST Number'}</Text>
            </Pressable> */}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    position: 'relative',
    marginTop: 10,
  },
  headerBoarder: {
    width: '100%',
    height: 2,
    backgroundColor: '#bbb',
  },
  headerText: {
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'white',
    padding: 10,
  },
  headTextBox: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: -20,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 10,
  },
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  field: {
    marginVertical: 20,
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
});
