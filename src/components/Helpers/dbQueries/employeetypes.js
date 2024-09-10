const Bd = require('../../SelectedBusiness');
const Db = require('../../../RxDb/Database/Database');
const commons = require('./commonLogic');

export const getEmployeeTypes = async (id, isSingle) => {
    const businessData = await Bd.getBusinessData();
    const db = await Db.get();
    let  selector= {
              $and: [
                  { businessId: { $eq: businessData.businessId } },
              ]
          }
    if(isSingle) {
      selector.$and.push({ id: { $eq: id } });
    }
    const query = isSingle
      ? await db.employeetypes.findOne({ selector })
      : await db.employeetypes.find({ selector });
    return commons.executeQuery(query);
};

export const getEmployeeTypesCount = async () => {
    try {
        const db = await Db.get();
        const businessData = await Bd.getBusinessData();

        const query = db.employeetypes.find({
            selector: {
                businessId: { $eq: businessData.businessId }
            }
        });

        const data = await query.exec();
        return data.length > 0;
    } catch (err) {
        console.log('employee types Count Internal Server Error', err);
    }
};

export const deleteEmployeeTypesById = async (id) => {
    try {
        const db = await Db.get();
        const businessData = await Bd.getBusinessData();

        const query = db.employeetypes.findOne({
            selector: {
                $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { id: { $eq: id } }
                ]
            }
        });

        const document = await query.exec();
        if (!document) {
            console.log('No matching employee types data found');
            return false;
        }

        await document.remove();
        console.log('employee types data removed');
        return true;
    } catch (error) {
        console.log('employee types deletion Failed ' + error);
        return false;
    }
};

export const updateEmployeeTypes = async (id, fieldsToUpdate) => {
    try {
        const db = await Db.get();
        const businessData = await Bd.getBusinessData();

        const result = await db.employeetypes
            .findOne({
                selector: {
                    $and: [
                        { businessId: { $eq: businessData.businessId } },
                        { id: { $eq: id } }
                    ]
                }
            })
            .update({
                $set: {
                    ...fieldsToUpdate
                }
            });

        if (result) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log('employee types update Failed ' + error);
        return false;
    }
};
