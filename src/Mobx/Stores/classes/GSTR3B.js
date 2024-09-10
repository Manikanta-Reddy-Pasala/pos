export default class GSTR3B {
  Section31Summary() {
      return [
        {
          name: 'Outward taxable supplies (other than zero rated, nil rated and exempted)',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Outward taxable supplies (zero rated)',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: '',
          state_ut_tax: '',
          cess: 0
        },
        {
          name: 'Other outward supplies (nil rated, exempted',
          total_taxable_value: 0,
          integrated_tax: '',
          central_tax: '',
          state_ut_tax: '',
          cess: ''
        },
        {
          name: 'Inward supplies (liable to reverse charge)',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Non-GST outward supplies',
          total_taxable_value: 0,
          integrated_tax: '',
          central_tax: '',
          state_ut_tax: '',
          cess: ''
        }
      ];
    }
    Section311Summary() {
      return [
        {
          name: 'Taxable supplies on which electronic commerce operator pays tax u/s 9(5) [to be furnished by electronic commerce operator]',
          total_taxable_value: 0,
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Taxable supplies made by registered person through electronic commerce operator, on which electronic commerce operator is required to pay tax u/s 9(5) [to be furnished by registered person making supplies through electronic commerce operator]',
          total_taxable_value: 0,
          integrated_tax: '',
          central_tax: '',
          state_ut_tax: '',
          cess: ''
        }
      ];
    }
    Section32Summary() {
      return [
        {
          name: 'Supplies made to Unregistered Persons',
          items:[]
        },
        {
          name: 'Supplies made to Composition Taxable Persons',
          items:[]
        },
        {
          name: 'Supplies made to UIN holders',
          items:[]
        }
      ];
    }
    Section4ASummary() {
      return [
        {
          name: 'Import of goods',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Import of services',
          integrated_tax: ' ',
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Inward supplies liable to reverse charge (other than 1 & 2 above) ',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Inward supplies from ISD',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'All other ITC',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        }
      ];
    }
    Section4BSummary() {
      return [
        {
          name: '(1) As per rules 38,42 & 43 of CGST Rules and section 17(5)',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: '(2) Others',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        }
      ];
    }
    Section4CSummary() {
      return {
        integrated_tax: 0,
        central_tax: 0,
        state_ut_tax: 0,
        cess: 0
      };
    }
    Section4DSummary() {
      return [
        {
          name: '(1) ITC reclaimed which was reversed under Table 4(B)(2) in earlier tax period',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: '(2) Ineligible ITC under section 16(4) & ITC restricted due to PoS rules',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        }
      ];
    }
    Section5Summary() {
      return [
        {
          name: 'From a supplier under composition scheme, Exempt and Nil rated supply',
          inter_state_supplies: 0,
          intra_state_supplies: 0
        },
        {
          name: 'Non GST supply',
          inter_state_supplies: 0,
          intra_state_supplies: 0
        }
      ];
    }
    Section51Summary() {
      return [
        {
          name: 'System computed Interest',
          integrated_tax: '',
          central_tax: '',
          state_ut_tax: '',
          cess: ''
        },
        {
          name: 'Interest Paid',
          integrated_tax: 0,
          central_tax: 0,
          state_ut_tax: 0,
          cess: 0
        },
        {
          name: 'Late fee',
          integrated_tax: '',
          central_tax: 0,
          state_ut_tax: 0,
          cess: ''
        }
      ];
    }
    Purchases() {
      return {
        id: '',
        transactionId: '',
        sequenceNumber: '',
        transactionType: '',
        invoiceDate: '',
        businessId: '',
        businessCity: '',
        total: '',
        balance: '',
        updatedAt: '',
        posId: '',
        data: '',
        vendorName: '',
        vendorGstNumber: '',
        itcValue: '',
        rcmValue: ''
      };
    }
  }
  