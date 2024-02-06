import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import logo from '../Assets/images/logo.png';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import AIcon from 'react-native-vector-icons/EvilIcons';
import {baseUrl} from '../baseUrl';
import {loginCustomer} from '../Actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      password: '',
      shop_name: '',
      seller_name: '',
      mobile: '',
      otpButtonDisabled: false,
      accountButtonDisabled: false,
      submitButtonDisabled: false,
      credentialsAdded: false,
      gender: '',
      dateModalOpened: false,
      date: new Date(),
      displayDate: null,
    };
  }
  componentDidUpdate() {
    if (this.props.token && this.props.seller_info) {
      console.log(this.props.seller_info);
      this.props.navigation.navigate('Onboarding');
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
            this.setState({
              mail: '',
              password: '',
              shop_name: '',
              seller_name: '',
              mobile: '',
              otpButtonDisabled: false,
              accountButtonDisabled: false,
              submitButtonDisabled: false,
              credentialsAdded: false,
              gender: '',
              dateModalOpened: false,
              date: new Date(),
              displayDate: null,
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
    const changeDate = date => {
      const dt = date;
      const yyyy = dt.getFullYear();
      let mm = dt.getMonth() + 1; // Months start at 0!
      let dd = dt.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedToday = yyyy + '-' + mm + '-' + dd;
      this.setState({displayDate: formattedToday, date: date, dateModalOpened: false});
    };
    const signUp = () => {
      if (this.state.mail === '' || this.state.password === '' || this.state.gender === '' || this.state.displayDate === null || this.state.shop_name === '' || this.state.seller_name === '' || this.state.mobile === '') {
        this.props.alert('Please enter credentials', 'info');
      } else {
        this.setState({
          submitButtonDisabled: true,
        });
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          number: this.state.mobile,
          shop_name: this.state.shop_name,
          gender: this.state.gender,
          dob: this.state.displayDate,
          seller_name: this.state.seller_name,
          email: this.state.mail,
          password: this.state.password,
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch(`${baseUrl}/seller_signup`, requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.status === 'success') {
              this.props.alert(result.msg, 'success');
              storeToken(result.token);
            } else {
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.innerContainer}>
              {!this.state.credentialsAdded ? (
                <>
                  <Text style={styles.heading}>Create your account</Text>
                  <Text style={styles.welcomeText}>Become a Dukkandaar seller and grow your business.</Text>
                  <View style={styles.field}>
                    <Text style={styles.label}>Shop Name</Text>
                    <TextInput style={styles.input} placeholder="Enter your shop name" value={this.state.shop_name} onChangeText={e => this.setState({shop_name: e})} />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Seller Name</Text>
                    <TextInput style={styles.input} placeholder="Enter your seller name" value={this.state.seller_name} onChangeText={e => this.setState({seller_name: e})} />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="Enter your email" value={this.state.mail} onChangeText={e => this.setState({mail: e.toLowerCase()})} />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Mobile</Text>
                    <TextInput style={styles.input} placeholder="Enter your mobile number" value={this.state.mobile} onChangeText={e => this.setState({mobile: e})} />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.pickerBox}>
                      <Picker itemStyle={styles.picker} mode="dropdown" selectedValue={this.state.gender} onValueChange={e => this.setState({gender: e})}>
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <View style={styles.dateBox}>
                      <Text style={styles.date}>{this.state.displayDate || 'Date of Birth'}</Text>
                      <Pressable
                        onPress={() => {
                          this.setState({dateModalOpened: true});
                        }}>
                        <AIcon name="calendar" size={45} color={'black'} />
                      </Pressable>
                    </View>
                    <DatePicker
                      mode="date"
                      modal={true}
                      open={this.state.dateModalOpened}
                      theme="light"
                      date={this.state.date}
                      onConfirm={date => changeDate(date)}
                      onCancel={() => {
                        this.setState({dateModalOpened: false});
                      }}
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true} value={this.state.password} onChangeText={e => this.setState({password: e})} />
                  </View>
                  <Pressable onPress={() => signUp()}>
                    <View style={styles.submitButton}>{this.state.submitButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Sign Up</Text>}</View>
                  </Pressable>
                  <View style={styles.border}></View>
                  <View style={styles.field}>
                    <Text style={{textAlign: 'center', color: 'black', fontSize: 16}}>Already have an account ?</Text>
                    <Pressable onPress={() => this.props.navigation.navigate('Signin')}>
                      <View style={styles.submitButton}>{this.state.accountButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>SignIn</Text>}</View>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.heading}>Enter OTP</Text>
                  <Text style={styles.welcomeText}>Please enter the OTP recieved.</Text>
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
          </ScrollView>
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
  pickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  date: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    fontSize: 14,
    color: 'black',
    flexShrink: 1,
    width: '100%',
  },
  date: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginTop: 3,
    fontSize: 14,
    color: 'black',
    flexShrink: 1,
    width: '100%',
  },
  dateBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
