import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { Add } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StackIt
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to StackIt
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            A minimal question-and-answer platform for collaborative learning
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Counter Demo
            </Typography>
            <Box textAlign="center" my={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCount((count) => count + 1)}
                size="large"
              >
                Count is {count}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Click the button to increment the counter
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Getting Started
            </Typography>
            <Typography variant="body1">
              This is a React app built with Create React App and Material UI.
              Edit <code>src/App.js</code> and save to see changes.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
