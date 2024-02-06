import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {baseUrl} from '../baseUrl';
import FIcon from 'react-native-vector-icons/Foundation';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import logo from '../Assets/images/logo.png';
import {connect} from 'react-redux';
import {getSellerInfo} from '../Actions';
import {Picker} from '@react-native-picker/picker';
import {states} from '../utils/States';

class EditBankDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyButtonDisabled: false,
      state: '',
      town_city: '',
      flat_house_building: '',
      area: '',
      landmark: '',
      pincode: '',
      address_type: '',
    };
  }
  componentDidMount() {
    const address = this.props.route.params.address;
    this.setState({
      state: address.state,
      town_city: address.town_city,
      flat_house_building: address.flat_house_building,
      area: address.area,
      landmark: address.landmark,
      pincode: address.pincode,
      address_type: address.address_type,
    });
  }
  render() {
    const editDetails = () => {
      if (this.state.state === '' || this.state.town_city === '' || this.state.flat_house_building === '' || this.state.area === '' || this.state.landmark === '' || this.state.pincode === '' || this.state.address_type === '') {
        this.props.alert('Enter complete details', 'info');
      } else {
        var myHeaders = new Headers();
        myHeaders.append('token', this.props.token);
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          state: this.state.state,
          town_city: this.state.town_city,
          flat_house_building: this.state.flat_house_building,
          area: this.state.area,
          landmark: this.state.landmark,
          pincode: this.state.pincode,
          address_type: this.state.address_type,
          billing_default_address: this.state.billing_default_address,
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch(`${baseUrl}/edit_seller_address/${this.props.route.params.address.sellers_address_id}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.status === 'success') {
              this.props.alert('Edited Address', 'success');
              this.props.navigation.navigate('Address', {edited: true});
            } else {
              this.props.alert(result.msg, 'error');
            }
          })
          .catch(error => console.log('error', error));
      }
    };
    const closeSideBar = () => {
      this.setState({sidebarOpened: false});
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
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF', marginBottom: 10}}>Edit Address</Text>
        <ScrollView style={{paddingHorizontal: 20}}>
          <View style={styles.field}>
            <Text style={styles.label}>Flat, House no., Building, Apartment</Text>
            <TextInput style={styles.input} placeholder="Enter Flat, House no., Building,  Apartment" value={this.state.flat_house_building} onChangeText={e => this.setState({flat_house_building: e})} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Area, Street, Sector, Village</Text>
            <TextInput style={styles.input} placeholder="Enter Area, Street, Sector, Village" value={this.state.area} onChangeText={e => this.setState({area: e})} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Town/City</Text>
            <TextInput style={styles.input} placeholder="Enter Town/City" value={this.state.town_city} onChangeText={e => this.setState({town_city: e})} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Landmark</Text>
            <TextInput style={styles.input} placeholder="Enter Landmark" value={this.state.landmark} onChangeText={e => this.setState({landmark: e})} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput style={styles.input} placeholder="Enter Pincode" value={this.state.pincode} onChangeText={e => this.setState({pincode: e})} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerBox}>
              <Picker itemStyle={styles.picker} mode="dropdown" selectedValue={this.state.state} onValueChange={e => this.setState({state: e})}>
                <Picker.Item label="Select State" value="" />
                {states.map((state, i) => (
                  <Picker.Item key={i} label={state} value={state} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Address Type</Text>
            <TextInput style={styles.input} placeholder="Enter Pincode" value={this.state.address_type} onChangeText={e => this.setState({address_type: e})} />
          </View>
          <Pressable onPress={() => editDetails()}>
            <View style={styles.submitButton}>{this.state.verifyButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Edit Details</Text>}</View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
});
const mapStateToProps = state => {
  return {
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
export default connect(mapStateToProps, mapDispatchToProps)(EditBankDetails);
