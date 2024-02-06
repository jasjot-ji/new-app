import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import ListingCard from './ListingCard';
import { connect } from 'react-redux';
import { baseUrl } from '../../baseUrl';

class SingleListings extends Component {
  constructor(props){
    super(props);
    this.state={
      listings: null
    }
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/prd_lst//seller_signle_uploaded_products/1?status=${this.props.status}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status === "success"){
          this.setState({listings: result.data});
        }
        else{
          this.setState({listings: []});
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    console.log(this.props.status);
    return (
      <View>
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>Listing : {this.props.status}</Text>
        </View>
        <ScrollView style={{paddingHorizontal: 20, marginBottom: 150}}>
          {
            this.state.listings && (
              this.state.listings.length > 0 ?this.state.listings.map((listing, i) => <ListingCard changeTab={this.props.changeTab} alert={this.props.alert} setCatalogType={this.props.setCatalogType} setCatalogID={this.props.setCatalogID} key={i} product={listing} />): <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginTop: 10}}>No Product Found !</Text>
            )
          }
        </ScrollView>
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
export default connect(mapStateToProps, null)(SingleListings);