export const auditSchema = () => {
  return {
    customerGSTNo: {
      type: 'string',
      description:
        'The GST (Goods and Services Tax) number of the customer. Can be null if not provided.',
      nullable: true
    },
    customerGstType: {
      type: 'string',
      description:
        "The type of GST classification for the customer (e.g., 'Unregistered Customer')."
    },
    customer_name: {
      type: 'string',
      description: 'The name of the customer.'
    },
    customer_address: {
      type: 'string',
      description: 'The address of the customer.'
    },
    customer_phoneNo: {
      type: 'string',
      description: 'The phone number of the customer.'
    },
    customer_city: {
      type: 'string',
      description: 'The city where the customer resides.'
    },
    customer_emailId: {
      type: 'string',
      description: 'The email address of the customer.'
    },
    customer_pincode: {
      type: 'string',
      description: "The postal code (ZIP code) of the customer's address."
    },
    sequenceNumber: {
      type: 'string',
      description: 'The sequence number for the invoice.'
    },
    invoice_date: {
      type: 'string',
      format: 'date',
      description: 'The date when the invoice was issued.'
    },
    order_type: {
      type: 'string',
      description: "The type of order (e.g., 'pos' for point of sale)."
    },
    round_amount: {
      type: 'string',
      description: 'The rounded amount on the invoice.'
    },
    total_amount: {
      type: 'number',
      description: 'The total amount billed in the invoice.'
    },
    balance_amount: {
      type: 'number',
      description: 'The remaining balance to be paid by the customer.'
    },
    is_credit: {
      type: 'boolean',
      description: 'Indicates whether the transaction was a credit transaction.'
    },
    payment_type: {
      type: 'string',
      description: "The method of payment used (e.g., 'cash')."
    },
    isFullyReturned: {
      type: 'boolean',
      description: 'Indicates if the invoice has been fully returned.'
    },
    isPartiallyReturned: {
      type: 'boolean',
      description: 'Indicates if the invoice has been partially returned.'
    },
    linkPayment: {
      type: 'boolean',
      description: 'Indicates if the payment is linked to another transaction.'
    },
    linked_amount: {
      type: 'number',
      description: 'The amount linked to another transaction.'
    },
    linkedTxnList: {
      type: 'array',
      description: 'A list of linked transactions.',
      items: {
        type: 'object',
        properties: {
          linkedId: {
            type: 'string',
            description: 'The ID of the linked transaction.'
          },
          date: {
            type: 'string',
            format: 'date',
            description: 'The date of the linked transaction.'
          },
          linkedAmount: {
            type: 'number',
            description: 'The amount linked in the transaction.'
          },
          paymentType: {
            type: 'string',
            description: 'The type of payment used.'
          },
          transactionNumber: {
            type: 'string',
            description: 'The transaction number.'
          },
          sequenceNumber: {
            type: 'string',
            description: 'The sequence number for the linked transaction.'
          }
        }
      }
    },
    discount_percent: {
      type: 'number',
      description: 'The percentage of discount applied.'
    },
    discount_amount: {
      type: 'number',
      description: 'The total discount amount.'
    },
    discount_type: {
      type: 'string',
      description: 'The type of discount applied.'
    },
    item_list: {
      type: 'array',
      description: 'A list of items included in the invoice.',
      items: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: 'The ID of the product.'
          },
          description: {
            type: 'string',
            description: 'A brief description of the item.'
          },
          unit: {
            type: 'string',
            description: 'The unit of measurement for the item.'
          },
          hsn: {
            type: 'string',
            description:
              'Harmonized System of Nomenclature (HSN) code for the item.'
          },
          item_name: {
            type: 'string',
            description: 'The name of the item.'
          },
          mrp: {
            type: 'number',
            description: 'The Maximum Retail Price of the item.'
          },
          purchased_price: {
            type: 'number',
            description: 'The price at which the item was purchased.'
          },
          offer_price: {
            type: 'number',
            description: 'The price after any offers/discounts.'
          },
          mrp_before_tax: {
            type: 'number',
            description: 'The MRP before taxes are applied.'
          },
          qty: {
            type: 'number',
            description: 'The quantity of the item purchased.'
          },
          cgst: {
            type: 'number',
            description: 'The Central GST rate applied.'
          },
          sgst: {
            type: 'number',
            description: 'The State GST rate applied.'
          },
          igst: {
            type: 'number',
            description: 'The Integrated GST rate applied.'
          },
          cess: {
            type: 'number',
            description: 'Any additional cess applied.'
          },
          cgst_amount: {
            type: 'number',
            description: 'The CGST amount calculated.'
          },
          sgst_amount: {
            type: 'number',
            description: 'The SGST amount calculated.'
          },
          igst_amount: {
            type: 'number',
            description: 'The IGST amount calculated.'
          },
          discount_percent: {
            type: 'number',
            description: 'The percentage of discount applied to the item.'
          },
          discount_amount: {
            type: 'number',
            description: 'The discount amount for the item.'
          },
          discount_amount_per_item: {
            type: 'number',
            description: 'The discount per item.'
          },
          amount: {
            type: 'number',
            description: 'The total amount for the item.'
          },
          taxIncluded: {
            type: 'boolean',
            description: 'Indicates if the tax is included in the item price.'
          },
          roundOff: {
            type: 'number',
            description: 'The rounded-off amount for the item.'
          },
          returnedQty: {
            type: 'number',
            description: 'The quantity of the item that has been returned.'
          },
          brandName: {
            type: 'string',
            description: 'The brand name of the item.'
          },
          categoryLevel3DisplayName: {
            type: 'string',
            description:
              'The display name of the category to which the item belongs.'
          },
          vendorName: {
            type: 'string',
            description: "The vendor's name who supplied the item."
          },
          netWeight: {
            type: 'string',
            description: 'The net weight of the item.'
          },
          purity: {
            type: 'string',
            description: 'The purity of the item (e.g., for gold).'
          },
          serialOrImeiNo: {
            type: 'string',
            description: 'The serial or IMEI number of the item.'
          },
          freeQty: {
            type: 'number',
            description: 'The quantity of the item provided for free.'
          },
          returnedFreeQty: {
            type: 'number',
            description: 'The quantity of free items that have been returned.'
          },
          qtyUnit: {
            type: 'string',
            description: 'The unit of quantity (e.g., kg, pcs).'
          },
          modelNo: {
            type: 'string',
            description: 'The model number of the item.'
          },
          pricePerGram: {
            type: 'number',
            description: 'The price per gram if applicable.'
          },
          warrantyDays: {
            type: 'number',
            description: 'The number of warranty days for the item.'
          },
          warrantyEndDate: {
            type: 'string',
            format: 'date',
            description: 'The date when the warranty ends.'
          }
        }
      }
    },
    packing_charge: {
      type: 'number',
      description: 'Any additional charge for packing.'
    },
    shipping_charge: {
      type: 'number',
      description: 'Any additional charge for shipping.'
    },
    place_of_supply: {
      type: 'string',
      description: 'The location from which the goods are supplied.'
    },
    placeOfSupplyName: {
      type: 'string',
      description: 'The name associated with the place of supply.'
    },
    ewayBillNo: {
      type: 'string',
      description: 'The e-way bill number generated for the shipment.'
    },
    waiter_name: {
      type: 'string',
      description: 'The name of the waiter if applicable.'
    },
    tableNumber: {
      type: 'string',
      description: 'The table number if applicable.'
    },
    onlineOrderStatus: {
      type: 'string',
      description: 'The status of the online order.'
    },
    sub_total: {
      type: 'string',
      description: 'The subtotal amount before taxes and charges.'
    },
    reverseCharge: {
      type: 'boolean',
      description: 'Indicates if reverse charge is applicable.'
    },
    bankAccount: {
      type: 'string',
      description: 'The bank account used for the transaction.'
    },
    bankAccountId: {
      type: 'string',
      description: 'The ID of the bank account used.'
    },
    bankPaymentType: {
      type: 'string',
      description: 'The type of bank payment (e.g., NEFT, RTGS).'
    },
    paymentReferenceNumber: {
      type: 'string',
      description: 'The payment reference number.'
    },
    poDate: {
      type: 'string',
      format: 'date',
      description: 'The date of the purchase order.'
    },
    poInvoiceNo: {
      type: 'string',
      description: 'The invoice number for the purchase order.'
    },
    vehicleNo: {
      type: 'string',
      description: 'The vehicle number used for transport.'
    },
    transportMode: {
      type: 'string',
      description: "The mode of transport (e.g., 'Road')."
    },
    shipToCustomerName: {
      type: 'string',
      description: 'The name of the customer to whom the goods are shipped.'
    },
    shipToCustomerGSTNo: {
      type: 'string',
      description:
        'The GST number of the customer to whom the goods are shipped.'
    },
    shipToCustomerGstType: {
      type: 'string',
      description: 'The GST type of the customer to whom the goods are shipped.'
    },
    customerState: {
      type: 'string',
      description: 'The state of the customer.'
    },
    customerCountry: {
      type: 'string',
      description: 'The country of the customer.'
    },
    shipToCustomerState: {
      type: 'string',
      description: 'The state of the customer to whom the goods are shipped.'
    },
    shipToCustomerCountry: {
      type: 'string',
      description: 'The country of the customer to whom the goods are shipped.'
    },
    notes: {
      type: 'string',
      description: 'Additional notes for the invoice.'
    },
    prefix: {
      type: 'string',
      description: 'The prefix used in the invoice number.'
    },
    subPrefix: {
      type: 'string',
      description: 'The sub-prefix used in the invoice number.'
    },
    ewayBillStatus: {
      type: 'string',
      description: 'The status of the e-way bill.'
    },
    ewayBillDetails: {
      type: 'object',
      description: 'Details of the e-way bill.',
      properties: {
        field1: {
          type: 'string',
          description: 'Details specific to the e-way bill.'
        }
      }
    },
    einvoiceBillStatus: {
      type: 'string',
      description: 'The status of the e-invoice bill.'
    },
    einvoiceDetails: {
      type: 'object',
      description: 'Details of the e-invoice.',
      properties: {
        field1: {
          type: 'string',
          description: 'Details specific to the e-invoice.'
        }
      }
    },
    vehicleType: {
      type: 'string',
      description: 'The type of vehicle used for transport.'
    },
    approxDistance: {
      type: 'number',
      description: 'The approximate distance of transport.'
    },
    transporterName: {
      type: 'string',
      description: 'The name of the transporter.'
    },
    transporterId: {
      type: 'string',
      description: 'The ID of the transporter.'
    },
    ewayBillGeneratedDate: {
      type: 'string',
      format: 'date',
      description: 'The date when the e-way bill was generated.'
    },
    einvoiceBillGeneratedDate: {
      type: 'string',
      format: 'date',
      description: 'The date when the e-invoice was generated.'
    },
    ewayBillValidDate: {
      type: 'string',
      format: 'date',
      description: 'The validity date of the e-way bill.'
    },
    irnNo: {
      type: 'string',
      description: 'The Invoice Reference Number (IRN) for the e-invoice.'
    },
    tcsAmount: {
      type: 'number',
      description: 'The amount of Tax Collected at Source (TCS).'
    },
    tcsName: {
      type: 'string',
      description: 'The name associated with the TCS.'
    },
    tcsRate: {
      type: 'number',
      description: 'The rate of TCS applied.'
    },
    tcsCode: {
      type: 'string',
      description: 'The code for TCS.'
    },
    dueDate: {
      type: 'string',
      format: 'date',
      description: 'The due date for payment.'
    },
    tdsAmount: {
      type: 'number',
      description: 'The amount of Tax Deducted at Source (TDS).'
    },
    tdsName: {
      type: 'string',
      description: 'The name associated with the TDS.'
    },
    tdsRate: {
      type: 'number',
      description: 'The rate of TDS applied.'
    },
    tdsCode: {
      type: 'string',
      description: 'The code for TDS.'
    },
    isCancelled: {
      type: 'boolean',
      description: 'Indicates if the invoice has been cancelled.'
    },
    eWayErrorMessage: {
      type: 'string',
      description: 'Error message related to e-way bill generation.'
    },
    eInvoiceErrorMessage: {
      type: 'string',
      description: 'Error message related to e-invoice generation.'
    },
    salesEmployeeName: {
      type: 'string',
      description:
        'The name of the sales employee associated with the transaction.'
    },
    amendmentDate: {
      type: 'string',
      format: 'date',
      description: 'The date when the amendment was made to the invoice.'
    },
    amended: {
      type: 'boolean',
      description: 'Indicates whether the invoice has been amended.'
    },
    amendmentReason: {
      type: 'string',
      description: 'The reason for the amendment.'
    },
    exportType: {
      type: 'string',
      description: "The type of export, such as 'Direct', 'Indirect', etc."
    },
    exportCountry: {
      type: 'string',
      description: 'The country to which the goods are being exported.'
    },
    exportCurrency: {
      type: 'string',
      description: 'The currency used for the export transaction.'
    },
    exportConversionRate: {
      type: 'number',
      description:
        'The conversion rate applied for the export currency to the local currency.'
    },
    exportShippingBillNo: {
      type: 'string',
      description: 'The shipping bill number associated with the export.'
    },
    exportShippingBillDate: {
      type: 'string',
      format: 'date',
      description: 'The date when the shipping bill was issued.'
    },
    exportShippingPortCode: {
      type: 'string',
      description: 'The code of the port from which the goods are exported.'
    },
    discountPercentForAllItems: {
      type: 'number',
      description:
        'The percentage of discount applied to all items in the invoice.'
    },
    insurance: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'The total insurance amount.'
        },
        percent: {
          type: 'number',
          description: 'The insurance percentage applied.'
        },
        type: {
          type: 'string',
          description: "The type of insurance, either 'amount' or 'percent'."
        },
        policyNo: {
          type: 'string',
          description: 'The insurance policy number.'
        },
        cgst: {
          type: 'number',
          description:
            'The Central Goods and Services Tax percentage on the insurance.'
        },
        sgst: {
          type: 'number',
          description:
            'The State Goods and Services Tax percentage on the insurance.'
        },
        igst: {
          type: 'number',
          description:
            'The Integrated Goods and Services Tax percentage on the insurance.'
        },
        cgstAmount: {
          type: 'number',
          description:
            'The Central Goods and Services Tax amount on the insurance.'
        },
        sgstAmount: {
          type: 'number',
          description:
            'The State Goods and Services Tax amount on the insurance.'
        },
        igstAmount: {
          type: 'number',
          description:
            'The Integrated Goods and Services Tax amount on the insurance.'
        }
      },
      required: ['amount', 'percent', 'type']
    },
    oldSequenceNumber: {
      type: 'string',
      description:
        'The previous sequence number of the invoice before the amendment.'
    },
    placeOfReceiptByPreCarrier: {
      type: 'string',
      description: 'The place where the goods are received by the pre-carrier.'
    },
    vesselFlightNo: {
      type: 'string',
      description: 'The vessel or flight number used for shipping the goods.'
    },
    portOfLoading: {
      type: 'string',
      description: 'The port where the goods are loaded for export.'
    },
    portOfDischarge: {
      type: 'string',
      description: 'The port where the goods will be discharged.'
    },
    otherReference: {
      type: 'string',
      description: 'Any other reference related to the shipment or transaction.'
    },
    billOfLadingNo: {
      type: 'string',
      description: 'The Bill of Lading number associated with the shipment.'
    },
    terms: {
      type: 'string',
      description: 'The terms and conditions of the transaction.'
    },
    buyerOtherBillTo: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The unique identifier for the alternate billing party.'
        },
        phoneNo: {
          type: 'string',
          description: 'The phone number of the alternate billing party.'
        },
        name: {
          type: 'string',
          description: 'The name of the alternate billing party.'
        }
      },
      required: ['id', 'phoneNo', 'name']
    },
    totalOtherCurrency: {
      type: 'number',
      description: 'The total amount in another currency, if applicable.'
    },
    exportCountryOrigin: {
      type: 'string',
      description: 'The country of origin for the exported goods.'
    },
    shippingChargeOtherCurrency: {
      type: 'number',
      description: 'The shipping charge in another currency, if applicable.'
    },
    packingChargeOtherCurrency: {
      type: 'number',
      description: 'The packing charge in another currency, if applicable.'
    }
  };
};

export const kotAuditSchema = () => {
  return {
    categoryName: {
      type: 'string',
      description:
        "Name of the category or section where the table is located, e.g., 'Third Floor'."
    },
    tableId: {
      type: 'string',
      description: 'Unique identifier for the table.'
    },
    tableNumber: {
      type: 'string',
      description: 'Identifier or number assigned to the table.'
    },
    ordersData: {
      type: 'array',
      description: 'List of orders placed at the table.',
      items: {
        type: 'object',
        properties: {
          invoice_number: {
            type: 'string',
            description: 'Unique identifier for the invoice.'
          },
          sequenceNumber: {
            type: 'string',
            description: 'Sequence number of the order, if applicable.'
          },
          waiter_phoneNo: {
            type: 'string',
            description: 'Phone number of the waiter serving the table.'
          },
          customer_name: {
            type: 'string',
            description: 'Name of the customer placing the order.'
          },
          invoice_date: {
            type: 'string',
            format: 'date',
            description: 'Date when the invoice was generated.'
          },
          total_amount: {
            type: 'number',
            description: 'Total amount for the order.'
          },
          items: {
            type: 'array',
            description: 'List of items ordered.',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Unique identifier for the item.'
                },
                product_id: {
                  type: 'string',
                  description: 'Unique identifier for the product.'
                },
                item_name: {
                  type: 'string',
                  description: 'Name of the item ordered.'
                },
                sku: {
                  type: 'string',
                  description:
                    'Stock Keeping Unit, an identifier for tracking the item in inventory.'
                },
                barcode: {
                  type: 'string',
                  description: 'Barcode associated with the item.'
                },
                mrp: {
                  type: 'number',
                  description: 'Maximum Retail Price of the item.'
                },
                mrp_before_tax: {
                  type: 'number',
                  description: 'MRP before any taxes are applied.'
                },
                purchased_price: {
                  type: 'number',
                  description:
                    'The price at which the item was purchased by the business.'
                },
                offer_price: {
                  type: 'number',
                  description: 'Discounted price offered to the customer.'
                },             
                qty: {
                  type: 'integer',
                  description: 'Quantity of the item ordered.'
                },
                cgst: {
                  type: 'number',
                  description:
                    'Central Goods and Services Tax applied to the item.'
                },
                sgst: {
                  type: 'number',
                  description:
                    'State Goods and Services Tax applied to the item.'
                },
                igst: {
                  type: 'number',
                  description:
                    'Integrated Goods and Services Tax applied to the item.'
                },
                cess: {
                  type: 'number',
                  description: 'Cess or additional tax applied to the item.'
                },
                igst_amount: {
                  type: 'number',
                  description:
                    'Amount of Integrated Goods and Services Tax applied.'
                },
                cgst_amount: {
                  type: 'number',
                  description:
                    'Amount of Central Goods and Services Tax applied.'
                },
                sgst_amount: {
                  type: 'number',
                  description: 'Amount of State Goods and Services Tax applied.'
                },
                amount: {
                  type: 'number',
                  description:
                    'Total amount after applying all taxes and discounts.'
                },
                roundOff: {
                  type: 'number',
                  description: 'The round-off amount for the item price.'
                },           
                brandName: {
                  type: 'string',
                  description: 'Brand name of the item.'
                },
                categoryLevel3DisplayName: {
                  type: 'string',
                  description:
                    'Display name for the third-level category of the item.'
                },
                served: {
                  type: 'boolean',
                  description: 'Indicates whether the item has been served.'
                },
                discount_percent: {
                  type: 'number',
                  description: 'Discount percentage applied to the item.'
                },
                discount_amount: {
                  type: 'number',
                  description: 'Total discount amount applied to the item.'
                },
                discount_amount_per_item: {
                  type: 'number',
                  description: 'Discount amount per item unit.'
                },
                discount_type: {
                  type: 'string',
                  description:
                    'Type of discount applied (e.g., percentage, flat amount).'
                },
                taxIncluded: {
                  type: 'boolean',
                  description: 'Indicates whether tax is included in the price.'
                },
                hsn: {
                  type: 'string',
                  description:
                    'Harmonized System Nomenclature code for the item.'
                }
              },
              required: ['id', 'product_id', 'item_name', 'mrp', 'amount']
            }
          },
          customerGSTNo: {
            type: ['string', 'null'],
            description: 'GST number of the customer, if available.'
          },
          customer_address: {
            type: 'string',
            description: 'Address of the customer.'
          },
          customer_city: {
            type: 'string',
            description: 'City of the customer.'
          },
          customer_emailId: {
            type: 'string',
            description: 'Email ID of the customer.'
          },
          customer_pincode: {
            type: 'string',
            description: "Pincode of the customer's address."
          },
          is_roundoff: {
            type: 'boolean',
            description: 'Indicates whether the amount has been rounded off.'
          },
          round_amount: {
            type: 'string',
            description: 'The round-off amount applied to the total.'
          },
          payment_type: {
            type: 'string',
            description: 'Type of payment used (e.g., cash, card, UPI).'
          },
          balance_amount: {
            type: 'number',
            description: 'Balance amount to be paid by the customer.'
          },
          discount_percent: {
            type: 'number',
            description: 'Overall discount percentage applied to the order.'
          },
          discount_amount: {
            type: 'number',
            description: 'Total discount amount applied to the order.'
          },
          discount_type: {
            type: 'string',
            description: 'Type of discount applied to the order.'
          },
          packing_charge: {
            type: 'number',
            description: 'Additional charge for packing, if applicable.'
          },
          shipping_charge: {
            type: 'number',
            description: 'Charge for shipping or delivery, if applicable.'
          },
          categoryId: {
            type: 'string',
            description: 'Unique identifier for the category.'
          },
          prefix: {
            type: 'string',
            description: 'Prefix used in the invoice or order ID, if any.'
          },
          subPrefix: {
            type: 'string',
            description: 'Sub-prefix used in the invoice or order ID, if any.'
          },
          bankAccount: {
            type: 'string',
            description: 'Name of the bank account used for the payment.'
          },
          bankAccountId: {
            type: 'string',
            description: 'Unique identifier for the bank account.'
          },
          bankPaymentType: {
            type: 'string',
            description: 'Type of bank payment (e.g., NEFT, IMPS).'
          },
          paymentReferenceNumber: {
            type: 'string',
            description: 'Reference number for the payment transaction.'
          },
          customerGSTType: {
            type: 'string',
            description: 'Type of GST associated with the customer.'
          },
          customerState: {
            type: 'string',
            description: "State of the customer's address."
          },
          customerCountry: {
            type: 'string',
            description: "Country of the customer's address."
          },       
          menuType: {
            type: 'string',
            description:
              'Type of menu used for the order (e.g., a la carte, buffet).'
          },
          subTotal: {
            type: 'number',
            description: 'Subtotal amount before taxes and discounts.'
          }
        }
      }
    },
    id: {
      type: 'string',
      description: 'Unique identifier for the table (same as tableId).'
    }
  };
};