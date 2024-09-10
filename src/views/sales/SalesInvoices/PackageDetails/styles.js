import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: '#fff'
  },
  appBarBottom: {
    top: 'auto',
    bottom: 0,
    background: '#fff'
  },
  wrapper: {
    padding: '1rem 1rem 0 1rem'
  },
  cell: {
    borderRight: '1px solid #cacaca'
  },
  minWidthCell: {
    minWidth: '200px',
    maxWidth: '200px',
    width: '200px'
  },
  tableWrapper: {
    tableLayout: 'fixed'
  }
}));
