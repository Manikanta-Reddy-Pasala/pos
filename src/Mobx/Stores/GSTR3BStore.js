import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import { getSelectedDateMonthAndYearMMYYYY, getCurrentFinancialYear } from 'src/components/Helpers/DateHelper';
import GSTR3B from './classes/GSTR3B';

import { observable, makeObservable, runInAction } from 'mobx';

class GSTR3BStore {
  taxdata = {};
  taxDataList = [];
  GSTRDateRange = {};
  financialYear = getCurrentFinancialYear();
  financialMonth = '01';
  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];
  //section 3.1
  salesData = [];
  salesReturnData = [];
  purchaseReturnData = [];

  //section 3.2
  selection32Summary = {
    UnregData: []
  };
  taxablePersonData = [];
  uinHoldersData = [];


  onlineGSTR3BDialogOpen = false;
  isEdit3B = false;
  edit3BSection = '';
  GSTRPeriod = '';
  GSTR3BDateRange = {};
  section31Data = [];
  section32Data = [];
  section4Data = [];
  section5Data = [];
  section51Data = [];
  section31EditedData = [];
  section311EditedData = [];
  section32EditedData = [];
  section4EditedData = [];
  section5EditedData = [];
  section51EditedData = [];

  Section31SummaryTotal = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };
  Section31SummaryTotalDefault = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };
  Section311SummaryTotal = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };
  Section311SummaryTotalDefault = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };
  Section32SummaryTotal = {
    total_taxable_value: 0,
    integrated_tax: 0
  };

  Section32SummaryTotalDefault = {
    total_taxable_value: 0,
    integrated_tax: 0
  };

  Section4SummaryTotal = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };
  Section4SummaryTotalDefault = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };

  Section5SummaryTotal = {
    inter_state_supplies: 0,
    intra_state_supplies: 0
  };
  Section5SummaryTotalDefault = {
    inter_state_supplies: 0,
    intra_state_supplies: 0
  };

  Section51SummaryTotal = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };
  Section51SummaryTotalDefault = {
    total_taxable_value: 0,
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };

  Section31Summary = new GSTR3B().Section31Summary();
  Section31EditedSummary = new GSTR3B().Section31Summary();
  Section31SummaryUpdated = [];
  Section31DummySummary = new GSTR3B().Section31Summary();

  Section311Summary = new GSTR3B().Section311Summary();
  Section311EditedSummary = new GSTR3B().Section311Summary();
  Section311SummaryUpdated = [];
  Section311DummySummary = new GSTR3B().Section311Summary();

  Section32Summary = new GSTR3B().Section32Summary();
  Section32EditedSummary = new GSTR3B().Section32Summary();
  Section32DummySummary = new GSTR3B().Section32Summary();
  Section32SummaryUpdated = [];


  section4ASummary = new GSTR3B().Section4ASummary();
  section4BSummary = new GSTR3B().Section4BSummary();
  section4CSummary = new GSTR3B().Section4CSummary();
  section4DSummary = new GSTR3B().Section4DSummary();

  section4ADummySummary = new GSTR3B().Section4ASummary();
  section4BDummySummary = new GSTR3B().Section4BSummary();
  section4CDummySummary = new GSTR3B().Section4CSummary();
  section4DDummySummary = new GSTR3B().Section4DSummary();

  section4AEditedSummary = new GSTR3B().Section4ASummary();
  section4BEditedSummary = new GSTR3B().Section4BSummary();
  section4CEditedSummary = new GSTR3B().Section4CSummary();
  section4DEditedSummary = new GSTR3B().Section4DSummary();

  section4ASummaryUpdated = [];
  section4BSummaryUpdated = [];
  section4CSummaryUpdated = [];
  section4DSummaryUpdated = [];

  Section5Summary = new GSTR3B().Section5Summary();
  Section5SummaryUpdated = [];
  Section5DummySummary = new GSTR3B().Section5Summary();
  Section5EditedSummary = new GSTR3B().Section5Summary();


  Section51Summary = new GSTR3B().Section51Summary();
  Section51SummaryUpdated = [];
  Section51DummySummary = new GSTR3B().Section51Summary();
  Section51EditedSummary = new GSTR3B().Section51Summary();




  section6ASummary = [
    {
      name: 'Integrated tax',
      total_taxable_value: 0,
      integrated_tax: 0,
      central_tax: 0,
      state_ut_tax: 0,
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: 0,
      latefee_paid_in_cash: '',
    },
    {
      name: 'Central tax',
      total_taxable_value: 0,
      integrated_tax: 0,
      central_tax: 0,
      state_ut_tax: '',
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: 0,
      latefee_paid_in_cash: 0
    },
    {
      name: 'State/UT tax',
      total_taxable_value: 0,
      integrated_tax: 0,
      central_tax: '',
      state_ut_tax: 0,
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: 0,
      latefee_paid_in_cash: 0
    },
    {
      name: 'Cess',
      total_taxable_value: 0,
      integrated_tax: '',
      central_tax: '',
      state_ut_tax: '',
      cess: 0,
      tax_paid_in_cash: 0,
      interest_paid_in_cash: 0,
      latefee_paid_in_cash: ''
    }
  ];

  section6BSummary = [
    {
      name: 'Integrated tax',
      total_taxable_value: 0,
      integrated_tax: '',
      central_tax: '',
      state_ut_tax: '',
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: '',
      latefee_paid_in_cash: '',
    },
    {
      name: 'Central tax',
      total_taxable_value: 0,
      integrated_tax: '',
      central_tax: '',
      state_ut_tax: '',
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: '',
      latefee_paid_in_cash: '',
    },
    {
      name: 'State/UT tax',
      total_taxable_value: 0,
      integrated_tax: '',
      central_tax: '',
      state_ut_tax: '',
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: '',
      latefee_paid_in_cash: '',
    },
    {
      name: 'Cess',
      total_taxable_value: 0,
      integrated_tax: '',
      central_tax: '',
      state_ut_tax: '',
      cess: '',
      tax_paid_in_cash: 0,
      interest_paid_in_cash: '',
      latefee_paid_in_cash: '',
    }
  ];


  sectionBreakupSummary = {
    period: 'December 2022',
    integrated_tax: 0,
    central_tax: 0,
    state_ut_tax: 0,
    cess: 0
  };

  finalSave3BData = {
    "gstin": "",
    "retPeriod": "",
    "gstr3bPosData": {
      "editedData": {},
      "posData": {}
    }
  };


  save3BData = {
    "sup_details": {
      "osup_det": {
        "txval": 0,
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "osup_zero": {
        "txval": 0,
        "iamt": 0,
        "csamt": 0
      },
      "osup_nil_exmp": {
        "txval": 0
      },
      "isup_rev": {
        "txval": 0,
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "osup_nongst": {
        "txval": 0
      }
    },
    "inter_sup": {
      "unreg_details": [],
      "comp_details": [],
      "uin_details": []
    },
    "eco_dtls": {
      "eco_sup": {
        "txval": 0,
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "eco_reg_sup": {
        "txval": 0
      }
    },
    "itc_elg": {
      "itc_avl": [
        {
          "ty": "IMPG",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "IMPS",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "ISRC",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "ISD",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "OTH",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
      ],
      "itc_rev": [
        {
          "ty": "RUL",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "OTH",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
      ],
      "itc_net": {
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "itc_inelg": [
        {
          "ty": "RUL",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "OTH",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
      ]
    },
    "inward_sup": {
      "isup_details": [
        {
          "ty": "GST",
          "inter": 0,
          "intra": 0
        },
        {
          "ty": "NONGST",
          "inter": 0,
          "intra": 0
        }
      ]
    },
    "intr_ltfee": {
      "intr_details": {
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      }
    }
  };

  save3BPOSData = {
    "sup_details": {
      "osup_det": {
        "txval": 0,
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "osup_zero": {
        "txval": 0,
        "iamt": 0,
        "csamt": 0
      },
      "osup_nil_exmp": {
        "txval": 0
      },
      "isup_rev": {
        "txval": 0,
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "osup_nongst": {
        "txval": 0
      }
    },
    "inter_sup": {
      "unreg_details": [],
      "comp_details": [],
      "uin_details": []
    },
    "eco_dtls": {
      "eco_sup": {
        "txval": 0,
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "eco_reg_sup": {
        "txval": 0
      }
    },
    "itc_elg": {
      "itc_avl": [
        {
          "ty": "IMPG",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "IMPS",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "ISRC",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "ISD",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "OTH",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
      ],
      "itc_rev": [
        {
          "ty": "RUL",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "OTH",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
      ],
      "itc_net": {
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      },
      "itc_inelg": [
        {
          "ty": "RUL",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        },
        {
          "ty": "OTH",
          "iamt": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
      ]
    },
    "inward_sup": {
      "isup_details": [
        {
          "ty": "GST",
          "inter": 0,
          "intra": 0
        },
        {
          "ty": "NONGST",
          "inter": 0,
          "intra": 0
        }
      ]
    },
    "intr_ltfee": {
      "intr_details": {
        "iamt": 0,
        "camt": 0,
        "samt": 0,
        "csamt": 0
      }
    }
  };


  activeTab = "Summary";


  retSumData = {
  };

  summary31KeyValue = ['osup_det', "osup_zero", "osup_nil_exmp", "isup_rev", "osup_nongst"];
  summary311KeyValue = ['eco_sup', "eco_reg_sup"];
  summary32KeyValue = ['unreg_details', "comp_details", "uin_details"];
  summary4AKeyValue = ['IMPG', "IMPS", "ISRC", "ISD", "OTH"];
  summary4BKeyValue = ['RUL', "OTH"];
  summary4DKeyValue = ['RUL', "OTH"];
  summary51KeyValue = ['', 'intr_details', "ltfee_details"];
  isFiled = false;
  purchases = {};
  itcTotal = {};
  rcmTotal = {};
  purchaseData = [];
  expenseData = [];
  openPurchasesExpenses2B=false;



  setDateRageOfGSTR3B = async (fromDate, toDate) => {
    this.GSTRDateRange.fromDate = fromDate;
    this.GSTRDateRange.toDate = toDate;
  };
  setOpenPurchasesExpenses2B = async (value) => {
    runInAction(() => {
      this.openPurchasesExpenses2B= value;
    });
  };
  setPurchaseData = async (data) => {
    this.purchaseData = data;
  };
  setExpenseData = async (data) => {
    this.expenseData = data;
  };
  setDateRageOfGSTR2BFromDate = async (fromDate) => {
    runInAction(() => {
      this.GSTR3BDateRange.fromDate = fromDate;
    });
  };
  setActiveTab = async (tab) => {
    runInAction(() => {
      this.activeTab = tab;
    });
  };
  setRetSumData = async (value) => {
    runInAction(() => {
      this.retSumData = value;
    });
  };

  setDateRageOfGSTR2BToDate = async (toDate) => {
    runInAction(() => {
      this.GSTR3BDateRange.toDate = toDate;
    });
  };
  getGSTR3BData = async (data, editedData) => {

    this.section31Data = data.r3bautopop?.liabitc?.sup_details;
    this.section32Data = data.r3bautopop?.liabitc?.inter_sup;
    this.section4Data = data.r3bautopop?.liabitc?.elgitc;
    this.section5Data = data.inward_sup;
    this.section51Data = data.intr_ltfee;

    if (editedData != '') {
      this.section31EditedData = editedData.sup_details;
      this.section311EditedData = editedData.eco_dtls;
      this.section32EditedData = editedData.inter_sup;
      this.section4EditedData = editedData.itc_elg;
      this.section5EditedData = editedData.inward_sup;
      this.section51EditedData = editedData.intr_ltfee;
    }



    this.Section31Summary[0].total_taxable_value = this.section31Data.osup_3_1a?.subtotal?.txval || '0';
    this.Section31Summary[0].integrated_tax = this.section31Data.osup_3_1a?.subtotal?.iamt || '0';
    this.Section31Summary[0].central_tax = this.section31Data.osup_3_1a?.subtotal?.camt || '0';
    this.Section31Summary[0].state_ut_tax = this.section31Data.osup_3_1a?.subtotal?.samt || '0';
    this.Section31Summary[0].cess = this.section31Data.osup_3_1a?.subtotal?.csamt || '0';

    this.Section31Summary[1].total_taxable_value = this.section31Data.osup_3_1b?.subtotal?.txval || '0';
    this.Section31Summary[1].integrated_tax = this.section31Data.osup_3_1b?.subtotal?.iamt || '0';
    this.Section31Summary[1].cess = this.section31Data.osup_3_1b?.subtotal?.csamt || '0';

    this.Section31Summary[2].total_taxable_value = this.section31Data.osup_3_1c?.subtotal?.txval || '0';

    this.Section31Summary[3].total_taxable_value = this.section31Data.isup_3_1d?.subtotal?.txval || '0';
    this.Section31Summary[3].integrated_tax = this.section31Data.isup_3_1d?.subtotal?.iamt || '0';
    this.Section31Summary[3].central_tax = this.section31Data.isup_3_1d?.subtotal?.camt || '0';
    this.Section31Summary[3].state_ut_tax = this.section31Data.isup_3_1d?.subtotal?.samt || '0';
    this.Section31Summary[3].cess = this.section31Data.isup_3_1d?.subtotal?.csamt || '0';

    this.Section31Summary[4].total_taxable_value = this.section31Data.osup_3_1e?.subtotal?.txval || '0';

    if (editedData != '') {
      this.Section31EditedSummary[0].total_taxable_value = this.section31EditedData.osup_det?.txval || '0';
      this.Section31EditedSummary[0].integrated_tax = this.section31EditedData.osup_det?.iamt || '0';
      this.Section31EditedSummary[0].central_tax = this.section31EditedData.osup_det?.camt || '0';
      this.Section31EditedSummary[0].state_ut_tax = this.section31EditedData.osup_det?.samt || '0';
      this.Section31EditedSummary[0].cess = this.section31EditedData.osup_det?.csamt || '0';

      this.Section31EditedSummary[1].total_taxable_value = this.section31EditedData.osup_zero?.txval || '0';
      this.Section31EditedSummary[1].integrated_tax = this.section31EditedData.osup_zero?.iamt || '0';
      this.Section31EditedSummary[1].cess = this.section31EditedData.osup_zero?.csamt || '0';

      this.Section31EditedSummary[2].total_taxable_value = this.section31EditedData.osup_nil_exmp?.txval || '0';

      this.Section31EditedSummary[3].total_taxable_value = this.section31EditedData.isup_rev?.txval || '0';
      this.Section31EditedSummary[3].integrated_tax = this.section31EditedData.isup_rev?.iamt || '0';
      this.Section31EditedSummary[3].central_tax = this.section31EditedData.isup_rev?.camt || '0';
      this.Section31EditedSummary[3].state_ut_tax = this.section31EditedData.isup_rev?.samt || '0';
      this.Section31EditedSummary[3].cess = this.section31EditedData.isup_rev?.csamt || '0';

      this.Section31EditedSummary[4].total_taxable_value = this.section31EditedData.osup_nongst?.txval || '0';
      this.Section31SummaryUpdated = this.Section31EditedSummary;

    } else {
      this.Section31SummaryUpdated = this.Section31Summary;
    }
    this.calculateTotal(this.Section31Summary, '3.1');
    this.requestFormat(this.Section31Summary, '3.1');
    this.requestPOSFormat(this.Section31Summary, '3.1');

    //section 3.1.1 data

    this.Section311Summary[0].total_taxable_value = this.section31Data.esup_3_1_1a?.subtotal?.txval || '0';
    this.Section311Summary[0].integrated_tax = this.section31Data.esup_3_1_1a?.subtotal?.iamt || '0';
    this.Section311Summary[0].central_tax = this.section31Data.esup_3_1_1a?.subtotal?.camt || '0';
    this.Section311Summary[0].state_ut_tax = this.section31Data.esup_3_1_1a?.subtotal?.samt || '0';
    this.Section311Summary[0].cess = this.section31Data.esup_3_1_1a?.subtotal?.csamt || '0';

    this.Section311Summary[1].total_taxable_value = this.section31Data.esup_3_1_1b?.subtotal?.txval || '0';

    if (editedData != '') {
      this.Section311EditedSummary[0].total_taxable_value = this.section311EditedData.eco_sup?.txval || '0';
      this.Section311EditedSummary[0].integrated_tax = this.section311EditedData.eco_sup?.iamt || '0';
      this.Section311EditedSummary[0].central_tax = this.section311EditedData.eco_sup?.camt || '0';
      this.Section311EditedSummary[0].state_ut_tax = this.section311EditedData.eco_sup?.samt || '0';
      this.Section311EditedSummary[0].cess = this.section311EditedData.eco_sup?.csamt || '0';

      this.Section311EditedSummary[1].total_taxable_value = this.section311EditedData.eco_reg_sup?.txval || '0';
      this.Section311SummaryUpdated = this.Section311EditedSummary;
    } else {
      this.Section311SummaryUpdated = this.Section311Summary;
    }



    this.calculateTotal(this.Section311Summary, '3.1.1');
    this.requestFormat(this.Section311Summary, '3.1.1');
    this.requestPOSFormat(this.Section311Summary, '3.1.1');



    //section 3.2 data

    let a = {};
    this.section32Data.osup_unreg_3_2.subtotal.forEach((item, index) => {
      a.pos = item.pos;
      a.total_taxable_value = item.txval;
      a.integrated_tax = item.iamt;
      this.Section32Summary[0].items.push(a);
    });


    let b = {};
    this.section32Data.osup_comp_3_2.subtotal.forEach((item, index) => {
      b.pos = item.pos;
      b.total_taxable_value = item.txval;
      b.integrated_tax = item.iamt;
      this.Section32Summary[1].items.push(b);
    });

    let c = {};
    this.section32Data.osup_uin_3_2.subtotal.forEach((item, index) => {
      c.pos = item.pos;
      c.total_taxable_value = item.txval;
      c.integrated_tax = item.iamt;
      this.Section32Summary[2].items.push(c);
    });

    this.Section32SummaryUpdated = this.Section32Summary;

    this.calculateTotal(this.Section32Summary, '3.2');
    this.requestFormat(this.Section32Summary, '3.2');
    this.requestPOSFormat(this.Section32Summary, '3.2');

    //section 4A data
    this.section4ASummary[0].integrated_tax = this.section4Data?.itc4a1?.subtotal?.iamt;
    this.section4ASummary[0].central_tax = 0;
    this.section4ASummary[0].state_ut_tax = 0;
    this.section4ASummary[0].cess = this.section4Data?.itc4a1?.subtotal?.csamt;

    this.section4ASummary[1].integrated_tax = 0;
    this.section4ASummary[1].central_tax = 0;
    this.section4ASummary[1].state_ut_tax = 0;
    this.section4ASummary[1].cess = 0;

    this.section4ASummary[2].integrated_tax = this.section4Data?.itc4a3?.subtotal?.iamt;
    this.section4ASummary[2].central_tax = this.section4Data?.itc4a3?.subtotal?.samt;
    this.section4ASummary[2].state_ut_tax = this.section4Data?.itc4a3?.subtotal?.camt;
    this.section4ASummary[2].cess = this.section4Data?.itc4a3?.subtotal?.csamt;

    this.section4ASummary[3].integrated_tax = this.section4Data?.itc4a4?.subtotal?.iamt;
    this.section4ASummary[3].central_tax = this.section4Data?.itc4a4?.subtotal?.samt;
    this.section4ASummary[3].state_ut_tax = this.section4Data?.itc4a4?.subtotal?.camt;
    this.section4ASummary[3].cess = this.section4Data?.itc4a4?.subtotal?.csamt;

    this.section4ASummary[4].integrated_tax = this.section4Data?.itc4a5?.subtotal?.iamt;
    this.section4ASummary[4].central_tax = this.section4Data?.itc4a5?.subtotal?.samt;
    this.section4ASummary[4].state_ut_tax = this.section4Data?.itc4a5?.subtotal?.camt;
    this.section4ASummary[4].cess = this.section4Data?.itc4a5?.subtotal?.csamt;


    if (editedData != '') {
      this.section4AEditedSummary[0].integrated_tax = this.section4EditedData.itc_avl[0]?.iamt || '0';
      this.section4AEditedSummary[0].central_tax = this.section4EditedData.itc_avl[0]?.camt || '0';
      this.section4AEditedSummary[0].state_ut_tax = this.section4EditedData.itc_avl[0]?.samt || '0';
      this.section4AEditedSummary[0].cess = this.section4EditedData.itc_avl[0]?.csamt || '0';

      this.section4AEditedSummary[1].integrated_tax = this.section4EditedData.itc_avl[1]?.iamt || '0';
      this.section4AEditedSummary[1].central_tax = this.section4EditedData.itc_avl[1]?.camt || '0';
      this.section4AEditedSummary[1].state_ut_tax = this.section4EditedData.itc_avl[1]?.samt || '0';
      this.section4AEditedSummary[1].cess = this.section4EditedData.itc_avl[1]?.csamt || '0';

      this.section4AEditedSummary[2].integrated_tax = this.section4EditedData.itc_avl[2]?.iamt || '0';
      this.section4AEditedSummary[2].central_tax = this.section4EditedData.itc_avl[2]?.camt || '0';
      this.section4AEditedSummary[2].state_ut_tax = this.section4EditedData.itc_avl[2]?.samt || '0';
      this.section4AEditedSummary[2].cess = this.section4EditedData.itc_avl[2]?.csamt || '0';

      this.section4AEditedSummary[3].integrated_tax = this.section4EditedData.itc_avl[3]?.iamt || '0';
      this.section4AEditedSummary[3].central_tax = this.section4EditedData.itc_avl[3]?.camt || '0';
      this.section4AEditedSummary[3].state_ut_tax = this.section4EditedData.itc_avl[3]?.samt || '0';
      this.section4AEditedSummary[3].cess = this.section4EditedData.itc_avl[3]?.csamt || '0';

      this.section4AEditedSummary[4].integrated_tax = this.section4EditedData.itc_avl[4]?.iamt || '0';
      this.section4AEditedSummary[4].central_tax = this.section4EditedData.itc_avl[4]?.camt || '0';
      this.section4AEditedSummary[4].state_ut_tax = this.section4EditedData.itc_avl[4]?.samt || '0';
      this.section4AEditedSummary[4].cess = this.section4EditedData.itc_avl[4]?.csamt || '0';
      this.section4ASummaryUpdated = this.section4AEditedSummary;
    } else {
      this.section4ASummaryUpdated = this.section4ASummary;
    }





    //section 4B data
    this.section4BSummary[0].integrated_tax = 0;
    this.section4BSummary[0].central_tax = 0;
    this.section4BSummary[0].state_ut_tax = 0;
    this.section4BSummary[0].cess = 0;

    this.section4BSummary[1].integrated_tax = 0;
    this.section4BSummary[1].central_tax = 0;
    this.section4BSummary[1].state_ut_tax = 0;
    this.section4BSummary[1].cess = 0;

    if (editedData != '') {
      this.section4BEditedSummary[0].integrated_tax = this.section4EditedData.itc_rev[0]?.iamt || '0';
      this.section4BEditedSummary[0].central_tax = this.section4EditedData.itc_rev[0]?.camt || '0';
      this.section4BEditedSummary[0].state_ut_tax = this.section4EditedData.itc_rev[0]?.samt || '0';
      this.section4BEditedSummary[0].cess = this.section4EditedData.itc_rev[0]?.csamt || '0';

      this.section4BEditedSummary[1].integrated_tax = this.section4EditedData.itc_rev[1]?.iamt || '0';
      this.section4BEditedSummary[1].central_tax = this.section4EditedData.itc_rev[1]?.camt || '0';
      this.section4BEditedSummary[1].state_ut_tax = this.section4EditedData.itc_rev[1]?.samt || '0';
      this.section4BEditedSummary[1].cess = this.section4EditedData.itc_rev[1]?.csamt || '0';

      this.section4BSummaryUpdated = this.section4BEditedSummary;
    } else {
      this.section4BSummaryUpdated = this.section4BSummary;
    }




    //section 4C data
    this.section4CSummary.integrated_tax = 0;
    this.section4CSummary.central_tax = 0;
    this.section4CSummary.state_ut_tax = 0;
    this.section4CSummary.cess = 0;

    if (editedData != '') {
      this.section4CEditedSummary.integrated_tax = this.section4EditedData.itc_net?.iamt || '0';
      this.section4CEditedSummary.central_tax = this.section4EditedData.itc_net?.camt || '0';
      this.section4CEditedSummary.state_ut_tax = this.section4EditedData.itc_net?.samt || '0';
      this.section4CEditedSummary.cess = this.section4EditedData.itc_net?.csamt || '0';

      this.section4CSummaryUpdated = this.section4CEditedSummary;
    } else {
      this.section4CSummaryUpdated = this.section4CSummary;
    }



    //section 4D data
    this.section4DSummary[0].integrated_tax = 0;
    this.section4DSummary[0].central_tax = 0;
    this.section4DSummary[0].state_ut_tax = 0;
    this.section4DSummary[0].cess = 0;

    this.section4DSummary[1].integrated_tax = 0;
    this.section4DSummary[1].central_tax = 0;
    this.section4DSummary[1].state_ut_tax = 0;
    this.section4DSummary[1].cess = 0;

    if (editedData != '') {
      this.section4DEditedSummary[0].integrated_tax = this.section4EditedData.itc_inelg[0]?.iamt || '0';
      this.section4DEditedSummary[0].central_tax = this.section4EditedData.itc_inelg[0]?.camt || '0';
      this.section4DEditedSummary[0].state_ut_tax = this.section4EditedData.itc_inelg[0]?.samt || '0';
      this.section4DEditedSummary[0].cess = this.section4EditedData.itc_inelg[0]?.csamt || '0';

      this.section4DEditedSummary[1].integrated_tax = this.section4EditedData.itc_inelg[1]?.iamt || '0';
      this.section4DEditedSummary[1].central_tax = this.section4EditedData.itc_inelg[1]?.camt || '0';
      this.section4DEditedSummary[1].state_ut_tax = this.section4EditedData.itc_inelg[1]?.samt || '0';
      this.section4DEditedSummary[1].cess = this.section4EditedData.itc_inelg[1]?.csamt || '0';

      this.section4DSummaryUpdated = this.section4DEditedSummary;
    } else {
      this.section4DSummaryUpdated = this.section4DSummary;
    }



    const section4data = {
      a: this.section4ASummary,
      b: this.section4BSummary,
      c: this.section4CSummary,
      d: this.section4DSummary
    };
    this.calculateTotal(section4data, '4');
    this.requestFormat(section4data, '4');
    this.requestPOSFormat(section4data, '4');



    // //section 5 data
    this.Section5Summary[0].inter_state_supplies = 0;
    this.Section5Summary[0].intra_state_supplies = 0;

    this.Section5Summary[1].inter_state_supplies = 0;
    this.Section5Summary[1].intra_state_supplies = 0;

    if (editedData != '') {
      this.Section5EditedSummary[0].inter_state_supplies = this.section5EditedData.isup_details[0]?.inter || '0';
      this.Section5EditedSummary[0].intra_state_supplies = this.section5EditedData.isup_details[0]?.intra || '0';

      this.Section5EditedSummary[1].inter_state_supplies = this.section5EditedData.isup_details[1]?.inter || '0';
      this.Section5EditedSummary[1].intra_state_supplies = this.section5EditedData.isup_details[1]?.intra || '0';

      this.Section5SummaryUpdated = this.Section5EditedSummary;
    } else {
      this.Section5SummaryUpdated = this.Section5Summary;
    }




    this.calculateTotal(this.Section5Summary, '5');
    this.requestFormat(this.Section5Summary, '5');
    this.requestPOSFormat(this.Section5Summary, '5');

    //section 5.1 data
    this.Section51Summary[1].integrated_tax = 0;
    this.Section51Summary[1].central_tax = 0;
    this.Section51Summary[1].state_ut_tax = 0;
    this.Section51Summary[1].cess = 0;

    this.Section51Summary[2].central_tax = 0;
    this.Section51Summary[2].state_ut_tax = 0;

    if (editedData != '') {
      this.Section5EditedSummary[0].integrated_tax = this.section51EditedData.intr_details[0]?.inter || '0';
      this.Section5EditedSummary[0].central_tax = this.section51EditedData.intr_details[0]?.intra || '0';
      this.Section5EditedSummary[0].state_ut_tax = this.section51EditedData.intr_details[0]?.intra || '0';
      this.Section5EditedSummary[0].cess = this.section51EditedData.intr_details[0]?.intra || '0';

      this.Section5EditedSummary[1].inter_state_supplies = this.section5EditedData.isup_details[1]?.inter || '0';
      this.Section5EditedSummary[1].intra_state_supplies = this.section5EditedData.isup_details[1]?.intra || '0';

      this.Section51SummaryUpdated = this.Section51Summary;
    } else {
      this.Section51SummaryUpdated = this.Section51Summary;
    }


    this.calculateTotal(this.Section51Summary, '5.1');
    this.requestFormat(this.Section51Summary, '5.1');
    this.requestPOSFormat(this.Section51Summary, '5.1');



    await Promise.all([
      // this.getSection3_1Data(),
      // this.getSaleDataByProduct(),
      // this.getSaleDataByZeroRatedProduct(),
      // this.getSaleDataByNillRatedProduct(),
      // this.getPurchasesDataByReverseChargeProduct(),
      // this.getSaleDataByNongstProduct(),

      // this.getSection3_2Data(),
      // this.getSection4Data(),
      // this.getSection4AData(),
      // this.getGSTR3B5ASaleDataByProduct()
    ]).then(async (results) => {
      // nothing to do here
    });
  };

  calculateTotal = (data, section) => {
    if (section == '3.1') {
      this.Section31SummaryTotal = this.Section31SummaryTotalDefault;
      data.forEach(obj => {
        for (let key in this.Section31SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section31SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });

      for (let key in this.Section31SummaryTotal) {
        this.Section31SummaryTotal[key] = this.Section31SummaryTotal[key].toFixed(2);
      }
    } else if (section == '3.1.1') {
      this.Section311SummaryTotal = this.Section311SummaryTotalDefault;
      data.forEach(obj => {
        for (let key in this.Section311SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section311SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });

      for (let key in this.Section311SummaryTotal) {
        this.Section311SummaryTotal[key] = this.Section311SummaryTotal[key].toFixed(2);
      }
    } else if (section == '3.2') {
      this.Section32SummaryTotal = this.Section32SummaryTotalDefault;
      data.forEach(obj => {
        obj.items.forEach(item => {
          this.Section32SummaryTotal.total_taxable_value += parseFloat(item.total_taxable_value);
          this.Section32SummaryTotal.integrated_tax += parseFloat(item.integrated_tax);
        });
      });

      for (let key in this.Section32SummaryTotal) {
        this.Section32SummaryTotal[key] = this.Section32SummaryTotal[key].toFixed(2);
      }

    } else if (section == '4') {
      this.Section4SummaryTotal = this.Section4SummaryTotalDefault;
      const a = data.a;
      const b = data.b;
      const c = data.c;
      const d = data.d;
      a.forEach(obj => {
        for (let key in this.Section4SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section4SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });
      b.forEach(obj => {
        for (let key in this.Section4SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section4SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });

      for (let key in this.Section4SummaryTotal) {
        if (!isNaN(parseFloat(c[key]))) {
          this.Section4SummaryTotal[key] += parseFloat(c[key]);
        }
      }

      d.forEach(obj => {
        for (let key in this.Section4SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section4SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });

      for (let key in this.Section4SummaryTotal) {
        this.Section4SummaryTotal[key] = this.Section4SummaryTotal[key].toFixed(2);
      }
    } else if (section == '5') {

      this.Section5SummaryTotal = this.Section5SummaryTotalDefault;
      data.forEach(obj => {
        for (let key in this.Section5SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section5SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });


      for (let key in this.Section5SummaryTotal) {
        this.Section5SummaryTotal[key] = this.Section5SummaryTotal[key].toFixed(2);
      }
    } else if (section == '5.1') {
      this.Section51SummaryTotal = this.Section51SummaryTotalDefault;
      data.forEach(obj => {
        for (let key in this.Section51SummaryTotal) {
          if (!isNaN(parseFloat(obj[key]))) {
            this.Section51SummaryTotal[key] += parseFloat(obj[key]);
          }
        }
      });
      console.log("section5", this.Section51SummaryTotal);
      for (let key in this.Section51SummaryTotal) {
        this.Section51SummaryTotal[key] = this.Section51SummaryTotal[key].toFixed(2);
      }
    }
  }

  requestFormat = (data, section) => {
    if (section == '3.1') {
      this.save3BData.sup_details.osup_det.txval = parseInt(data[0].total_taxable_value);
      this.save3BData.sup_details.osup_det.iamt = parseInt(data[0].integrated_tax);
      this.save3BData.sup_details.osup_det.camt = parseInt(data[0].central_tax);
      this.save3BData.sup_details.osup_det.samt = parseInt(data[0].state_ut_tax);
      this.save3BData.sup_details.osup_det.csamt = parseInt(data[0].cess);

      this.save3BData.sup_details.osup_zero.txval = parseInt(data[1].total_taxable_value);
      this.save3BData.sup_details.osup_zero.iamt = parseInt(data[1].integrated_tax);
      this.save3BData.sup_details.osup_zero.csamt = parseInt(data[1].cess);

      this.save3BData.sup_details.osup_nil_exmp.txval = parseInt(data[2].total_taxable_value);

      this.save3BData.sup_details.isup_rev.txval = parseInt(data[3].total_taxable_value);
      this.save3BData.sup_details.isup_rev.iamt = parseInt(data[3].integrated_tax);
      this.save3BData.sup_details.isup_rev.camt = parseInt(data[3].central_tax);
      this.save3BData.sup_details.isup_rev.samt = parseInt(data[3].state_ut_tax);
      this.save3BData.sup_details.isup_rev.csamt = parseInt(data[3].cess);

      this.save3BData.sup_details.osup_nongst.txval = parseInt(data[4].total_taxable_value);
    } else if (section == '3.1.1') {
      this.save3BData.eco_dtls.eco_sup.txval = parseInt(data[0].total_taxable_value);
      this.save3BData.eco_dtls.eco_sup.iamt = parseInt(data[0].integrated_tax);
      this.save3BData.eco_dtls.eco_sup.camt = parseInt(data[0].central_tax);
      this.save3BData.eco_dtls.eco_sup.samt = parseInt(data[0].state_ut_tax);
      this.save3BData.eco_dtls.eco_sup.csamt = parseInt(data[0].cess);

      this.save3BData.eco_dtls.eco_reg_sup.txval = parseInt(data[1].total_taxable_value);
    } else if (section == '3.2') {
      data[0].items.forEach((item, index) => {
        const unreg_details = {
          pos: item.pos,
          txval: parseInt(item.total_taxable_value),
          iamt: parseInt(item.integrated_tax)
        };
        if (unreg_details.pos != '') {
          this.save3BData.inter_sup.unreg_details.push(unreg_details);
        }
      });
      data[1].items.forEach((item, index) => {
        const comp_details = {
          pos: item.pos,
          txval: parseInt(item.total_taxable_value),
          iamt: parseInt(item.integrated_tax)
        };
        if (comp_details.pos != '') {
          this.save3BData.inter_sup.comp_details.push(comp_details);
        }
      });
      data[2].items.forEach((item, index) => {
        const uin_details = {
          pos: item.pos,
          txval: parseInt(item.total_taxable_value),
          iamt: parseInt(item.integrated_tax)
        };
        if (uin_details.pos != '') {
          this.save3BData.inter_sup.uin_details.push(uin_details);
        }
      });

    } else if (section == '4') {
      const a = data.a;
      const b = data.b;
      const c = data.c;
      const d = data.d;
      a.forEach((item, index) => {
        this.save3BData.itc_elg.itc_avl[index].iamt = parseInt(item.integrated_tax);
        this.save3BData.itc_elg.itc_avl[index].camt = parseInt(item.central_tax);
        this.save3BData.itc_elg.itc_avl[index].samt = parseInt(item.state_ut_tax);
        this.save3BData.itc_elg.itc_avl[index].csamt = parseInt(item.cess);
      });
      b.forEach((item, index) => {
        this.save3BData.itc_elg.itc_rev[index].iamt = parseInt(item.integrated_tax);
        this.save3BData.itc_elg.itc_rev[index].camt = parseInt(item.central_tax);
        this.save3BData.itc_elg.itc_rev[index].samt = parseInt(item.state_ut_tax);
        this.save3BData.itc_elg.itc_rev[index].csamt = parseInt(item.cess);
      });

      this.save3BData.itc_elg.itc_net.iamt = parseInt(c.integrated_tax);
      this.save3BData.itc_elg.itc_net.camt = parseInt(c.central_tax);
      this.save3BData.itc_elg.itc_net.samt = parseInt(c.state_ut_tax);
      this.save3BData.itc_elg.itc_net.csamt = parseInt(c.cess);

      d.forEach((item, index) => {
        this.save3BData.itc_elg.itc_inelg[index].iamt = parseInt(item.integrated_tax);
        this.save3BData.itc_elg.itc_inelg[index].camt = parseInt(item.central_tax);
        this.save3BData.itc_elg.itc_inelg[index].samt = parseInt(item.state_ut_tax);
        this.save3BData.itc_elg.itc_inelg[index].csamt = parseInt(item.cess);
      });

    } else if (section == '5') {
      data.forEach((item, index) => {
        this.save3BData.inward_sup.isup_details[index].inter = parseInt(item.inter_state_supplies);
        this.save3BData.inward_sup.isup_details[index].intra = parseInt(item.intra_state_supplies);
      });
    } else if (section == '5.1') {
      this.save3BData.intr_ltfee.intr_details.iamt = parseInt(data[1].integrated_tax);
      this.save3BData.intr_ltfee.intr_details.camt = parseInt(data[1].central_tax);
      this.save3BData.intr_ltfee.intr_details.samt = parseInt(data[1].state_ut_tax);
      this.save3BData.intr_ltfee.intr_details.csamt = parseInt(data[1].cess);
    }
    this.finalSave3BData.gstr3bPosData.editedData = this.save3BData;
    this.addRcmITCPurchases(this.purchaseData, this.expenseData);
  }

  requestPOSFormat = (data, section) => {
    if (section == '3.1') {
      this.save3BPOSData.sup_details.osup_det.txval = parseInt(data[0].total_taxable_value);
      this.save3BPOSData.sup_details.osup_det.iamt = parseInt(data[0].integrated_tax);
      this.save3BPOSData.sup_details.osup_det.camt = parseInt(data[0].central_tax);
      this.save3BPOSData.sup_details.osup_det.samt = parseInt(data[0].state_ut_tax);
      this.save3BPOSData.sup_details.osup_det.csamt = parseInt(data[0].cess);

      this.save3BPOSData.sup_details.osup_zero.txval = parseInt(data[1].total_taxable_value);
      this.save3BPOSData.sup_details.osup_zero.iamt = parseInt(data[1].integrated_tax);
      this.save3BPOSData.sup_details.osup_zero.csamt = parseInt(data[1].cess);

      this.save3BPOSData.sup_details.osup_nil_exmp.txval = parseInt(data[2].total_taxable_value);

      this.save3BPOSData.sup_details.isup_rev.txval = parseInt(data[3].total_taxable_value);
      this.save3BPOSData.sup_details.isup_rev.iamt = parseInt(data[3].integrated_tax);
      this.save3BPOSData.sup_details.isup_rev.camt = parseInt(data[3].central_tax);
      this.save3BPOSData.sup_details.isup_rev.samt = parseInt(data[3].state_ut_tax);
      this.save3BPOSData.sup_details.isup_rev.csamt = parseInt(data[3].cess);

      this.save3BPOSData.sup_details.osup_nongst.txval = parseInt(data[4].total_taxable_value);
    } else if (section == '3.1.1') {
      this.save3BPOSData.eco_dtls.eco_sup.txval = parseInt(data[0].total_taxable_value);
      this.save3BPOSData.eco_dtls.eco_sup.iamt = parseInt(data[0].integrated_tax);
      this.save3BPOSData.eco_dtls.eco_sup.camt = parseInt(data[0].central_tax);
      this.save3BPOSData.eco_dtls.eco_sup.samt = parseInt(data[0].state_ut_tax);
      this.save3BPOSData.eco_dtls.eco_sup.csamt = parseInt(data[0].cess);

      this.save3BPOSData.eco_dtls.eco_reg_sup.txval = parseInt(data[1].total_taxable_value);
    } else if (section == '3.2') {
      data[0].items.forEach((item, index) => {
        const unreg_details = {
          pos: item.pos,
          txval: parseInt(item.total_taxable_value),
          iamt: parseInt(item.integrated_tax)
        };
        if (unreg_details.pos != '') {
          this.save3BPOSData.inter_sup.unreg_details.push(unreg_details);
        }
      });
      data[1].items.forEach((item, index) => {
        const comp_details = {
          pos: item.pos,
          txval: parseInt(item.total_taxable_value),
          iamt: parseInt(item.integrated_tax)
        };
        if (comp_details.pos != '') {
          this.save3BPOSData.inter_sup.comp_details.push(comp_details);
        }
      });
      data[2].items.forEach((item, index) => {
        const uin_details = {
          pos: item.pos,
          txval: parseInt(item.total_taxable_value),
          iamt: parseInt(item.integrated_tax)
        };
        if (uin_details.pos != '') {
          this.save3BPOSData.inter_sup.uin_details.push(uin_details);
        }
      });

    } else if (section == '4') {
      const a = data.a;
      const b = data.b;
      const c = data.c;
      const d = data.d;
      a.forEach((item, index) => {
        this.save3BPOSData.itc_elg.itc_avl[index].iamt = parseInt(item.integrated_tax);
        this.save3BPOSData.itc_elg.itc_avl[index].camt = parseInt(item.central_tax);
        this.save3BPOSData.itc_elg.itc_avl[index].samt = parseInt(item.state_ut_tax);
        this.save3BPOSData.itc_elg.itc_avl[index].csamt = parseInt(item.cess);
      });
      b.forEach((item, index) => {
        this.save3BPOSData.itc_elg.itc_rev[index].iamt = parseInt(item.integrated_tax);
        this.save3BPOSData.itc_elg.itc_rev[index].camt = parseInt(item.central_tax);
        this.save3BPOSData.itc_elg.itc_rev[index].samt = parseInt(item.state_ut_tax);
        this.save3BPOSData.itc_elg.itc_rev[index].csamt = parseInt(item.cess);
      });

      this.save3BPOSData.itc_elg.itc_net.iamt = parseInt(c.integrated_tax);
      this.save3BPOSData.itc_elg.itc_net.camt = parseInt(c.central_tax);
      this.save3BPOSData.itc_elg.itc_net.samt = parseInt(c.state_ut_tax);
      this.save3BPOSData.itc_elg.itc_net.csamt = parseInt(c.cess);

      d.forEach((item, index) => {
        this.save3BPOSData.itc_elg.itc_inelg[index].iamt = parseInt(item.integrated_tax);
        this.save3BPOSData.itc_elg.itc_inelg[index].camt = parseInt(item.central_tax);
        this.save3BPOSData.itc_elg.itc_inelg[index].samt = parseInt(item.state_ut_tax);
        this.save3BPOSData.itc_elg.itc_inelg[index].csamt = parseInt(item.cess);
      });

    } else if (section == '5') {
      data.forEach((item, index) => {
        this.save3BPOSData.inward_sup.isup_details[index].inter = parseInt(item.inter_state_supplies);
        this.save3BPOSData.inward_sup.isup_details[index].intra = parseInt(item.intra_state_supplies);
      });
    } else if (section == '5.1') {
      this.save3BPOSData.intr_ltfee.intr_details.iamt = parseInt(data[1].integrated_tax);
      this.save3BPOSData.intr_ltfee.intr_details.camt = parseInt(data[1].central_tax);
      this.save3BPOSData.intr_ltfee.intr_details.samt = parseInt(data[1].state_ut_tax);
      this.save3BPOSData.intr_ltfee.intr_details.csamt = parseInt(data[1].cess);
    }
    this.finalSave3BData.gstr3bPosData.posData = this.save3BPOSData;
    console.log("this.save3BData1", this.finalSave3BData);
  }

  addRcmITCPurchases = (purchases, expenses) => {
    
    this.finalSave3BData.gstr3bPosData.editedData.rcmPurchases = [];
    this.finalSave3BData.gstr3bPosData.editedData.itcPurchases = [];
    purchases.forEach((ele, index) => {
      this.purchases = new GSTR3B().Purchases();
      runInAction(() => {
        this.purchases.id = '';
        this.purchases.transactionId = '';
        this.purchases.sequenceNumber = '';
        this.purchases.transactionType = 'Purchases';
        this.purchases.invoiceDate = ele.bill_date;
        this.purchases.businessId = ele.businessId;
        this.purchases.businessCity = ele.businessCity;
        this.purchases.total = ele.total_amount;
        this.purchases.balance = ele.balance_amount;
        this.purchases.updatedAt = ele.updatedAt;
        this.purchases.posId = ele.posId;
        this.purchases.data = '';
        this.purchases.vendorName = ele.vendor_name;
        this.purchases.vendorGstNumber = ele.vendor_gst_number;
        this.purchases.itcValue = ele.posITCAvailable;
        this.purchases.rcmValue = ele.posRCMValue;
        let igst = 0;
        let cgst = 0;
        let sgst = 0;
        let cess = 0;

        ele.item_list.forEach((item, idx) => {
          igst += parseFloat(item.igst_amount);
          cgst += parseFloat(item.cgst_amount);
          sgst += parseFloat(item.sgst_amount);
          cess += parseFloat(item.cess);
        });

        igst = parseFloat(igst.toFixed(2));
        cgst = parseFloat(cgst.toFixed(2));
        sgst = parseFloat(sgst.toFixed(2));
        cess = parseFloat(cess.toFixed(2));

        this.purchases.igst = igst;
        this.purchases.cgst = cgst;
        this.purchases.sgst = sgst;
        this.purchases.cess = cess;


      });
      if (ele.posITCAvailable) {
        this.finalSave3BData.gstr3bPosData.editedData.itcPurchases.push(this.purchases);
      } else if (ele.posRCMValue) {
        this.finalSave3BData.gstr3bPosData.editedData.rcmPurchases.push(this.purchases);
      }
    });
    expenses.forEach((ele, index) => {
      this.purchases = new GSTR3B().Purchases();
      runInAction(() => {
        this.purchases.id = '';
        this.purchases.transactionId = '';
        this.purchases.sequenceNumber = '';
        this.purchases.transactionType = 'Expenses';
        this.purchases.invoiceDate = ele.date;
        this.purchases.businessId = ele.businessId;
        this.purchases.businessCity = ele.businessCity;
        // this.purchases.total=ele.total_amount; 
        // this.purchases.balance=ele.balance_amount; 
        this.purchases.updatedAt = ele.updatedAt;
        this.purchases.posId = ele.posId;
        this.purchases.data = '';
        this.purchases.vendorName = ele.vendor_name;
        this.purchases.vendorGstNumber = ele.vendor_gst_number;
        this.purchases.itcValue = ele.posITCAvailable;
        this.purchases.rcmValue = ele.posRCMValue;
        let igst = 0;
        let cgst = 0;
        let sgst = 0;
        let cess = 0;

        ele.item_list.forEach((item, idx) => {
          igst += parseFloat(item.igst_amount);
          cgst += parseFloat(item.cgst_amount);
          sgst += parseFloat(item.sgst_amount);
          cess += parseFloat(item.cess);
        });

        igst = parseFloat(igst.toFixed(2));
        cgst = parseFloat(cgst.toFixed(2));
        sgst = parseFloat(sgst.toFixed(2));
        cess = parseFloat(cess.toFixed(2));

        this.purchases.igst = igst;
        this.purchases.cgst = cgst;
        this.purchases.sgst = sgst;
        this.purchases.cess = cess;

      });
      if (ele.posITCAvailable) {
        this.finalSave3BData.gstr3bPosData.editedData.itcPurchases.push(this.purchases);
      } else if (ele.posRCMValue) {
        this.finalSave3BData.gstr3bPosData.editedData.rcmPurchases.push(this.purchases);
      }
    });

    this.itcTotal =  this.finalSave3BData.gstr3bPosData.editedData.itcPurchases.reduce((totals, purchase) => {
      totals.igst += parseFloat(purchase.igst) || 0;
      totals.cgst += parseFloat(purchase.cgst) || 0;
      totals.sgst += parseFloat(purchase.sgst) || 0;
      totals.cess += parseFloat(purchase.cess) || 0;
      return totals;
    }, {
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0
    });
    this.rcmTotal =  this.finalSave3BData.gstr3bPosData.editedData.rcmPurchases.reduce((totals, purchase) => {
      totals.igst += parseFloat(purchase.igst) || 0;
      totals.cgst += parseFloat(purchase.cgst) || 0;
      totals.sgst += parseFloat(purchase.sgst) || 0;
      totals.cess += parseFloat(purchase.cess) || 0;
      return totals;
    }, {
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0
    });

    console.log("joe",this.itcTotal);
  }

  handleOnlineGSTR3BModalOpen = async () => {
    runInAction(() => {
      this.onlineGSTR3BDialogOpen = true;
    });
  };
  handleOnlineGSTR3BModalClose = async () => {
    runInAction(() => {
      this.onlineGSTR3BDialogOpen = false;
    });
  };
  handleEditGSTR3B = async (section) => {
    runInAction(() => {
      this.isEdit3B = true;
      this.edit3BSection = section;
    });
  };
  handleCloseEditGSTR3B = async () => {
    runInAction(() => {
      this.isEdit3B = false;
    });
  };
  saveGSTR3B31 = async (data) => {
    this.calculateTotal(data, '3.1');
    this.requestFormat(data, '3.1');
    runInAction(() => {
      this.Section31SummaryUpdated = data;
      this.isEdit3B = false;
      this.activeTab = "Summary";
    });
  };

  saveGSTR3B311 = async (data) => {
    this.calculateTotal(data, '3.1.1');
    this.requestFormat(data, '3.1.1');
    runInAction(() => {
      this.Section311SummaryUpdated = data;
      this.isEdit3B = false;
      this.activeTab = "Summary";
    });
  };

  saveGSTR3B32 = async (data) => {
    this.calculateTotal(data, '3.2');
    this.requestFormat(data, '3.2');
    runInAction(() => {
      this.Section32SummaryUpdated = data;
      this.isEdit3B = false;
      this.activeTab = "Summary";
    });
  };
  saveGSTR3B4 = async (dataA, dataB, dataC, dataD) => {
    const section4data = {
      a: dataA,
      b: dataB,
      c: dataC,
      d: dataD
    };
    this.calculateTotal(section4data, '4');
    this.requestFormat(section4data, '4');
    runInAction(() => {
      this.section4ASummaryUpdated = dataA;
      this.section4BSummaryUpdated = dataB;
      this.section4CSummaryUpdated = dataC;
      this.section4DSummaryUpdated = dataD;
      this.isEdit3B = false;
      this.activeTab = "Summary";
    });
  };
  saveGSTR3B5 = async (data) => {
    this.calculateTotal(data, '5');
    this.requestFormat(data, '5');
    runInAction(() => {
      this.Section5SummaryUpdated = data;
      this.isEdit3B = false;
      this.activeTab = "Summary";
    });
  };
  saveGSTR3B51 = async (data) => {
    this.calculateTotal(data, '5.1');
    this.requestFormat(data, '5.1');
    runInAction(() => {
      this.Section51SummaryUpdated = data;
      this.isEdit3B = false;
      this.activeTab = "Summary";
    });
  };

  setFinancialYear = async (value) => {
    runInAction(() => {
      this.financialYear = value;
    });
  };

  setFinancialMonth = async (value) => {
    runInAction(() => {
      this.financialMonth = value;
    });
  };

  getSection3_1Data = async () => {
    const db = await Db.get();

    await Promise.all([
      this.getSalesData(db),
      this.getSalesReturnData(db),
      this.getPurchaseReturnsData(db)
    ]).then(async (results) => {
      let cgst_amount = 0;
      let sgst_amount = 0;
      let igst_amount = 0;
      let cess = 0;
      let total_taxable_value = 0;

      //
      //total taxable value (Invoice + Purchase returns - Sales returns)
      //
      this.salesData.map((item) => {
        let items = item.item_list;
        items.map((product) => {
          cgst_amount =
            parseFloat(cgst_amount) + parseFloat(product.cgst_amount);
          sgst_amount =
            parseFloat(sgst_amount) + parseFloat(product.sgst_amount);
          igst_amount =
            parseFloat(igst_amount) + parseFloat(product.igst_amount);
          cess = parseFloat(cess) + parseFloat(product.cess);
        });

        total_taxable_value =
          parseFloat(total_taxable_value) + parseFloat(item.total_amount);
      });

      this.salesReturnData.map((item) => {
        let items = item.item_list;
        items.map((product) => {
          cgst_amount =
            parseFloat(cgst_amount) - parseFloat(product.cgst_amount);
          sgst_amount =
            parseFloat(sgst_amount) - parseFloat(product.sgst_amount);
          igst_amount =
            parseFloat(igst_amount) - parseFloat(product.igst_amount);
          cess = parseFloat(cess) - parseFloat(product.cess);
        });

        total_taxable_value =
          parseFloat(total_taxable_value) - parseFloat(item.total_amount);
      });

      let outward_taxable_supplies = {
        name: 'Outward taxable supplies (other than zero rated, nil rated and exempted',
        total_taxable_value: 0,
        integrated_tax: 0,
        central_tax: 0,
        state_ut_tax: 0,
        cess: 0
      };

      outward_taxable_supplies.total_taxable_value =
        parseFloat(total_taxable_value).toFixed(2);
      outward_taxable_supplies.integrated_tax =
        parseFloat(igst_amount).toFixed(2);
      outward_taxable_supplies.central_tax = parseFloat(cgst_amount).toFixed(2);
      outward_taxable_supplies.state_ut_tax =
        parseFloat(sgst_amount).toFixed(2);
      outward_taxable_supplies.cess = parseFloat(cess).toFixed(2);

      this.Section31Summary[0] = outward_taxable_supplies;
    });
  };

  getSalesData = async () => {
    let result = [];
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      const db = await Db.get();
      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: this.GSTRDateRange.fromDate
                }
              },
              {
                invoice_date: {
                  $lte: this.GSTRDateRange.toDate
                }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          result = data.map((item) => item.toJSON());
          this.salesData = result;
          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  getSalesReturnData = async (db) => {
    console.log('getSalesReturnData');
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      var query;
      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              invoice_date: {
                $lte: this.GSTRDateRange.toDate
              }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let result = data.map((item) => item.toJSON());
        this.salesReturnData = result;
        resolve(`Resolved getSalesReturnData`);
      });
    });
  };

  getPurchaseReturnsData = async (db) => {
    console.log('getPurchaseReturnsData');

    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              date: {
                $lte: this.GSTRDateRange.toDate
              }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let result = data.map((item) => item.toJSON());
        this.purchaseReturnData = result;

        resolve(`Resolved getPurchaseReturnsData`);
      });
    });
  };

  getPurchasesDataFromVendorsWithNoGST = async (db) => {
    console.log('getPurchasesDataFromVendorsWithNoGST');

    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;
    let cess = 0;
    let total_taxable_value = 0;
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      var query;
      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              bill_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            { vendor_gst_number: { $size: 0 } }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No data is available
          return;
        }
        data.map((item) => {
          // console.log('openingCashFlowCreditPurchaseData', item.toJSON());

          let items = item.item_list;
          items.map((product) => {
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(product.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(product.sgst_amount);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(product.igst_amount);
            cess = parseFloat(cess) + parseFloat(product.cess);
          });

          total_taxable_value =
            parseFloat(total_taxable_value) + parseFloat(item.total_amount);
        });

        let purchasesWithNoGst = {
          name: 'Inward supplies (liable to reverse charge)',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        };

        purchasesWithNoGst.total_taxable_value =
          parseFloat(total_taxable_value).toFixed(2);
        purchasesWithNoGst.integrated_tax = parseFloat(igst_amount).toFixed(2);
        purchasesWithNoGst.central_tax = parseFloat(cgst_amount).toFixed(2);
        purchasesWithNoGst.state_ut_tax = parseFloat(sgst_amount).toFixed(2);
        purchasesWithNoGst.cess = parseFloat(cess).toFixed(2);

        // this.Section31Summary[3] = purchasesWithNoGst;

        resolve(`Resolved getPurchasesDataFromVendorsWithNoGST`);
      });
    });
  };

  getSection3_2Data = async () => {
    let result = [];
    let selection32Summary = [];

    // return new Promise(async (resolve) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.sales
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              invoice_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              customerGstType: 'Unregistered Customer'
            },
            {
              place_of_supply: { $ne: '' }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => item.toJSON());
        console.log(result);
        // let resultMapGST = new Map();
        // let resultMap = new Map();

        // result.map((item) => {
        //   if (item.customerGSTNo) {
        //     if (item.customerGSTNo.length === 15) {
        //       if (item.place_of_supply && item.place_of_supply.length > 1) {
        //         let resultMapValue = {};
        //         if (resultMapGST.has(item.place_of_supply)) {
        //           resultMapValue = resultMapGST.get(item.place_of_supply);
        //           resultMapValue.total_taxable_value =
        //             resultMapValue.total_taxable_value + item.total_amount;
        //           resultMapValue.total_integrated_tax =
        //             resultMapValue.total_integrated_tax + item.igst_amount;
        //         } else {
        //           resultMapValue.total_taxable_value = item.total_amount;
        //           resultMapValue.total_integrated_tax = item.igst_amount;
        //         }
        //         resultMapGST.set(item.place_of_supply, resultMapValue);
        //       }
        //     }
        //   } else {
        //     if (item.place_of_supply && item.place_of_supply.length > 1) {
        //       let resultMapValue = {
        //         total_taxable_value: 0,
        //         resultMapValue: 0
        //       };
        //       if (resultMap.has(item.place_of_supply)) {
        //         resultMapValue = resultMap.get(item.place_of_supply);
        //         resultMapValue.total_taxable_value =
        //           resultMapValue.total_taxable_value + item.total_amount;
        //         resultMapValue.total_integrated_tax =
        //           resultMapValue.total_integrated_tax + item.igst_amount;
        //       } else {
        //         resultMapValue.total_taxable_value = item.total_amount;
        //         resultMapValue.total_integrated_tax = item.igst_amount;
        //       }
        //       resultMap.set(item.place_of_supply, resultMapValue);
        //     }
        //   }
        // });

        // resultMap.forEach(function (value, key) {
        //   let data = { taxableValue: 0, integratedTax: 0, state: '' };
        //   data.taxableValue = value.total_taxable_value;
        //   data.integratedTax = value.total_integrated_tax;
        //   data.state = key;
        //   nonGst.push(data);
        // });

        // resultMapGST.forEach(function (value, key) {
        //   let data = { taxableValue: 0, integratedTax: 0, state: '' };
        //   data.taxableValue = value.total_taxable_value;
        //   data.integratedTax = value.total_integrated_tax;
        //   data.state = key;

        //   gst.push(data);
        // });

        // selection32Summary.gst = gst;
        // selection32Summary.nonGst = nonGst;

        // resolve(`got data`);

        let array = [];
        result.forEach((ele, index) => {
          let total_tax = 0;
          let igst = 0;
          let taxableAmount = 0;

          ele.item_list.forEach((subEle, subIndex) => {
            if (subEle.cgst_amount > 0 || subEle.sgst_amount > 0) {
              total_tax =
                parseFloat(subEle.cgst_amount) + parseFloat(subEle.sgst_amount);
            }

            if (subEle.igst_amount > 0) {
              total_tax = parseFloat(subEle.igst_amount);
            }

            igst = Number(Number(igst) + Number(subEle.igst_amount)).toFixed(2);
          });

          taxableAmount = Number(
            Number(taxableAmount) + Number(ele.total_amount) - Number(total_tax)
          ).toFixed(2);
          let i = array.findIndex(
            (e) => e.place_of_supply === ele.place_of_supply
          );
          if (i > -1) {
            array[i].taxableAmount = Number(
              Number(array[i].taxableAmount) + Number(taxableAmount)
            ).toFixed(2);
            array[i].igst = Number(
              Number(array[i].igst) + Number(array[i].igst)
            ).toFixed(2);
          } else {
            array.push({
              taxableAmount: taxableAmount,
              igst: igst,
              place_of_supply: ele.place_of_supply
            });
          }

          if (index === result.length - 1) {
            selection32Summary = array;
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    // });
    return selection32Summary;
  };

  getSection32CompData = async () => {
    let result = [];
    let selection32UnregSummary = [];
    // return new Promise(async (resolve) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.sales
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              invoice_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              customerGstType: 'Composition Reg Customer'
            },
            {
              place_of_supply: { $ne: '' }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => item.toJSON());

        let array = [];
        result.forEach((ele, index) => {
          let total_tax = 0;
          let igst = 0;
          let taxableAmount = 0;

          ele.item_list.forEach((subEle, subIndex) => {
            if (subEle.cgst_amount > 0 || subEle.sgst_amount > 0) {
              total_tax =
                parseFloat(subEle.cgst_amount) + parseFloat(subEle.sgst_amount);
            }

            if (subEle.igst_amount > 0) {
              total_tax = parseFloat(subEle.igst_amount);
            }

            igst = Number(Number(igst) + Number(subEle.igst_amount)).toFixed(2);
          });

          taxableAmount = Number(
            Number(taxableAmount) + Number(ele.total_amount) - Number(total_tax)
          ).toFixed(2);
          let i = array.findIndex(
            (e) => e.place_of_supply === ele.place_of_supply
          );
          if (i > -1) {
            array[i].taxableAmount = Number(
              Number(array[i].taxableAmount) + Number(taxableAmount)
            ).toFixed(2);
            array[i].igst = Number(
              Number(array[i].igst) + Number(array[i].igst)
            ).toFixed(2);
          } else {
            array.push({
              taxableAmount: taxableAmount,
              igst: igst,
              place_of_supply: ele.place_of_supply
            });
          }

          if (index === result.length - 1) {
            selection32UnregSummary = array;
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    // });
    return selection32UnregSummary;
  };

  getSection4Data = async () => {
    this.getInputTaxData(
      this.GSTRDateRange.fromDate,
      this.GSTRDateRange.toDate
    );
  };

  getSaleDataByZeroRatedProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { taxType: { $eq: 'Zero-Rated' } },
            {
              $or: [
                { txnType: { $eq: 'Sales' } },
                { txnType: { $eq: 'Sales Return' } },
                { txnType: { $eq: 'KOT' } }
              ]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let salesDataByProductZeroRated = data;

        let summaryData = {
          name: 'Outward taxable supplies (zero rated)',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: '',
          state_ut_tax: '',
          cess: 0
        };

        salesDataByProductZeroRated.forEach((ele, index) => {
          if (ele.txnType === 'Sales Return') {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) -
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summaryData.cess = Number(
              Number(summaryData.cess) - Number(ele.cess)
            ).toFixed(2);
            summaryData.integrated_tax = Number(
              Number(summaryData.integrated_tax) - Number(ele.igst_amount)
            ).toFixed(2);
          } else {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) +
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summaryData.cess = Number(
              Number(summaryData.cess) + Number(ele.cess)
            ).toFixed(2);
            summaryData.integrated_tax = Number(
              Number(summaryData.integrated_tax) + Number(ele.igst_amount)
            ).toFixed(2);
          }

          if (index === salesDataByProductZeroRated.length - 1) {
            this.Section31Summary[1] = summaryData;
          }
        });
      });
  };

  getSaleDataByNillRatedProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              $or: [
                { txnType: { $eq: 'Sales' } },
                { txnType: { $eq: 'Sales Return' } },
                { txnType: { $eq: 'KOT' } }
              ]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let salesDataByProductZeroRated = data;

        let summaryData = {
          name: 'Other outward supplies (nil rated, exempted)',
          total_taxable_value: 0,
          integrated_tax: '',
          central_tax: '',
          state_ut_tax: '',
          cess: ''
        };

        salesDataByProductZeroRated.forEach((ele, index) => {
          if (ele.taxType === 'Nil-Rated' || ele.taxType === 'Exempted') {
            if (ele.txnType === 'Sales Return') {
              summaryData.total_taxable_value = Number(
                Number(summaryData.total_taxable_value) -
                (Number(ele.amount) - Number(ele.taxAmount))
              ).toFixed(2);
            } else {
              summaryData.total_taxable_value = Number(
                Number(summaryData.total_taxable_value) +
                (Number(ele.amount) - Number(ele.taxAmount))
              ).toFixed(2);
            }
          }

          if (index === salesDataByProductZeroRated.length - 1) {
            this.Section31Summary[2] = summaryData;
          }
        });
      });
  };

  getPurchasesDataByReverseChargeProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { reverseChargeEnable: true },
            {
              $or: [
                { txnType: { $eq: 'Purchases' } },
                { txnType: { $eq: 'Purchases Return' } }
              ]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let PurchasesDataByProduct = data;

        let summaryData = {
          name: 'Inward supplies (liable to reverse charge)',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        };

        PurchasesDataByProduct.forEach((ele, index) => {
          if (ele.txnType === 'Purchases Return') {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) -
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summaryData.cess = Number(
              Number(summaryData.cess) - Number(ele.cess)
            ).toFixed(2);
            summaryData.integrated_tax = Number(
              Number(summaryData.integrated_tax) - Number(ele.igst_amount)
            ).toFixed(2);
            summaryData.central_tax = Number(
              Number(summaryData.central_tax) - Number(ele.cgst_amount)
            ).toFixed(2);
            summaryData.state_ut_tax = Number(
              Number(summaryData.state_ut_tax) - Number(ele.sgst_amount)
            ).toFixed(2);
          } else {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) +
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summaryData.cess = Number(
              Number(summaryData.cess) + Number(ele.cess)
            ).toFixed(2);
            summaryData.integrated_tax = Number(
              Number(summaryData.integrated_tax) + Number(ele.igst_amount)
            ).toFixed(2);
            summaryData.central_tax = Number(
              Number(summaryData.central_tax) + Number(ele.cgst_amount)
            ).toFixed(2);
            summaryData.state_ut_tax = Number(
              Number(summaryData.state_ut_tax) + Number(ele.sgst_amount)
            ).toFixed(2);
          }

          if (index === PurchasesDataByProduct.length - 1) {
            this.Section31Summary[3] = summaryData;
          }
        });
      });
  };

  getSaleDataByNongstProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { taxType: { $eq: 'Non-GST' } },
            {
              $or: [
                { txnType: { $eq: 'Sales' } },
                { txnType: { $eq: 'Sales Return' } },
                { txnType: { $eq: 'KOT' } }
              ]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let salesDataByProduct = data;

        let summaryData = {
          name: 'Non-GST outward supplies',
          total_taxable_value: 0,
          integrated_tax: '',
          central_tax: '',
          state_ut_tax: '',
          cess: ''
        };

        let summary5Data = {
          name: 'Non GST supply',
          inter_state_supplies: 0,
          intra_state_supplies: 0
        };

        salesDataByProduct.forEach((ele, index) => {
          if (ele.txnType === 'Sales Return') {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) -
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summary5Data.inter_state_supplies = Number(
              Number(summary5Data.inter_state_supplies) -
              Number(ele.igst_amount)
            ).toFixed(2);
            summary5Data.intra_state_supplies = Number(
              Number(summary5Data.intra_state_supplies) -
              (Number(ele.sgst_amount) + Number(ele.cgst_amount))
            ).toFixed(2);
          } else {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) +
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summary5Data.inter_state_supplies = Number(
              Number(summary5Data.inter_state_supplies) +
              Number(ele.igst_amount)
            ).toFixed(2);
            summary5Data.intra_state_supplies = Number(
              Number(summary5Data.intra_state_supplies) +
              (Number(ele.sgst_amount) + Number(ele.cgst_amount))
            ).toFixed(2);
          }

          if (index === salesDataByProduct.length - 1) {
            this.Section31Summary[4] = summaryData;
            this.Section5Summary[1] = summary5Data;
          }
        });
      });
  };

  getSaleDataByProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { taxType: { $ne: 'Nil-Rated' } },
            { taxType: { $ne: 'Zero-Rated' } },
            { taxType: { $ne: 'Exempted' } },
            {
              $or: [
                { txnType: { $eq: 'Sales' } },
                { txnType: { $eq: 'Sales Return' } },
                { txnType: { $eq: 'KOT' } }
              ]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let salesDataByProduct = data;

        let summaryData = {
          name: 'Outward taxable supplies (other than zero rated, nil rated and exempted',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        };

        salesDataByProduct.forEach((ele, index) => {
          if (ele.txnType === 'Sales Return') {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) -
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summaryData.cess = Number(
              Number(summaryData.cess) - Number(ele.cess)
            ).toFixed(2);
            summaryData.integrated_tax = Number(
              Number(summaryData.integrated_tax) - Number(ele.igst_amount)
            ).toFixed(2);
            summaryData.central_tax = Number(
              Number(summaryData.central_tax) - Number(ele.cgst_amount)
            ).toFixed(2);
            summaryData.state_ut_tax = Number(
              Number(summaryData.state_ut_tax) - Number(ele.sgst_amount)
            ).toFixed(2);
          } else {
            summaryData.total_taxable_value = Number(
              Number(summaryData.total_taxable_value) +
              (Number(ele.amount) - Number(ele.taxAmount))
            ).toFixed(2);
            summaryData.cess = Number(
              Number(summaryData.cess) + Number(ele.cess)
            ).toFixed(2);
            summaryData.integrated_tax = Number(
              Number(summaryData.integrated_tax) + Number(ele.igst_amount)
            ).toFixed(2);
            summaryData.central_tax = Number(
              Number(summaryData.central_tax) + Number(ele.cgst_amount)
            ).toFixed(2);
            summaryData.state_ut_tax = Number(
              Number(summaryData.state_ut_tax) + Number(ele.sgst_amount)
            ).toFixed(2);
          }

          if (index === salesDataByProduct.length - 1) {
            this.Section31Summary[0] = summaryData;
          }
        });
      });
  };

  getGSTR3B5ASaleDataByProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customerGstType: 'Composition Reg Customer'
            },
            {
              $or: [
                { txnType: { $eq: 'Sales' } },
                { txnType: { $eq: 'Sales Return' } },
                { txnType: { $eq: 'KOT' } }
              ]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let salesDataByProductZeroRated = data;
        let summaryData = {
          name: 'From a supplier under composition scheme, Exempt and Nil rated supply',
          inter_state_supplies: 0,
          intra_state_supplies: 0
        };

        salesDataByProductZeroRated.forEach((ele, index) => {
          if (ele.taxType === 'Nil-Rated' || ele.taxType === 'Exempted') {
            if (ele.txnType === 'Sales Return') {
              summaryData.inter_state_supplies = Number(
                Number(summaryData.inter_state_supplies) -
                Number(ele.igst_amount)
              ).toFixed(2);
              summaryData.intra_state_supplies = Number(
                Number(summaryData.intra_state_supplies) -
                (Number(ele.cgst_amount) + Number(ele.sgst_amount))
              ).toFixed(2);
            } else {
              summaryData.inter_state_supplies = Number(
                Number(summaryData.inter_state_supplies) +
                Number(ele.igst_amount)
              ).toFixed(2);
              summaryData.intra_state_supplies = Number(
                Number(summaryData.intra_state_supplies) +
                (Number(ele.cgst_amount) + Number(ele.sgst_amount))
              ).toFixed(2);
            }
          }

          if (index === salesDataByProductZeroRated.length - 1) {
            this.Section5Summary[0] = summaryData;
          }
        });
      });
  };

  /**
   * input tax credit report
   */
  getInputTaxData = async (fromDate, toDate) => {
    console.log('getInputTaxData::');
    const db = await Db.get();

    this.taxdata = {};

    await Promise.all([
      this.taxInputTaxPurchaseData(db, fromDate, toDate),
      this.taxInputTaxPurchaseReturnData(db, fromDate, toDate)
    ]).then((results) => {
      // console.log(results);
      this.calculateTaxData();
    });
  };

  calculateTaxData = async () => {
    /**
     * get total payment in , payment out data,
     * then calculate total cash in hand
     */
    let totalInputCESS = 0;
    let totalInputIGST = 0;
    let totalInputSGST = 0;
    let totalInputCGST = 0;
    let totalInputTAX = 0;

    this.taxDataList = this.taxDataList ? this.taxDataList : [];
    for (const data of this.taxDataList) {
      if (
        data['transactionType'] === 'Purchases' ||
        data['transactionType'] === 'Purchases Return'
      ) {
        if (data['transactionType'] === 'Purchases') {
          for (let item of data['item_list']) {
            totalInputCESS = totalInputCESS + (item.cess || 0);
            totalInputIGST = totalInputIGST + (item.igst_amount || 0);
            totalInputSGST = totalInputSGST + (item.sgst_amount || 0);
            totalInputCGST = totalInputCGST + (item.cgst_amount || 0);
          }
        } else if (data['transactionType'] === 'Purchases Return') {
          for (let item of data['item_list']) {
            totalInputCESS = totalInputCESS - (item.cess || 0);
            totalInputIGST = totalInputIGST - (item.igst_amount || 0);
            totalInputSGST = totalInputSGST - (item.sgst_amount || 0);
            totalInputCGST = totalInputCGST - (item.cgst_amount || 0);
          }
        }
      }
    }

    totalInputTAX =
      totalInputTAX +
      totalInputCESS +
      totalInputIGST +
      totalInputSGST +
      totalInputCGST;

    let input = {};
    input.cess = input.igst = parseFloat(totalInputIGST).toFixed(2);
    input.sgst = parseFloat(totalInputSGST).toFixed(2);
    input.cgst = parseFloat(totalInputCGST).toFixed(2);
    input.total = parseFloat(totalInputTAX).toFixed(2);

    let inputTax = this.section4ASummary[4];

    inputTax.total_taxable_value = parseFloat(totalInputTAX).toFixed(2);
    inputTax.integrated_tax = parseFloat(totalInputIGST).toFixed(2);
    inputTax.central_tax = parseFloat(totalInputCGST).toFixed(2);
    inputTax.state_ut_tax = parseFloat(totalInputSGST).toFixed(2);
    inputTax.cess = parseFloat(totalInputCESS).toFixed(2);

    if (inputTax.total_taxable_value < 0) {
      inputTax.total_taxable_value = 0;
    }

    if (inputTax.integrated_tax < 0) {
      inputTax.integrated_tax = 0;
    }

    if (inputTax.central_tax < 0) {
      inputTax.central_tax = 0;
    }

    if (inputTax.state_ut_tax < 0) {
      inputTax.state_ut_tax = 0;
    }

    if (inputTax.cess < 0) {
      inputTax.cess = 0;
    }

    this.section4ASummary[4] = inputTax;
  };

  taxInputTaxPurchaseData = async (db, fromDate, toDate) => {
    // console.log('taxInputTaxPurchaseData');

    return new Promise(async (resolve) => {
      var query;
      if (fromDate && toDate) {
        const businessData = await Bd.getBusinessData();

        query = db.purchases.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          }
        });
      }

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          // console.log('purchases', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases';

          this.taxDataList = this.taxDataList ? this.taxDataList : [];
          this.taxDataList.push(finalData);
        });
        resolve(`Resolved taxInputOutputPurchaseData`);
      });
    });
  };

  taxInputTaxPurchaseReturnData = async (db, fromDate, toDate) => {
    console.log('taxInputTaxPurchaseReturnData');

    return new Promise(async (resolve) => {
      var query;
      if (fromDate && toDate) {
        const businessData = await Bd.getBusinessData();

        query = db.purchasesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          }
        });
      }

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          console.log('purchasesreturn no data');
          return;
        }
        data.map((item) => {
          // console.log('purchasesreturn', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases Return';

          this.taxDataList = this.cashFlowList ? this.cashFlowList : [];
          this.taxDataList.push(finalData);
        });
        resolve(`Resolved taxInputOutputPurchaseReturnData`);
      });
    });
  };

  getPurchaseOverseasGSTR3bData = async () => {
    const db = await Db.get();
    let result = [];
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              bill_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              vendor_gst_type: 'Oveseas Vendor'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }
          row.total_tax = parseFloat(total_tax).toFixed(2);
          row.cess = cess;
          row.igst_amount = parseFloat(igst_amount).toFixed(2);
          row.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          row.sgst_amount = parseFloat(sgst_amount).toFixed(2);

          return row;
        });

        // purchaseData = result;
        console.log(result);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return result;
  };

  getPurchaseReverseChargeData = async () => {
    const db = await Db.get();

    let result = [];
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              bill_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              reverseChargeEnable: true
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        data.map((item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let tempRow = {};
            tempRow.total_tax = parseFloat(total_tax).toFixed(2);
            tempRow.cess = cess;
            tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
            tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
            tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
            tempRow.amount = parseFloat(amount).toFixed(2);

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax
            ).toFixed(2);
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount
            ).toFixed(2);
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount
            ).toFixed(2);
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount
            ).toFixed(2);
            individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
              2
            );
            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key);
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });
        // purchaseData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return result;
  };

  getSection4AData = async () => {
    let Overseasdata = await this.getPurchaseOverseasGSTR3bData();
    let purchaseData = {
      name: 'Import of goods',
      integrated_tax: 0,
      central_tax: '',
      state_ut_tax: '',
      cess: 0
    };
    Overseasdata.forEach((ele, index) => {
      purchaseData.integrated_tax = Number(
        Number(purchaseData.integrated_tax) + Number(ele.igst_amount)
      );
      purchaseData.cess = Number(
        Number(purchaseData.cess) + Number(ele.cess)
      ).toFixed(2);

      if (index === Overseasdata.length - 1) {
        this.section4ASummary[0] = purchaseData;
      }
    });

    let ReverseData = await this.getPurchaseReverseChargeData();
    let purchaseReverseData = {
      name: 'Inward supplies liable to reverse charge( other than 1 & 2 above)',
      integrated_tax: 0,
      central_tax: 0,
      state_ut_tax: 0,
      cess: 0
    };
    ReverseData.forEach((ele, index) => {
      purchaseReverseData.integrated_tax = Number(
        Number(purchaseReverseData.integrated_tax) + Number(ele.igst_amount)
      );
      purchaseReverseData.cess = Number(
        Number(purchaseReverseData.cess) + Number(ele.cess)
      ).toFixed(2);
      purchaseReverseData.state_ut_tax = Number(
        Number(purchaseReverseData.state_ut_tax) + Number(ele.sgst_amount)
      ).toFixed(2);
      purchaseReverseData.central_tax = Number(
        Number(purchaseReverseData.central_tax) + Number(ele.cgst_amount)
      );

      if (index === ReverseData.length - 1) {
        this.section4ASummary[2] = purchaseReverseData;
      }
    });
  };

  setGSTRPeriod = async (yearData, monthData) => {
    if (monthData > '03') {
      this.GSTRPeriod = monthData + yearData;
    } else {
      this.GSTRPeriod = monthData + (parseInt(yearData) + 1);
    }
    const year = this.GSTRPeriod.substring(2, 6);
    const month = this.GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    this.GSTR3BDateRange.fromDate = `${start.getFullYear()}-${(
      start.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
    this.GSTR3BDateRange.toDate = `${end.getFullYear()}-${(end.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}`;
    console.log('this.GSTR3BDateRange', this.GSTR3BDateRange);
    console.log('this.GSTR3BDateRange', end);
  };

  setGSTINandFP = async (GSTIN, FP) => {
    runInAction(() => {
      this.finalSave3BData.gstin = GSTIN;
      this.finalSave3BData.retPeriod = FP;
      this.save3BData.gstin = GSTIN;
      this.save3BData.ret_period = FP;
    });
  };

  setFiled = (value) => {
    this.isFiled = value;
  };

  constructor() {
    makeObservable(this, {
      uinHoldersData: observable,
      Section31Summary: observable,
      Section31DummySummary: observable,
      Section311Summary: observable,
      Section311DummySummary: observable,
      Section32Summary: observable,
      Section32DummySummary: observable,
      Section5Summary: observable,
      Section51Summary: observable,
      section4ASummary: observable,
      section4DSummary: observable,
      section4BSummary: observable,
      section4CSummary: observable,
      section6BSummary: observable,
      section6ASummary: observable,
      sectionBreakupSummary: observable,
      isEdit3B: observable,
      edit3BSection: observable,
      onlineGSTR3BDialogOpen: observable,
      financialYear: observable,
      financialMonth: observable,
      GSTR3BDateRange: observable,
      Section31SummaryTotal: observable,
      Section31SummaryUpdated: observable,
      Section311SummaryUpdated: observable,
      Section311SummaryTotal: observable,
      Section32SummaryUpdated: observable,
      Section32SummaryTotal: observable,
      section4ASummaryUpdated: observable,
      section4BSummaryUpdated: observable,
      section4CSummaryUpdated: observable,
      section4DSummaryUpdated: observable,
      Section4SummaryTotal: observable,
      Section5SummaryUpdated: observable,
      Section5SummaryTotal: observable,
      Section51SummaryUpdated: observable,
      Section51SummaryTotal: observable,
      save3BData: observable,
      finalSave3BData: observable,
      activeTab: observable,
      isFiled: observable,
      retSumData: observable,
      purchaseData: observable,
      expenseData: observable,
      itcTotal: observable,
      rcmTotal: observable,
      openPurchasesExpenses2B: observable,
    });
  }
}
export default new GSTR3BStore();
