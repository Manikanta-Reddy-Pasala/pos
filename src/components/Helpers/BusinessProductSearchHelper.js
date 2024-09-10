import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';
import * as audit from '../../components/Helpers/AuditHelper';

export const getBusinessProducts = async (value) => {
  let results = [];
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');

  await db.businessproduct
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            name: { $regex: regexp }
          }
        ]
      }
    })
    .exec()
    .then((documents) => {
      if (!documents) {
        return;
      }
      results = documents.map((item) => item.toJSON());
    });
  return results;
};

const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

export const removeProduct = async (arrayFilter) => {
  const businessData = await Bd.getBusinessData();
  const db = await Db.get();

  const businessFilter = { businessId: { $eq: businessData.businessId } };

  arrayFilter.push(businessFilter);

  const query = db.businessproduct.find({
    selector: {
      $and: arrayFilter
    }
  });

  let deletedProduct = {};
  let today = new Date().getDate();
  let thisYear = new Date().getFullYear();
  let thisMonth = new Date().getMonth();

  await query
    .remove()
    .then((data) => {
      console.log('Product data removed' + data);
      deletedProduct = data;
      //save to audit
      audit.addAuditEvent(
        data.productId,
        '',
        'Product',
        'Delete',
        JSON.stringify(data),
        '',
        formatDate(new Date(thisYear, thisMonth, today))
      );
    })
    .catch((error) => {
      console.log('Product delete Failed - ', error);
      if (deletedProduct) {
        audit.addAuditEvent(
          deletedProduct.productId,
          '',
          'Product',
          'Delete',
          JSON.stringify(deletedProduct),
          error.message,
          formatDate(new Date(thisYear, thisMonth, today))
        );
      }
    });
};
