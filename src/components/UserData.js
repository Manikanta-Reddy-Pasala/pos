import * as Db from '../RxDb/Database/Database';
import * as Bd from '../components/SelectedBusiness';

export const getUserData = async () => {
  let userId = localStorage.getItem('userId');
  let userPass = localStorage.getItem('userPass');

  if (
    (userId === null && userPass === null) ||
    (userId === undefined && userPass === undefined) ||
    userId === ''
  ) {
    /**
     * select from db
     */
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = await db.user
      .findOne()
      .exec()
      .then((data) => {
        console.log(data);
        if (data) {
          userId = data.userId;
          userPass = data.userPass;
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userPass', data.userPass);
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  } else {
    userId = localStorage.getItem('userId');
    userPass = localStorage.getItem('userPass');
  }
  var data = {
    userId: userId,
    userPass: userPass
  };
  // Return it
  return data;
};

export const saveUserData = async (userId, userPass) => {
  const db = await Db.get();

  let InsertDoc = {};

  InsertDoc.userId = userId;
  InsertDoc.userPass = userPass;

  await db.user
    .insert(InsertDoc)
    .then((data) => {
      // console.log('data Inserted:', data);
    })
    .catch((err) => {
      console.log('Error in Adding userdata:', err);
    });
};
