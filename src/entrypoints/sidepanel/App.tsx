import DeleteIcon from '@/components/ui/DeleteIcon'
import HomeIcon from '@/components/ui/HomeIcon'

import './App.css'

import JargonCard from '@/components/ui/JargonCard'
import ReportIcon from '@/components/ui/ReportIcon'
import SettingsIcon from '@/components/ui/SettingsIcon'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'

import theme from '../../components/theme/theme'

import imageUrl from '/icon/title-logo.png'

function App() {
  const instructionalEntry: Keyword = {
    keyword: 'get started',
    meaning: 'select a complex block of text and right-click to simplify!',
    type: 'instructions',
  }
  const keywordStoreKey = 'keywordHistory'
  const [keywordHistory, setKeywordHistory] = useState([instructionalEntry])

  // Fetch keywordHistory from local storage on component mount
  useEffect(() => {
    const fetchKeywordHistory = async () => {
      try {
        const keywordHistory: null | string = await storage.getItem(`local:${keywordStoreKey}`)
        const keywordHistoryArray: Keyword[] | null = JSON.parse(keywordHistory || '[]')
        const storedHistory = keywordHistoryArray || []
        setKeywordHistory([instructionalEntry, ...storedHistory])
      }
      catch (error) {
        console.error('Error fetching keyword history:', error)
      }
    }

    fetchKeywordHistory()

    const unwatch = storage.watch<number>(`local:${keywordStoreKey}`, () => {
      fetchKeywordHistory()
    })

    return () => {
      unwatch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearKeywordHistory = async () => {
    try {
      await storage.setItem(`local:${keywordStoreKey}`, JSON.stringify([]))
      setKeywordHistory([instructionalEntry])
    }
    catch (error) {
      console.error('Error clearing keyword history:', error)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container id="root">
        <header id="header">
          <img alt="JarGone logo" className="logo" draggable="false" src={imageUrl} user-select="none" />
          <span className="icon">
            <IconButton aria-label="contact support" href="https://jargone.framer.ai/support" target="_blank">
              <ReportIcon />
            </IconButton>
            <IconButton aria-label="delete keyword history" onClick={clearKeywordHistory}>
              <DeleteIcon />
            </IconButton>
          </span>
        </header>

        <Box className="content">
          {keywordHistory.length === 0
            ? (
                <JargonCard keyword={instructionalEntry.keyword} meaning={instructionalEntry.meaning} type={instructionalEntry.type} />
              )
            : (
                [...keywordHistory].reverse().map((entry, index) => (
                  <Box className="zoom-in" key={index}>
                    <JargonCard key={index} keyword={entry.keyword} meaning={entry.meaning} type={entry.type} />
                  </Box>
                ))
              )}
        </Box>

        <Box id="bottom-nav">
          <BottomNavigation
            showLabels
            value={0}
          >
            <BottomNavigationAction
              className=".Mui-selected"
              icon={<HomeIcon aria-label="home" color={theme.palette.primary.main} />}
              sx={{ borderRadius: 8, m: 1 }}
            />
            <BottomNavigationAction
              icon={<SettingsIcon aria-label="settings" />}
              onClick={() => browser.runtime.openOptionsPage()}
              sx={{ borderRadius: 8, m: 1 }}
            />
          </BottomNavigation>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
