import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  root: {
    padding: 2,
    borderRadius: '12px',
    minHeight: '616px'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  categoryActionWrapper: {
    paddingRight: '10px',
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(1),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  contPad: {
    borderRight: '1px solid silver',
    borderLeft: '1px solid silver',
    borderTop: '1px solid silver'
  },
  bottomTab: {
    borderBottom: '1px solid silver',
    // borderRight: '1px solid silver',
    background: '#ffe8e8',
    fontSize: '17px',
    fontWeight: 'bold'
  },
  headTab: {
    padding: '10px',
    borderBottom: '1px solid silver',
    // borderRight: '1px solid silver',
    background: '#ffe8e8',
    fontSize: '17px',
    fontWeight: 'bold'
  },
  headrRight: {
    padding: '10px',
    borderBottom: '1px solid silver',
    background: '#ffe8e8',
    fontSize: '17px',
    fontWeight: 'bold'
  },
  marl: {
    marginLeft: '5px'
  },
  textAlignEnd: {
    textAlign: 'end'
  },
  setPadding: {
    padding: '14px'
  },
  subHeadLeft: {
    background: '#F7F7F7',
    padding: 10
  },
  subHeaderRight: {
    background: '#F7F7F7',
    padding: 10
  },
  listItems: {
    padding: 10
  },
  listItemsRight: {
    padding: 10
  },
  mrbtm: {
    marginBottom: 10
  },
  title: {
    textAlign: 'center',
    fontSize: '26px',
    marginTop: 20
  },
  gridContent: {
    height: 480,
    borderRight: '1px solid #b0b0b0'
  },
  gridContentRight: {
    height: 480
  }
}));
