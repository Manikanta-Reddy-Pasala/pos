class UpdateHandler {
  async callUpdateAPI() {
    try {
      console.log('Calling update API');
      const version = this.getVersionFromPackageJson();
      const lastVersion = localStorage.getItem('lastVersion');

      // If the version hasn't changed since the last API call, don't call the API
      if (version === lastVersion) {
        console.log(
          'Version has not changed since the last update, skipping API call'
        );
        return;
      }

      const businessCity = localStorage.getItem('businessCity');
      const businessId = localStorage.getItem('businessId');
      const posId = localStorage.getItem('posId');

      const requestBody = {
        businessCity,
        businessId,
        posId,
        version
      };

      const API_SERVER = window.REACT_APP_API_SERVER;

      const response = await fetch(API_SERVER + '/pos/v1/react/version/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API response status:', response.status);
      // After a successful API call, store the current version in the local storage

      if (response.status === 200) {
        localStorage.setItem('lastVersion', version);
      }
    } catch (error) {
      console.error('Error calling update API:', error);
    }
  }

  getVersionFromPackageJson() {
    console.log('Getting version from package.json');
    const { version } = require('../package.json');
    console.log('Fetched version:', version);
    return version;
  }
}

export default UpdateHandler;
