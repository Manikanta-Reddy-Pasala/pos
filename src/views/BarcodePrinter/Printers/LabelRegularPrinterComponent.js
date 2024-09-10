import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    labelStyle: {
      width: '64mm',
      height: '34mm'
    },
    labelDivStyle: {
      margin: '15px',
      padding: '10px',
      marginTop: '25px',
      marginLeft: '10px',
      width: '64mm',
      height: '34mm',
      textAlign: 'left',
    },
    address: {
      whiteSpace: 'break-spaces',
      maxHeight: '60px',
      overflow: 'hidden'
    }
});

class LabelRegularPrinterComponent extends React.PureComponent {
 
    render() {
        const { classes } = this.props;
        let _data = [];
        if (this.props && this.props.data) {
            _data = this.props.data;
          }
      
      return (
        <>
          <div>
            <>
              {_data.map((subArray,index) => (
                <>     
                  <Grid container>
                      {subArray.map((ele,index) => (
                        <>
                          <Grid item xs={4} key={index} className={classes.labelStyle} style={{breakInside:'avoid'}}>
                              <div className={classes.labelDivStyle} 
                                style={{fontSize:'12px', paddingBottom:'4px', 
                                marginLeft: (index % 3) === 0 && '7px' }}>
                                  
                                <div>{ele.name}</div>
                                <div className={classes.address}>{ele.line}</div>
                                <div>{ele.footer ? ele.footer : ' '} &nbsp; {ele.addtionalTextTwo ? '(' + ele.addtionalTextTwo + ')' : ' '}</div>
                                {/* <div>{ele.addtionalTextTwo ? ele.addtionalTextTwo : ' '}</div> */}
                              </div>
                          </Grid>
                        </>
                      ))} 
                  </Grid>  
                </>     
              ))}
            </>
          </div>
        </>
      );
    }
    };

export default withStyles(styles)(LabelRegularPrinterComponent);
