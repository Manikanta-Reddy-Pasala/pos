import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';
import axios from 'axios';

export const getSalePeriod = () => [
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 9, label: '9 Months' },
  { value: 'FY', label: 'Financial Year' }
];;

