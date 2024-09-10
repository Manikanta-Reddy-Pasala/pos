import { observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import TallySequenceNumber from './classes/TallySequenceNumber';
import {
  getTallySequenceNumbers,
  saveTallySequenceNumbers,
  updateTallySequenceNumbers
} from 'src/components/Helpers/dbQueries/tallysequencenumbers';

class TallySequenceNumbersStore {
  reportTxnEnableFieldsMap = new Map();

  getReportSettingdetails = async () => {
    const tallySequenceNumbersData = await getTallySequenceNumbers();
    this.tallySequenceNumbers = tallySequenceNumbersData;

    return this.tallySequenceNumbers;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tallysequencenumbers.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addTallySequenceNumbers();
        } else {
          let updateSelector = {
            $set: {
              posId: parseFloat(businessData.posDeviceId),
              updatedAt: Date.now(),
              businessId: businessData.businessId,
              businessCity: businessData.businessCity,
              isSyncedToServer: false,
              payment: this.tallySequenceNumbers.payment,
              receipt: this.tallySequenceNumbers.receipt
            }
          };

          await updateTallySequenceNumbers(updateSelector);
        }
      })
      .catch((err) => {
        console.log(
          'Sale Order Transaction Settings Internal Server Error',
          err
        );
      });
  };

  addTallySequenceNumbers = async () => {
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.tallySequenceNumbers.businessId = businessData.businessId;
      this.tallySequenceNumbers.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.tallySequenceNumbers;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await saveTallySequenceNumbers(InsertDoc);
  };

  setTallySequenceNumbersProperty = (property, subProperty, value, seqNoValue) => {
    this.tallySequenceNumbers[property][subProperty] = value;
    runInAction(() => {
      this.tallySequenceNumbers[property][subProperty] = [];
      let prefixSequence = {};
      prefixSequence.prefix = value;
      prefixSequence.sequenceNumber = seqNoValue === '' ? 1 : parseInt(seqNoValue);
      this.tallySequenceNumbers[property][subProperty].push(prefixSequence);
    });
    this.saveData();
  };

  constructor() {
    this.tallySequenceNumbers = new TallySequenceNumber().getDefaultValues();

    makeObservable(this, {
      tallySequenceNumbers: observable
    });
  }
}
export default new TallySequenceNumbersStore();