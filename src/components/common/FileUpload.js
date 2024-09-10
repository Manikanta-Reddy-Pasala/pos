import React, { useRef, useState, useEffect } from "react";
import { makeStyles, Box, CircularProgress, IconButton, Typography } from "@material-ui/core";
import { Close as CloseIcon } from '@material-ui/icons';
import * as fbUpload from 'src/components/Helpers/ShareDocHelper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  documentUploadButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& #product-doc-upload': {
      display: 'none'
    },
    '& .docUploadButton': {
      color: '#fff',
      backgroundColor: '#4a83fb',
      padding: '7px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 500,
      lineHeight: 1.75,
      borderRadius: '4px',
      marginRight: theme.spacing(2),
      cursor: 'pointer',
      '&.primaryDocImage': {
        margin: '5px',
        position: 'relative'
      },
      '& i': {
        marginRight: '8px'
      }
    }
  },
  fntClr: {
    color: '#616161'
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: theme.spacing(2)
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  filesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '10px',
    alignItems: 'center'
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px'
  },
  previewImage: {
    width: '50px',
    height: '50px',
    marginRight: '5px',
    objectFit: 'cover',
    cursor: 'pointer'
  },
  fileName: {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}));

const getFileType = (url) => {
  const extension = url?.split('.')?.pop()?.split('?')[0]?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return `image/${extension}`;
  } else if (extension === 'pdf') {
    return 'application/pdf';
  }
  return 'application/octet-stream';
};

const getFileName = (url) => {
  const decodedUrl = decodeURIComponent(url.split('/').pop().split('?')[0]);
  return decodedUrl.replace(/^PDF\//, '');
};

export const FileUpload = ({ onFilesUpload, uploadedFiles, fileNameDisplay = true }) => {
  const classes = useStyles();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (Array.isArray(uploadedFiles) && uploadedFiles.length > 0 && (uploadedFiles.length > files.length)) {
      const initialFiles = uploadedFiles.map(url => ({
        name: getFileName(url),
        url,
        type: getFileType(url)
      }));
      const urls = uploadedFiles.map(url => (url));
      setFiles(prevFiles => [...prevFiles, ...initialFiles]);
      onFilesUpload(urls);
    }
  }, [uploadedFiles]);

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.type;
      const fileSize = file.size / 1024 / 1024; // size in MB
      if (fileSize > 3) {
        toast.error(`${file.name} exceeds the 3MB limit.`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: true
        });
        return false;
      }
      return fileType === 'application/pdf' || fileType.startsWith('image/');
    });

    if (validFiles.length + files.length > 3) {
      toast.error('You can only upload up to 3 files.', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: true
      });
      return;
    }

    setLoading(true);

    try {
      const uploadedFilesUrl = [];
      for (const file of validFiles) {
        const fileUrl = await fbUpload.uploadToFirebase(file, file.name, (progress) => {
          setUploadProgress(progress);
        });
        uploadedFilesUrl.push(fileUrl);
        setFiles(prevFiles => [...prevFiles, { name: getFileName(fileUrl), url: fileUrl, type: file.type }]);
      }
      const newFilesArray = Array.isArray(uploadedFiles) ? [...uploadedFiles, ...uploadedFilesUrl] : uploadedFilesUrl;
      onFilesUpload(newFilesArray);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const fileUrls = updatedFiles.map(file => file.url);
    setFiles(updatedFiles);
    onFilesUpload(fileUrls);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (file) => {
    const url = file.url;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobURL);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box component="span" className={classes.documentUploadButtonWrapper}>
        <label
          htmlFor="product-doc-upload"
          className="docUploadButton primaryDocImage"
        >
          <i className="fa fa-upload fa-1 " aria-hidden="true" />
          <span>Upload Document</span>
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          id="product-doc-upload"
          ref={fileInputRef}
          multiple
        />
      </Box>
      {loading && (
        <Box className={classes.progressContainer}>
          <CircularProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" className={classes.progressText}>
            {uploadProgress}%
          </Typography>
        </Box>
      )}
      <div className={classes.filesContainer}>
        {files.map((file, index) => (
          <div key={index} className={classes.fileItem}>
            {file.type.startsWith('image/') ? (
              <img
                src={file.url}
                className={classes.previewImage}
                alt={file.name}
                onClick={() => handleDownload(file)}
              />
            ) : (
              <img
                src={'/static/images/pdflogo.svg'}
                width="25"
                height="25"
                style={{ marginRight: '5px', cursor: 'pointer' }}
                alt="file"
                onClick={() => handleDownload(file)}
              />
            )}
            {fileNameDisplay && (
                <label
                className={`${classes.fntClr} ${classes.fileName}`}
                onClick={() => handleDownload(file)}
                >
                <p>{file.name}</p>
                </label>
            )}
           
            <IconButton
              style={{ padding: '0px', marginLeft: '10px' }}
              onClick={() => handleClearFile(index)}
            >
              <CloseIcon style={{ width: '20px', height: '20px' }} />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};
