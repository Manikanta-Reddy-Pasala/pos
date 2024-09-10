import { useCallback } from 'react';
import { useRxData } from 'rxdb-hooks';

export const GetTableDataWithPagination = (table, size, filter) => {
  /**
   * add below filter for every call for sorting
   */
  if (!filter) {
    filter = {};
  }

  const queryConstructor = useCallback((c) => c.find(filter), [filter]);

  const {
    result: data,
    isFetching,
    fetchMore,
    isExhausted
  } = useRxData(table, queryConstructor, {
    pageSize: size,
    pagination: 'Infinite'
  });

  if (isFetching) {
    console.log('Loading...');
  }

  if (!isExhausted) {
    fetchMore();
  }

  //   console.log('test');
  //   console.log('result::', toJS(businessproduct));
  return data;
};
