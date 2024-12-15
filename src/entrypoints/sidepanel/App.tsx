import { useState, useEffect } from 'react';
import imageUrl from '/icon/title-logo.png';
import './App.css';
import theme from '../../components/theme/theme'
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ReportIcon from '@/components/ui/ReportIcon';
import DeleteIcon from '@/components/ui/DeleteIcon';
import HomeIcon from '@/components/ui/HomeIcon';
import SettingsIcon from '@/components/ui/SettingsIcon';
import Container from '@mui/material/Container';
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

    const unwatch = storage.watch<number>(`local:${keywordStoreKey}`, () => {
      fetchKeywordHistory();
    });

    return () => {
      unwatch();
    }
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
          <img draggable="false" user-select="none" src={imageUrl} alt="JarGone logo" className="logo" />
          <span className="icon">
            <IconButton aria-label="contact support" href="mailto:overingowl+jargone+support@gmail.com">
              <ReportIcon />
            </IconButton>
            <IconButton aria-label="delete keyword history" onClick={clearKeywordHistory}>
              <DeleteIcon />
            </IconButton>
          </span>
        </header>

        <Box className="content">
          {keywordHistory.length === 0 ? (
            <JargonCard keyword={instructionalEntry.keyword} type={instructionalEntry.type} meaning={instructionalEntry.meaning} />
          ) : (
            [...keywordHistory].reverse().map((entry, index) => (
              <JargonCard key={index} keyword={entry.keyword} type={entry.type} meaning={entry.meaning} />
            ))
          )}
        </Box>

        <Box id="bottom-nav">
          <BottomNavigation
            showLabels
            value={0}
          >
            <BottomNavigationAction
              className='.Mui-selected'
              sx={{ borderRadius: 8, m: 1 }}
              icon={<HomeIcon aria-label="home" color={theme.palette.primary.main} />}
            />
            <BottomNavigationAction
              sx={{ borderRadius: 8, m: 1 }}
              icon={<SettingsIcon aria-label="settings" />}
              onClick={() => browser.runtime.openOptionsPage()}
            />
          </BottomNavigation>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
