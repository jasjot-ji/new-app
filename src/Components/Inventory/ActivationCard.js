import React, {Component} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import productImage from '../../Assets/images/product.png';
import {connect} from 'react-redux';
import {baseUrl} from '../../baseUrl';

class InventoryCard extends Component {
  render() {
    const {product} = this.props;
    console.log(product);
    return (
      <View style={{width: '100%', borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 10, marginVertical: 10}}>
        <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
          <Text style={{paddingHorizontal: 10, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 12, textAlign: 'center', verticalAlign: 'middle'}}>{product.status}</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <View style={{width: '100%', flexShrink: 1}}>
            {product.product_name_n && (
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginBottom: 2}} numberOfLines={1}>
                {product.product_name_n}
              </Text>
            )}
            {product.product_description_n && (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Description : </Text>
                <Text style={{fontSize: 12}} numberOfLines={1}>
                  {product.product_description_n}
                </Text>
              </View>
            )}
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Catalog ID : </Text>
              <Text style={{fontSize: 12}}>{product.catalog_id}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>DSIN : </Text>
              <Text style={{fontSize: 12}}>{product.dsin}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Updated By : </Text>
              <Text style={{fontSize: 12}}>{product.updated_by}</Text>
            </View>
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
