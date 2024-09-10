export default class SequenceNumberItem {
  convertTypes(data) {
    data.prefixes = data.prefixes || '';
    data.subPrefixes = data.subPrefixes || '';
    data.prefixesList = data.prefixesList || [];
    data.subPrefixesList = data.subPrefixesList || [];
    data.appendYear = data.appendYear || false;
    data.prefixSequence = data.prefixSequence || [];
    data.noPrefixSequenceNo = parseInt(data.noPrefixSequenceNo) || 0;
    return data;
  }

  defaultValues() {
    return {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    };
  }
}