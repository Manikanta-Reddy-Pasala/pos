export const pdfContainerStyles = {
  page: {
    fontFamily: 'Helvetica',
    fontSize: 14,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
    lineHeight: 1.5,
    flexDirection: 'column'
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  titleContainer: {
    marginTop: 24
  },
  reportTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  companyOtherData: {
    fontSize: 10,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  customerTitle: {
    fontSize: 10,
    textAlign: 'center'
  },
  customerOtherData: {
    fontSize: 12
  },
  ledgerTitle: {
    fontSize: 14,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
   fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'white'
  },
  openingBalanceContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end'
  },
  closingBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
};

export const pdfTableHeaderStyles = {
  container: {
    flexDirection: 'row',
    borderColor: 'black none',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderLeft: 'none',
    borderRight: 'none',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    flexGrow: 1,
  },
  description: {
    width: '15%',
    borderColor: 'black none',
    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  refNo: {
    width: '15%',
    borderColor: 'black none',

    fontSize:9,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  particular: {
    width: '15%',
    borderColor: 'black none',

    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  amount: {
    width: '20%',
    borderColor: 'black none',
    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  }
};

export const pdfTableFooterStyles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    border:"none"
  },
  description: {
    width: '60%',
    fontWeight: '700',
    fontSize:10
  },
  amount: {
    width: '20%',
    fontStyle: 'bold',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    fontWeight: '700',
    borderColor: 'black',
    fontSize:10
  },
  amountWithoutBorder: {
    width: '20%',
    fontStyle: 'bold',
    border:0,
    fontWeight: '700',
    borderColor: 'white',
    fontSize:10
  },
  amountWithBorderTop: {
    width: '20%',
    fontStyle: 'bold',
    borderTopWidth: 1,
    fontWeight: '700',
    borderColor: 'black',
    fontSize:10
  },
  amountWithBottomBorder: {
    width: '20%',
    fontStyle: 'bold',
    border:'none',
    borderBottomWidth: 1,
    fontWeight: '700',
    borderColor: 'black none',
    fontSize: 10
  },
  totalCount:{
    fontSize:10,
    fontFamily:'Helvetica-Bold',
    width:'60%',
    fontWeight:"700"
  }
};

export const pdfTableRowStyles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    textAlign: 'center',
    fontSize: '10px',
    padding: '2px',
    flexGrow: 1
  },
  description: {
    fontSize:9,
    width: '15%'
  },
  particular: {
    fontSize:9,
    width: '20%'
  },
  refNo: {
    width: '10%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    fontSize:9
  },
  amount: {
    width: '20%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    fontSize:9
  }
};
