export default class ComplaintBooking {
  convertTypes(data) {
    data.bookingId = data.bookingId || '';
    data.updatedAt = Number(data.updatedAt);
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.customer = data.customer || {
      id: '',
      phoneNo: '',
      name: '',
      gstNo: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      email: '',
      aadharNo: ''
    };
    data.date = data.date || '';
    data.dueDate = data.dueDate || '';
    data.itemList = data.itemList || [];
    data.isSyncedToServer = data.isSyncedToServer || false;
    data.totalAmount = data.totalAmount || 0
  }

  getDefaultValues() {
    return {
      bookingId: '',
      updatedAt: Date.now(),
      businessId: '',
      businessCity: '',
      customer: {
        id: '',
        phoneNo: '',
        name: '',
        gstNo: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        email: '',
        aadharNo: ''
      },
      date: '',
      dueDate: '',
      itemList: [],
      isSyncedToServer: false,
      totalAmount: 0
    };
  }
}