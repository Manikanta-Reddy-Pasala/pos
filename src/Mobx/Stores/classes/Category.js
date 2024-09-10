export default class Category {
  convertTypes(data) {
    let newData = {};

    newData.count = parseFloat(data ? data.count : 0);
    newData.name = data ? data.name : '';
    newData.displayName = data ? data.displayName : '';
    newData.imgurl = data ? data.imgurl : '';

    return newData;
  }

  defaultValues() {
    return {
      name: '',
      displayName: '',
      imgurl: '',
      count: 0
    };
  }
}
