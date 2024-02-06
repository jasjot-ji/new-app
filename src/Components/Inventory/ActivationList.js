import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {baseUrl} from '../../baseUrl';
import InventoryCard from './InventoryCard';
import ActivationCard from './ActivationCard';

class ActivationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
    };
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/prd_lst/get_edit_prdct_requests/0`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({
            products: result.data,
          });
        } else {
          this.setState({
            products: [],
          });
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <View>
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>ACTIVATION PENDING</Text>
        </View>
        <ScrollView style={{paddingHorizontal: 20, marginBottom: 150}}>{this.state.products && (this.state.products.length > 0 ? this.state.products.map((product, i) => <ActivationCard key={i} product={product} />) : <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium', marginTop: 10}}>No Products Found!</Text>)}</ScrollView>
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
export default connect(mapStateToProps, null)(ActivationList);
