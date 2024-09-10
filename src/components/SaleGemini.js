import React, { useState, useEffect, useRef } from 'react';
import { View } from '@react-pdf/renderer';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { getAuditData } from 'src/components/Helpers/apiQueries/audit';
import { Send } from '@material-ui/icons';
import BubbleModalLoader from './BubbleModalLoader';
import { auditSchema } from './Helpers/AuditSchemaHelper'

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
  },
  userMessageStyle: {
    alignSelf: 'flex-end', // Float user messages to the right
    backgroundColor: '#e0f7fa', // Optional: Add a background color
    margin: '5px 0',
    padding: '10px',
    borderRadius: '5px',
  },
  botMessageStyle: {
    alignSelf: 'flex-start', // Float bot messages to the left
    backgroundColor: '#fff', // Optional: Add a background color
    margin: '5px 0',
    padding: '10px',
    borderRadius: '5px',
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
    borderRadius: '4px',
  },
  dialogPaper: {
    maxWidth: '70%',
    minHeight: '500px'
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4">{children}</Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function SaleGemini({
  open,
  onClose,
  item
}) {
  const chatHistoryRef = useRef(null);
  const classes = useStyles();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "AIzaSyAcoFXyn-OO4teO9zImfpfYfYfzjN6FIBs";
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

    const auditData = await getAuditData(item.invoice_number, 'Sale');
    let question = "I need to analyze the following invoice data based on the given JSON schema. I have provided list of invoice data objects which includes changes. The data includes various fields related to customer details, invoice specifics, itemized billing, payment information, and logistical details. The AI model should validate, process, and extract insights from the data, such as identifying inconsistencies, calculating totals, or summarizing key information. Please summarize the changes between the list of invoice data objects";
    handleSubmit(question + auditSchema() + JSON.stringify(auditData));
  };

  const handleSubmit = async (question) => {
    setIsLoading(true);
    setError(null);
    let req = {};

    let initial = [
      {
        role: 'user',
        parts: [
          {
            text: question,
          },
        ],
      },
    ];

    if (chatHistory.length > 0) {
      req = chatHistory;
      const newObject = {
        role: 'user',
        parts: [
          {
            text: question,
          },
        ],
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
          responseMimeType: 'text/plain',
        }
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      try {
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

  return (
    <div>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth="true"
        maxWidth={'lg'}
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
          Analysing Audit History For Inv-{item.sequenceNumber}
        </DialogTitle>
        <DialogContent dividers>
          <View>
            <div>
              {error && <div className="error">Error: {error}</div>}
              <div className={classes.chatHistoryStyle}>
                {chatHistory.map((message, index) => {
                  let parts = message.parts[0].text
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                  return (
                    <div key={index} className={message.role === 'user' ? classes.userMessageStyle : classes.botMessageStyle}>
                      {index === 0 && message.role === 'user' ? (
                        <></>
                      ) : (
                        <>
                          <span dangerouslySetInnerHTML={{ __html: parts }}></span>
                        </>
                      )}
                    </div>);
                })}
              </div>
              {isLoading && <BubbleModalLoader ref={chatHistoryRef}></BubbleModalLoader>}
            </div>
          </View>
        </DialogContent>
        <DialogActions>
          <form style={{ display: 'flex', alignItems: 'center', width: '100%' }} onSubmit={(e) => {
            e.preventDefault();
            const question = e.target.question.value;
            handleSubmit(question);
            e.target.question.value = '';
          }}>
            <textarea style={{ height: '80px' }} className={classes.inputStyle} type="text" name="question" placeholder="Type your message"></textarea>
            <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <Send style={{ marginLeft: '-27px' }} />
            </button>
          </form>
        </DialogActions>
      </Dialog>
    </div>
  );
}
