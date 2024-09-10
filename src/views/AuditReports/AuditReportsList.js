import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import classnames from 'classnames';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const accountsLists = [
  {
    label: 'Sale',
    key: 'sale'
  },
  {
    label: 'Sale Return',
    key: 'salereturn'
  },
  {
    label: 'Purchase',
    key: 'purchase'
  },
  {
    label: 'Purchase Return',
    key: 'purchasereturn'
  },
  {
    label: 'Section 43B(h) Report',
    key: '43bh'
  }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: 10
  },
  list: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#f6f8fa',
      color: '#ef5350'
    }
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    borderRadius: 8,
    paddingTop: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  heading: {
    padding: '18px',
    fontSize: '15px',
    marginBottom: '-5px'
  },
  listH: {
    padding: '2px',
    '&:hover': {
      background: '#F7F8FA',
      borderLeft: '5px solid #EF5350'
    },
    '&:focus': {
      background: '#F7F8FA',
      borderLeft: '5px solid #EF5350'
    }
  },
  topHeading: {
    paddingLeft: '12px',
    fontSize: '12px',
    marginBottom: '-5px',
    fontWeight: 'bold'
  },
  activeList: {
    padding: '2px',
    background: '#F7F8FA',
    borderLeft: '5px solid #EF5350',
    '&:focus': {
      background: '#F7F8FA',
      borderLeft: '5px solid #EF5350'
    }
  },
  detailRoot: {
    padding: '0px !important'
  },
  hedersummaryRoot: {
    padding: '0px !important',
    minHeight: '48px !important'
  },
  accordionStyle: {
    borderBottom: '1px solid #d2d1d1'
  },
  accordionExpanded: {
    margin: '0px !important'
  }
});

const AuditReportsList = (props) => {
  const classes = useStyles();
  const store = useStore();
  const [expanded, setExpanded] = React.useState('accountsReport');
  const { auditReportRouterData } = toJS(store.ReportsStore);
  const [active, setActive] = React.useState(auditReportRouterData);
  const [taxList, setTaxList] = React.useState([]);
  const { taxSettingsData } = toJS(store.TaxSettingsStore);
  const { getTaxSettingsData } = store.TaxSettingsStore;
  const [compositeScheme, setCompositeScheme] = React.useState(false);

  const taxRef = useRef(null);
  const accountRef = useRef(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    async function fetchData() {
      await getTaxSettingsData();
    }

    fetchData();

    setCompositeScheme(taxSettingsData.compositeScheme);
  }, [getTaxSettingsData, taxSettingsData]);

  useEffect(() => {
    let list = [
      {
        label: 'Input and Output Tax Credits',
        key: 'taxcredits'
      },
      {
        label: 'GSTR-1',
        key: 'gstrreports'
      }
    ];

    setTaxList(list);
  }, [compositeScheme]);

  useEffect(() => {
    taxList.forEach((ele) => {
      if (ele.key === auditReportRouterData) {
        setExpanded('taxReport');
        taxRef.current.scrollIntoView();
      }
    });

    accountsLists.forEach((ele) => {
      if (ele.key === auditReportRouterData) {
        setExpanded('accountsReport');
        accountRef.current.scrollIntoView();
      }
    });
  }, [auditReportRouterData, taxList]);

  return (
    <div className={classes.card}>
       <Accordion
        classes={{
          root: classes.accordionStyle,
          expanded: classes.accordionExpanded
        }}
        expanded={expanded === 'accountsReport'}
        onChange={handleChange('accountsReport')}
        elevation={0}
      >
        <AccordionSummary
          classes={{ root: classes.hedersummaryRoot }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            gutterBottom
            className={classes.topHeading}
            variant="h6"
            component="h6"
            ref={accountRef}
          >
            ACCOUNTS REPORT
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.detailRoot }}>
          <List classes={{ root: classes.detailRoot }}>
            {accountsLists.map(({ key, label, href }) => {
              return (
                <Typography
                  key={key}
                  onClick={() => {
                    props.returnData(key);
                    // setReportRouterData(key);
                    setActive(key);
                  }}
                  gutterBottom
                  className={classnames([
                    classes.listH,
                    'menu-item',
                    active === key ? classes.activeList : 'menu-default'
                  ])}
                  variant="h6"
                  component="h6"
                >
                  <p className={classes.list}>{label}</p>
                </Typography>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion> 

      {taxList.length > 0 ? (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'taxReport'}
          onChange={handleChange('taxReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={taxRef}
            >
              TAX REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {taxList.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : null}
    </div>
  );
};

export default InjectObserver(AuditReportsList);