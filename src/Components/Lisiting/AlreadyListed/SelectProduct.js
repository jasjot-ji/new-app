import React, {Component} from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, View} from 'react-native';
import ListingCard from '.././ListingCard';
import {connect} from 'react-redux';
import {baseUrl} from '../../../baseUrl';

class AlreadyListed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
    };
  }
  componentDidMount() {
    const dsin = this.props.dsin;
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      dsin: dsin,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/prd_lst/search_product_dsin/1`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({products: result.data});
        } else {
          this.setState({products: []});
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <View>
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>Select Product</Text>
        </View>
        {this.state.products ? (
          <ScrollView style={{paddingHorizontal: 20, marginBottom: 150}}>
            {
              this.state.products.length > 0 ? this.state.products.map((product, i) => <Pressable key={i} onPress={() =>{
                this.props.selectProduct(product);
                this.props.changeTab("productDetailsAL")
              }}><ListingCard product={product} type={'product-info'} /></Pressable>) : 
              <Text style={{fontSize: 16, fontFamily: "Roboto-Medium", marginTop: 10}}>No Product Found!</Text>
            }
          </ScrollView>
        ) : <View style={{paddingVertical: 30}}><ActivityIndicator size={30} color={"blue"} /></View>}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(AlreadyListed);
