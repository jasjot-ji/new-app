import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import productImage from '../../../Assets/images/product.png';
import AIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import {baseUrl} from '../../../baseUrl';
import {connect} from 'react-redux';

const GetFormInput = ({id, name, identifier, type, required, description, placeholder, options, value, changeValue}) => {
  if (type === 'text') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <TextInput numberOfLines={1} name={identifier} id={id} value={value} onChangeText={e => changeValue(e)} style={styles.input} placeholder={placeholder} />
        {/* <div className="position-absolute bottom-100 tooltip-text">{description}</div> */}
      </View>
    );
  } else if (type === 'select') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <View style={styles.pickerBox}>
          <Picker name={identifier} id={id} itemStyle={styles.picker} mode="dropdown" selectedValue={value} onValueChange={e => changeValue(e)}>
            <Picker.Item label="Select" value="" />
            {options?.map(value => (
              <Picker.Item label={value} value={value} key={value} />
            ))}
          </Picker>
        </View>
      </View>
    );
  } else if (type === 'number') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <TextInput numberOfLines={1} name={identifier} id={id} value={value} onChangeText={e => changeValue(e)} style={styles.input} placeholder={placeholder} keyboardType="numeric" />
      </View>
    );
  } else if (type === 'textarea') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <TextInput numberOfLines={5} style={[styles.input, {textAlignVertical: 'top'}]} placeholder={placeholder} name={identifier} id={id} value={value} onChangeText={e => changeValue(e)} />
      </View>
    );
  } else {
    return <Text>...</Text>;
  }
};
const GetTableFormInput = ({id, name, identifier, type, required, description, placeholder, options, value, changeValue}) => {
  console.log(id, name, identifier, type, required, description, placeholder, options, value, changeValue);
  if (type === 'text') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <TextInput numberOfLines={1} style={styles.tableInput} placeholder={placeholder} value={value} onChangeText={e => changeValue(e)} />
        </View>
      </View>
    );
  } else if (type === 'select') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <View style={styles.tablePickerBox}>
            <Picker itemStyle={styles.picker} mode="modal" selectedValue={value} onValueChange={e => changeValue(e)}>
              <Picker.Item label="Select" value="" />
              {options?.map(value => (
                <Picker.Item label={value} value={value} key={value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  } else if (type === 'number') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <TextInput numberOfLines={1} style={styles.tableInput} placeholder={placeholder} value={value} onChangeText={e => changeValue(e)} keyboardType="numeric" />
        </View>
      </View>
    );
  } else {
    return <Text>...</Text>;
  }
};

class ProductDetailsAL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null,
      showSizeOptions: false,
      selectedVariations: [],
      selectedFullVariations: [],
      variationsData: [],
      product_data: null,
    };
  }
  componentDidMount() {
    const {selectedProduct} = this.props;
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      dsin: selectedProduct.dsin,
      category_4_id: selectedProduct.category_4_id,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/prd_lst/arldy_listed_product_form`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result);
        if (result.status === 'success') {
          this.setState({});
          let dataObj = {
            product_id: result.lst_product_data.product_id,
            dsin: result.lst_product_data.dsin,
            catalog_id: result.lst_product_data.catalog_id,
            supplier_product_id: '',
            status: result.lst_product_data.status,
            category_4_id: result.lst_product_data.category_4_id,
            product_variations: [],
          };
          this.setState({formData: result, product_data: dataObj});
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    const getVariations = variationsData => {
      let pvArr = [];
      variationsData.forEach(vd => {
        let attributesArr = [];
        this.state.formData.productvariationdatafields.forEach((field, i) => {
          const attributes = {
            name: field.productVarFields.name,
            identifier: field.productVarFields.identifier,
            value: '',
          };
          attributesArr = [...attributesArr, Object.assign({}, attributes)];
        });
        let pv = {};
        if (vd.sku === 'free-size') {
          pv = {
            variation_value: 'Free Size',
            variation_name: 'Free Size',
            variation_name_sku: 'free-size',
            variation_value_sku: 'free-size',
            inventory: '',
            seller_price: '',
            supplier_sku_id: '',
            product_mrp: '',
            variation_attributes: [...attributesArr],
          };
        } else {
          pv = {
            variation_value: vd.name,
            variation_name: 'Size',
            variation_name_sku: 'size',
            variation_value_sku: vd.sku,
            inventory: '',
            seller_price: '',
            supplier_sku_id: '',
            product_mrp: '',
            variation_attributes: [...attributesArr],
          };
        }
        pvArr.push(Object.assign({}, pv));
      });
      let pd = Object.assign({}, this.state.product_data);
      pd.product_variations = [...pvArr];
      this.setState({product_data: pd});
    };

    const toggleVariation = variation => {
      if (this.state.selectedVariations.includes(variation.name)) {
        let arr, arr2;
        arr = this.state.selectedVariations.filter(function (selected_variation) {
          return selected_variation !== variation.name;
        });
        arr2 = this.state.selectedFullVariations.filter(function (selected_variation) {
          return selected_variation.name !== variation.name;
        });
        this.setState({
          selectedVariations: [...arr],
          selectedFullVariations: [...arr2],
        });
      } else {
        let arr = [...this.state.selectedVariations],
          arr2 = [...this.state.selectedFullVariations];
        arr.push(variation.name);
        arr2.push(variation);
        this.setState({
          selectedVariations: [...arr],
          selectedFullVariations: [...arr2],
        });
      }
    };

    const applyVariations = () => {
      this.setState({
        showSizeOptions: false,
        variationsData: this.state.selectedFullVariations,
      });
      getVariations(this.state.selectedFullVariations);
    };
    const resetVariations = () => {
      this.setState({
        showSizeOptions: false,
        selectedVariations: [],
        variationsData: [],
        selectedFullVariations: [],
      });
      let pd = Object.assign({}, this.state.product_data);
      pd.product_variations = [];
      this.setState({
        product_data: pd,
      });
    };
    const reset = () => {
      this.setState({
        showSizeOptions: false,
        selectedVariations: [],
        selectedFullVariations: [],
        variationsData: [],
        formData: null,
        product_data: null,
      });
    };
    const discardListing = () => {
      this.props.changeTab('categories');
      reset();
    };

    const submitListing = () => {
      const token = this.props.token
  
      var raw = JSON.stringify(this.state.product_data);
  
      var requestOptions= {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: raw,
        redirect: "follow",
      };
  
      fetch(
        `${baseUrl}/prd_lst/submit_alrdy_listed_product`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success" || result.status === "Success") {
            this.props.alert(result.msg, "success");
            this.props.changeTab("categories")
          } else {
            this.props.alert(result.msg, "error");
          }
        })
        .catch((error) => console.log("error", error));
    };
    console.log(this.state);
    return (
      <View>
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF'}}>Add Product Details</Text>
        {(this.state.formData && this.state.product_data) ? (
          <ScrollView style={{paddingHorizontal: 20, marginBottom: 130}}>
            <View style={{marginBottom: 20}}>
              <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb', marginBottom: 5, marginTop: 10}}>Product Details</Text>
              <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <Image source={{uri: this.state.formData.lst_product_data.products_images[0].url}} style={{width: 200, height: 200}} />
              </View>
              <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5, flexDirection: 'row', gap: 5}}>{this.state.formData.lst_product_data.products_images.map((image, i) => i > 0 && <Image key={i} source={{uri: image.url}} style={{width: 70, height: 70}} />)}</View>
              <Text style={{marginVertical: 5, fontFamily: 'Roboto-Medium', fontSize: 16}}>{this.state.formData.lst_product_data.product_name.en}</Text>
              <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Medium'}}>Description : </Text>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Regular', width: '100%', flexShrink: 1}}>{this.state.formData.lst_product_data.product_description.en}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginVertical: 5}}>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Medium'}}>Uploaded By : </Text>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Regular', width: '100%', flexShrink: 1}}>{this.state.formData.lst_product_data.uploaded_by}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Medium'}}>Category : </Text>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Regular', width: '100%', flexShrink: 1}}>{this.state.formData.lst_product_data.category_4.name}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginVertical: 5}}>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Medium'}}>DSIN : </Text>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Regular', width: '100%', flexShrink: 1}}>{this.state.formData.lst_product_data.dsin}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 10}}>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Medium'}}>Catalog ID : </Text>
                <Text style={{fontSize: 12, fontFamily: 'Roboto-Regular', width: '100%', flexShrink: 1}}>{this.state.formData.lst_product_data.catalog_id}</Text>
              </View>
              <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb', marginBottom: 5, marginTop: 10}}>Product, Size and Inventory</Text>
              {this.state.formData.productsizeinvtfields.map(field => (
                <GetFormInput
                  key={field.product_size_inventory_fields_id}
                  id={field.product_size_inventory_fields_id}
                  name={field.name}
                  identifier={field.identifier}
                  type={field.input_types}
                  required={field.required}
                  description={field.description}
                  placeholder={field.placeholder}
                  options={field.options || []}
                  value={this.state.product_data.supplier_product_id}
                  changeValue={e => {
                    let pd = Object.assign({}, this.state.product_data);
                    pd.supplier_product_id = e;
                    this.setState({
                      product_data: pd,
                    });
                  }}
                />
              ))}
              <Pressable style={{position: 'relative'}} onPress={() => this.setState({showSizeOptions: !this.state.showSizeOptions})}>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Select Size</Text>
                  <Text style={{borderWidth: 1, borderColor: '#697475', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, fontSize: 16}}>Select Size</Text>
                </View>
              </Pressable>
              {this.state.showSizeOptions && (
                <View style={{backgroundColor: 'white', width: '100%', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderWidth: 1, borderColor: 'black', zIndex: 999, flexDirection: 'row', borderRadius: 10, marginTop: 5}}>
                  <Pressable
                    style={{display: 'flex', alignItems: 'center', gap: 5, flexDirection: 'row', margin: 5, width: 110}}
                    onPress={() => {
                      toggleVariation(this.state.formData.productvariationsfields[1].variation);
                    }}>
                    <View style={{width: 15, height: 15, borderWidth: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.selectedVariations.includes(this.state.formData.productvariationsfields[1]?.variation.name) && <EIcon name="check" size={10} color="black" />}</View>
                    <Text>{this.state.formData.productvariationsfields[1]?.variation.name}</Text>
                  </Pressable>
                  {this.state.formData.productvariationsfields[0].variation.variation_values.map(variation => (
                    <Pressable
                      style={{display: 'flex', alignItems: 'center', gap: 5, flexDirection: 'row', margin: 5, width: 50}}
                      onPress={() => {
                        toggleVariation(variation);
                      }}>
                      <View style={{width: 15, height: 15, borderWidth: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.selectedVariations.includes(variation.name) && <EIcon name="check" size={10} color="black" />}</View>
                      <Text>{variation.name}</Text>
                    </Pressable>
                  ))}
                  <View style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', paddingTop: 10, gap: 10}}>
                    <Pressable onPress={() => resetVariations()}>
                      <Text style={{backgroundColor: 'red', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium'}}>Reset</Text>
                    </Pressable>
                    <Pressable onPress={() => applyVariations()}>
                      <Text style={{backgroundColor: 'blue', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium'}}>Apply</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              <ScrollView horizontal={true} style={{marginTop: 10, borderColor: 'black'}}>
                {this.state.product_data.product_variations.length > 0 && (
                  <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch'}}>
                      <View style={{width: 150, borderColor: 'black', borderWidth: 1}}>
                        <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>Size</Text>
                      </View>
                      {this.state.formData.productvariationdatafields.map((field, i) => (
                        <View style={{width: 150, borderColor: 'black', borderWidth: 1}} key={i}>
                          <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{field.productVarFields.name}</Text>
                        </View>
                      ))}
                      {this.state.formData.productpricetaxfields.map((field, i) => (
                        <View style={{width: 150, borderColor: 'black', borderWidth: 1}} key={i}>
                          <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{field.name}</Text>
                        </View>
                      ))}
                    </View>

                    {this.state.product_data.product_variations.map((variation, i) => {
                      return (
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch'}} key={i}>
                          <View style={{width: 150, borderColor: 'black', borderWidth: 1}}>
                            <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{variation.variation_value}</Text>
                          </View>
                          {this.state.formData.productvariationdatafields.map((field, j) => (
                            <GetTableFormInput
                              id={field.productVarFields.identitfier}
                              name={field.productVarFields.name}
                              options={field.productVarFields.options}
                              identifier={field.productVarFields.identifier}
                              type={field.productVarFields.input_types}
                              required={field.productVarFields.required}
                              placeholder={field.productVarFields.placeholder}
                              value={this.state.product_data.product_variations[i].variation_attributes[j].value}
                              changeValue={e => {
                                let pd = this.state.product_data;
                                this.state.product_data.product_variations[i].variation_attributes[j].value = e;
                                this.setState({product_data: pd});
                              }}
                            />
                          ))}
                          {this.state.formData.productpricetaxfields.map((field, j) => (
                            <GetTableFormInput
                              id={field.identitfier}
                              name={field.name}
                              options={field.options}
                              identifier={field.identifier}
                              type={field.input_types}
                              required={field.required}
                              placeholder={field.placeholder}
                              value={this.state.product_data.product_variations[i][field.identifier]}
                              changeValue={e => {
                                let pd = this.state.product_data;
                                this.state.product_data.product_variations[i][field.identifier] = e;
                                this.setState({product_data: pd});
                              }}
                            />
                          ))}
                        </View>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
              <View style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', paddingTop: 10, gap: 10}}>
                <Pressable onPress={() => discardListing()}>
                  <Text style={{backgroundColor: 'red', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Discard</Text>
                </Pressable>
                <Pressable onPress={() => submitListing()}>
                  <Text style={{backgroundColor: 'green', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        ) : <View style={{paddingVertical: 30}}><ActivityIndicator size={30} color={"blue"} /></View>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  label: {
    fontFamily: 'Roboto-Medium',
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 3,
  },
  inputBox: {
    marginVertical: 5,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  tablePickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 14,
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  tableInput: {
    borderWidth: 1,
    borderColor: '#697475',
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 25,
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
export default connect(mapStateToProps, null)(ProductDetailsAL);
