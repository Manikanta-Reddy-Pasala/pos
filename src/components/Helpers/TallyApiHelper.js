export const sendXmlDataToTally = async (xmlData) => {
  const apiURL = 'http://localhost:9000';
  const retryCount = 3;

  async function postApi(xmlData, retriesLeft) {
    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xmlData
      });

      if (!response.ok) throw new Error('Network response was not ok');

      return true;
    } catch (error) {
      if (retriesLeft > 1) {
        return postApi(xmlData, retriesLeft - 1);
      } else {
        alert(`Tally API push failed: ${error.message}`);
        return false;
      }
    }
  }

  return postApi(xmlData, retryCount);
};
