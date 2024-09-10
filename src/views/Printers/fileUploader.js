import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@material-ui/core';
class InputFileReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: '',
            value: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.inputFileChanged = this.inputFileChanged.bind(this);
    };
    handleClick() {
        let input = this.refs.input_reader;
        input.click();
    };
    inputFileChanged(e) {
        if (window.FileReader) {
            let file = e.target.files[0], reader = new FileReader(), self = this;
            reader.onload = function (r) {
                self.setState({
                    src: r.target.result
                });
                self.props.onFilesChange(r.target.result);
            }
            reader.readAsDataURL(file);
            self.setState({ value: reader });
        }
        else {
            alert('Soryy, your browser does\'nt support for preview');
        }
    }
    render() {
        const { accept, capture, multiple } = this.props, { src, value } = this.state;
        return (
            <div style={{ display: 'inline-block' }}>
                {/* <img src={src} height={80} width={80} /> */}
                <Link href="#" variant="body2" style={{ fontFamily: 'Nunito Sans, Roboto, sans-serif', color: '#ef5350', marginRight: '30px' }} onClick={this.handleClick}>Upload</Link>
                <input type="file" ref="input_reader" accept={Array.isArray(accept) ? accept.join(',') : accept} multiple={multiple} capture={capture} style={{ display: 'none' }} onChange={this.inputFileChanged} />
            </div>
        );
    }
}
InputFileReader.defaultProps = {
    accept: 'image/*',
    capture: true,
    multiple: false
}
InputFileReader.propTypes = {
    accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    capture: PropTypes.bool,
    multiple: PropTypes.bool
}
export default InputFileReader;