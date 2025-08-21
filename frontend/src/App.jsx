import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import store from './store';
import './App.css';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className="App">
            <h1>Admin Dashboard</h1>
            <p>🚀 Infrastructure setup complete!</p>
            <p>📊 Ready for PHASE 2: Layout & Navigation</p>
            <div>
              <h3>✅ Completed:</h3>
              <ul>
                <li>Redux Store với 4 slices</li>
                <li>API Services cho Users, Departments, Roles, Dashboard</li>
                <li>Material-UI Theme setup</li>
                <li>Folder structure hoàn chỉnh</li>
                <li>Utility functions</li>
              </ul>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
