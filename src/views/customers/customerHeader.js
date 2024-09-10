import React from 'react';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';

function CustomerHeader() {
  const store = useStore();
  const { customer } = toJS(store.CustomerStore);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '33%', fontSize: '16px', fontWeight: 'bold' }}>
        NAME: {customer.name}
      </div>
      <div
        style={{
          width: '33%',
          fontSize: '16px',
          fontWeight: 'bold',
          marginLeft: '16px'
        }}
      >
        GSTIN: {customer.gstNumber ? customer.gstNumber : '-Nil-'}{' '}
      </div>
      <div
        style={{
          width: '33%',
          fontSize: '16px',
          fontWeight: 'bold',
          marginLeft: '16px'
        }}
      >
        PHONE: {customer.phoneNo ? customer.phoneNo : '-Nil-'}{' '}
      </div>
    </div>
  );
}

export default InjectObserver(CustomerHeader);