import { action, observable, makeObservable, runInAction, toJS } from 'mobx';
import * as Db from '../../RxDb/Database/Database';

import * as apiHelper from '../../components/Helpers/ApiHelper';
import * as ewayHelper from '../../components/Helpers/EWayHelper';

class EWayStore {
  eWayBillNo = '';
  invoiceDetails = {};
  type = '';
  invoiceId = '';

  openEWayGenerateModal = false;
  openEWayCancelModal = false;
  openEWayExtendModal = false;
  openEWayUpdatePartBModal = false;
  openEWayUpdateTransporterModal = false;

  openEWayPrintSelectionAlert = false;

  ewayBillData = {
    supplyType: '',
    subSupplyType: '',
    subSupplyDesc: '',
    docType: '',
    docNo: '',
    docDate: '',
    transactionType: 0,
    fromTrdName: '',
    fromGstin: '',
    fromAddr1: '',
    fromAddr2: '',
    fromPlace: '',
    fromPincode: '',
    fromStateCode: 0.0,
    actFromStateCode: 0.0,
    toTrdName: '',
    toGstin: '',
    toAddr1: '',
    toAddr2: '',
    toPlace: '',
    toPincode: '',
    toStateCode: 0.0,
    actToStateCode: 0.0,
    otherValue: 0.0,
    totalValue: 0.0,
    totInvValue: 0.0,
    cgstValue: 0.0,
    sgstValue: 0.0,
    igstValue: 0.0,
    cessValue: 0.0,
    cessNonAdvolValue: 0.0,
    transMode: 0,
    vehicleType: 'Regular',
    transporterId: '',
    vehicleNo: '',
    transporterName: '',
    transDocNo: '',
    transDocDate: '',
    transDistance: 0.0,
    itemList: [],
    ewbNo: '',
    type: '',
    invoiceId: '',
    businessId: '',
    businessCity: ''
  };

  resetGeneratedData = () => {
    this.ewayBillData = {
      supplyType: '',
      subSupplyType: '',
      subSupplyDesc: '',
      docType: '',
      docNo: '',
      docDate: '',
      transactionType: 0,
      fromTrdName: '',
      fromGstin: '',
      fromAddr1: '',
      fromAddr2: '',
      fromPlace: '',
      fromPincode: '',
      fromStateCode: 0.0,
      actFromStateCode: 0.0,
      toTrdName: '',
      toGstin: '',
      toAddr1: '',
      toAddr2: '',
      toPlace: '',
      toPincode: '',
      toStateCode: 0.0,
      actToStateCode: 0.0,
      otherValue: 0.0,
      totalValue: 0.0,
      totInvValue: 0.0,
      cgstValue: 0.0,
      sgstValue: 0.0,
      igstValue: 0.0,
      cessValue: 0.0,
      cessNonAdvolValue: 0.0,
      transMode: 0.0,
      vehicleType: 'Regular',
      transporterId: '',
      vehicleNo: '',
      transporterName: '',
      transDocNo: '',
      transDocDate: '',
      transDistance: 0.0,
      itemList: [],
      ewbNo: '',
      type: '',
      invoiceId: '',
      businessId: '',
      businessCity: ''
    };

    this.invoiceDetails = {};
    this.invoiceId = '';
    this.eWayBillNo = '';
    this.type = '';
  };

  resetEWayPrintData = () => {
    this.ewayBillData = {
      supplyType: '',
      subSupplyType: '',
      subSupplyDesc: '',
      docType: '',
      docNo: '',
      docDate: '',
      transactionType: 0,
      fromTrdName: '',
      fromGstin: '',
      fromAddr1: '',
      fromAddr2: '',
      fromPlace: '',
      fromPincode: '',
      fromStateCode: 0.0,
      actFromStateCode: 0.0,
      toTrdName: '',
      toGstin: '',
      toAddr1: '',
      toAddr2: '',
      toPlace: '',
      toPincode: '',
      toStateCode: 0.0,
      actToStateCode: 0.0,
      otherValue: 0.0,
      totalValue: 0.0,
      totInvValue: 0.0,
      cgstValue: 0.0,
      sgstValue: 0.0,
      igstValue: 0.0,
      cessValue: 0.0,
      cessNonAdvolValue: 0.0,
      transMode: 0.0,
      vehicleType: 'Regular',
      transporterId: '',
      vehicleNo: '',
      transporterName: '',
      transDocNo: '',
      transDocDate: '',
      transDistance: 0.0,
      itemList: [],
      ewbNo: '',
      type: '',
      invoiceId: '',
      businessId: '',
      businessCity: ''
    };

    // this.invoiceDetails = {};
    this.invoiceId = '';
    this.eWayBillNo = '';
    this.type = '';
    this.openEWayPrintSelectionAlert = false;
  };

  // Generate e-Way fields
  openGenErrorAlertMessage = false;
  genErrorMessage = '';
  openLoadingAlertMessage = false;

  // Cancel e-Way fields
  openCancelErrorAlertMessage = false;
  cancelErrorMessage = '';
  openCancelLoadingAlertMessage = false;

  // Update Part-B e-Way fields
  openUpdatePartBErrorAlertMessage = false;
  updatePartBErrorMessage = '';
  openUpdatePartBLoadingAlertMessage = false;

  // Update Transporter e-Way fields
  openUpdateTransporterErrorAlertMessage = false;
  updateTransporterErrorMessage = '';
  openUpdateTransporterLoadingAlertMessage = false;

  // Extend e-Way fields
  openExtendErrorAlertMessage = false;
  updateExtendErrorMessage = '';
  openExtendLoadingAlertMessage = false;

  //success alert fields
  openSuccessAlertMessage = false;
  successMessage = '';
  openSuccessAlertSaleMessage = false;

  isComingFromSale = false;

  handleOpenGenEWayErrorModal = () => {
    runInAction(() => {
      this.openGenErrorAlertMessage = true;
    });
  };

  handleCloseGenEWayErrorModal = () => {
    runInAction(() => {
      this.genErrorMessage = '';
      this.openGenErrorAlertMessage = false;
    });
  };

  handleOpenGenEWayLoadingModal = () => {
    runInAction(() => {
      this.openLoadingAlertMessage = true;
    });
  };

  handleCloseGenEWayLoadingModal = () => {
    runInAction(() => {
      this.openLoadingAlertMessage = false;
    });
  };

  // Generate E- Way
  handleOpenEWayGenerateModal = (type, invoiceDetails) => {
    runInAction(() => {
      this.type = type;
      this.invoiceDetails = invoiceDetails;
      if ('Invoice' === type) {
        this.invoiceId = invoiceDetails.invoice_number;
      }

      this.openEWayGenerateModal = true;
    });
  };

  handleCloseEWayGenerateModal = () => {
    runInAction(() => {
      this.openEWayGenerateModal = false;
    });
  };

  setEwayGenEwaySupplyType = (value) => {
    runInAction(() => {
      this.ewayBillData.supplyType = value;
    });
  };
  setEwayGenEwaySubSupplyType = (value) => {
    runInAction(() => {
      this.ewayBillData.subSupplyType = value;
    });
  };
  setEwayGenEwayTxnType = (value) => {
    runInAction(() => {
      this.ewayBillData.transactionType = value;
    });
  };

  setEwayDocType = (value) => {
    runInAction(() => {
      this.ewayBillData.docType = value;
    });
  };
  setEwayDocNo = (value) => {
    runInAction(() => {
      this.ewayBillData.docNo = value;
    });
  };
  setEwayDocDate = (value) => {
    runInAction(() => {
      this.ewayBillData.docDate = value;
    });
  };

  setEwayBillFromName = (value) => {
    runInAction(() => {
      this.ewayBillData.fromTrdName = value;
    });
  };
  setEwayBillFromGST = (value) => {
    runInAction(() => {
      this.ewayBillData.fromGstin = value;
    });
  };
  setEwayBillFromState = (value) => {
    runInAction(() => {
      this.ewayBillData.fromStateCode = value;
      this.ewayBillData.actFromStateCode = value;
    });
  };
  setEwayDispatchFromAddress = (value) => {
    runInAction(() => {
      this.ewayBillData.fromAddr1 = value;
    });
  };
  setEwayDispatchFromPincode = (value) => {
    runInAction(() => {
      this.ewayBillData.fromPincode = value;
    });
  };

  setEwayDispatchFromPlace = (value) => {
    runInAction(() => {
      this.ewayBillData.fromPlace = value;
    });
  };

  setEwayDispatchFromState = (value) => {
    runInAction(() => {
      this.ewayBillData.fromStateCode = value;
      this.ewayBillData.actFromStateCode = value;
    });
  };

  setEwayBillToName = (value) => {
    runInAction(() => {
      this.ewayBillData.toTrdName = value;
    });
  };
  setEwayBillToGST = (value) => {
    runInAction(() => {
      this.ewayBillData.toGstin = value;
    });
  };
  setEwayBillToState = (value) => {
    runInAction(() => {
      this.ewayBillData.toStateCode = value;
      this.ewayBillData.actToStateCode = value;
    });
  };
  setEwayShipToAddress = (value) => {
    runInAction(() => {
      this.ewayBillData.toAddr1 = value;
    });
  };
  setEwayShipToPincode = (value) => {
    runInAction(() => {
      this.ewayBillData.toPincode = value;
    });
  };

  setEwayShipToState = (value) => {
    runInAction(() => {
      this.ewayBillData.toStateCode = value;
      this.ewayBillData.actToStateCode = value;
    });
  };

  setEwayShipToPlace = (value) => {
    runInAction(() => {
      this.ewayBillData.toPlace = value;
    });
  };

  setEwayTransporterName = (value) => {
    runInAction(() => {
      this.ewayBillData.transporterName = value;
    });
  };
  setEwayTransportID = (value) => {
    runInAction(() => {
      this.ewayBillData.transporterId = value;
    });
  };
  setEwayApproxDistance = (value) => {
    runInAction(() => {
      this.ewayBillData.transDistance = parseInt(value);
    });
  };
  setEwayTransportMode = (value) => {
    runInAction(() => {
      this.ewayBillData.transMode = value;
    });
  };

  setEwayVehicleType = (value) => {
    runInAction(() => {
      this.ewayBillData.vehicleType = value;
    });
  };

  setEwayVehicleNo = (value) => {
    runInAction(() => {
      this.ewayBillData.vehicleNo = value;
    });
  };

  setEwayTransporterDocNo = (value) => {
    runInAction(() => {
      this.ewayBillData.transDocNo = value;
    });
  };
  setEwayTransporterDocDate = (value) => {
    runInAction(() => {
      this.ewayBillData.transDocDate = value;
    });
  };

  generateEWay = async (isSaveAndPrint) => {
    console.log(this.ewayBillData);

    let itemList = [];

    let supplyType = this.ewayBillData.supplyType || 'Outward';
    let subSupplyType = this.ewayBillData.subSupplyType || 'Supply';
    let vehicleType = this.ewayBillData.vehicleType || 'Regular';
    let transMode = this.ewayBillData.transMode || 'Road';
    let transactionType = this.ewayBillData.transactionType || 'Regular';

    let subSupply = await ewayHelper
      .getEWaySubSupplyTypes()
      .find((e) => e.name === subSupplyType);

    let supply = await ewayHelper
      .getEWaySupplyTypes()
      .find((e) => e.name === supplyType);

    let vehicleTypeObject = {};
    let transModeObject = {};
    if (
      this.ewayBillData.vehicleNo !== '' &&
      this.ewayBillData.vehicleNo !== null
    ) {
      vehicleTypeObject = await ewayHelper
        .getVehicleTypes()
        .find((e) => e.name === vehicleType);

      if (transMode !== 0) {
        transModeObject = await ewayHelper
          .getTransportationModes()
          .find((e) => e.name === transMode);
      } else {
        transModeObject = await ewayHelper
          .getTransportationModes()
          .find((e) => e.name === 'Road');
      }
    }

    let transactionTypeObject = await ewayHelper
      .getEWayTransactionTypes()
      .find((e) => e.name === transactionType);

    let totalTaxableAmount = 0;
    for (let item of this.invoiceDetails.item_list) {
      let product = {
        productName: item.item_name,
        productDesc: '',
        hsnCode: parseInt(item.hsn),
        quantity: parseFloat(item.qty),
        taxableAmount:
          parseFloat(item.amount) -
          (parseFloat(item.cgst_amount) || 0) -
          (parseFloat(item.sgst_amount) || 0) -
          (parseFloat(item.igst_amount) || 0) -
          (parseFloat(item.cess) || 0), // total amount - total tax
        cgstRate: parseFloat(item.cgst),
        sgstRate: parseFloat(item.sgst),
        igstRate: parseFloat(item.igst),
        cessRate: parseFloat(item.cess),
        cessNonadvol: 0.0
      };

      totalTaxableAmount =
        totalTaxableAmount + parseFloat(product.taxableAmount);
      itemList.push(product);
    }

    runInAction(() => {
      this.ewayBillData.businessCity = this.invoiceDetails.businessCity;
      this.ewayBillData.businessId = this.invoiceDetails.businessId;
      this.ewayBillData.itemList = itemList;
      this.ewayBillData.invoiceId = this.invoiceDetails.invoice_number;
      this.ewayBillData.docDate = this.dateFormatter(this.ewayBillData.docDate);
      if ('Invoice' === this.type) {
        this.ewayBillData.type = 'INV';
      }

      this.ewayBillData.totInvValue = parseFloat(
        this.invoiceDetails.total_amount
      );

      this.ewayBillData.otherValue =
        (parseFloat(this.invoiceDetails.shipping_charge) || 0) +
        (parseFloat(this.invoiceDetails.packing_charge) || 0);

      this.ewayBillData.totalValue =
        parseFloat(totalTaxableAmount) -
        (parseFloat(this.invoiceDetails.discount_amount) || 0);

      if (supply) {
        this.ewayBillData.supplyType = supply.val;
      }

      if (subSupply) {
        this.ewayBillData.subSupplyType = subSupply.val;
      }

      if (transactionTypeObject) {
        this.ewayBillData.transactionType = transactionTypeObject.val;
      }

      if (
        this.ewayBillData.vehicleNo !== '' &&
        this.ewayBillData.vehicleNo !== null
      ) {
        if (vehicleTypeObject) {
          this.ewayBillData.vehicleType = vehicleTypeObject.val;
        }
        if (transModeObject) {
          this.ewayBillData.transMode = transModeObject.val;
        }
      } else {
        this.ewayBillData.vehicleNo = null;
        this.ewayBillData.vehicleType = null;
        this.ewayBillData.transMode = -1;
        this.ewayBillData.transDocNo = null;
        this.ewayBillData.transDocDate = null;
      }
    });

    const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
      '/pos/v1/business/invoice/eway/generate',
      this.ewayBillData,
      null
    );

    if (apiResponse.success) {
      if (isSaveAndPrint) {
        if (apiResponse.success === true) {
          this.invoiceDetails.ewayBillNo = apiResponse.ewayBillNo;
          this.invoiceDetails.ewayBillStatus = apiResponse.ewayBillStatus;
          this.invoiceDetails.ewayBillValidDate = apiResponse.ewayBillValidDate;
          this.invoiceDetails.ewayBillGeneratedDate =
            apiResponse.ewayBillGeneratedDate;
          this.invoiceDetails.ewayBillDetails = apiResponse.ewayBillDetails;

          //insert into eway details into sales table
          await this.updateEwayDetailsInSalesTable(
            this.invoiceDetails,
            apiResponse
          );
        }

        this.handleCloseEWayGenerateModal();
        this.handleOpenPrintSelectionAlertMessage(true);
      } else {
        if (apiResponse.success === true) {
          //insert into eway details into sales table
          await this.updateEwayDetailsInSalesTable(
            this.invoiceDetails,
            apiResponse
          );
        }
        //close pop up and reset the data
        this.resetGeneratedData();
        this.handleCloseEWayGenerateModal();
        if (this.isComingFromSale) {
          this.handleSaleSuccessAlertMessageOpen(
            'E-Way generated successfully'
          );
        } else {
          this.handleSuccessAlertMessageOpen('E-Way generated successfully');
        }
      }
    } else {
      this.handleCloseGenEWayLoadingModal();
      this.genErrorMessage = apiResponse.errorMessage;
      this.handleOpenGenEWayErrorModal();
    }
  };

  updateEwayDetailsInSalesTable = async (invoiceDetails, apiResponse) => {
    const db = await Db.get();

    await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: invoiceDetails.businessId } },
            { invoice_number: { $eq: invoiceDetails.invoice_number } }
          ]
        }
      })
      .update({
        $set: {
          ewayBillStatus: apiResponse.ewayBillStatus,
          ewayBillValidDate: apiResponse.ewayBillValidDate,
          ewayBillGeneratedDate: apiResponse.ewayBillGeneratedDate,
          ewayBillNo: apiResponse.ewayBillNo,
          ewayBillDetails: apiResponse.ewayBillDetails
        }
      })
      .then(async () => {
        console.log('update eway is completed');
      });
  };

  dateFormatter(date) {
    if (date.includes('-')) {
      var dateParts = date.split('-');
      if (dateParts.length >= 3) {
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    } else {
      return date;
    }
  }

  // Cancel E-Way
  handleOpenEWayCancelModal = (type, invoiceDetails) => {
    this.eWayBillNo = invoiceDetails.ewayBillNo;
    this.type = type;
    this.invoiceDetails = invoiceDetails;
    if ('INV' === type) {
      this.invoiceId = invoiceDetails.invoice_number;
    }
    runInAction(() => {
      this.openEWayCancelModal = true;
    });
  };

  handleCloseEWayCancelModal = () => {
    runInAction(() => {
      this.openEWayCancelModal = false;
    });
  };

  cancelEWay = async (cancelData) => {
    let servType = '';
    if ('Invoice' === this.type) {
      servType = 'INV';
    }

    //prepare API
    let cancelEway = {
      businessCity: this.invoiceDetails.businessCity,
      businessId: this.invoiceDetails.businessId,
      invoiceId: this.invoiceDetails.invoice_number,
      type: servType,
      cancelRmrk: cancelData.cancelRmrk,
      cancelRsnCode: cancelData.cancelRsnCode || 0,
      ewbNo: this.eWayBillNo
    };

    const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
      '/pos/v1/business/invoice/eway/cancel',
      cancelEway,
      null
    );

    this.handleCloseCancelEWayLoadingModal();
    if (apiResponse.success) {
      //close pop up and reset the data
      this.resetGeneratedData();
      this.handleCloseEWayCancelModal();
      this.handleSuccessAlertMessageOpen('E-Way cancelled successfully');
    } else {
      this.cancelErrorMessage = apiResponse.errorMessage;
      this.handleOpenCancelEWayErrorModal();
    }
  };

  handleOpenCancelEWayErrorModal = () => {
    runInAction(() => {
      this.openCancelErrorAlertMessage = true;
    });
  };

  handleCloseCancelEWayErrorModal = () => {
    runInAction(() => {
      this.cancelErrorMessage = '';
      this.openCancelErrorAlertMessage = false;
    });
  };

  handleOpenCancelEWayLoadingModal = () => {
    runInAction(() => {
      this.openCancelLoadingAlertMessage = true;
    });
  };

  handleCloseCancelEWayLoadingModal = () => {
    runInAction(() => {
      this.openCancelLoadingAlertMessage = false;
    });
  };

  // Extend E-Way
  handleOpenEWayExtendModal = (type, invoiceDetails) => {
    this.eWayBillNo = invoiceDetails.ewayBillNo;
    this.type = type;
    this.invoiceDetails = invoiceDetails;
    if ('INV' === type) {
      this.invoiceId = invoiceDetails.invoice_number;
    }
    runInAction(() => {
      this.openEWayExtendModal = true;
    });
  };

  handleCloseEWayExtendModal = () => {
    runInAction(() => {
      this.openEWayExtendModal = false;
    });
  };

  extendEWay = async (data) => {
    let extendEwayData = {
      businessCity: this.invoiceDetails.businessCity,
      businessId: this.invoiceDetails.businessId,
      type: this.type,
      invoiceId: this.invoiceId,
      ewbNo: this.eWayBillNo,
      vehicleNo: data.vehicleNo,
      fromPlace: data.fromPlace,
      fromState: data.fromState,
      remainingDistance: data.remainingDistance,
      transDocNo: data.transDocNo,
      transDocDate: data.transDocDate,
      transMode: data.transMode,
      extnRsnCode: data.extnRsnCode,
      extnRemarks: data.extnRemarks,
      fromPincode: data.fromPincode,
      consignmentStatus: data.consignmentStatus,
      transitType: '',
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressLine3: data.addressLine3
    };

    const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
      '/pos/v1/business/invoice/eway/extend',
      extendEwayData,
      null
    );

    this.handleCloseExtendEWayLoadingModal();
    if (apiResponse.success) {
      //close pop up and reset the data
      this.resetGeneratedData();
      this.handleCloseEWayExtendModal();
      this.handleSuccessAlertMessageOpen('E-Way extended successfully');
    } else {
      this.updateExtendErrorMessage = apiResponse.errorMessage;
      this.handleOpenExtendEWayErrorModal();
    }
  };

  handleOpenExtendEWayErrorModal = () => {
    runInAction(() => {
      this.openExtendErrorAlertMessage = true;
    });
  };

  handleCloseExtendEWayErrorModal = () => {
    runInAction(() => {
      this.updateExtendErrorMessage = '';
      this.openExtendErrorAlertMessage = false;
    });
  };

  handleOpenExtendEWayLoadingModal = () => {
    runInAction(() => {
      this.openExtendLoadingAlertMessage = true;
    });
  };

  handleCloseExtendEWayLoadingModal = () => {
    runInAction(() => {
      this.openExtendLoadingAlertMessage = false;
    });
  };

  // Update Part-B E-Way
  handleOpenEWayUpdatePartBModal = (type, invoiceDetails) => {
    this.eWayBillNo = invoiceDetails.ewayBillNo;
    this.type = type;
    this.invoiceDetails = invoiceDetails;
    if ('INV' === type) {
      this.invoiceId = invoiceDetails.invoice_number;
    }
    runInAction(() => {
      this.openEWayUpdatePartBModal = true;
    });
  };

  handleCloseEWayUpdatePartBModal = () => {
    runInAction(() => {
      this.openEWayUpdatePartBModal = false;
    });
  };

  updatePartBEWay = async (data) => {
    let servType = '';
    if ('Invoice' === this.type) {
      servType = 'INV';
    }

    let updateVehicleDetails = {
      businessCity: this.invoiceDetails.businessCity,
      businessId: this.invoiceDetails.businessId,
      type: servType,
      invoiceId: this.invoiceDetails.invoice_number,
      ewbNo: this.eWayBillNo,
      fromPlace: data.fromPlace,
      fromState: Number(data.fromState),
      reasonCode: data.reasonCode,
      reasonRem: data.reasonRem,
      transDocDate: data.transDocDate,
      transDocNo: data.transDocNo,
      transMode: data.transMode,
      vehicleNo: data.vehicleNo
    };

    const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
      '/pos/v1/business/invoice/eway/vehicle/update',
      updateVehicleDetails,
      null
    );

    this.handleCloseUpdatePartBEWayLoadingModal();
    if (apiResponse.success) {
      //close pop up and reset the data
      this.resetGeneratedData();
      this.handleCloseEWayUpdatePartBModal();
      this.handleSuccessAlertMessageOpen(
        'E-Way Part-B details updated successfully'
      );
    } else {
      this.updatePartBErrorMessage = apiResponse.errorMessage;
      this.handleOpenUpdatePartBEWayErrorModal();
    }
  };

  handleOpenUpdatePartBEWayErrorModal = () => {
    runInAction(() => {
      this.openUpdatePartBErrorAlertMessage = true;
    });
  };

  handleCloseUpdatePartBEWayErrorModal = () => {
    runInAction(() => {
      this.updatePartBErrorMessage = '';
      this.openUpdatePartBErrorAlertMessage = false;
    });
  };

  handleOpenUpdatePartBEWayLoadingModal = () => {
    runInAction(() => {
      this.openUpdatePartBLoadingAlertMessage = true;
    });
  };

  handleCloseUpdatePartBEWayLoadingModal = () => {
    runInAction(() => {
      this.openUpdatePartBLoadingAlertMessage = false;
    });
  };

  // Update Transporter E-Way
  handleOpenEWayUpdateTransporterModal = (type, invoiceDetails) => {
    this.eWayBillNo = invoiceDetails.ewayBillNo;
    this.type = type;
    this.invoiceDetails = invoiceDetails;
    if ('INV' === type) {
      this.invoiceId = invoiceDetails.invoice_number;
    }
    runInAction(() => {
      this.openEWayUpdateTransporterModal = true;
    });
  };

  handleCloseEWayUpdateransporterModal = () => {
    runInAction(() => {
      this.openEWayUpdateTransporterModal = false;
    });
  };

  updateTransporterEWay = async (transporterId) => {
    let serverType = '';
    if ('Invoice' === serverType) {
      serverType = 'INV';
    }
    //prepare object for API
    let updateTransportDetails = {
      businessCity: this.invoiceDetails.businessCity,
      businessId: this.invoiceDetails.businessId,
      type: serverType,
      invoiceId: this.invoiceDetails.invoice_number,
      ewbNo: this.eWayBillNo,
      transporterId: transporterId
    };

    const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
      '/pos/v1/business/invoice/eway/transporter',
      updateTransportDetails,
      null
    );

    this.handleCloseUpdateTransporterEWayLoadingModal();
    if (apiResponse.success) {
      //close pop up and reset the data
      this.resetGeneratedData();
      this.handleCloseEWayUpdateransporterModal();
      this.handleSuccessAlertMessageOpen(
        'E-Way transporter details updated successfully'
      );
    } else {
      this.updateTransporterErrorMessage = apiResponse.errorMessage;
      this.handleOpenUpdateTransporterEWayErrorModal();
    }
  };

  handleOpenUpdateTransporterEWayErrorModal = () => {
    runInAction(() => {
      this.openUpdateTransporterErrorAlertMessage = true;
    });
  };

  handleCloseUpdateTransporterEWayErrorModal = () => {
    runInAction(() => {
      this.updateTransporterErrorMessage = '';
      this.openUpdateTransporterErrorAlertMessage = false;
    });
  };

  handleOpenUpdateTransporterEWayLoadingModal = () => {
    runInAction(() => {
      this.openUpdateTransporterLoadingAlertMessage = true;
    });
  };

  handleCloseUpdateTransporterEWayLoadingModal = () => {
    runInAction(() => {
      this.openUpdateTransporterLoadingAlertMessage = false;
    });
  };

  setEWayBillNo = (value) => {
    this.eWayBillNo = value;
  };

  setInvoiceDetails = (value) => {
    this.invoiceDetails = value;
  };

  reset = () => {
    this.eWayBillNo = '';
    this.invoiceDetails = {};
    this.type = '';
    this.invoiceId = '';
  };

  setGenErrorMessage = (value) => {
    this.genErrorMessage = value;
  };

  handleSuccessAlertMessageClose = () => {
    runInAction(() => {
      this.successMessage = '';
      this.openSuccessAlertMessage = false;
    });
  };

  handleSuccessAlertMessageOpen = (message) => {
    runInAction(() => {
      this.successMessage = message;
      this.openSuccessAlertMessage = true;
    });
  };

  setIsComingFromSale = (val) => {
    runInAction(() => {
      this.isComingFromSale = val;
    });
  };

  handleSaleSuccessAlertMessageClose = () => {
    runInAction(() => {
      this.successMessage = '';
      this.openSuccessAlertSaleMessage = false;
      this.isComingFromSale = false;
    });
  };

  handleSaleSuccessAlertMessageOpen = (message) => {
    runInAction(() => {
      this.successMessage = message;
      this.openSuccessAlertSaleMessage = true;
    });
  };

  handleOpenPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openEWayPrintSelectionAlert = true;
    });
  };

  handleClosePrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openEWayPrintSelectionAlert = false;
    });
  };

  constructor() {
    makeObservable(this, {
      openEWayGenerateModal: observable,
      handleOpenEWayGenerateModal: action,
      handleCloseEWayGenerateModal: action,
      generateEWay: action,
      openEWayCancelModal: observable,
      handleOpenEWayCancelModal: action,
      handleCloseEWayCancelModal: action,
      cancelEWay: action,
      openEWayExtendModal: observable,
      handleOpenEWayExtendModal: action,
      handleCloseEWayExtendModal: action,
      extendEWay: action,
      openEWayUpdatePartBModal: observable,
      handleOpenEWayUpdatePartBModal: action,
      handleCloseEWayUpdatePartBModal: action,
      updatePartBEWay: action,
      openEWayUpdateTransporterModal: observable,
      handleOpenEWayUpdateTransporterModal: action,
      handleCloseEWayUpdateransporterModal: action,
      updateTransporterEWay: action,
      eWayBillNo: observable,
      setEWayBillNo: action,
      ewayBillData: observable,
      genErrorMessage: observable,
      openGenErrorAlertMessage: observable,
      setGenErrorMessage: action,
      openLoadingAlertMessage: observable,
      cancelErrorMessage: observable,
      openCancelErrorAlertMessage: observable,
      openCancelLoadingAlertMessage: observable,
      openUpdatePartBErrorAlertMessage: observable,
      updatePartBErrorMessage: observable,
      openUpdatePartBLoadingAlertMessage: observable,
      openExtendErrorAlertMessage: observable,
      updateExtendErrorMessage: observable,
      openExtendLoadingAlertMessage: observable,
      openUpdateTransporterErrorAlertMessage: observable,
      updateTransporterErrorMessage: observable,
      openUpdateTransporterLoadingAlertMessage: observable,
      successMessage: observable,
      openSuccessAlertMessage: observable,
      openSuccessAlertSaleMessage: observable,
      handleSaleSuccessAlertMessageClose: action,
      openEWayPrintSelectionAlert: observable,
      invoiceDetails: observable
    });
  }
}

export default new EWayStore();
