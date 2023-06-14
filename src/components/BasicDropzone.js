// import React from 'react';
// import Container from 'react-bootstrap/esm/Container';
// import {useDropzone} from 'react-dropzone';

// function BasicDropzone(props) {
//     const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
//         // Disable click and keydown behavior
//         noClick: true,
//         noKeyboard: true
//       });

//       const files = acceptedFiles.map(file => (
//         <li key={file.path}>
//           {file.path} - {file.size} bytes
//         </li>
//       ));
    
//       return (
//         <Container>
//         <div className="container" style={styles.dropzone}>
//           <div {...getRootProps({className: 'dropzone'})}>
//             <input {...getInputProps()} />
//             <br/>
//             <p>Drag 'n' drop some files here</p>
//             <br/>
//             <button type="button" onClick={open}>
//               Open File Dialog
//             </button>
//             <br/><br/>
//           </div>
//           <aside>
//             <br/><br/>
//             <h4>Files</h4>
//             <ul>{files}</ul>
//           </aside>
//         </div>
//         </Container>
//       );
// }

import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import {useDropzone} from 'react-dropzone';
import axios from "axios";
import styles from './comp_styles.css';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// import {styless} from 'styles.css';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: "65%",
  height: "65%",
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: '100%',
  height: '100%'
};

const buttonBrendan = {
  color: "white",
  backgroundColor: "#1976d2",
  borderRadius: "20px",
  border: "1px solid #fff",
  padding: "10px",
  cursor:"pointer"
}


function BasicDropzone(props) {
  const [files, setFiles] = useState([]);
  const [opens, setOpen] = React.useState(false);
  const [caption,setCaption] = useState("Image Caption");
  const [textArea,setTextArea] = useState(<div></div>)
  const {getRootProps, getInputProps,open, acceptedFiles} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    noClick: true,
    noKeyboard: true
  });



  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    if(files.length==0)
    {
      setOpen(true)
      return
    }
    for(var x = 0; x<files.length; x++) {
        data.append('file', files[x])
    }
    setTextArea(<LinearProgress />)
    // setTextArea(<Skeleton variant="rounded" height={150} />)
    console.log(files)
    console.log(data)
    axios.post("http://localhost:8001/im_size", data)
    .then(res => { 
        console.log(res)
        // setCaption(res.data["caption"])
        setTextArea(
          <TextField
          id="filled-multiline-static"
          // label="Caption"
          multiline
          rows={4}
          // defaultValue={"Image Caption"}
          value={res.data["caption"]}
          variant="filled"
          style={{width: "100%", borderRadius: "5px", border: "blue 2px solid"}}
        />
        )
      })
}

  const thumbs = files.map(file => (
    <div className={styles.cont} key={file.name}>
    <div style={thumb} >
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
    <br/>
    {file.name} - {file.size/1000}KB
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Container style={{"textAlign":'center'}}>
    <section className="container" style={styles.dropzone}>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <br/>
        <p>Drag 'n' drop some files here, or click to select files</p>
        <br/>
            <button type="button" style={buttonBrendan} onClick={open}>
              Open File Dialog
            </button>
            <br/><br/>
      </div>
      {/* <aside style={thumbsContainer}>
        
      </aside> */}
      <br></br>
      {thumbs}
    </section>
    
    <br></br>
    <button 
    className="btn btn-primary mt-3"
    style={{...buttonBrendan,paddingLeft: '25px',paddingRight: '25px',fontSize: '14px'}} 
    onClick={handleSubmit}
    >Caption Image</button>
<br></br><br></br>

    {textArea}
{/*  */}
<Snackbar open={opens} autoHideDuration={6000} onClose={handleClose}>
        {/* <Alert onClose={handleClose} severity="Alert" sx={{ width: '100%' }}>
          Select Image to Upload
        </Alert> */}
        <Alert severity="error" onClose={handleClose}>
        <AlertTitle>Error</AlertTitle>
        Image Not Selected — <strong>Click Open File Dialog</strong>
      </Alert>
      </Snackbar>
    </Container>
  );
}

export default BasicDropzone;