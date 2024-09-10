import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6,
    backgroundColor: '#f6f8fa'
  },
  sectionHeader: {
    marginBottom: 30
  },
  searchInput: {
    width: '75%'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  TextField: {
    position: 'relative',
    width: '130%'
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      display: 'flex',
      flexWrap: 'wrap',
      width: '70'
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '20%',
    right: 30,
    display: 'flex',
    wrap: 'nowrap',
    '& .MuiOutlinedInput-input': {
      padding: '2px 3px'
    }
  },
  data1: {
    position: 'absolute',
    right: 50,
    top: 20
  },
  pageHeader: {
    position: 'relative',
    padding: theme.spacing(2),
    display: 'flex',
    marginBottom: theme.spacing(1)
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6
  },
  dialogPaper: {
    maxWidth: '70%',
    height: '500px'
  },
  formControl: {
    // margin: theme.spacing(1),
    // position: 'relative',
    minWidth: '48%',
    // bottom: '30px',
    minHeight: '5%'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  receipt: {
    position: 'absolute',
    bottom: '355px',
    marginLeft: '500px'
    // left:'130px',
  },
  date: {
    position: 'relative',
    bottom: 130,
    // marginLeft:'500px',
    width: '70%'
  },
  dialogTitleRoot: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center'
  },
  baltypo: {
    color: 'red',
    paddingLeft: 5
  },
  width50: {
    width: '50%'
  },
  flexRow: {
    flexFlow: 'row'
  },
  actBtn: {
    borderColor: '#ff5252',
    color: '#ff5252'
  },
  actGrid: {
    padding: '0px 3px'
  },
  contentGrid: {
    padding: '0px 10px'
  }
}));
export default { useStyles };
