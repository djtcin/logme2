import './App.css';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import MUIWrapper from './components/MUI/MUIWrapper';
import Header from './components/Header';
import MainPage from './components/MainPage';

function App() {
  return (
    <MUIWrapper>
      <Box sx={{ flexGrow: 1 }}>
        <Header/>
        <Container maxWidth="lg" sx={{ padding: "20px 0px"}}>
          <MainPage/>
        </Container>    
      </Box>
    </MUIWrapper>
  );
}

export default App;
