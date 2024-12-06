import { useState, useEffect } from 'react';
import imageUrl from '/icon/title-logo.png';
import './App.css';
import theme from '../../components/theme/theme.ts'
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ReportIcon from '@mui/icons-material/Report';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import JargonCard from '@/components/ui/JargonCard';

function App() {
  const instructionalEntry: Keyword = {
    keyword: 'get started',
    type: 'instructions',
    meaning: 'select a complex block of text and right-click to simplify!',
  };
  const keywordStoreKey = 'keywordHistory';
  const [keywordHistory, setKeywordHistory] = useState([instructionalEntry]);

  // Fetch keywordHistory from local storage on component mount
  useEffect(() => {
    const fetchKeywordHistory = async () => {
      try {
        const keywordHistory: string | null = await storage.getItem(`local:${keywordStoreKey}`);
        const keywordHistoryArray: Keyword[] | null = JSON.parse(keywordHistory || '[]');
        const storedHistory = keywordHistoryArray || [];
        setKeywordHistory([instructionalEntry, ...storedHistory]);
      } catch (error) {
        console.error('Error fetching keyword history:', error);
      }
    };

    fetchKeywordHistory();
  }, []);

  const clearKeywordHistory = async () => {
    try {
      await storage.setItem(`local:${keywordStoreKey}`, JSON.stringify([]));
      setKeywordHistory([instructionalEntry]);
    } catch (error) {
      console.error('Error clearing keyword history:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container id="root">
        <header id="header">
          <img draggable="false" src={imageUrl} alt="JarGone logo" className="logo" />
          <span className="icon">
            <IconButton href="mailto:overingowl+jargone+support@gmail.com" aria-label="report bug">
              <ReportIcon />
            </IconButton>
            <IconButton onClick={clearKeywordHistory} aria-label="delete keyword history">
              <DeleteIcon />
            </IconButton>
          </span>
        </header>

        <Grid container>
          <Box sx={{ height: '75px' }}>.</Box>

          <Grid size={12} className="content">
            {keywordHistory.length === 0 ? (
              <JargonCard keyword={instructionalEntry.keyword} type={instructionalEntry.type} meaning={instructionalEntry.meaning} />
            ) : (
              [...keywordHistory].reverse().map((entry, index) => (
                <JargonCard key={index} keyword={entry.keyword} type={entry.type} meaning={entry.meaning} />
              ))
            )}
          </Grid>

          <Box sx={{ height: '75px' }}>.</Box>
        </Grid>

        <Box id="bottom-nav">
          <BottomNavigation
            showLabels
            value={0}
          >
            <BottomNavigationAction icon={<HomeIcon />} />
            <BottomNavigationAction icon={<SettingsIcon />} onClick={() => browser.runtime.openOptionsPage()} />
          </BottomNavigation>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
