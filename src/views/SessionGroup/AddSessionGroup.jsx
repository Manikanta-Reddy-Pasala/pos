import { FormControl, 
         Grid, 
         TextField, 
         Typography, 
         Table,
         TableBody,
         TableCell,
         TableContainer,
         TableHead,
         TableRow,
         Paper,
         Select,
         MenuItem,
         Button,
         Dialog,
         DialogContent,
         IconButton,
         FormControlLabel,
         Checkbox,
         Box,
         Backdrop,
        } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useStore } from "src/Mobx/Helpers/UseStore";
import { getCustomerAutoCompleteList, getEmployeeAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import style from 'src/components/Helpers/Classes/commonStyle';
import TruncatedTextField from "src/components/Helpers/TruncatedTextField";
import Loader from "react-js-loader";
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { DeleteOutlined } from "@material-ui/icons";
import { Close as CloseIcon } from '@material-ui/icons';
import { storage } from 'src/firebase/firebase';
import { styled } from "@material-ui/styles";
import * as clinicHelper from 'src/components/Utility/ClinicUtility';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  padding: '6px',
}));

const AddSessionGroup = (props) => {
    const classes = style.useStyles();
    const { DialogActions, DialogTitle } = style;
    const store = useStore();
    const { setCustomerDetails,
            sessionGroup,
            sessionGroupListDefault,
            handleSessionGroupValues,
            sessionGroupDefault,
            sessionGroupDialogOpen,
            handleCloseSessionGroupDialog,
            viewHistory,
            getSessionId,
           } = store.SessionGroupStore;
    const [customerList, setCustomerList] = useState();
    const [customerName, setCustomerName] = useState();
    const [sessionGroupData, setSessionGroup] = useState(sessionGroup);
    const [rows, setRows] = useState([]);
    const [employeeList, setEmployeeList] = useState();
    const [currentIndex, setIndex] = useState();
    const [isEdit, setEdit] = useState(true);
    const [isAdmin, setIsAdmin] = useState();
    const [errorMsg, setErrorMsg] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [previousSessionNo, setPreviousSessionNo] = useState(0);
    const [selectedRow, setSelectedRow] = useState();
    const [loading, setLoading] = useState(false); 
    const [openMntryFieldErrorDialog, setOpenMntryFieldErrorDialog] = useState(false);
    const currentDateTime = new Date();
  
    // Function to handle image upload
    const handleImageUpload = (event) => {
      setLoading(true);
      const files = Array.from(event.target.files);
      const urls = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          urls.push({url: reader.result, name: file.name, file: file});
          if (urls.length === files.length) {
           await handleFirebaseImageUpload(urls);
          }
        };
        reader.readAsDataURL(file);
      });
    };


    const handleRemoveImage = (rowIndex, imageUrlIndex) => {
      const updatedRows = rows.map((row, idx) => {
        if (idx === rowIndex) {
          const updatedImageUrl = row.sessionNotes.imageUrl?.filter((_, i) => i !== imageUrlIndex);
          return { ...row, sessionNotes: { ...row.sessionNotes, imageUrl: updatedImageUrl } };
        }
        return row;
      });
      setRows(updatedRows);
    };
    
    const getCustomerList = async (value) => {
        setCustomerName(value);
        setCustomerList(await getCustomerAutoCompleteList(value));
    };

    const getEmployeeList = async (value) => {
      setEmployeeList(await getEmployeeAutoCompleteList(value));
    };

      const handleCustomerClick = (customer) => {
        setCustomerDetails(customer);
        setCustomerName(customer.name);
        setCustomerList([]);
      };

      const handleSessionGroup = (property, value) => {
        setSessionGroup({...sessionGroupData, [property]: value});
      }

      const handleOnChange = (value, index, property) => {
        const updatedRows = rows.map((row, idx) => {
          if (idx === index) {
            return { ...row, [property]: value };
          }
          return row;
        });
        setRows(updatedRows);
      }

      const getSessionDateTime = (row) => {
        return new Date(`${row.sessionDate}T${row.sessionStartTime}`);
      }

      const handleSessionNotesOnChange = (value, index) => {
        const updatedRows = rows.map((row, idx) => 
          idx === index
            ? { ...row, sessionNotes: { imageUrl: row.sessionNotes?.imageUrl || [], message: value } }
            : row
        );
        setRows(updatedRows);
      };
    
      const handleEmployeeList = (value, index) => {
        const updatedRows = rows.map((row, idx) => {
          if (index === idx) {
            if(value instanceof Object) {
              return { ...row, doctorName: value.name, doctorId: value.id, doctorPhoneNo: value.userName };
            } else {
              return { ...row, doctorName: value };
            }
           
          }
          return row;
        });
        setRows(updatedRows);
        setEmployeeList([]);
      };

      const handleOnClickAddSession = async() => {
        if(previousSessionNo === sessionGroupData.noOfSession) {
          return;
        }
        if(previousSessionNo < sessionGroupData.noOfSession){
          setPreviousSessionNo(sessionGroupData.noOfSession)
          let array = rows;
          let noOfSession = sessionGroupData.noOfSession;
          if(rows.length > 0){
           noOfSession = (sessionGroupData.noOfSession - rows.length);
          } 
          for (let i = 0; i < noOfSession; i++) {
            array.push({...sessionGroupListDefault, sessionId: await getSessionId()});
        }
         setRows([...array]);
        }   else {
          setErrorMsg('Are you you want to remove Sessions');
          setOpenErrorDialog(true);
        }    
      }

      const handleRemoveSession = () => {
        setOpenErrorDialog(false);
        let array = [...rows];
        const elementsToRemove = sessionGroupData.noOfSession - previousSessionNo;
        array.splice(elementsToRemove);
        setRows(array);
        setPreviousSessionNo(sessionGroupData.noOfSession);
      }

      const handleAddNewSession = async() => {
        let array = rows;
        array.push({...sessionGroupListDefault, sessionId: await getSessionId()});

        setRows([...array]);
        setSessionGroup({...sessionGroupData, noOfSession: array.length});
      }

      const handleOpenMntryFieldErrorDialog = (val) => {
           setOpenMntryFieldErrorDialog(val);
      }

      const saveDataOnClick = () => {
        let error = false;
        rows.map((item) => {
          if(!item.sessionDate){
            error = true;
            setErrorMsg('Please choose Session Date!');
            
          }
          if(!item.doctorName){
            error = true
            setErrorMsg('Please choose Doctor!');
      
          }
        });

        if(error){
          handleOpenMntryFieldErrorDialog(true);
          return;
        }
          setSessionGroup({...sessionGroupData, sessionList: rows});
          handleSessionGroupValues({...sessionGroupData, sessionList: rows}, false);
          reset();
           
      }

      const updateData = () => {
        setSessionGroup({...sessionGroupData, sessionList: rows});
        handleSessionGroupValues({...sessionGroupData, sessionList: rows}, true);
      };
       

      const reset = () => {
        setPreviousSessionNo(0);
        setSessionGroup(sessionGroupDefault);
        setRows([]);
        setCustomerName('');
      }

      const sessionReset = () => {
        setPreviousSessionNo(0);
        setSessionGroup({...sessionGroupData, noOfSession: 0});
        setRows([]);
      }

      const deleteRow = (index) => {
         let array = rows;
         array.splice(index, 1);
         setSessionGroup({...sessionGroupData, noOfSession: array.length});
         setPreviousSessionNo(array.length);
         setRows([...array]);
      }

      const fetchData = async () => {
        try {
          setCustomerName(sessionGroup.customerName); 
          setSessionGroup(sessionGroup);
          setRows(sessionGroup.sessionList);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      useEffect(() => {
       
          if(viewHistory){  
            fetchData(); 
            if(isAdmin) {
              setEdit(true)
            } else {
              setEdit(false);
            }
          } else {
            reset();
          }
      }, [viewHistory, sessionGroup]);

      useEffect(() => {
        const load = async () => {
          
          const admin = localStorage.getItem('isAdmin');
          if(String(admin).toLowerCase() === 'true'){
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
      };
  
      load();
      }, []);


      useEffect(() => {
         setEdit(isAdmin);
      }, [isAdmin]);

      const handleOpenErrorDialog = (value) => {
        setOpenErrorDialog(value);
      }

      const handleFirebaseImageUpload = (imageUrls) => {
        const uploadPromises = imageUrls.map((imageUrl) => {
          return new Promise((resolve, reject) => {
            const uploadTask = storage
              .ref(`/session/${imageUrl?.name}`)
              .put(imageUrl?.file);
  
            uploadTask.on(
              'state_changed',
              (snapShot) => {
                console.log(snapShot);
              },
              (err) => {
                console.log(err);
                reject(err);
              },
              () => {
                storage
                  .ref('session')
                  .child(imageUrl?.name)
                  .getDownloadURL()
                  .then((fireBaseUrl) => {
                    resolve(fireBaseUrl);
                  })
                  .catch((err) => {
                    console.log(err);
                    reject(err);
                  });
              }
            );
          });
        });
  
        Promise.all(uploadPromises)
          .then((fireBaseUrls) => {
            setRows(rows.map((row, index) => 
              index === selectedRow
                ? { 
                    ...row, 
                    sessionNotes: { 
                      ...row.sessionNotes, 
                      imageUrl: [...(row.sessionNotes.imageUrl || []), ...fireBaseUrls] 
                    } 
                  }
                : row
            ));
          })
          .catch((error) => {
            console.error("Error uploading images:", error);
          })
          .finally(() => {
            setLoading(false); // End loading
          });
      };

      const handleSelectedRow = (idx, event) => {
        event.stopPropagation(); // Stop event from bubbling up
        setSelectedRow(idx);
      };

      const checkDoctors = (list) => {
         let count = false;
         clinicHelper.getDoctors().map((item) => {
             if(item?.toLowerCase() == list?.type?.toLowerCase()) {
               count = true;
             }
         })

         return count;
      }
      
      
          
    return (
      <>
       <Backdrop open={loading} style={{ zIndex: 1301, color: '#fff' }}>
         <Loader type="bubble-top" bgColor={"#EF524F"} size={50} />
        </Backdrop>
      <Dialog
        open={sessionGroupDialogOpen}
        onClose={handleCloseSessionGroupDialog}
        fullScreen
      >
        <DialogTitle id="product-modal-title" style={{boxShadow: '0 0 0 1px rgb(35 35 37 / 5%), 0 1px 2px 0 rgb(42 42 48 / 36%)', fontSize: '18px', padding: '6px 24px'}}>
          {viewHistory ? (isAdmin ? 'Edit Session' : 'Sessions') : 'Add Session'}
          <IconButton
            aria-label="close"
            onClick={handleCloseSessionGroupDialog}
            className="closeButton"
            style={{top: '0px'}}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
      <div style={{marginBottom: '100px'}}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item md={2} sm={6} className={'grid-padding'}>
                <FormControl fullWidth className={classes.datecol}>
                  <Typography variant="subtitle1">Date</Typography>
                  <TextField
                    fullWidth
                    margin="dense"
                    type="date"
                    className="customTextField"
                    disabled={!isEdit}
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        root: classes.bootstrapRoot,
                        input: classes.bootstrapInput
                      }
                    }}
                    value={sessionGroupData?.date}
                    onChange={(event) => handleSessionGroup('date', event.target.value)}                  
                  />
                </FormControl>
              </Grid>
  
              <Grid item md={3} sm={6} className={'grid-padding'}>
                <FormControl fullWidth className={classes.datecol}>
                  <Typography variant="subtitle1">Patient Name</Typography>

                  <div>
                        <TextField
                          fullWidth
                          placeholder="Select Customer"
                          margin="dense"
                          className="customTextField"
                          value={customerName}
                          disabled={!isEdit || viewHistory}
                          onChange={(e) => {
                            getCustomerList(e.target.value);
                          }}
                          InputProps={{
                            disableUnderline: true,
                            classes: {
                              root: classes.bootstrapRoot,
                              input: classes.bootstrapInput
                            }
                          }}
                          InputLabelProps={{
                            shrink: true,
                            className: classes.bootstrapFormLabel
                          }}
                        />
                        {customerList && customerList.length > 0 ? (
                          <>
                            <ul
                              className={classes.listbox}
                              style={{ width: '80%' }}
                            >
                             {customerList.map((list) => (
                               <li key={list.name} className={classes.liBtn} onClick={() =>handleCustomerClick(list)}>
                                {list.name}
                                 </li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                       
                      </div>
                
                </FormControl>
              </Grid>
              <Grid item md={3} sm={6} className={classes.gridPadding}>
                <FormControl fullWidth className={classes.datecol}>
                  <Typography variant="subtitle1">Amount</Typography>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        type="number"
                        margin="dense"
                        className="customTextField"
                        disabled={!isEdit}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput,
                          },
                        }}
                        value={sessionGroupData?.amount}
                        onChange={(event) => handleSessionGroup('amount', event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            disabled={!isEdit}
                            checked={sessionGroupData?.perSession}
                            onChange={(event) => handleSessionGroup('perSession', event.target.checked)}
                            name="perSession"
                          />
                        }
                        label="per session"
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item md={3} sm={6} className={'grid-padding'}>
                <Grid container>
                  <Grid item md={8} sm={4}>
                    <FormControl fullWidth className={classes.datecol}>
                    <Typography variant="subtitle1">No of Session</Typography>

                          <TextField
                            placeholder="Enter Session"
                            margin="dense"
                            type="number"
                            disabled={!isEdit}
                            className="customTextField"
                            value={sessionGroupData.noOfSession}
                            onChange={(e) => {
                              handleSessionGroup('noOfSession', e.target.value);
                            }}
                            InputProps={{
                              disableUnderline: true,
                              classes: {
                                root: classes.bootstrapRoot,
                                input: classes.bootstrapInput
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                              className: classes.bootstrapFormLabel
                            }}
                          />
                                      
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={7}>
                  {isEdit && (
                      <Button 
                        color="secondary"
                        variant="outlined"
                        style={{marginTop: '40px'}}
                        onClick={handleOnClickAddSession}
                        disabled={!sessionGroupData.noOfSession}
                        >
                          + ADD
                      </Button> 
                    )}
                  </Grid>
                </Grid>
                
              </Grid>
              <Grid item md={1} sm={6} className={'grid-padding'}>
              {isEdit && (
                     <Button 
                        color="secondary"
                        variant="outlined"
                        style={{marginTop: '40px'}}
                        onClick={sessionReset}
                        disabled={rows.length === 0}
                        >
                          Reset
                      </Button> 
                 )}
              </Grid>
            </Grid>
            {rows.length > 0 && (
              <div style={{ margin: '14px'}}>
                <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      
                      <CustomTableCell>#</CustomTableCell>
                      <CustomTableCell>Date</CustomTableCell>
                      <CustomTableCell>Doctor</CustomTableCell>
                      <CustomTableCell>Start Time</CustomTableCell>
                      <CustomTableCell>End Time</CustomTableCell>
                  
                      <CustomTableCell>Status</CustomTableCell>
                      {isAdmin && (
                      <TableCell />
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {rows.map((row, idx) => (
                    <React.Fragment key={idx}>
                      <TableRow>
                        <CustomTableCell>{idx + 1}</CustomTableCell>
                        <CustomTableCell>
                          <TextField
                            type="date"
                            InputProps={{
                              disableUnderline: true,
                              classes: {
                                root: classes.bootstrapRoot,
                                input: classes.bootstrapInput
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                              className: classes.bootstrapFormLabel
                            }}
                            value={row.sessionDate}
                            disabled={!isEdit}
                            onChange={(e) => handleOnChange(e.target.value, idx, 'sessionDate')}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <FormControl>
                                  <TextField
                                    fullWidth
                                    placeholder="Select Doctor"
                                    margin="dense"
                                    className="customTextField"
                                    value={row.doctorName}
                                    disabled={!isEdit}
                                    onChange={(e) => {
                                      getEmployeeList(e.target.value);
                                      handleEmployeeList(e.target.value, idx);
                                      setIndex(idx);
                                    }}
                                    InputProps={{
                                      disableUnderline: true,
                                      classes: {
                                        root: classes.bootstrapRoot,
                                        input: classes.bootstrapInput
                                      }
                                    }}
                                    InputLabelProps={{
                                      shrink: true,
                                      className: classes.bootstrapFormLabel
                                    }}
                                  />
                                  {employeeList && employeeList.length > 0 && currentIndex === idx ? (
                                    <>
                                      <ul
                                        className={classes.listbox}
                                        style={{ width: '80%' }}
                                      >
                                      {employeeList?.map((list) => (
                                        <>
                                        {checkDoctors(list) && (
                                          <li className={classes.liBtn} onClick={() =>handleEmployeeList(list, idx)}>
                                          {list.name}
                                          </li>
                                        )}                                        
                                        </>                                       
                                        ))}
                                      </ul>
                                    </>
                                  ) : null}
                                
                          </FormControl>
                        </CustomTableCell>
                        <CustomTableCell>
                          <TextField
                            type="time"
                            value={row.sessionStartTime}
                            onChange={(e) => handleOnChange(e.target.value, idx, 'sessionStartTime')}
                            style={{width:'130px'}}
                            disabled={!isEdit}
                            InputProps={{
                              disableUnderline: true,
                              classes: {
                                root: classes.bootstrapRoot,
                                input: classes.bootstrapInput
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                              className: classes.bootstrapFormLabel
                            }}
                            inputProps={{
                              step: 300, // 5 minute steps
                            }}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <TextField
                            type="time"
                            value={row.sessionEndTime}
                            onChange={(e) =>handleOnChange(e.target.value, idx, 'sessionEndTime')}
                            style={{width:'130px'}}
                            disabled={!isEdit}
                            InputProps={{
                              disableUnderline: true,
                              classes: {
                                root: classes.bootstrapRoot,
                                input: classes.bootstrapInput
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                              className: classes.bootstrapFormLabel
                            }}     
                            inputProps={{
                              step: 300, // 5 minute steps
                              min:  row?.sessionStartTime, // Minimum value for end time is the selected start time
                            }}                     
                          />
                        </CustomTableCell>
                      
                        <CustomTableCell>
                          <FormControl>
                            <Select
                              value={row.status}
                              onChange={(e) => handleOnChange(e.target.value, idx, 'status')}
                              variant="outlined"
                              disabled={!isEdit}
                              style={{
                              minWidth: '116px'
                              }}
                            >
                              <MenuItem value="completed" disabled={getSessionDateTime(row) > currentDateTime}>Completed</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                              <MenuItem value="rescheduled">Rescheduled</MenuItem>
                            </Select>
                          </FormControl>
                        </CustomTableCell>
                        {isAdmin && (
                          <CustomTableCell>
                          <Button>
                                <DeleteOutlined
                                  color="secondary"
                                  onClick={() => deleteRow(idx)}
                                  style={{ fontSize: 'x-large' }}
                                />
                          </Button>
                          </CustomTableCell>
                        )}
                        
                      </TableRow>
                      <TableRow>
                        <CustomTableCell colSpan={isAdmin ? 7 : 6}>
                          <Typography style={{fontSize: '12px', fontWeight: 'bold', marginTop: '-5px', marginBottom: '-5px'}}>Notes</Typography>
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                          {row?.sessionNotes?.imageUrl?.map((imageUrl, index) => (
                              <div alt={`Uploaded ${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
                              <div
                                className={classes.primaryImageWrapper}
                                style={{ marginRight: '0px' }}
                              >
                                <img
                                  src={imageUrl}
                                  width="60"
                                  height="60"
                                />
                              </div>
                              {isEdit && (
                                <div style={{ height: '20px', width: '40px' }}>
                                <IconButton style={{ padding: '0px' }}>
                                  <CloseIcon
                                    style={{ widht: '15px', height: '15px' }}
                                    onClick={() => {
                                      handleRemoveImage(idx, index, imageUrl);
                                    }}
                                  />
                                </IconButton>
                                </div>
                              )}
                             
                              </div>
                              ))}
                               {isEdit && (
                              <Box
                                component="span"
                                className={classes.primaryImageButtonWrapper}
                                onClick={(e) => handleSelectedRow(idx, e)}
                              >
                                <label
                                  htmlFor={`product-primary-upload-${idx}`} // Use a unique ID for each row
                                  className="uploadImageButton primaryImage"
                                  style={{ position: 'static' }}
                                >
                                  <i className="fa fa-upload fa-1 " aria-hidden="true" />
                                  <span>Upload</span>
                                </label>
                                <input
                                  type="file"
                                  onChange={(e) => handleImageUpload(e)}
                                  id={`product-primary-upload-${idx}`}
                                  style={{ display: 'none' }}
                                  multiple
                                  accept="image/*"
                                />
                              </Box>
                                )}
                             
                            </div>
                      
                            <TruncatedTextField value={row.sessionNotes.message} maxWords={45} isEdit={isEdit} handleOnChange={(e) => handleSessionNotesOnChange(e.target.value, idx)} />
                        </CustomTableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                    
                  </TableBody>
                </Table>
              </TableContainer>
              {isEdit && (
                <Button
                  color="secondary"
                  variant="outlined"
                  style={{ marginTop: '10px'}}
                  onClick={() => {
                    handleAddNewSession();
                  }}
                >
                + Add New 
                </Button>
              )}
              
              </div>
            )}
      </div>
      </DialogContent>
      <DialogActions style={{boxShadow: '0 0 0 1px rgb(35 35 37 / 28%), 0 1px 2px 0 rgb(42 42 48 / 0%)', padding: '0px'}}>
            {(isEdit && !viewHistory )&& (
                  <Button
                    color="secondary"
                    variant="outlined"
                    disabled={customerName && rows.length && sessionGroupData?.amount && sessionGroupData?.date ? false : true}
                    onClick={() => {
                      saveDataOnClick();
                    }}
                    style={{ margin: '15px', float: 'inline-end' }}
                  >
                    Save
                  </Button>
            )}
        {(isEdit && viewHistory )&& (
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      updateData();
                    }}
                    style={{ margin: '15px', float: 'inline-end' }}
                  >
                    Update
                  </Button>
            )}
        </DialogActions>
       
      </Dialog> 
      <Dialog
        open={openErrorDialog}
        onClose={() => handleOpenErrorDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Typography variant='h6'>{errorMsg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpenErrorDialog(false)} color="primary" >
            Cancel
          </Button>
          <Button onClick={() => handleRemoveSession()} color="primary" >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openMntryFieldErrorDialog}
        onClose={() => handleOpenMntryFieldErrorDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Typography variant='h6'>{errorMsg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpenMntryFieldErrorDialog(false)} color="primary" >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      </>    
    );
}

export default AddSessionGroup;