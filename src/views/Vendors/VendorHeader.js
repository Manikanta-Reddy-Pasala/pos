import React from 'react';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';

function VendorHeader() {
  const store = useStore();
  const { vendor } = toJS(store.VendorStore);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '33%', fontSize: '16px', fontWeight: 'bold' }}>
        NAME: {vendor.name}
      </div>
      <div
        style={{
          width: '33%',
          fontSize: '16px',
          fontWeight: 'bold',
          marginLeft: '16px'
        }}
      >
        GSTIN: {vendor.gstNumber ? vendor.gstNumber : '-Nil-'}{' '}
      </div>
      <div
        style={{
          width: '33%',
          fontSize: '16px',
          fontWeight: 'bold',
          marginLeft: '16px'
        }}
      >
        PHONE: {vendor.phoneNo ? vendor.phoneNo : '-Nil-'}{' '}
      </div>
    </div>
  );
}
export default InjectObserver(VendorHeader);