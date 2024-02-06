import {Picker} from '@react-native-picker/picker';
import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {states} from '../utils/States';
import {baseUrl} from '../baseUrl';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import Sidebar from '../Components/Common/Sidebar';
import FIcon from 'react-native-vector-icons/Foundation';
import logo from '../Assets/images/logo.png';
import PickupAddressCard from '../Components/PickupAddressCard';

class AddPickupAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectButtonDisabled: false,
      addresses: null,
      sidebarOpened: false,
    };
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/get_all_seller_address/1`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({addresses: result.data});
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
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
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF', marginBottom: 10}}>Select Pickup Address</Text>
        <ScrollView>
          <View style={{paddingHorizontal: 20, marginBottom: 20}}>{this.state.addresses ? this.state.addresses.length > 0 ? this.state.addresses.map((address, i) => <PickupAddressCard token={this.props.token} navigation={this.props.navigation} key={i} address={address} alert={this.props.alert} />) : <Text>Addresses Not available</Text> : <ActivityIndicator size={30} color={'#0000ff'} />}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'relative',
    flex: 1,
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
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(AddPickupAddress);
