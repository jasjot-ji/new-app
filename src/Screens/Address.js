import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable, TextInput, SafeAreaView} from 'react-native';
import logo from '../Assets/images/logo.png';
import AddressCard from '../Components/AddressCard';
import {connect} from 'react-redux';
import Sidebar from '../Components/Common/Sidebar';
import FIcon from 'react-native-vector-icons/Foundation';
import {baseUrl} from '../baseUrl';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpened: false,
      addresses: null,
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
    componentDidUpdate() {
      if (this.props.route.params && this.props.route.params.edited) {
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
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF', marginBottom: 10}}>Your Addresses</Text>
        <ScrollView>
          <View style={{paddingHorizontal: 20, marginBottom: 20}}>{this.state.addresses && this.state.addresses.length > 0 ? this.state.addresses.map((address, i) => <AddressCard navigation={this.props.navigation} key={i} address={address} />) : <Text>Addresses Not available</Text>}</View>
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
  innerContainer: {},
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
export default connect(mapStateToProps, null)(Address);
