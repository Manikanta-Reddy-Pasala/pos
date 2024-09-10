import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import Loader from 'react-js-loader';
import InnerHTML from 'dangerously-set-html-content';

const useStyles = makeStyles((theme) => ({
  cancelBtn: {
    float: 'right',
    marginRight: '2%'
  },
  btn: {
    '&:hover': {
      color: '#EF5350'
    }
  },
  mainWrapper: {
    minWidth: '100vh',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

function FAQ() {
  const classes = useStyles();
  const [isLoading, setLoadingShown] = React.useState(true);

  const store = useStore();

  const content = `
  
    `;

  const html = `
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    .collapsible {
      background-color:#f6f8fa;
      color: black;
      cursor: pointer;
      padding: 18px;
      width: 80%;
      border: none;
      text-align: left;
      outline: none;
      font-size: 15px;
      font-weight: bold;
      margin-left: 150px;
    }
    
    .active, .collapsible:hover {
      background-color:#cee6f3;
    }
    
    .collapsible:after {
       content: ' \\002B';
      color: grey;
      font-weight: bold;
      float: right;
      margin-left: 5px;
    }
    
    .active:after {
       content: "\\2212";
    }
    
    .content {
      padding: 0 18px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.2s ease-out;
      background-color: #ffffff;
      width: 80%;
      margin-left: 150px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    </style>
    </head>
    <body>
    
    <h2 style="text-align: center; margin: 20px;">Frequently Asked Questions
    </h2>
    <button class="collapsible">Is OneShell POS FREE?</button>
<div class="content">
  <p>Yes, you get OneShell POS FREE! for first 30 Days with all premium features and reports</p>
</div>
<button class="collapsible">How to create Login for OneShell POS?</button>
<div class="content">
  <p><ol>
    <li>Download OneShell Partner App from Play Store </li>
    <li>Register your Business by choosing POS plan</li> 
<li>Create your POS Login Credentials on OneShell App using POS Feature in Home Page</li></ol>
</p>
</div>
<button class="collapsible">Why my printer is not listed in the print settings?</button>
<div class="content">
  <p>Ensure your printer is connected with your PC and restart the App</p>
</div>
<button class="collapsible">Why print option is not seen on invoice?</button>
<div class="content">
  <p>Ensure your printer is connected with your PC and restart the App</p>
</div>
<button class="collapsible">How can I manage user Permissions?</button>
<div class="content">
  <p>You can enable user-role permission on OneShell Partner App from POS Feature in Hone Page.
</p>
</div>
<button class="collapsible">How to add tables for KOT (Restaurant POS)?</button>
<div class="content">
  <p>You can Add Tables from OneShell Partner App using Table Management Feature. Its available under View More options</p>
</div>
<button class="collapsible">How to add Waiters?</button>
<div class="content">
  <p>You can Add Waiters from OneShell Partner App on Employees Feature. Its available under View More option</p>
</div>
<button class="collapsible">How to update OneShell POS to its latest version?</button>
<div class="content">
  <p>We show you a notification to update your app on new version release, you can always check your version from what's new option on side bar</p>
</div>
<button class="collapsible">I am a Wholesaler, can I use OneShell POS?</button>
<div class="content">
  <p>Yes, OneShell POS can be used for any business</p>
</div>
<button class="collapsible">My Question is not listed above?</button>
<div class="content">
  <p>Please mail us on contactus@oneshell.in</p>
</div>
    <script>
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
    </script>
    
    </body>
    </html>
    

  `;
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setLoadingShown(false);
    }, 1000);
  }, []);

  return (
    <div>
      {isLoading && (
        <div className={classes.mainWrapper}>
          <div className={classes.paper}>
            <Loader
              type="bubble-top"
              bgColor={'#EF524F'}
              color={'#EF524F'}
              title={'Please Wait'}
              size={60}
            />
          </div>
        </div>
      )}
      {!isLoading && (
        <div>
          <div className={classes.cancelBtn}>
            <IconButton onClick={() => navigate(-1)} className={classes.btn}>
              <Cancel fontSize="inherit" />
            </IconButton>
          </div>
          <div>
            <InnerHTML html={html} />
          </div>
        </div>
      )}
    </div>
  );
}

export default InjectObserver(FAQ);
