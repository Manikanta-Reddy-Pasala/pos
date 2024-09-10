import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: '#ffffff'
      },
      pageHeader: {
        display: 'flex',
        overflowX: 'hidden'
      },
      oneShellColor: {
        color: '#EF5350'
      },
      gridStyle: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        border:'1px solid lightgrey',
        width:'90%',
        alignSelf:'center',
        borderRadius:'10px',
        backgroundColor: '#ffffff',
        margin:'10px'
      },
      gridStyleNoBorder: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        width:'90%',
        alignSelf:'center',
        border:'1px solid lightgrey',
        backgroundColor: '#ffffff',
      },
      gridCol: {
        display:'flex',
        flexDirection:'col',
        justifyContent:'space-around',
      },
      gridRow: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
      },
      root: {
        margin: 0,
        padding: theme.spacing(2),
        width: '400px'
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(0),
        color: theme.palette.grey[500]
      }

}));
export default { useStyles }