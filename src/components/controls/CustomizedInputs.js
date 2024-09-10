import React from "react";
import PropTypes from "prop-types";
import {
  withStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import purple from "@material-ui/core/colors/purple";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  cssLabel: {
    "&$cssFocused": {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    "&:after": {
      borderBottomColor: purple[500]
    }
  },
  bootstrapRoot: {
    padding: 5,
    width: "100px",
    "label + &": {
      marginTop: theme.spacing.unit * 3
    }
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "2px 12px",
    width: "calc(100% - 24px)",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "Nunito Sans, Roboto, sans-serif"
    ].join(","),
    "&:focus": {
      // borderColor: "#80bdff",
      // boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  },
  bootstrapFormLabel: {
    fontSize: 18
  }
});

function CustomizedInputs(props) {
  const { classes } = props;
     const { id, text, color, defaultValue, width, ...other } = props

  return (
    <TextField
      id={id}
      placeholder={text||''}
      defaultValue={defaultValue||''}
      InputProps={{
        style:{width:width||''},
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
                  {...other}

    />
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedInputs);
