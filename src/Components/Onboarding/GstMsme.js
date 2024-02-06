import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {baseUrl} from '../../baseUrl';

export default class GstMsme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyButtonDisabled: false,
      verifyType: 'gst',
      number: '',
      captchaData: null,
      captcha: null,
      sessionId: null,
    };
  }
  render() {
    console.log(this.props.token);
    const verify = () => {
      if (this.state.number === '') {
        this.props.alert('Enter Number for verification', 'info');
      } else {
        this.setState({verifyButtonDisabled: true});
        if (this.state.verifyType === 'gst') {
          var myHeaders = new Headers();
          myHeaders.append('token', this.props.token);
          myHeaders.append('Content-Type', 'application/json');

          var raw = JSON.stringify({
            gstin_number: this.state.number,
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };

          fetch(`${baseUrl}/verify_gst_details`, requestOptions)
            .then(response => response.json())
            .then(result => {
              if (result.status === 'success') {
                this.props.alert('Added Tax Details', 'success');
                this.props.changeTab('bank');
                this.setState({
                  verifyButtonDisabled: false,
                  verifyType: 'gst',
                  number: '',
                  captchaData: null,
                  captcha: null,
                  sessionId: null,
                });
              } else {
                this.props.alert(result.msg, 'error');
              }
            })
            .catch(error => console.log('error', error));
        } else {
          var myHeaders = new Headers();
          myHeaders.append('token', this.props.token);
          myHeaders.append('Content-Type', 'application/json');

          var raw = JSON.stringify({
            udyam_aadhaar_number: this.state.number,
            captcha: this.state.captcha,
            session_id: this.state.sessionId,
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };

          fetch(`${baseUrl}/verify_msme_details`, requestOptions)
            .then(response => response.json())
            .then(result => {
              if (result.status === 'success') {
                this.props.alert('Added Tax Details', 'success');
                this.props.changeTab('bank');
                this.setState({
                  verifyButtonDisabled: false,
                  verifyType: 'gst',
                  number: '',
                  captchaData: null,
                  captcha: null,
                  sessionId: null,
                });
              } else {
                this.props.alert(result.msg, 'error');
              }
            })
            .catch(error => console.log('error', error));
        }
      }
    };
    const getCaptcha = () => {
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/msme_generate_captcha`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.status === 'success') {
            this.setState({
              captchaData: result.data.data.captcha,
              sessionId: result.data.data.session_id,
            });
          }
        })
        .catch(error => console.log('error', error));
    };
    return (
      <ScrollView style={{paddingHorizontal: 20, marginTop: 30}}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Verify your GST / MSME</Text>
          <View style={styles.field}>
            <Text style={styles.label}>{this.state.verifyType === 'gst' ? 'Provisional GSTN' : 'MSME Number'}</Text>
            <TextInput style={styles.input} placeholder={this.state.verifyType === 'gst' ? 'Enter your GST Number' : 'Enter your MSME Number'} value={this.state.number} onChangeText={e => this.setState({number: e})} />
          </View>
          {this.state.verifyType === 'msme' && (
            <View style={styles.field}>
              <Text style={styles.label}>Captcha</Text>
              <TextInput style={styles.input} placeholder="Captcha" value={this.state.captcha} onChangeText={e => this.setState({captcha: e})} />
              <View style={{marginTop: 10}}>{this.state.captchaData ? <Image source={{uri: `data:image/png;base64,${this.state.captchaData}`}} style={{width: 100, height: 50}} /> : <ActivityIndicator size={30} color={'#0000ff'} />}</View>
            </View>
          )}
          <Pressable
            onPress={() => {
              if (this.state.verifyType === 'gst') {
                this.setState({verifyType: 'msme'});
                this.props.alert('Generating Captcha!', 'info');
                getCaptcha();
              } else {
                this.setState({verifyType: 'gst'});
              }
            }}>
            <Text style={[styles.label, {color: '#059CA6', marginTop: 5}]}>Verify with {this.state.verifyType === 'gst' ? 'MSME Number' : 'GST Number'}</Text>
          </Pressable>
          <Pressable onPress={() => verify()}>
            <View style={styles.submitButton}>{this.state.verifyButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Verify</Text>}</View>
          </Pressable>
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
    marginBottom: 20,
  },
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
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
});
