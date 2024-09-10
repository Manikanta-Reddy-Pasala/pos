export default class LoyaltySettings {
    convertTypes(data) {
      data.amountPerPoint = parseFloat(data.amountPerPoint) || 0;
      data.minValueToEarnPoints = parseFloat(data.minValueToEarnPoints) || 0;
      data.pointExpiry = Boolean(data.pointExpiry);
      data.expiryDays = parseFloat(data.expiryDays) || 0;
      data.pointPerAmount = parseFloat(data.pointPerAmount) || 0;
      data.minValueForRedemption = parseFloat(data.minValueForRedemption) || 0;
      data.minRedemptionPoints = parseFloat(data.minRedemptionPoints) || 0;
      data.maxRedemptionPoints = parseFloat(data.maxRedemptionPoints) || 0;
      data.maxDiscount = parseFloat(data.maxDiscount) || 0;
      data.otpRequired = Boolean(data.otpRequired);
      data.enableRedemption = Boolean(data.enableRedemption);
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.posId = parseFloat(data.posId) || 0;
      data.isSyncedToServer = Boolean(data.isSyncedToServer); 
      return data;
    }
  
    getDefaultValues() {
      return {
        amountPerPoint: 0,
        minValueToEarnPoints: 0,
        pointExpiry: false,
        expiryDays: 0,
        pointPerAmount: 0,
        minValueForRedemption: 0,
        minRedemptionPoints: 0,
        maxRedemptionPoints: 0,
        maxDiscount: 0,
        otpRequired: false,
        enableRedemption: true,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false
      };
    }
  }
  