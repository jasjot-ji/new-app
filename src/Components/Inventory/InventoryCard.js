import React, {Component} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import productImage from '../../Assets/images/product.png';
import {connect} from 'react-redux';
import {baseUrl} from '../../baseUrl';

class InventoryCard extends Component {
  render() {
    const {product} = this.props;
    return (
      <View style={{width: '100%', borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 10, marginVertical: 10}}>
        <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
          <Text style={{paddingHorizontal: 10, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 12, textAlign: 'center', verticalAlign: 'middle'}}>{product.status}</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <Image source={{uri: product.product.products_images[0].url}} style={{width: 75, height: 75}} />
          <View style={{width: '100%', flexShrink: 1}}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginBottom: 2}} numberOfLines={2}>
              {product.product.product_name_n}
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
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Uploaded By : </Text>
              <Text style={{fontSize: 12}}>{product.uploaded_by}</Text>
            </View>
          </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10}}>
          <View style={{width: '100%', flexShrink: 1}}>
            <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>More Details</Text>
          </View>
        </View>
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
export default connect(mapStateToProps, null)(InventoryCard);
