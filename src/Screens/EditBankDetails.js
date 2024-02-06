import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {baseUrl} from '../baseUrl';
import FIcon from 'react-native-vector-icons/Foundation';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import logo from '../Assets/images/logo.png';
import {connect} from 'react-redux';
import {getSellerInfo} from '../Actions';

class EditBankDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyButtonDisabled: false,
      bank_nanme: '',
      name: '',
      ac_number: '',
      ifsc: '',
      location: '',
      sidebarOpened: false,
    };
  }
  componentDidMount() {
    const id = this.props.route.params.id;
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/get_all_bank_details/1?sellers_bank_info_id=${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          let data = result.data[0];
          this.setState({
            bank_nanme: data.name,
            name: data.account_holder_name,
            ac_number: data.account_number,
            ifsc: data.ifsc_code,
            location: data.location,
          });
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidUpdate(prevProps) {
    console.log(this.state.ac_number);
    if (this.state.ac_number === '') {
      console.log('here');
      const id = this.props.route.params.id;
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/get_all_bank_details/1?sellers_bank_info_id=${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            let data = result.data[0];
            this.setState({
              bank_nanme: data.name,
              name: data.account_holder_name,
              ac_number: data.account_number,
              ifsc: data.ifsc_code,
              location: data.location,
            });
          }
        })
        .catch(error => console.log('error', error));
    }
  }
  render() {
    const editDetails = () => {
      if (this.state.name === '' || this.state.bank_nanme === '' || this.state.ifsc === '' || this.state.ac_number === '' || this.state.location === '') {
        this.props.alert('Enter complete details', 'info');
      } else {
        var myHeaders = new Headers();
        myHeaders.append('token', this.props.token);
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          name: this.state.bank_nanme,
          account_holder_name: this.state.name,
          account_number: this.state.ac_number,
          ifsc_code: this.state.ifsc,
          location: this.state.location,
          currency: 'INR',
        });
        console.log(raw);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch(`${baseUrl}/edit_bank_details/${this.props.route.params.id}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            if (result.status === 'success') {
              this.props.alert('Edited Bank Details', 'success');
              this.props.getSellerDetails(this.props.token);
              this.props.navigation.goBack();
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
          <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF', marginBottom: 10}}>Edit Bank Details</Text>
          <ScrollView style={{paddingHorizontal: 20}}>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Enter your Full Name" value={this.state.name} onChangeText={e => this.setState({name: e})} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput style={styles.input} placeholder="Enter your Acount Number" value={this.state.ac_number} onChangeText={e => this.setState({ac_number: e})} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput style={styles.input} placeholder="Enter Bank IFSC Code" value={this.state.ifsc} onChangeText={e => this.setState({ifsc: e})} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput style={styles.input} placeholder="Enter Bank Name" value={this.state.bank_nanme} onChangeText={e => this.setState({bank_nanme: e})} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} placeholder="Enter Branch Details" value={this.state.location} onChangeText={e => this.setState({location: e})} />
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
