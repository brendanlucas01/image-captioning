// import './App.css';
import ButtonArea from './components/ButtonArea';
import Navbar from './components/Navbar'
import Container from '@mui/material/Container';
import StandardImageList from './components/StandardImageList';
import BasicDropzone from './components/BasicDropzone';
function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Navbar></Navbar>
      <br></br><br></br>
      <Container maxWidth="sm">
        {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
      {/* <ButtonArea></ButtonArea> */}
      <br></br>
      {/* <StandardImageList></StandardImageList> */}
      <BasicDropzone></BasicDropzone>
      <br></br><br></br>
      </Container>
    </div>
  );
}

export default App;
