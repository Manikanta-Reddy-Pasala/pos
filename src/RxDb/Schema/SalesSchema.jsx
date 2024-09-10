import * as Bd from '../../components/SelectedBusiness';
import {
  getLastSyncedRecordForBusiness,
  validateSalesDocumentBeforeSync
} from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const SalesSchema = {
  title: ' ',
  description: '',
  version: 27,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    customer_id: {
      type: 'string'
    },
    company_name: {
      type: 'string'
    },
    customerGSTNo: {
      type: 'string'
    },
    customerGstType: {
      type: 'string'
    },
    mobile_no: {
      type: 'number'
    },
    customer_name: {
      type: 'string'
    },
    customer_address: {
      type: 'string'
    },
    customer_phoneNo: {
      type: 'string'
    },
    customer_city: {
      type: 'string'
    },
    customer_emailId: {
      type: 'string'
    },
    customer_pincode: {
      type: 'string'
    },
    invoice_number: {
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    invoice_date: {
      type: 'string',
      format: 'date'
    },
    order_type: {
      type: 'string'
    },
    is_roundoff: {
      type: 'boolean'
    },
    round_amount: {
      type: 'number'
    },
    total_amount: {
      type: 'number'
    },
    rounded_amount: {
      type: 'number'
    },
    balance_amount: {
      type: 'number'
    },
    is_credit: {
      type: 'boolean'
    },
    payment_type: {
      type: 'string'
    },
    received_amount: {
      type: 'number'
    },
    isFullyReturned: {
      type: 'boolean'
    },
    isPartiallyReturned: {
      type: 'boolean'
    },
    discount_percent: {
      type: 'number'
    },
    discount_amount: {
      type: 'number'
    },
    discount_type: {
      type: 'string'
    },
    linkPayment: {
      type: 'boolean'
    },
    linked_amount: {
      type: 'number'
    },
    linkedTxnList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          linkedId: {
            type: 'string'
          },
          date: {
            type: 'string',
            format: 'date'
          },
          linkedAmount: {
            type: 'number'
          },
          paymentType: {
            type: 'string'
          },
          transactionNumber: {
            type: 'string'
          },
          sequenceNumber: {
            type: 'string'
          }
        }
      }
    },
    rateList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          metal: {
            type: 'string'
          },
          purity: {
            type: 'string'
          },
          rateByGram: {
            type: 'number'
          },
          defaultBool: {
            type: 'boolean'
          }
        }
      }
    },
    item_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          imageUrl: {
            type: 'string'
          },
          batch_id: {
            type: 'number'
          },
          unit: {
            type: 'string'
          },
          hsn: {
            type: 'string'
          },
          item_name: {
            type: 'string'
          },
          sku: {
            type: 'string'
          },
          barcode: {
            type: 'string'
          },
          mrp: {
            type: 'number'
          },
          purchased_price: {
            type: 'number'
          },
          offer_price: {
            type: 'number'
          },
          mrp_before_tax: {
            type: 'number'
          },
          size: {
            type: 'number'
          },
          qty: {
            type: 'number'
          },
          taxType: {
            type: 'string'
          },
          cgst: {
            type: 'number'
          },
          sgst: {
            type: 'number'
          },
          igst: {
            type: 'number'
          },
          cgst_amount: {
            type: 'number'
          },
          sgst_amount: {
            type: 'number'
          },
          igst_amount: {
            type: 'number'
          },
          discount_percent: {
            type: 'number'
          },
          discount_amount: {
            type: 'number'
          },
          discount_amount_per_item: {
            type: 'number'
          },
          discount_type: {
            type: 'string'
          },
          cess: {
            type: 'number'
          },
          amount: {
            type: 'number'
          },
          isEdit: {
            type: 'boolean'
          },
          taxIncluded: {
            type: 'boolean'
          },
          roundOff: {
            type: 'number'
          },
          returnedQty: {
            type: 'number'
          },
          stockQty: {
            type: 'number'
          },
          vendorName: {
            type: 'string'
          },
          vendorPhoneNumber: {
            type: 'string'
          },
          brandName: {
            type: 'string'
          },
          categoryLevel2: {
            type: 'string'
          },
          categoryLevel2DisplayName: {
            type: 'string'
          },
          categoryLevel3: {
            type: 'string'
          },
          categoryLevel3DisplayName: {
            type: 'string'
          },
          wastagePercentage: {
            type: 'string'
          },
          wastageGrams: {
            type: 'string'
          },
          grossWeight: {
            type: 'string'
          },
          netWeight: {
            type: 'string'
          },
          purity: {
            type: 'string'
          },
          makingChargePercent: {
            type: 'number'
          },
          makingChargeAmount: {
            type: 'number'
          },
          makingChargeType: {
            type: 'string'
          },
          makingChargePerGramAmount: {
            type: 'number'
          },
          serialOrImeiNo: {
            type: 'string'
          },
          finalMRPPrice: {
            type: 'number'
          },
          makingChargeIncluded: {
            type: 'boolean'
          },
          freeQty: {
            type: 'number'
          },
          freeStockQty: {
            type: 'number'
          },
          returnedFreeQty: {
            type: 'number'
          },
          qtyUnit: {
            type: 'string'
          },
          primaryUnit: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string'
              },
              shortName: {
                type: 'string'
              }
            }
          },
          secondaryUnit: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string'
              },
              shortName: {
                type: 'string'
              }
            }
          },
          unitConversionQty: {
            type: 'number'
          },
          units: {
            type: 'array'
          },
          originalMrpWithoutConversionQty: {
            type: 'number'
          },
          mfDate: {
            type: 'string'
          },
          expiryDate: {
            type: 'string'
          },
          rack: {
            type: 'string'
          },
          warehouseData: {
            type: 'string'
          },
          batchNumber: {
            type: 'string'
          },
          modelNo: {
            type: 'string'
          },
          pricePerGram: {
            type: 'number'
          },
          stoneWeight: {
            type: 'number'
          },
          stoneCharge: {
            type: 'number'
          },
          itemNumber: {
            type: 'number'
          },
          originalDiscountPercent: {
            type: 'number'
          },
          hallmarkCharge: {
            type: 'number'
          },
          certificationCharge: {
            type: 'number'
          },
          properties: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: {
                  type: 'string'
                },
                value: {
                  type: 'string'
                }
              }
            }
          },
          addOnProperties: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                additionalPropertyId: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                type: {
                  type: 'string'
                },
                offline: {
                  type: 'boolean'
                },
                taxType: {
                  type: 'string'
                },
                cgst: {
                  type: 'number'
                },
                sgst: {
                  type: 'number'
                },
                igst: {
                  type: 'number'
                },
                cgst_amount: {
                  type: 'number'
                },
                sgst_amount: {
                  type: 'number'
                },
                igst_amount: {
                  type: 'number'
                },
                discount_percent: {
                  type: 'number'
                },
                discount_amount: {
                  type: 'number'
                },
                discount_amount_per_item: {
                  type: 'number'
                },
                discount_type: {
                  type: 'string'
                },
                amount: {
                  type: 'number'
                },
                cess: {
                  type: 'number'
                },
                taxIncluded: {
                  type: 'boolean'
                },
                groupName: {
                  type: 'string'
                },
                purchasedPrice: {
                  type: 'number'
                },
                productId: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                batchId: {
                  type: 'number'
                },
                brandName: {
                  type: 'string'
                },
                categoryLevel2: {
                  type: 'string'
                },
                categoryLevel2DisplayName: {
                  type: 'string'
                },
                categoryLevel3: {
                  type: 'string'
                },
                categoryLevel3DisplayName: {
                  type: 'string'
                },
                stockQty: {
                  type: 'number'
                },
                hsn: {
                  type: 'string'
                },
                barcode: {
                  type: 'string'
                }
              }
            }
          },
          dailyRate: {
            type: 'string'
          },
          startPackingNo: {
            type: 'number'
          },
          endPackingNo: {
            type: 'number'
          },
          totalPackingNos: {
            type: 'number'
          },
          netWeightPerPackage: {
            type: 'number'
          },
          grossWeightPerPackage: {
            type: 'number'
          },
          totalPackageNetWeight: {
            type: 'number'
          },
          totalPackageGrossWeight: {
            type: 'number'
          },
          mrpOtherCurrency: {
            type: 'number'
          },
          amountOtherCurrency: {
            type: 'number'
          },
          discountOtherCurrency: {
            type: 'number'
          },
          warrantyDays: {
            type: 'number'
          },
          warrantyEndDate: {
            type: 'string'
          },
          purchased_price_before_tax: {
            type: 'number'
          }
        }
      }
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    packing_charge: {
      type: 'number'
    },
    shipping_charge: {
      type: 'number'
    },
    reverseCharge: {
      type: 'boolean'
    },
    place_of_supply: {
      type: 'string'
    },
    placeOfSupplyName: {
      type: 'string'
    },
    ewayBillNo: {
      type: 'string'
    },
    //kot fields
    waiter_name: {
      type: 'string'
    },
    waiter_phoneNo: {
      type: 'string'
    },
    numberOfPax: {
      type: 'number'
    },
    chairsUsedInString: {
      type: 'string'
    },
    categoryId: {
      type: 'string'
    },
    categoryName: {
      type: 'string'
    },
    tableNumber: {
      type: 'string'
    },
    onlineOrderStatus: {
      type: 'string'
    },
    sub_total: {
      type: 'number'
    },
    employeeId: {
      type: 'string'
    },
    bankAccount: {
      type: 'string'
    },
    bankAccountId: {
      type: 'string'
    },
    bankPaymentType: {
      type: 'string'
    },
    templeBillType: {
      type: 'string'
    },
    templeSpecialDayName: {
      type: 'string'
    },
    templeSpecialDayStartDate: {
      type: 'string'
    },
    templeSpecialDayEndDate: {
      type: 'string'
    },
    templeSpecialDayTimings: {
      type: 'string'
    },
    templeCustomTypeComments: {
      type: 'string'
    },
    templeOccursEveryYear: {
      type: 'boolean'
    },
    gothra: {
      type: 'string'
    },
    rashi: {
      type: 'string'
    },
    star: {
      type: 'string'
    },
    specialDayEnabled: {
      type: 'boolean'
    },
    paymentReferenceNumber: {
      type: 'string'
    },
    poDate: {
      type: 'string',
      format: 'date'
    },
    poInvoiceNo: {
      type: 'string'
    },
    vehicleNo: {
      type: 'string'
    },
    transportMode: {
      type: 'string'
    },
    shipToCustomerName: {
      type: 'string'
    },
    shipToCustomerGSTNo: {
      type: 'string'
    },
    shipToCustomerGstType: {
      type: 'string'
    },
    shipToCustomerAddress: {
      type: 'string'
    },
    shipToCustomerPhoneNo: {
      type: 'string'
    },
    shipToCustomerCity: {
      type: 'string'
    },
    shipToCustomerEmailId: {
      type: 'string'
    },
    shipToCustomerPincode: {
      type: 'string'
    },
    shipToCustomerId: {
      type: 'string'
    },
    customerState: {
      type: 'string'
    },
    customerCountry: {
      type: 'string'
    },
    shipToCustomerState: {
      type: 'string'
    },
    shipToCustomerCountry: {
      type: 'string'
    },
    convertedToDC: {
      type: 'boolean'
    },
    notes: {
      type: 'string'
    },
    prefix: {
      type: 'string'
    },
    subPrefix: {
      type: 'string'
    },
    ewayBillStatus: {
      type: 'string'
    },
    ewayBillDetails: {
      type: 'object',
      properties: {
        supplyType: {
          type: 'string'
        },
        subSupplyType: {
          type: 'string'
        },
        subSupplyDesc: {
          type: 'string'
        },
        docType: {
          type: 'string'
        },
        docNo: {
          type: 'string'
        },
        docDate: {
          type: 'string'
        },
        fromGstin: {
          type: 'string'
        },
        fromTrdName: {
          type: 'string'
        },
        fromAddr1: {
          type: 'string'
        },
        fromAddr2: {
          type: 'string'
        },
        fromPlace: {
          type: 'string'
        },
        fromPincode: {
          type: 'number'
        },
        fromStateCode: {
          type: 'number'
        },
        actFromStateCode: {
          type: 'number'
        },
        toGstin: {
          type: 'string'
        },
        toTrdname: {
          type: 'string'
        },
        toAddr1: {
          type: 'string'
        },
        toAddr2: {
          type: 'string'
        },
        toPlace: {
          type: 'string'
        },
        toPincode: {
          type: 'number'
        },
        toStateCode: {
          type: 'number'
        },
        actToStateCode: {
          type: 'number'
        },
        transactionType: {
          type: 'number'
        },
        otherValue: {
          type: 'number'
        },
        totalValue: {
          type: 'number'
        },
        totInvValue: {
          type: 'number'
        },
        cgstValue: {
          type: 'number'
        },
        sgstValue: {
          type: 'number'
        },
        igstValue: {
          type: 'number'
        },
        cessValue: {
          type: 'number'
        },
        cessNonAdvolValue: {
          type: 'number'
        },
        transMode: {
          type: 'number'
        },
        vehicleType: {
          type: 'string'
        },
        transDistance: {
          type: 'number'
        },
        transporterId: {
          type: 'string'
        },
        transporterName: {
          type: 'string'
        },
        transDocNo: {
          type: 'string'
        },
        transDocDate: {
          type: 'string'
        },
        vehicleNo: {
          type: 'string'
        },
        ewayBillDate: {
          type: 'string'
        },
        ewayBillValidDate: {
          type: 'string'
        },
        ewayBillCancelDate: {
          type: 'string'
        },
        vehicleValidDate: {
          type: 'string'
        },
        vehicleUpdatedDate: {
          type: 'string'
        },
        remainingDistance: {
          type: 'number'
        },
        ewayBillExtendedDate: {
          type: 'string'
        },
        transUpdatedDate: {
          type: 'string'
        },
        ewayBillNo: {
          type: 'string'
        },
        cancelRmrk: {
          type: 'string'
        },
        cancelRsnCode: {
          type: 'number'
        },
        vehicleRsnCode: {
          type: 'number'
        },
        vehicleRsnRem: {
          type: 'string'
        },
        extnRsnCode: {
          type: 'number'
        },
        extnRemarks: {
          type: 'string'
        },
        extendConsignmentStatus: {
          type: 'string'
        },
        extendTransitType: {
          type: 'string'
        },
        extendAddressLine1: {
          type: 'string'
        },
        extendAddressLine2: {
          type: 'string'
        },
        extendAddressLine3: {
          type: 'string'
        },
        itemList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productName: {
                type: 'string'
              },
              productDesc: {
                type: 'string'
              },
              hsnCode: {
                type: 'number'
              },
              quantity: {
                type: 'number'
              },
              qtyUnit: {
                type: 'string'
              },
              taxableAmount: {
                type: 'number'
              },
              cgstRate: {
                type: 'number'
              },
              sgstRate: {
                type: 'number'
              },
              igstRate: {
                type: 'number'
              },
              cessRate: {
                type: 'number'
              },
              cessNonadvol: {
                type: 'number'
              }
            }
          }
        }
      }
    },
    einvoiceBillStatus: {
      type: 'string'
    },
    einvoiceDetails: {
      type: 'object',
      properties: {
        ackNo: {
          type: 'string'
        },
        ackDt: {
          type: 'string'
        },
        irn: {
          type: 'string'
        },
        version: {
          type: 'string'
        },
        tranDtls: {
          type: 'object',
          properties: {
            taxSch: {
              type: 'string'
            },
            supTyp: {
              type: 'string'
            },
            regRev: {
              type: 'string'
            },
            igstOnIntra: {
              type: 'string'
            }
          }
        },
        docDtls: {
          type: 'object',
          properties: {
            typ: {
              type: 'string'
            },
            no: {
              type: 'string'
            },
            dt: {
              type: 'string'
            }
          }
        },
        sellerDtls: {
          type: 'object',
          properties: {
            gstin: {
              type: 'string'
            },
            lglNm: {
              type: 'string'
            },
            addr1: {
              type: 'string'
            },
            loc: {
              type: 'string'
            },
            pin: {
              type: 'number'
            },
            stcd: {
              type: 'string'
            }
          }
        },
        buyerDtls: {
          type: 'object',
          properties: {
            gstin: {
              type: 'string'
            },
            lglNm: {
              type: 'string'
            },
            pos: {
              type: 'string'
            },
            addr1: {
              type: 'string'
            },
            loc: {
              type: 'string'
            },
            pin: {
              type: 'number'
            },
            stcd: {
              type: 'string'
            }
          }
        },
        dispDtls: {
          type: 'object',
          properties: {
            nm: {
              type: 'string'
            },
            addr1: {
              type: 'string'
            },
            loc: {
              type: 'string'
            },
            pin: {
              type: 'number'
            },
            stcd: {
              type: 'string'
            }
          }
        },
        shipDtls: {
          type: 'object',
          properties: {
            gstin: {
              type: 'string'
            },
            lglNm: {
              type: 'string'
            },
            addr1: {
              type: 'string'
            },
            loc: {
              type: 'string'
            },
            pin: {
              type: 'number'
            },
            stcd: {
              type: 'string'
            }
          }
        },
        valDtls: {
          type: 'object',
          properties: {
            assVal: {
              type: 'number'
            },
            cgstVal: {
              type: 'number'
            },
            sgstVal: {
              type: 'number'
            },
            igstVal: {
              type: 'number'
            },
            cesVal: {
              type: 'number'
            },
            stCesVal: {
              type: 'number'
            },
            discount: {
              type: 'number'
            },
            othChrg: {
              type: 'number'
            },
            rndOffAmt: {
              type: 'number'
            },
            totInvVal: {
              type: 'number'
            }
          }
        },
        ewbDtls: {
          type: 'object',
          properties: {
            transId: {
              type: 'string'
            },
            transName: {
              type: 'string'
            },
            transMode: {
              type: 'string'
            },
            distance: {
              type: 'number'
            },
            vehNo: {
              type: 'string'
            },
            vehType: {
              type: 'string'
            }
          }
        },
        itemList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              itemNo: {
                type: 'int'
              },
              slNo: {
                type: 'string'
              },
              isServc: {
                type: 'string'
              },
              prdDesc: {
                type: 'string'
              },
              hsnCd: {
                type: 'string'
              },
              qty: {
                type: 'number'
              },
              unit: {
                type: 'string'
              },
              unitPrice: {
                type: 'number'
              },
              totAmt: {
                type: 'number'
              },
              discount: {
                type: 'number'
              },
              preTaxVal: {
                type: 'number'
              },
              assAmt: {
                type: 'number'
              },
              gstRt: {
                type: 'number'
              },
              igstAmt: {
                type: 'number'
              },
              cgstAmt: {
                type: 'number'
              },
              sgstAmt: {
                type: 'number'
              },
              cesRt: {
                type: 'number'
              },
              cesAmt: {
                type: 'number'
              },
              cesNonAdvlAmt: {
                type: 'number'
              },
              stateCesRt: {
                type: 'number'
              },
              stateCesAmt: {
                type: 'number'
              },
              stateCesNonAdvlAmt: {
                type: 'number'
              },
              othChrg: {
                type: 'number'
              },
              totItemVal: {
                type: 'number'
              }
            }
          }
        },
        einvoiceDate: {
          type: 'string'
        },
        irnNo: {
          type: 'string'
        },
        uuid: {
          type: 'string'
        },
        signedQrCodeImgUrl: {
          type: 'string'
        },
        invoicePdfUrl: {
          type: 'string'
        },
        irnStatus: {
          type: 'string'
        },
        ewbStatus: {
          type: 'string'
        },
        irp: {
          type: 'string'
        },
        remarks: {
          type: 'string'
        },
        ackNoStr: {
          type: 'string'
        },
        ewbValidTill: {
          type: 'string'
        },
        signedQrCode: {
          type: 'string'
        },
        signedInvoice: {
          type: 'string'
        },
        ewbDt: {
          type: 'string'
        },
        ewbNo: {
          type: 'string'
        },
        infoDtls: {
          type: 'object',
          properties: {
            infCd: {
              type: 'string'
            },
            desc: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  errorCode: {
                    type: 'string'
                  },
                  errorMessage: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    vehicleType: {
      type: 'string'
    },
    approxDistance: {
      type: 'number'
    },
    transporterName: {
      type: 'string'
    },
    transporterId: {
      type: 'string'
    },
    ewayBillGeneratedDate: {
      type: 'string'
    },
    einvoiceBillGeneratedDate: {
      type: 'string'
    },
    ewayBillValidDate: {
      type: 'string'
    },
    irnNo: {
      type: 'string'
    },
    customerTradeName: {
      type: 'string'
    },
    customerLegalName: {
      type: 'string'
    },
    shipToCustomerTradeName: {
      type: 'string'
    },
    shipToCustomerLegalName: {
      type: 'string'
    },
    customerRegistrationNumber: {
      type: 'string'
    },
    customerPanNumber: {
      type: 'string'
    },
    shipToCustomerRegistrationNumber: {
      type: 'string'
    },
    shipToCustomerPanNumber: {
      type: 'string'
    },
    tcsAmount: {
      type: 'number'
    },
    tcsName: {
      type: 'string'
    },
    tcsRate: {
      type: 'number'
    },
    tcsCode: {
      type: 'string'
    },
    dueDate: {
      type: 'string'
    },
    tdsAmount: {
      type: 'number'
    },
    tdsName: {
      type: 'string'
    },
    tdsRate: {
      type: 'number'
    },
    tdsCode: {
      type: 'string'
    },
    splitPaymentList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          paymentType: {
            type: 'string'
          },
          referenceNumber: {
            type: 'string'
          },
          paymentMode: {
            type: 'string'
          },
          accountDisplayName: {
            type: 'string'
          },
          bankAccountId: {
            type: 'string'
          },
          amount: {
            type: 'number'
          }
        }
      }
    },
    weightIn: {
      type: 'number'
    },
    weightOut: {
      type: 'number'
    },
    wastage: {
      type: 'number'
    },
    jobAssignedEmployeeId: {
      type: 'string'
    },
    jobAssignedEmployeeName: {
      type: 'string'
    },
    jobAssignedEmployeePhoneNumber: {
      type: 'string'
    },
    isCancelled: {
      type: 'boolean'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    invoiceStatus: {
      type: 'string'
    },
    tallySyncedStatus: {
      type: 'string'
    },
    tallySynced: {
      type: 'boolean'
    },
    aadharNumber: {
      type: 'string'
    },
    sortingNumber: {
      type: 'number'
    },
    eWayErrorMessage: {
      type: 'string'
    },
    eInvoiceErrorMessage: {
      type: 'string'
    },
    salesEmployeeName: {
      type: 'string'
    },
    salesEmployeeId: {
      type: 'string'
    },
    salesEmployeePhoneNumber: {
      type: 'string'
    },
    calculateStockAndBalance: {
      type: 'boolean'
    },
    schemeId: {
      type: 'string'
    },
    shippingTax: {
      type: 'object',
      properties: {
        cgst: {
          type: 'number'
        },
        sgst: {
          type: 'number'
        },
        igst: {
          type: 'number'
        },
        cgstAmount: {
          type: 'number'
        },
        sgstAmount: {
          type: 'number'
        },
        igstAmount: {
          type: 'number'
        }
      }
    },
    packingTax: {
      type: 'object',
      properties: {
        cgst: {
          type: 'number'
        },
        sgst: {
          type: 'number'
        },
        igst: {
          type: 'number'
        },
        cgstAmount: {
          type: 'number'
        },
        sgstAmount: {
          type: 'number'
        },
        igstAmount: {
          type: 'number'
        }
      }
    },
    amendmentDate: {
      type: 'string'
    },
    amended: {
      type: 'boolean'
    },
    amendmentReason: {
      type: 'string'
    },
    exportType: {
      type: 'string'
    },
    exportCountry: {
      type: 'string'
    },
    exportCurrency: {
      type: 'string'
    },
    exportConversionRate: {
      type: 'number'
    },
    exportShippingBillNo: {
      type: 'string'
    },
    exportShippingBillDate: {
      type: 'string'
    },
    exportShippingPortCode: {
      type: 'string'
    },
    discountPercentForAllItems: {
      type: 'number'
    },
    insurance: {
      type: 'object',
      properties: {
        amount: {
          type: 'number'
        },
        percent: {
          type: 'number'
        },
        type: {
          type: 'string'
        },
        policyNo: {
          type: 'string'
        },
        cgst: {
          type: 'number'
        },
        sgst: {
          type: 'number'
        },
        igst: {
          type: 'number'
        },
        cgstAmount: {
          type: 'number'
        },
        sgstAmount: {
          type: 'number'
        },
        igstAmount: {
          type: 'number'
        },
        amountOtherCurrency: {
          type: 'number'
        }
      }
    },
    receiptOrPayment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          sequenceNumber: {
            type: 'string'
          },
          paymentType: {
            type: 'string'
          },
          paymentMode: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          bankName: {
            type: 'string'
          },
          bankId: {
            type: 'string'
          },
          referenceNumber: {
            type: 'string'
          },
          createdAt: {
            type: 'number'
          },
          narration: {
            type: 'string'
          },
          cancelled: {
            type: 'boolean'
          }
        }
      }
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    oldSequenceNumber: {
      type: 'string'
    },
    placeOfReceiptByPreCarrier: {
      type: 'string'
    },
    vesselFlightNo: {
      type: 'string'
    },
    portOfLoading: {
      type: 'string'
    },
    portOfDischarge: {
      type: 'string'
    },
    otherReference: {
      type: 'string'
    },
    billOfLadingNo: {
      type: 'string'
    },
    terms: {
      type: 'string'
    },
    buyerOtherBillTo: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        phoneNo: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        address: {
          type: 'string'
        },
        pincode: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        state: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        gstNo: {
          type: 'string'
        },
        gstType: {
          type: 'string'
        },
        pan: {
          type: 'string'
        },
        aadhar: {
          type: 'string'
        },
        tradeName: {
          type: 'string'
        },
        legalName: {
          type: 'string'
        },
        regNo: {
          type: 'string'
        }
      }
    },
    totalOtherCurrency: {
      type: 'number'
    },
    exportCountryOrigin: {
      type: 'string'
    },
    shippingChargeOtherCurrency: {
      type: 'number'
    },
    packingChargeOtherCurrency: {
      type: 'number'
    }
  },
  indexes: [
    ['invoice_date', 'updatedAt'],
    'updatedAt',
    'invoice_date',
    'dueDate',
    'customer_id',
    'posId',
    'customer_phoneNo',
    'balance_amount',
    'item_list.[].hsn',
    'order_type',
    'sequenceNumber',
    'templeBillType',
    'templeSpecialDayName',
    'templeSpecialDayStartDate',
    'tcsAmount',
    'customerGSTNo',
    'customerState',
    'templeSpecialDayStartDate',
    'sortingNumber'
  ],
  required: ['businessId', 'businessCity', 'invoice_date', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await getLastSyncedRecordForBusiness(
        'sales',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    localStorage.setItem('saleLastSyncDoc', JSON.stringify(doc));

    if (!doc) {
      // the first pull does not have a start-document
      doc = {
        invoice_number: '0',
        updatedAt: 0,
        posId: businessData.posDeviceId,
        businessId: businessData.businessId,
        businessCity: businessData.businessCity
      };
    }

    if (!doc.posId) {
      doc.posId = localStoragePosId;
    }

    const currentUpdatedAt = Date.now();
    if (!(doc.updatedAt <= currentUpdatedAt)) {
      doc.updatedAt = currentUpdatedAt;
    }

    try {
      return await pullQueryBuilderInBackground(doc);
    } catch (error) {
      console.error('Error executing pullQueryBuilderInBackground:', error);
    }
  }
  return null;
};

export const pushQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    try {
      return await salesPushQueryBuilderInBackground(doc, localStoragePosId);
    } catch (error) {
      console.error('Error executing pullQueryBuilderInBackground:', error);
    }
  }
  return null;
};

const pullQueryBuilderInBackground = greenlet(async (doc) => {
  const BATCH_SIZE = 30;

  const query = `{
    getSales(lastId: "${doc.invoice_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      customer_id,
      company_name,
      customerGSTNo,
      customerGstType,
      mobile_no,
      customer_name,
      customer_address,
      customer_phoneNo,
      customer_city,
      customer_emailId,
      customer_pincode,
      invoice_number,
      sequenceNumber,
      invoice_date,
      order_type,
      is_roundoff,
      round_amount,
      total_amount,
      rounded_amount,
      balance_amount,
      is_credit,
      payment_type,
      received_amount,
      isFullyReturned,
      isPartiallyReturned,
      linkPayment,
      linked_amount,
      linkedTxnList {
        linkedId,
        date,
        linkedAmount,
        paymentType,
        transactionNumber,
        sequenceNumber
      },
      rateList {
        id
        metal
        purity
        rateByGram
        defaultBool
      },
      discount_percent,
      discount_amount,
      discount_type,
      item_list {
        product_id,
        description,
        imageUrl,
        batch_id,
        unit,
        hsn,
        item_name,
        sku,
        barcode,
        mrp,
        purchased_price,
        offer_price,
        mrp_before_tax,
        size,
        qty,
        taxType,
        stockQty,
        cgst,
        sgst,
        igst,
        cess,
        cgst_amount,
        sgst_amount,
        igst_amount,
        discount_percent,
        discount_amount,
        discount_amount_per_item,
        discount_type,
        amount,
        isEdit,
        taxIncluded,
        roundOff,
        returnedQty,
        brandName,
        categoryLevel2,
        categoryLevel2DisplayName,
        categoryLevel3,
        categoryLevel3DisplayName,
        vendorName,
        vendorPhoneNumber,
        wastagePercentage,
        wastageGrams,
        grossWeight,
        netWeight,
        purity,
        makingChargePercent
        makingChargeAmount
        makingChargeType
        makingChargePerGramAmount
        serialOrImeiNo
        finalMRPPrice
        makingChargeIncluded
        freeQty
        freeStockQty
        returnedFreeQty
        qtyUnit
            primaryUnit {
              fullName
              shortName
            }
            secondaryUnit{
              fullName
              shortName
            }
            unitConversionQty
            units
            originalMrpWithoutConversionQty
            mfDate
            expiryDate
            rack
            warehouseData
            batchNumber
            modelNo
            pricePerGram
            stoneWeight
            stoneCharge
            itemNumber
            originalDiscountPercent
            dailyRate
            hallmarkCharge
            certificationCharge
            purchased_price_before_tax
            properties {
              title
              value
            }
            addOnProperties {
              additionalPropertyId
              name
              price
              type
              offline
              cgst
              sgst
              igst
              cgst_amount
              sgst_amount
              igst_amount
              discount_percent
              discount_amount
              discount_amount_per_item
              discount_type
              amount
              amount_before_tax
              cess
              taxIncluded
              groupName
              purchasedPrice
              taxType
              productId
              description
              batchId
              brandName
              categoryLevel2
              categoryLevel2DisplayName
              categoryLevel3
              categoryLevel3DisplayName
              stockQty
              hsn
              barcode
            }
            startPackingNo
            endPackingNo
            totalPackingNos
            netWeightPerPackage
            grossWeightPerPackage
            totalPackageNetWeight
            totalPackageGrossWeight
            mrpOtherCurrency
            amountOtherCurrency
            discountOtherCurrency
            warrantyDays
            warrantyEndDate
            purchased_price_before_tax
      }
      employeeId
      updatedAt
      posId
      packing_charge
      shipping_charge
      place_of_supply
      placeOfSupplyName
      ewayBillNo
      waiter_name
      waiter_phoneNo
      numberOfPax
      chairsUsedInString
      categoryId
      categoryName
      tableNumber
      deleted
      onlineOrderStatus
      sub_total
      reverseCharge
      bankAccount
      bankAccountId
      bankPaymentType
      templeBillType
      templeSpecialDayName
      templeSpecialDayStartDate
      templeSpecialDayEndDate
      templeSpecialDayTimings
      templeCustomTypeComments
      templeOccursEveryYear
      gothra
      rashi
      star
      specialDayEnabled
      paymentReferenceNumber
      poDate
      poInvoiceNo
      vehicleNo
      transportMode
      shipToCustomerName
      shipToCustomerGSTNo
      shipToCustomerGstType
      shipToCustomerAddress
      shipToCustomerPhoneNo
      shipToCustomerCity
      shipToCustomerEmailId
      shipToCustomerPincode
      shipToCustomerId
      customerState
      customerCountry
      shipToCustomerState
      shipToCustomerCountry
      convertedToDC
      notes
      prefix
      subPrefix
      ewayBillStatus
      ewayBillDetails {
        supplyType
        subSupplyType
        subSupplyDesc
        docType
        docNo
        docDate
        fromGstin
        fromTrdName
        fromAddr1
        fromAddr2
        fromPlace
        fromPincode
        fromStateCode
        actFromStateCode
        toGstin
        toTrdname
        toAddr1
        toAddr2
        toPlace
        toPincode
        toStateCode
        actToStateCode
        transactionType
        otherValue
        totalValue
        totInvValue
        cgstValue
        sgstValue
        igstValue
        cessValue
        cessNonAdvolValue
        transMode
        vehicleType
        transDistance
        transporterId
        transporterName
        transDocNo
        transDocDate
        vehicleNo
        ewayBillDate
        ewayBillValidDate
        ewayBillCancelDate
        vehicleValidDate
        vehicleUpdatedDate
        remainingDistance
        ewayBillExtendedDate
        transUpdatedDate
        ewayBillNo
        cancelRmrk
        cancelRsnCode
        vehicleRsnCode
        vehicleRsnRem
        extnRsnCode
        extnRemarks
        extendConsignmentStatus
        extendTransitType
        extendAddressLine1
        extendAddressLine2
        extendAddressLine3
        itemList {
          productName
          productDesc
          hsnCode
          quantity
          qtyUnit
          taxableAmount
          cgstRate
          sgstRate
          igstRate
          cessRate
          cessNonadvol
        }
      }
      einvoiceBillStatus
      einvoiceDetails {
        ackNo
        ackDt
        irn
        version
        tranDtls {
          taxSch
          supTyp
          regRev
          igstOnIntra
        }
        docDtls {
          typ
          no
          dt
        }
        sellerDtls {
          gstin
          lglNm
          addr1
          loc
          pin
          stcd
        }
        buyerDtls {
          gstin
          lglNm
          pos
          addr1
          loc
          pin
          stcd
        }
        dispDtls {
          nm
          addr1
          loc
          pin
          stcd
        }
        shipDtls {
          gstin
          lglNm
          addr1
          loc
          pin
          stcd
        }
        valDtls {
          assVal
          cgstVal
          sgstVal
          igstVal
          cesVal
          stCesVal
          discount
          othChrg
          rndOffAmt
          totInvVal
        }
        ewbDtls {
          transId
          transName
          transMode
          distance
          vehNo
          vehType
        }
        itemList {
          itemNo
          slNo
          isServc
          prdDesc
          hsnCd
          qty
          unit
          unitPrice
          totAmt
          discount
          preTaxVal
          assAmt
          gstRt
          igstAmt
          cgstAmt
          sgstAmt
          cesRt
          cesAmt
          cesNonAdvlAmt
          stateCesRt
          stateCesAmt
          stateCesNonAdvlAmt
          othChrg
          totItemVal
        }
      
    einvoiceDate
    irnNo
    uuid
    signedQrCodeImgUrl
    invoicePdfUrl
    irnStatus
    ewbStatus
    irp
    remarks
    ackNoStr
    ewbValidTill
    signedQrCode
    signedInvoice
    ewbDt
    ewbNo
    infoDtls {
      infCd
      desc {
        errorCode
        errorMessage
      }
    }
  }
    vehicleType
    approxDistance
    transporterName
    transporterId
    ewayBillGeneratedDate
    einvoiceBillGeneratedDate
    ewayBillValidDate
    irnNo
    customerTradeName
    customerLegalName
    shipToCustomerTradeName
    shipToCustomerLegalName
    customerRegistrationNumber
    customerPanNumber
    shipToCustomerRegistrationNumber
    shipToCustomerPanNumber
    tcsAmount
    tcsName
    tcsRate
    tcsCode
    dueDate
    tdsAmount
    tdsName
    tdsRate
    tdsCode
    splitPaymentList {
      id
      paymentType
      referenceNumber
      paymentMode
      accountDisplayName
      bankAccountId
      amount
    }
    weightIn
    weightOut
    wastage
    jobAssignedEmployeeId
    jobAssignedEmployeeName
    jobAssignedEmployeePhoneNumber
    isCancelled
    isSyncedToServer
    invoiceStatus
    tallySyncedStatus
    tallySynced
    aadharNumber
    sortingNumber
    eWayErrorMessage
    eInvoiceErrorMessage
    salesEmployeeName
    salesEmployeeId
    salesEmployeePhoneNumber
    calculateStockAndBalance
    schemeId
    shippingTax {
        cgst
        sgst
        igst
        cgstAmount
        sgstAmount
        igstAmount
    }
      packingTax {
          cgst
          sgst
          igst
          cgstAmount
          sgstAmount
          igstAmount
      }
      amendmentDate
      amended
      amendmentReason
      exportType
      exportCountry
      exportCurrency
      exportConversionRate
      exportShippingBillNo
      exportShippingBillDate
      exportShippingPortCode
      discountPercentForAllItems
      insurance {
          amount
          percent
          type
          policyNo
          cgst
          sgst
          igst
          cgstAmount
          sgstAmount
          igstAmount
          amountOtherCurrency
      }
      receiptOrPayment {
        id
        sequenceNumber
        paymentType
        paymentMode
        amount
        bankName
        bankId
        referenceNumber
        createdAt
        narration
        cancelled
      }
      imageUrls
      oldSequenceNumber
      placeOfReceiptByPreCarrier
      vesselFlightNo
      portOfLoading
      portOfDischarge
      otherReference
      billOfLadingNo
      terms
      buyerOtherBillTo {
        id
        phoneNo
        name
        address
        pincode
        city
        state
        country
        email
        gstNo
        gstType
        pan
        aadhar
        tradeName
        legalName
        regNo
      }
      totalOtherCurrency
      exportCountryOrigin
      shippingChargeOtherCurrency
      packingChargeOtherCurrency
}
}`;

  return {
    query,
    variables: {}
  };
});

const salesPushQueryBuilderInBackground = greenlet(
  async (doc, localStoragePosId) => {
    if (!doc.posId) {
      doc.posId = localStoragePosId;
    }

    const currentUpdatedAt = Date.now();
    if (!(doc.updatedAt <= currentUpdatedAt)) {
      doc.updatedAt = currentUpdatedAt;
    }

    const query = `
    mutation setSales($input: SalesInput) {
      setSales(sales: $input) {
        invoice_number
        updatedAt
      }
    }
  `;
    const variables = {
      input: doc
    };

    return {
      query,
      variables
    };
  }
);

export const salesSyncQueryBuilder = async (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.sales.syncGraphQL({
    url: syncURL,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // },
    push: {
      batchSize,
      queryBuilder: pushQueryBuilder,

      /**
       *  Modifies all pushed documents before they are send to the GraphQL endpoint.
       * Returning null will skip the document.
       */
      modifier: async (doc) => {
        return await validateSalesDocumentBeforeSync(doc);
      }
    },
    pull: {
      queryBuilder: pullQueryBuilder
      // modifier: async (doc) => {
      //   console.log('----doc---::' + JSON.stringify(doc));
      //   return doc;
      // }
    },
    live: true,
    /**
     * Because the websocket is used to inform the client
     * when something has changed,
     * we can set the live Interval to a high value
     */
    liveInterval: 1000 * 60 * 5,
    autoStart: true,
    retryTime: 1000 * 60 * 5,
    deletedFlag: 'deleted'
  });
};