import * as Bd from '../SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';

export const retry = async (fn, retries = 5, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

// Database operations
export const getDatabase = async () => retry(() => Db.get());
export const getBusinessData = async () => retry(() => Bd.getBusinessData());
