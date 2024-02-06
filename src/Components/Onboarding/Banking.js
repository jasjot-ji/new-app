import React, {Component} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {baseUrl} from '../../baseUrl';

export default class Banking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyButtonDisabled: false,
      bank_nanme: '',
      name: '',
      ac_number: '',
      ifsc: '',
      location: '',
    };
  }
  render() {
    const addDetails = () => {
      if (this.state.name === '' || this.state.bank_nanme === '' || this.state.ifsc === '' || this.state.ac_number === '' || this.state.location === '') {
        this.props.alert('Enter complete details', 'info');
      } else {
        this.setState({
          verifyButtonDisabled: true,
        });
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

        fetch(`${baseUrl}/add_bank_details`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            if (result.status === 'success') {
              this.props.alert('Added Bank Details', 'success');
              this.props.changeTab('billing');
              this.setState({
                verifyButtonDisabled: false,
                bank_nanme: '',
                name: '',
                ac_number: '',
                ifsc: '',
                location: '',
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
          <Text style={styles.heading}>Add your Banking Details</Text>
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
          <Pressable onPress={() => addDetails()}>
            <View style={styles.submitButton}>{this.state.verifyButtonDisabled ? <ActivityIndicator size={25} color="black" /> : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>Add Details</Text>}</View>
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
    marginBottom: 10,
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
