import React, {Fragment} from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap',
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#D3D3D3',
    fontWeight:'bold'
  },
  // description: {
  //   width: '40%'
  // },
  // amount: {
  //   width: '20%'
  // }
  description: {
    width: '15%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
    // textAlign:'center'
  },
  refNo: {
      width: '10%'
  },
  refNos: {
      width: '2%'
  },
  amount: {
      width: '20%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700'
  },
  amountDup: {
      width: '30%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700'
  },
  amounteB: {
      width: '13%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700'
  },
  amount1: {
      width: '15%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700',
      marginTop:2,
      textAlign:'right',
      paddingRight:'10px',
      borderTopWidth: 1,
      borderTopColor: '#000000',
      paddingLeft:'10px',
      paddingTop:'5px',
  },
  amount1eB: {
      width: '13%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700',
      marginTop:2,
      textAlign:'right',
      borderTopWidth: 1,
      borderTopColor: '#000000',
      paddingRight:'10px',
      paddingTop:'5px',
      // paddingLeft:'10px'
  },
  borderTop:{
    borderTopWidth: 1,
    borderTopColor: '#000000',
    width: '28%',
  },
  amount2: {
      width: '15%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700',
      paddingTop:2,
      paddingBottom:2,
      textAlign:'right',
      paddingRight:'10px',
      borderTopWidth: 1,
      borderTopColor: '#000000',
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      // paddingLeft:'10px'
  },
  amount2eB: {
      width: '13%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700',
      borderTopWidth: 1,
      borderTopColor: '#000000',
      paddingTop:2,
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      paddingBottom:2,
      textAlign:'right',
      paddingRight:'10px',
      // paddingLeft:'10px'
  },
  amount3: {
      width: '15%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700',
      textAlign:'right',
      paddingRight:'10px',
      // paddingLeft:'10px'
  },
  amount3eB: {
      width: '13%',
      fontFamily: 'Helvetica-Bold',
      fontWeight: '700',
      textAlign:'right',
      paddingRight:'10px',
      // paddingLeft:'10px'
  },
});

const LedgerPDFTableFooter = ({ total,enableBalance }) => {

  const getClosingBalanceCredit = () => {
    let closingBalance = 0;
    const a = total.totalDebit;
    const b = total.totalCredit;
    if (a > b) {
      closingBalance = Math.abs(a - b);
    }
    return closingBalance;
  };
  const getClosingBalanceDebit = () => {
    let closingBalance = 0;
    const a = total.totalDebit;
    const b = total.totalCredit;
    if (b > a) {
      closingBalance = Math.abs(a - b);
    }
    return closingBalance;
  };

  function formatNumber(number) {
    return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <Fragment>
      <View style={styles.row}>
        <Text style={styles.description}></Text>
        <Text style={styles.amountDup}></Text>
        {!enableBalance &&<Text style={styles.description}></Text>}
        {enableBalance &&<Text style={styles.refNos}></Text>}
        <Text style={styles.description}></Text>
          {/* <View style={styles.borderTop}> */}
            {!enableBalance ? ( 
              <><Text style={styles.amount1}>{total.totalDebit != 0 ? formatNumber(total.totalDebit) : ' '}</Text>
                <Text style={styles.amount1}>{total.totalCredit != 0 ? formatNumber(total.totalCredit) : ' '}</Text>
              </>):(
                <><Text style={styles.amount1}>{total.totalDebit != 0 ? formatNumber(total.totalDebit): ' '}</Text>
                  <Text style={styles.amount1eB}>{total.totalCredit != 0 ? formatNumber(total.totalCredit): ' '}</Text>
              </>)}
          {/* </View> */}
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>To</Text>
        <Text style={styles.amountDup}>Closing Balance</Text>
        {!enableBalance &&<Text style={styles.description}></Text>}
        {enableBalance &&<Text style={styles.refNos}></Text>}
        <Text style={styles.description}></Text>
        {!enableBalance ? ( 
        <><Text style={styles.amount3}>{getClosingBalanceDebit() != 0 && <>{formatNumber(getClosingBalanceDebit())}</> }</Text>
          <Text style={styles.amount3}>{getClosingBalanceCredit() != 0 && <>{formatNumber(getClosingBalanceCredit())}</> }</Text>
        </>):(
          <><Text style={styles.amount3}>{getClosingBalanceDebit() != 0 && <>{formatNumber(getClosingBalanceDebit())}</> }</Text>
            <Text style={styles.amount3eB}>{getClosingBalanceCredit() != 0 && <>{formatNumber(getClosingBalanceCredit())}</> }</Text>
        </>)}
        
      </View>
      <View style={styles.row}>
        <Text style={styles.description}></Text>
        <Text style={styles.amountDup}></Text>
        {!enableBalance &&<Text style={styles.description}></Text>}
        {enableBalance &&<Text style={styles.refNos}></Text>}
        <Text style={styles.description}></Text>
        
        {!enableBalance ? ( 
        <><Text style={styles.amount2}>{formatNumber(parseInt(total.totalDebit) + parseInt(getClosingBalanceDebit()))}</Text>
          <Text style={styles.amount2}>{formatNumber(parseInt(total.totalCredit) + parseInt(getClosingBalanceCredit()))}</Text>
        </>):(
          <><Text style={styles.amount2}>{formatNumber(parseInt(total.totalDebit) + parseInt(getClosingBalanceDebit()))}</Text>
            <Text style={styles.amount2eB}>{formatNumber(parseInt(total.totalCredit) + parseInt(getClosingBalanceCredit()))}</Text>
        </>)}
      </View>
    </Fragment>
    
  );
};

export default LedgerPDFTableFooter;