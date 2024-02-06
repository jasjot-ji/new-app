import React, {Component} from 'react';
import {Text, ScrollView, View, TextInput, StyleSheet, Image, Pressable} from 'react-native';
import searchIcon from '../../Assets/icons/search.png';
import AIcon from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {baseUrl} from '../../baseUrl';
import {SafeAreaView} from 'react-native-safe-area-context';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dsin: '',
      all_status: null,
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

    fetch(`${baseUrl}/prd_lst/prd_lst_qc_status`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({
            all_status: result.data,
          });
        } else {
          this.setState({
            all_status: [],
          });
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <SafeAreaView>
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>Product Listing</Text>
        </View>
        <ScrollView style={{marginBottom: 130}}>
          <View style={{padding: 20}}>
            {/* <View style={{position: 'relative'}}>
              <TextInput style={styles.input} placeholder="Search listing with sku" />
              <Image source={searchIcon} style={{width: 25, height: 25, position: 'absolute', right: 10, top: 5}} />
            </View> */}
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexWrap: 'wrap', width: '100%'}}>
              <Pressable
                onPress={() => {
                  this.props.setStatus('All');
                  this.props.changeTab('singleListing');
                }}
                style={{padding: 5, width: '50%'}}>
                <View style={{borderWidth: 1, borderColor: '#000', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: '100%', flexShrink: 1}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}} numberOfLines={1}>
                      ALL
                    </Text>
                    {/* <Text style={{fontFamily: 'Roboto-Bold', fontSize: 16}}>0</Text> */}
                  </View>
                </View>
              </Pressable>
              {this.state.all_status &&
                (this.state.all_status.length > 0 ? (
                  this.state.all_status.map(status => (
                    <Pressable
                      onPress={() => {
                        this.props.setStatus(status);
                        this.props.changeTab('singleListing');
                      }}
                      key={status}
                      style={{padding: 5, width: '50%'}}>
                      <View style={{borderWidth: 1, borderColor: '#000', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '100%', flexShrink: 1}}>
                          <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}} numberOfLines={1}>
                            {status}
                          </Text>
                          {/* <Text style={{fontFamily: 'Roboto-Bold', fontSize: 16}}>0</Text> */}
                        </View>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>No status found !</Text>
                ))}
            </View>
          </View>
          <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
            <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>Add New Listing</Text>
          </View>
          <View style={{paddingHorizontal: 20}}>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginVertical: 20, backgroundColor: '#F6F6F6', paddingHorizontal: 20, paddingVertical: 30, borderRadius: 10}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>Have a Unique Product to sell ?</Text>
              <Text style={{fontFamily: 'Roboto-Regular', fontSize: 10}}>Upload images to Dukkandaar domain using image uploader.</Text>
              <Pressable onPress={() => this.props.changeTab('categorySelect')}>
                <Text style={{fontFamily: 'Roboto-Bold', backgroundColor: '#4a93ff', color: 'white', paddingHorizontal: 15, paddingVertical: 10, fontSize: 12, marginTop: 5, borderRadius: 50, elevation: 10}}>ADD SINGLE LISTING</Text>
              </Pressable>
            </View>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginBottom: 20, backgroundColor: '#F6F6F6', paddingHorizontal: 20, paddingVertical: 30, borderRadius: 10}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>List existing products on Dukkandaar.</Text>
              <Text style={{fontFamily: 'Roboto-Regular', fontSize: 10}}>Find your products in Dukkandaar's catalog.</Text>
              <View style={{width: '100%', position: 'relative'}}>
                <TextInput style={styles.input} placeholder="Search product with DSIN" value={this.state.dsin} onChangeText={e => this.setState({dsin: e})} />
                <Pressable
                  onPress={() => {
                    if (this.state.dsin !== '') {
                      this.props.setDSIN(this.state.dsin);
                      this.props.changeTab('alreadyListed');
                    } else {
                      this.props.alert('Enter DSIN', 'info');
                    }
                  }}
                  style={{position: 'absolute', right: 10, top: 5}}>
                  <Image source={searchIcon} style={{width: 25, height: 25}} />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 12,
    color: 'black',
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'Roboto-Regular',
    elevation: 5,
    width: '100%',
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(Categories);
