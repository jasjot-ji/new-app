import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {baseUrl} from '../../baseUrl';

class OrdersCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptDisabled: false,
      cancelDisabled: false,
    };
  }
  render() {
    const {order} = this.props;
    const {product} = this.props.order;
    const acceptOrder = () => {
      this.setState({
        acceptDisabled: true,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        order_items_id: order.order_items_id,
        order_status: 'Processing',
        length: '5',
        breadth: '5',
        height: '5',
        weight: '20',
      });
      console.log(raw);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/orders/chng_order_status`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.fetchOrdersAgain();
          } else {
            this.props.alert(result.msg, 'error');
            if (result.msg === 'Please select valid Pickup Address!') {
              this.props.navigation.navigate('AddPickupAddress');
            }
          }
          this.setState({
            acceptDisabled: false,
          });
        })
        .catch(error => console.log('error', error));
    };
    const cancelOrder = () => {
      this.setState({
        cancelDisabled: true,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        order_items_id: order.order_items_id,
        order_status: 'Canceled',
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/orders/chng_order_status`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.fetchOrdersAgain();
          } else {
            this.props.alert(result.msg, 'error');
          }
          this.setState({
            cancelDisabled: false,
          });
        })
        .catch(error => console.log('error', error));
    };
    return (
      product && (
        <View style={{width: '100%', borderRadius: 10, borderWidth: 1, borderColor: '#000', marginVertical: 10, overflow: 'hidden'}}>
          <View style={{paddingHorizontal: 10}}>
            <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
              <Text style={{paddingHorizontal: 10, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 12, textAlign: 'center', verticalAlign: 'middle'}}>{order.order_status}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <Image source={{uri: product.products_images[0].url}} style={{width: 75, height: 75}} />
              <View style={{width: '100%', flexShrink: 1}}>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginBottom: 2}} numberOfLines={2}>
                  {product.product_name.en}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Catalog ID : </Text>
                  <Text style={{fontSize: 12}}>{product.catalog_id}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>DSIN : </Text>
                  <Text style={{fontSize: 12}}>{product.dsin}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Ordered At : </Text>
                  <Text style={{fontSize: 12}}>
                    {order.createdAt.substring(0, 10)} {order.createdAt.substring(11, 19)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{borderTopWidth: 1, borderColor: '#ddd', paddingVertical: 5, marginTop: 10, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', gap: 10}}>
              <View style={{width: 75}}>
                <Text style={{color: '#B41919', fontSize: 16, fontFamily: 'Roboto-Medium', textAlign: 'center'}}>Qty: {order.quantity}</Text>
              </View>
              <View style={{width: '100%', flexShrink: 1}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Customer Number : </Text>
                  <Text style={{fontSize: 12}}>{order.number}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Product SKU : </Text>
                  <Text style={{fontSize: 12}}>{order.seller_products_variant.supplier_sku_id}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Variant : </Text>
                  <Text style={{fontSize: 12}}>{order.seller_products_variant.product_variant.variation_value}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Price : </Text>
                  <Text style={{fontSize: 12}}>Rs. {order.seller_products_variant.price}</Text>
                </View>
              </View>
            </View>
          </View>
          {order.order_status === 'Pending' && (
            <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
              <Pressable style={{width: '100%', flexShrink: 1}} onPress={() => acceptOrder()}>
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 40, backgroundColor: '#00B094'}}>{!this.state.acceptDisabled ? <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', color: '#fff', textAlign: 'center', padding: 10}}>Accept Item</Text> : <ActivityIndicator color="#fff" size={20} />}</View>
              </Pressable>
              <Pressable style={{width: '100%', flexShrink: 1}} onPress={() => cancelOrder()}>
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 40, backgroundColor: '#ff0000'}}>{!this.state.cancelDisabled ? <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', color: '#fff', textAlign: 'center', padding: 10}}>Cancel Item</Text> : <ActivityIndicator color="#fff" size={20} />}</View>
              </Pressable>
            </View>
          )}
          {/* <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10}}>
            <Pressable style={{width: '100%', flexShrink: 1}}>
              <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Edit</Text>
            </Pressable>
            <Pressable style={{width: '100%', flexShrink: 1}}>
              <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Delete</Text>
            </Pressable>
          </View> */}
        </View>
      )
    );
  }
}
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(OrdersCard);
