export default class Reminder {
  
    convertTypes(data) {
      data.remindBySms = data.remindBySms || false;
      data.remindByMail = data.remindByMail || false;
      data.remindByWhatsApp = data.remindByWhatsApp || false;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.reminders = data.reminders || [];

      return data;
    }

    getDefaultValues() {
      return {
        remindBySms: false,
        remindByMail: false,
        remindByWhatsApp: false,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        reminders: []
      };
    }
  }