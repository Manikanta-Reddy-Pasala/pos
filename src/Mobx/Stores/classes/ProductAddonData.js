export default class ProductAddonData {
  convertTypes(data) {
    data.groupId = data.groupId || '';
    data.name = data.name || '';
    data.min_choices = parseInt(data.min_choices) || 0;
    data.max_choices = parseInt(data.max_choices) || 0;
    data.additional_property_list = data.additional_property_list || [];

    return data;
  }

  defaultValues() {
    return {
      groupId: '',
      name: '',
      min_choices: 0,
      max_choices: 0,
      additional_property_list: []
    };
  }
}