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
      gridCol: {
        display:'flex',
        flexDirection:'col',
        justifyContent:'space-around',
      },
      gridRow: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
      }

}));
export default { useStyles }