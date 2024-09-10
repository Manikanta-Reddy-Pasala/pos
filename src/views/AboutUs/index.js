import React from 'react';
import about_us from '../../../raw_html/oneshell_about_us.html';

var __html = require(about_us);
var template = { __html: __html };

const MyComponent = React.createClass({
  render: function () {
    return <div dangerouslySetInnerHTML={template} />;
  }
});

export default MyComponent;
