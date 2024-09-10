import { observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import Reminder from './classes/Reminder';

class RemindersStore {
  reminderIndex = '';
  reminderDialogOpen = false;
  dailyType = ['Daily Sale Summary', 'Daily Outstanding Payments'];
  isReminderEdit = false;
  reminderData = [];
  currentReminderData = {};

  constructor() {
    this.reminderData = new Reminder().getDefaultValues();

    makeObservable(this, {
      reminderData: observable,
      currentReminderData: observable,
      reminderDialogOpen: observable
    });
  }

  handleReminderDialogOpen = () => {
    runInAction(() => {
      this.reminderDialogOpen = true;
    });
  };

  handleReminderDialogOpenClose = () => {
    runInAction(() => {
      this.reminderDialogOpen = false;
    });
  };

  addNewReminder = async () => {
    const businessData = await Bd.getBusinessData();
    this.isReminderEdit = false;
    this.reminderIndex = -1;

    let reminderData = {
      id: '',
      reminderOn: true,
      name: '',
      type: '',
      remind: '',
      remindFor: '',
      message: '',
      daysList: []
    };

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('rem');
    reminderData.id = `${id}${appId}${timestamp}`;

    runInAction(() => {
      this.currentReminderData = reminderData;
    });
    this.handleReminderDialogOpen();
  };

  updateReminderData = (property, value) => {
    runInAction(() => {
      this.currentReminderData[property] = value;

      if (property === 'type') {
        if (this.dailyType.includes(value)) {
          this.currentReminderData['remind'] = 'Remind me';
        }
      }
    });
  };

  addReminderDay = async () => {
    const businessData = await Bd.getBusinessData();
    let day = {
      id: '',
      days: 0,
      remindForDays: 'Before Due Date'
    };

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('remd');
    day.id = `${id}${appId}${timestamp}`;
    runInAction(() => {
      this.currentReminderData.daysList.push(day);
    });
  };

  updateReminderDay = (property, index, value) => {
    runInAction(() => {
      this.currentReminderData.daysList[index][property] = value;
    });
  };

  removeReminderDay = (index) => {
    runInAction(() => {
      this.currentReminderData.daysList.splice(index, 1);
    });
  };

  saveReminderData = async () => {
    if (
      this.currentReminderData &&
      this.currentReminderData.daysList &&
      this.currentReminderData.daysList.length > 0
    ) {
      for (var i = 0; i < this.currentReminderData.daysList.length; i++) {
        if (
          this.currentReminderData.daysList[i].days === undefined ||
          this.currentReminderData.daysList[i].days === null ||
          this.currentReminderData.daysList[i].days === ''
        ) {
          this.currentReminderData.daysList[i].days = 0;
        }
      }
    }
    if (this.isReminderEdit) {
      this.reminderData.reminders[this.reminderIndex] =
        this.currentReminderData;
      await this.saveData();
    } else {
      this.reminderData.reminders.push(this.currentReminderData);
      await this.saveData();
    }
    this.handleReminderDialogOpenClose();
  };

  editReminderData = (index) => {
    let remind_data = this.reminderData.reminders[index];
    runInAction(() => {
      this.isReminderEdit = true;
      this.currentReminderData = remind_data;
      this.reminderDialogOpen = true;
      this.reminderIndex = index;
    });
  };
  changeReminderDataStatus = async (index, value) => {
    this.reminderData.reminders[index]['reminderOn'] = value;
    await this.saveData();
  };

  deleteReminderData = (index) => {
    this.reminderData.reminders.splice(index, 1);
    this.saveData();
  };

  saveData = async () => {
    const db = await Db.get();
    const query = db.reminders.findOne({
      selector: {
        businessId: this.reminderData.businessId
      }
    });

    if (
      this.reminderData &&
      this.reminderData.reminders &&
      this.reminderData.reminders.length > 0
    ) {
      for (let reminder of this.reminderData.reminders) {
        if (reminder && reminder.daysList && reminder.daysList.length > 0) {
          for (let day of reminder.daysList) {
            if (
              day.days === undefined ||
              day.days === '' ||
              day.days === null
            ) {
              day.days = 0;
            } else {
              day.days = parseFloat(day.days);
            }
          }
        }
      }
    }

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addReminderData();
        } else {
          await query
            .update({
              $set: {
                updatedAt: Date.now(),
                reminders: this.reminderData.reminders,
                remindBySms: this.reminderData.remindBySms,
                remindByMail: this.reminderData.remindByMail,
                remindByWhatsApp: this.reminderData.remindByWhatsApp
              }
            })
            .then(async (data) => {
              // console.log('inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Reminder Settings Internal Server Error', err);
      });
  };

  addReminderData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.reminderData.businessId = businessData.businessId;
      this.reminderData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.reminderData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.reminders
      .insert(InsertDoc)
      .then(() => {
        console.log('reminders :: data Inserted');
      })
      .catch((err) => {
        console.log('reminders :: data insertion Failed::', err);
      });
  };

  deleteReminderData = async (index) => {
    this.reminderData.reminders.splice(index, 1);
    this.saveData();
  };

  getReminders = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.reminders.findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      runInAction(() => {
        this.reminderData.reminders = data.reminders;
        this.reminderData.remindBySms = data.remindBySms;
        this.reminderData.remindByMail = data.remindByMail;
        this.reminderData.remindByWhatsApp = data.remindByWhatsApp;
      });
    });

    return this.reminderData;
  };

  setReminderBySMS = (value) => {
    runInAction(() => {
      this.reminderData.remindBySms = value;
      this.saveData();
    });
  };

  setReminderByEmail = (value) => {
    runInAction(() => {
      this.reminderData.remindByMail = value;
      this.saveData();
    });
  };

  setReminderByWhatsApp = (value) => {
    runInAction(() => {
      this.reminderData.remindByWhatsApp = value;
      this.saveData();
    });
  };
}
export default new RemindersStore();