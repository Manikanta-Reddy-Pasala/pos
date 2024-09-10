import { observable, makeObservable, runInAction, action } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';

class EmployeeStore {
  employeeDialogOpen = false;
  employeeList = [];
  employeeTransactionList = [];
  disableBalanceEdit = false;
  isEdit = false;
  isEmployeeList = false;
  phoneNoAlreadyExistDialog = false;

  // to set default values
  employeeDefault = {
    id: '',
    name: '',
    userName: '',
    password: '',
    businessId: '',
    businessCity: '',
    date: getTodayDateInYYYYMMDD(),
    updatedAt: Date.now(),
    posId: 0,
    passwordSet: false,
    changePassword: '',
    isSyncedToServer: false,
    type: '',
  };

  employee = {
    id: '',
    name: '',
    userName: '',
    password: '',
    businessId: '',
    businessCity: '',
    date: getTodayDateInYYYYMMDD(),
    updatedAt: Date.now(),
    posId: 0,
    passwordSet: false,
    changePassword: '',
    isSyncedToServer: false,
    type: '',
  };

  selectedEmployee = {
    name: '',
    userName: ''
  };

  allEmployees = [];

  generateEmployeeId = async () => {
    console.log('inside generateEmployeeId');
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('e');
    runInAction(() => {
      this.employee.id = `${id}${appId}${timestamp}`;
    });
  };

  getEmployeeCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.employees.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        this.isEmployeeList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setSelectedEmployee = (data) => {
    this.selectedEmployee.name = data.name;
    this.selectedEmployee.userName = data.userName;
  };

  handleEmployeeModalOpen = () => {
    runInAction(() => {
      this.isEdit = false;
      this.employee = this.employeeDefault;
      this.employeeDialogOpen = true;
    });
  };

  isDate = async (date) => {
    if (isNaN(date) && !isNaN(Date.parse(date))) return true;
    else return false;
  };

  setToDefaults = () => {
    runInAction(() => {
      this.employeeTransactionList = [];
    });
  };

  viewOrEditEmployee = async (employee) => {
    //get data from Db and assign to variable
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    await db.employees
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: employee.id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          this.employee.id = data.id;
          this.employee.name = data.name;
          this.employee.userName = data.userName;
          this.employee.password = data.password;
          this.employee.businessId = data.businessId;
          this.employee.businessCity = data.businessCity;
          this.employee.posId = data.posId;
          this.employee.date = data.date;
          this.employee.passwordSet = data.passwordSet;
          this.employee.changePassword = data.changePassword;
          this.employee.isSyncedToServer = data.isSyncedToServer;
          this.employee.type = data.type;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    this.handleOpenDialog(true);
  };

  deleteEmployee = async (employee) => {
    console.log(employee);
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();

    const query = db.employees.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: employee.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('employee data removed' + data);
      })
      .catch((error) => {
        console.log('employee deletion Failed ' + error);
      });
  };

  handleOpenDialog = (isEdit) => {
    this.isEdit = isEdit;
    if (!isEdit) {
      this.employee = this.employeeDefault;
    }
    this.employeeDialogOpen = true;
  };

  handleEmployeeTransactionSearch = async (value) => {
    let id = this.employee.id;
    if (value.length > 0) {
      this.setToDefaults();
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      var regexp = new RegExp('^.*' + value + '.*$', 'i');

      await db.alltransactions
        .find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { employeeId: { $eq: id } },
                  { sequenceNumber: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { employeeId: { $eq: id } },
                  { txnType: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { employeeId: { $eq: id } },
                  { total: { $eq: parseFloat(value) } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { employeeId: { $eq: id } },
                  { balance: { $eq: parseFloat(value) } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { employeeId: { $eq: id } },
                  { customerName: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { employeeId: { $eq: id } },
                  { vendorName: { $regex: regexp } }
                ]
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No employee transactions is available
            return;
          }
          const finalData = data.map((item) => item.toJSON());
          runInAction(() => {
            this.employeeTransactionList = finalData;
          });
        });
    } else if (value.length === 0) {
      this.getEmployeeTransactionList(id);
    }
  };

  handleCloseDialogEmployee = () => {
    runInAction(() => {
      this.employeeDialogOpen = false;
      this.isEdit = false;
    });
  };

  handlePhoneNumberAlreadyExsitDialog = () => {
    runInAction(() => {
      this.phoneNoAlreadyExistDialog = false;
    });
  }

  getEmployeeTransactionList = async (employeeId) => {
    const db = await Db.get();

    runInAction(() => {
      this.employeeTransactionList = [];
      this.employee.id = employeeId;
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              employeeId: { $eq: employeeId }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No txn data is available
          return;
        }

        const finalData = data.map((item) => item.toJSON());
        runInAction(() => {
          this.employeeTransactionList = finalData;
        });
      });
  };

  getEmployeeList = () => {
    return this.employeeList;
  };

  setEmployeeProperty = (property, value) => {
    runInAction(() => {
      this.employee[property] = value;
    });
  };

  saveData = async () => {
    const businessData = await Bd.getBusinessData();
    const db = await Db.get();

    this.employee.updatedAt = Date.now();
    this.employee.businessId = businessData.businessId;
    this.employee.businessCity = businessData.businessCity;
    this.employee.posId = parseFloat(businessData.posDeviceId);
    if (!this.isEdit) {
      const query = db.employees.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { userName: { $eq: this.employee.userName } }
          ]
        }
      });

      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            await this.generateEmployeeId();
            if (this.employee.password && this.employee.password !== '') {
              this.employee.passwordSet = true;
            }
      
            await db.employees
              .insert(this.employee)
              .then((data) => {
                console.log('data Inserted:', data);
                this.employee = this.employeeDefault;
                this.employeeDialogOpen = false;
              })
              .catch((err) => {
                console.log('Error in saving employee:', err);
              });
          } else {
             this.phoneNoAlreadyExistDialog = true;
          }
        })
        .catch((err) => {
          console.log('Internal Server Error employee ', err);
        });
      
    } else {      

      const query = db.employees.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.employee.id } }
          ]
        }
      });

      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No Sales data is found so cannot update any information
            return;
          }

          await query
            .update({
              $set: {
                name: this.employee.name,
                userName: this.employee.userName,
                password: this.employee.password,
                businessId: this.employee.businessId,
                businessCity: this.employee.businessCity,
                posId: this.employee.posId,
                date: this.employee.date,
                passwordSet: this.employee.passwordSet,
                changePassword: this.employee.changePassword,
                isSyncedToServer: this.employee.isSyncedToServer,
                type: this.employee.type,
                updatedAt: Date.now()
              }
            })
            .then(async () => {
              console.log('inside update employee');
              this.isEdit = false;
              this.employeeDialogOpen = false;
            });
        })
        .catch((err) => {
          console.log('Internal Server Error employee ', err);
        });
    }
  };

  getAllReportEmployees = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.reportemployees.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        // No customer is available
        return;
      }

      runInAction(() => {
        this.allEmployees = [];
      });
      data.map((item) => {
        let finalData = item.toJSON();
        runInAction(() => {
          this.allEmployees.push(finalData);
        });
      });
    });

    return this.allEmployees;
  };

  // setting variables as observables so that it can be accesible
  // from other components and making methods as actions to invoke from other components
  constructor() {
    makeObservable(this, {
      employee: observable,
      employeeDialogOpen: observable,
      employeeList: observable,
      employeeTransactionList: observable,
      selectedEmployee: observable,
      isEmployeeList: observable,
      allEmployees: observable,
      phoneNoAlreadyExistDialog: observable,
      handlePhoneNumberAlreadyExsitDialog: action,
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new EmployeeStore();
