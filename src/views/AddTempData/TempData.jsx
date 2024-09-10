import React, { useState, useEffect } from 'react';
import * as Db from '../../RxDb/Database/Database';
import { removeRxDatabase } from 'rxdb';

export default function TempDataButton() {
  const destroy = async () => {
    removeRxDatabase('oneshelldb', 'idb');
  };
  const addData = async () => {
    const db = await Db.get();
    try {
      await db.parties.bulkInsert(customerData);
      await db.product.bulkInsert(productData);
      await db.paymentin.bulkInsert(paymentInData);
      await db.sales.bulkInsert(salesData);
      await db.businesscategories.bulkInsert(businessCategoriesData);
      await db.businessproduct.bulkInsert(businessProductData);
      console.log('Data Inserted Successfully');
    } catch (e) {
      console.log('Error Insert Data');
      console.log(e);
    }
  };

  const checkData = async () => {
    const db = await Db.get();
    let CustomerData = await db.parties
      .find()
      .where('isCustomer')
      .eq(true)
      .exec();
    if (CustomerData.length === 0) {
      addData();
    }
  };

  useEffect(() => {
    // checkData();
  }, []);

  const customerData = [
    {
      businessId: 1,
      customerId: 1,
      customerName: 'Vaidhy',
      phoneNo: '9791489361',
      emailId: 'vaidhy@gmail.com',
      address: 'ADDRESS-1',
      gstType: '',
      gstState: '',
      balance: 1000
    },
    {
      businessId: 2,
      customerId: 2,
      customerName: 'Abbas',
      phoneNo: '9791489362',
      emailId: 'abbas@gmail.com',
      address: 'ADDRESS-2',
      gstType: '',
      gstState: '',
      balance: 2000
    },
    {
      businessId: 3,
      customerId: 3,
      customerName: 'Jobins Raj',
      phoneNo: '9791489363',
      emailId: 'jobinsraj@gmail.com',
      address: 'ADDRESS-3',
      gstType: '',
      gstState: '',
      balance: -2000
    },
    {
      businessId: 4,
      customerId: 4,
      customerName: 'Pandi',
      phoneNo: '9791489364',
      emailId: 'pandi@gmail.com',
      address: 'ADDRESS-4',
      gstType: '',
      gstState: '',
      balance: -3000
    },
    {
      businessId: 5,
      customerId: 5,
      customerName: 'Vallavan',
      phoneNo: '9791489364',
      emailId: 'vallavan@gmail.com',
      address: 'ADDRESS-5',
      gstType: '',
      gstState: '',
      balance: 5000
    }
  ];

  const productData = [
    {
      businessId: 1,
      productId: 1,
      name: 'Biscuit',
      mrp: 100.0,
      offerPrice: 1,
      purchasePrice: 80.0,
      stock: 100
    },
    {
      businessId: 2,
      productId: 2,
      name: 'Soap',
      mrp: 28,
      offerPrice: 3,
      purchasePrice: 80.0,
      stock: 100
    },
    {
      businessId: 3,
      productId: 3,
      name: 'Brush',
      mrp: 40,
      offerPrice: 3,
      purchasePrice: 80.0,
      stock: 100
    },
    {
      businessId: 4,
      productId: 4,
      name: 'Tooth Paste',
      mrp: 50,
      offerPrice: 5,
      purchasePrice: 80.0,
      stock: 100
    },
    {
      businessId: 5,
      productId: 5,
      name: 'Shampoo',
      mrp: 10,
      offerPrice: 0,
      purchasePrice: 80.0,
      stock: 100
    }
  ];

  const paymentInData = [
    {
      businessId: 1,
      date: '2020-01-21',
      receiptNumber: '111',
      customerName: 'Vaidhy',
      customerId: 1,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 1000.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 1,
      date: '2020-01-21',
      receiptNumber: '112',
      customerName: 'Vaidhy',
      customerId: 1,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 0.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 1,
      date: '2020-01-21',
      receiptNumber: '113',
      customerName: 'Vaidhy',
      customerId: 1,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 100.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 1,
      date: '2020-01-21',
      receiptNumber: '114',
      customerName: 'Vaidhy',
      customerId: 1,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 1000.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 1,
      date: '2020-01-21',
      receiptNumber: '115',
      customerName: 'Vaidhy',
      customerId: 1,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 200.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 2,
      date: '2020-01-21',
      customerName: 'Abbas',
      customerId: 2,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 2000.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 3,
      date: '2020-01-21',
      customerName: 'Jobins Raj',
      customerId: 3,
      paymentType: 'credit',
      paymentStatus: 'used',
      balance: 3000.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 4,
      date: '2020-01-21',
      customerName: 'Pandi',
      customerId: 4,
      paymentType: 'credit',
      paymentStatus: 'remaining',
      balance: 4000.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    },
    {
      businessId: 5,
      date: '2020-01-21',
      customerName: 'Vallavan',
      customerId: 5,
      paymentType: 'cash',
      paymentStatus: 'used',
      balance: 5000.0,
      received: 5000.0,
      saleHistory: {
        transactionDate: '2020-01-21'
      }
    }
  ];

  const salesData = [
    {
      businessId: 1,
      customer_id: 1,
      customer_name: 'Vaidhy',
      company_name: 'ABB industry',
      mobile_no: 9632587410,
      invoice_number: 1,
      invoice_date: '2020-01-21',
      is_roundoff: true,
      round_amount: -0.25,
      total_amount: 14444.5,
      rounded_amount: 4445,
      balance_amount: 0,
      is_credit: true,
      payment_type: 'credit',
      received_amount: 123,
      payment_history: [
        {
          transaction_date: '2020-01-21',
          reference_no: '1234',
          transaction_type: 'type',
          linked_amount: 200
        }
      ],
      item_list: [
        {
          item_id: 1,
          item_name: 'Bisket',
          sku: 1,
          barcode: '1234',
          mrp: 21,
          offer_price: 3,
          size: 1,
          qty: 1,
          discount_percent: 2,
          discount_amount: 1,
          cgst: 1,
          sgst: 2,
          amount: 3
        },
        {
          item_id: 2,
          item_name: 'Bisket',
          sku: 1,
          barcode: '1234',
          mrp: 21,
          offer_price: 3,
          size: 1,
          qty: 1,
          discount_percent: 2,
          discount_amount: 1,
          cgst: 1,
          sgst: 2,
          amount: 3
        }
      ]
    },
    {
      businessId: 2,
      customer_id: 2,
      customer_name: 'Jobins',
      company_name: 'ABB industry',
      mobile_no: 9632587410,
      invoice_number: 2,
      invoice_date: '2020-12-20',
      is_roundoff: true,
      round_amount: -0.25,
      total_amount: 14444.5,
      rounded_amount: 4445,
      balance_amount: 0,
      is_credit: true,
      payment_type: 'cash',
      received_amount: 123,
      payment_history: [
        {
          transaction_date: '2020-01-21',
          reference_no: '1234',
          transaction_type: 'type',
          linked_amount: 200
        }
      ],
      item_list: [
        {
          item_id: 1,
          item_name: 'Bisket',
          sku: 1,
          barcode: '1234',
          mrp: 21,
          offer_price: 3,
          size: 1,
          qty: 1,
          discount_percent: 2,
          discount_amount: 1,
          cgst: 1,
          sgst: 2,
          amount: 3
        }
      ]
    },
    {
      businessId: 3,
      customer_id: 3,
      company_name: 'ABB industry',
      mobile_no: 9632587410,
      customer_name: 'Jobins',
      invoice_number: 3,
      invoice_date: '2021-01-01',
      is_roundoff: true,
      round_amount: -0.25,
      total_amount: 14444.5,
      rounded_amount: 4445,
      balance_amount: 0,
      is_credit: true,
      payment_type: 'credit',
      received_amount: 123,
      payment_history: [
        {
          transaction_date: '2021-01-21',
          reference_no: '1234',
          transaction_type: 'type',
          linked_amount: 200
        }
      ],
      item_list: [
        {
          item_id: 1,
          item_name: 'Bisket',
          sku: 1,
          barcode: '1234',
          mrp: 21,
          offer_price: 3,
          size: 1,
          qty: 1,
          discount_percent: 2,
          discount_amount: 1,
          cgst: 1,
          sgst: 2,
          amount: 3
        }
      ]
    },
    {
      businessId: 5,
      customer_id: 5,
      customer_name: 'Jobins',
      company_name: 'ABB industry',
      mobile_no: 9632587410,
      invoice_number: 4,
      invoice_date: '2020-12-21',
      is_roundoff: true,
      round_amount: -0.25,
      total_amount: 14444.5,
      rounded_amount: 4445,
      balance_amount: 0,
      is_credit: true,
      payment_type: 'cash',
      received_amount: 123,
      payment_history: [
        {
          transaction_date: '2020-01-21',
          reference_no: '1234',
          transaction_type: 'type',
          linked_amount: 200
        }
      ],
      item_list: [
        {
          item_id: 1,
          item_name: 'Bisket',
          sku: 1,
          barcode: '1234',
          mrp: 21,
          offer_price: 3,
          size: 1,
          qty: 1,
          discount_percent: 2,
          discount_amount: 1,
          cgst: 1,
          sgst: 2,
          amount: 3
        }
      ]
    },
    {
      businessId: 4,
      customer_id: 4,
      customer_name: 'Jobins',
      company_name: 'ABB industry',
      mobile_no: 9632587410,
      invoice_number: 5,
      invoice_date: '2021-01-21',
      is_roundoff: true,
      round_amount: -0.25,
      total_amount: 14444.5,
      rounded_amount: 4445,
      balance_amount: 0,
      is_credit: true,
      payment_type: 'cash',
      received_amount: 123,
      payment_history: [
        {
          transaction_date: '2020-01-21',
          reference_no: '1234',
          transaction_type: 'type',
          linked_amount: 200
        }
      ],
      item_list: [
        {
          item_id: 1,
          item_name: 'Bisket',
          company_name: 'ABB industry',
          mobile_no: 9632587410,
          sku: 1,
          barcode: '1234',
          mrp: 21,
          offer_price: 3,
          size: 1,
          qty: 1,
          discount_percent: 2,
          discount_amount: 1,
          cgst: 1,
          sgst: 2,
          amount: 3
        }
      ]
    }
  ];

  const businessCategoriesData = [
    {
      global_category: 'food_drinks_level1',
      display_name: 'Food & Drinks',
      img_url: '',
      level1_category: 'food_drinks_level1',
      level1_img_url: '',
      level2_category: 'ice_cream_shop_level2',
      level2_display_name: 'Ice Cream Shop',
      level2_img_url: '',
      level3_category: 'ice_cream_milkshake_level3',
      level3_display_name: 'Milkshake',
      level3_img_url: ''
    },
    {
      global_category: 'food_drinks_level1',
      display_name: 'Food & Drinks',
      img_url: '',
      level1_category: 'food_drinks_level1',
      level1_img_url: '',
      level2_category: 'restaurant_level2',
      level2_display_name: 'Restaurant',
      level2_img_url: '',
      level3_category: 'ice_cream_milkshake_level3',
      level3_display_name: 'Hot Dog',
      level3_img_url: ''
    },
    {
      global_category: 'food_drinks_level1',
      display_name: 'Food & Drinks',
      img_url: '',
      level1_category: 'food_drinks_level1',
      level1_img_url: '',
      level2_category: 'restaurant_level2',
      level2_display_name: 'Restaurant',
      level2_img_url: '',
      level3_category: 'restaurant_masala_pizza_level3',
      level3_display_name: 'Masala Pizza',
      level3_img_url: ''
    },
    {
      global_category: 'food_drinks_level1',
      display_name: 'Food & Drinks',
      img_url: '',
      level1_category: 'food_drinks_level1',
      level1_img_url: '',
      level2_category: 'restaurant_level2',
      level2_display_name: 'Restaurant',
      level2_img_url: '',
      level3_category: 'restaurant_masala_pizza_level3',
      level3_display_name: 'Sandwich',
      level3_img_url: ''
    }
  ];

  const businessProductData = [
    {
      businessId: 1,
      businessCity: 'Ballari',
      productId: 'prod_1',
      businessOrAdv: 'Business',
      categoryLevel1: {
        name: 'Level1'
      },
      categoryLevel2: {
        name: 'Level2'
      },
      categoryLevel3: {
        name: 'Level3'
      },
      name: 'Product Name 1',
      nameAutocomplete: 'Product Name 1',
      brandName: 'Brand Name 1',
      description: 'Description 1',
      imageUrl: '',
      salePrice: 100,
      offerPrice: 10,
      salePrice: 90,
      location: 'Chennai',
      latitude: 120120,
      longitude: 121121,
      actualDiscount: 10,
      discountSlab: 1,
      isOutOfStock: false,
      spamReportedCustomerList: [],
      spamComments: [],
      secondaryImageUrls: [],
      numberOfLikes: 10,
      likedCustomerList: [],
      totalCustomerClicks: 100,
      totalCustomerImpressions: 20,
      dailyCustomerClicks: 120,
      dailyCustomerImpressions: 20,
      updatedDate: '2020-02-02',
      businessName: 'Business Name 1',
      startsFrom: 1,
      minimumQuantity: 10,
      tagProperties: '',
      valuedProperties: '',
      shareLink: '',
      shareImageUrl: '',
      barcode: 'barcode 1',
      shareCode: '',
      oneshellHomeDelivery: true,
      maxQuantity: 50,
      stockReOrderQty: 2,
      stockQty: 35,
      properties: '',
      additionalProperties: '',
      showAddToCartButton: true,
      isMainPropertiesAvailable: true,
      variableImageBaseProperty: '',
      propertyImageUrls: '',
      selfPickUpEnabled: true,
      additionalPropertiesAvailable: true,
      additionalPropertyGroupList: '',
      cgst: 4,
      sgst: 5,
      sku: '',
      createdTimeMilliSec: 0,
      taxIncluded: true,
      selfOrderActualPrice: 50,
      selfOrderOfferPrice: 20,
      selfOrderActualDiscount: 20,
      selfOrderDiscountSlab: 2,
      selfOrderEffectivePrice: 25,
      mode: '',
      sortId: 1
    }
  ];

  return (
    <>
      <button onClick={() => addData()}>ADD Temp Data</button> <br />
      <button onClick={() => destroy()}>Destroy Temp Data</button>
    </>
  );
}
