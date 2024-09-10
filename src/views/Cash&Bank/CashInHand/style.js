import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: '2rem',
    width: '100%'
  },
  minWidthCell: {
    minWidth: '200px',
    maxWidth: '200px',
    width: '200px'
  },
  thead: {
    fontSize: '1.125rem',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  select: {
    minWidth: '15rem'
  },
  rightAlign: {
    textAlign: 'right'
  }
}));
