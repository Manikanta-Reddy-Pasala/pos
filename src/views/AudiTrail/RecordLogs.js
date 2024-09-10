import React, { useState, useEffect, useRef } from 'react';
import { View } from '@react-pdf/renderer';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { getAuditData } from 'src/components/Helpers/apiQueries/audit';
import { Send } from '@material-ui/icons';
import BubbleModalLoader from 'src/components/BubbleModalLoader';
import {
  auditSchema,
  kotAuditSchema
} from 'src/components/Helpers/AuditSchemaHelper';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import BubbleLoader from '../../components/loader';
import {
  Button,
  Dialog,
  Grid,
  makeStyles,
  Typography,
  Tab,
  Tabs,
  Paper,
  Card,
  Toolbar,
  IconButton
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  buttonProgress: {
    color: '#ff7961',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

const useStyles = makeStyles((theme) => ({
  chatHistoryStyle: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(',')
  },
  userMessageStyle: {
    alignSelf: 'flex-end', // Float user messages to the right
    backgroundColor: '#e0f7fa', // Optional: Add a background color
    margin: '5px 0',
    padding: '10px',
    borderRadius: '5px'
  },
  botMessageStyle: {
    alignSelf: 'flex-start', // Float bot messages to the left
    backgroundColor: '#fff', // Optional: Add a background color
    margin: '5px 0',
    padding: '10px',
    borderRadius: '5px'
  },
  inputStyle: {
    width: '100%',
    height: '34px',
    padding: '6px 12px',
    fontSize: '14px',
    lineHeight: 1.42857143,
    color: '#555',
    backgroundColor: '#f0f4f9',
    backgroundImage: 'none',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  dialogPaper: {
    maxWidth: '70%',
    minHeight: '500px'
  },
  stickyBotom: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '999',
    padding: '0 10px 0 10px',
    backgroundColor: '#F6F8FA'
  }
}));

export default function RecordLogs(props) {
  const chatHistoryRef = useRef(null);
  const classes = useStyles();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = 'AIzaSyAcoFXyn-OO4teO9zImfpfYfYfzjN6FIBs';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  useEffect(() => {
    analyseHistory();
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.focus();
    }
  }, [chatHistory]);

  const analyseHistory = async () => {
    setIsLoading(true);
    const auditData = await getAuditData(props.invoiceNumber, props.auditType);
    const schema =
      props.auditType && props.auditType === 'Kot'
        ? kotAuditSchema()
        : auditSchema();
    let question =
      'I need to analyze the following invoice data based on the given JSON schema. I have provided list of invoice data objects which includes changes. The data includes various fields related to customer details, invoice specifics, itemized billing, payment information, and logistical details. The AI model should validate, process, and extract insights from the data, such as identifying inconsistencies, calculating totals, or summarizing key information. Please summarize the changes between the list of invoice data objects. Please dont infer changes with object terminology';
    handleSubmit(question + schema + JSON.stringify(auditData));
  };

  const handleSubmit = async (question) => {
    setError(null);
    let req = {};

    let initial = [
      {
        role: 'user',
        parts: [
          {
            text: question
          }
        ]
      }
    ];

    if (chatHistory.length > 0) {
      req = chatHistory;
      const newObject = {
        role: 'user',
        parts: [
          {
            text: question
          }
        ]
      };
      req = [...req, newObject];
    } else {
      req = initial;
    }
    try {
      const data = {
        contents: req,
        generationConfig: {
          temperature: 1,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: 'text/plain'
        }
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      try {
        setIsLoading(true);

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Error occurred');
        }
        const result = await response.json();
        const resultText = result.candidates[0].content.parts[0].text;
        // const jsonContent = resultText.replace('```json', '').replace('```', '');
        // const json = JSON.parse(jsonContent);
        setChatHistory([
          ...chatHistory,
          { role: 'user', parts: [{ text: question }] },
          { role: 'model', parts: [{ text: resultText }] }
        ]);
        // setResponse(json);
      } catch (error) {
        console.error('Error:', error);
        // setResponse(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(isLoading);

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: '#f6f8fa',
          fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(',')
        }
      }}
      fullScreen
      open={props.openDetail}
      onClose={props.closeDialog}
    >
      <AppBar elevation={1} className={classes.appBar}>
        <Toolbar variant="dense">
          <Grid container>
            <Grid
              style={{ display: 'flex', alignItems: 'center' }}
              item
              xs={11}
            >
              <Box fontWeight={600} fontSize={'1.25rem'}>
                Audit History for {props.sequenceNumber}
              </Box>
            </Grid>
            <Grid item xs={1} style={{ textAlign: 'end' }}>
              <IconButton onClick={props.closeDialog}>
                <Cancel fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {isLoading && <BubbleLoader />}

      <div>
        <View style={{ margin: '10px' }}>
          <div>
            {error && <div className="error">Error: {error}</div>}
            <div className={classes.chatHistoryStyle}>
              {chatHistory.map((message, index) => {
                let parts = message.parts[0].text
                  .replace(/\n/g, '<br />')
                  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                return (
                  <div
                    key={index}
                    className={
                      message.role === 'user'
                        ? classes.userMessageStyle
                        : classes.botMessageStyle
                    }
                  >
                    {index === 0 && message.role === 'user' ? (
                      <></>
                    ) : (
                      <>
                        <span
                          dangerouslySetInnerHTML={{ __html: parts }}
                        ></span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {/* {isLoading && (
              <BubbleModalLoader ref={chatHistoryRef}></BubbleModalLoader>
            )} */}
          </div>
        </View>
        {/* <div className={classes.stickyBotom}>
              <form
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const question = e.target.question.value;
                  handleSubmit(question);
                  e.target.question.value = '';
                }}
              >
                <textarea
                  style={{ height: '80px' }}
                  className={classes.inputStyle}
                  type="text"
                  name="question"
                  placeholder="Type your message"
                ></textarea>
                <button
                  type="submit"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <Send style={{ marginLeft: '-27px' }} />
                </button>
              </form>
            </div> */}
      </div>
    </Dialog>
  );
}
