import React, {Component} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {baseUrl} from '../baseUrl';

export default class PickupAddressCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectButtonDisabled: false,
    };
  }
  render() {
    const {address} = this.props;
    console.log(address);
    const selectAddress = () => {
      this.setState({
        selectButtonDisabled: true,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        sellers_address_id: address.sellers_address_id,
      });
      console.log(raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/set_pickup_address`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.navigation.navigate('Orders');
          } else {
            this.props.alert(result.msg, 'error');
          }
          this.setState({
            selectButtonDisabled: false,
          });
        })
        .catch(error => console.log('error', error));
    };
    return (
      <View style={styles.addressCard}>
        <Text style={styles.addressType}>{address.address_type}</Text>
        <View style={styles.addressBody}>
          <Text style={styles.addressline}>
            {address.flat_house_building}, {address.area}, {address.landmark},
          </Text>
          <Text style={styles.addressline}>
            {address.town_city}, {address.state} - {address.pincode}
          </Text>
          <Text style={styles.addressline}>India</Text>
          <Pressable onPress={() => selectAddress()}>
            <View style={styles.submitButton}>{this.state.selectButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Select Address</Text>}</View>
          </Pressable>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  addressCard: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
  },
  addressType: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    fontSize: 12,
    color: '#697475',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    fontFamily: 'Roboto-Medium',
  },
  addressBody: {
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  name: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto-Medium',
  },
  addressline: {
    fontSize: 14,
    color: 'black',
  },
  addressOptionsText: {
    color: '#059CA6',
    fontSize: 14,
  },
  addressOptions: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  rightBorder: {
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: '#059CA6',
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
