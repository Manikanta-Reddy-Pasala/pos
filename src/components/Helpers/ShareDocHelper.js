import { storage } from '../../firebase/firebase';
export const uploadToFirebase = (pdfFile,pdfName, progressCallback) => {
  return new Promise((resolve, reject) => {
    const uploadTask = storage.ref(`/PDF/${pdfName}`).put(pdfFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress
        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('Upload is ' + progress + '% done');
        if (progressCallback) {
          progressCallback(progress);
        }
      },
      (error) => {
        console.error('Error uploading PDF:', error);
        reject(error);
      },
      () => {
        storage
          .ref('PDF')
          .child(pdfFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            console.log(fireBaseUrl);
            resolve(fireBaseUrl);
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
            reject(error);
          });
      }
    );
  });
};
