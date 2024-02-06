import {Picker} from '@react-native-picker/picker';
import React, {Component} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {states} from '../../utils/States';
import {baseUrl} from '../../baseUrl';

export default class Billing extends Component {
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
      billing_default_address: true,
    };
  }
  render() {
    const addDetails = () => {
      if (this.state.state === '' || this.state.town_city === '' || this.state.flat_house_building === '' || this.state.area === '' || this.state.landmark === '' || this.state.pincode === '' || this.state.address_type === '') {
        this.props.alert('Enter complete details', 'info');
      } else {
        this.setState({
          verifyButtonDisabled: true,
        });
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

        fetch(`${baseUrl}/add_billing_address`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            if (result.status === 'success') {
              this.props.alert('Added Billing Address', 'success');
              this.props.changeTab('shipping');
              this.props.setBillingAddress(result);
              this.setState({
                verifyButtonDisabled: false,
                state: '',
                town_city: '',
                flat_house_building: '',
                area: '',
                landmark: '',
                pincode: '',
                address_type: '',
                billing_default_address: true,
              });
            } else {
              this.props.alert(result.msg, 'error');
            }
          })
          .catch(error => console.log('error', error));
      }
    };
    return (
      <ScrollView style={{paddingHorizontal: 20, marginTop: 30}}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Add your Billing Address</Text>
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
            <TextInput style={styles.input} placeholder="Address Type" value={this.state.address_type} onChangeText={e => this.setState({address_type: e})} />
          </View>
          <Pressable onPress={() => addDetails()}>
            <View style={styles.submitButton}>{this.state.verifyButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Add Details</Text>}</View>
          </Pressable>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
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
    marginBottom: 20,
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
