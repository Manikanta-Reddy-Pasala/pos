import { action, observable, makeObservable } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class UserManagementStore {

    posUserList = [
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        },
        {
            name : "vilva",
            userName : '9028227277',
            features : [
                {
                    name : "Sales",
                    checked : true,
                },
                {
                    name : "Purchases",
                    checked : true,
                },
                {
                    name : "Expenses",
                    checked : true,
                },
                {
                    name : "Customers",
                    checked : true,
                },
                {
                    name : "Vendors",
                    checked : true,
                },
                {
                    name : "Cash & Bank",
                    checked : true,
                },
                {
                    name : "Accounts Reports",
                    checked : true,
                },
                {
                    name : "Sales Report",
                    checked : true,
                },
                {
                    name : "Purchases Report",
                    checked : true,
                },
                {
                    name : "Returns Report",
                    checked : true,
                },
                {
                    name : "P&L Report",
                    checked : true,
                },
                {
                    name : "Tax Report",
                    checked : true,
                },
                {
                    name : "Settings",
                    checked : true,
                },
            ]
        }
    ];

    selectedFeatureList = [];

    setSelectedFeatureList = (list) => {
        this.selectedFeatureList = list;
    }


    setFeatures = (val,subIndex,Index) => {
      this.posUserList[Index].features[subIndex].checked = val;
    }



  constructor() {
    makeObservable(this, {
        posUserList : observable,
        selectedFeatureList : observable,
    });
  }
}
export default new UserManagementStore();
