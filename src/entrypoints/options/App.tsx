import JargonCard from '@/components/ui/JargonCard.tsx'
import SwitchTextTrack from '@/components/ui/SwitchTextTrack.tsx'
import { MenuItem } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Select from '@mui/material/Select'
import { ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'

import theme from '../../components/theme/theme.ts'

function App() {
  const settingsStoreKey = 'settings'
  const [apiKey, setApiKey] = useState('')
  const [confettiAnimation, setConfettiAnimation] = useState(true)
  const [replaceText, setReplaceText] = useState(true)
  const [locale, setLocale] = useState('english')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load settings from local storage when the component mounts
    const loadSettings = async () => {
      const savedSettings: null | string = await storage.getItem(`local:${settingsStoreKey}`)
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setApiKey(parsedSettings.apiKey || '')
        setConfettiAnimation(parsedSettings.confettiAnimation !== undefined ? parsedSettings.confettiAnimation : true)
        setReplaceText(parsedSettings.replaceText !== undefined ? parsedSettings.replaceText : true)
        setLocale(parsedSettings.locale || 'english')
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    const settings = {
      apiKey,
      confettiAnimation,
      locale,
      replaceText,
    }
    await storage.setItem(`local:${settingsStoreKey}`, JSON.stringify(settings))
    // eslint-disable-next-line no-console
    console.log('[JarGone]: Settings saved!')
  }

  const handleReset = async () => {
    setApiKey('')
    setConfettiAnimation(true)
    setReplaceText(true)
    setLocale('english')

    const settings = {
      apiKey: '',
      confettiAnimation: true,
      locale,
      replaceText: true,
    }
    await storage.setItem(`local:${settingsStoreKey}`, JSON.stringify(settings))
    // eslint-disable-next-line no-console
    console.log('[JarGone]: Settings reset.')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          alignItems: 'center',
          background: `linear-gradient(0deg, ${theme.palette.yellowShade!.main}, ${theme.palette.yellowShade!.light})`,
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 0,
            width: 400,
          }}
        >
          <CardContent>

            <JargonCard keyword={i18n.t('settingsCardKeyword')} meaning={i18n.t('settingsCardMeaning')} type={i18n.t('settingsCardType')} />

            <Divider sx={{ mb: 2, mx: 2 }} />

            <Box sx={{ px: 2, py: 1 }}>
              <Box sx={{ letterSpacing: -0.5, my: 2 }}>
                <Typography sx={{ fontWeight: 700 }} variant="overline">{i18n.t('apiKeyLabel')}</Typography>
                <TextField
                  autoComplete="off"
                  fullWidth
                  helperText={(
                    <Typography variant="caption">
                      {i18n.t('apiKeyHelper')}
                      &nbsp;&nbsp;
                      <Link color="inherit" href="https://github.com/OveringOwl/JarGone/blob/main/.github/docs/API_KEY.md" target="_blank">{i18n.t('learnMore')}</Link>
                    </Typography>
                  )}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-"
                  value={apiKey}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', letterSpacing: -0.5, my: 2 }}>
                <Typography>{i18n.t('confettiSetting')}</Typography>
                <SwitchTextTrack
                  checked={confettiAnimation}
                  onChange={e => setConfettiAnimation(e.target.checked)}
                />
              </Box>

              <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', letterSpacing: -0.5, my: 2 }}>
                <Typography>{i18n.t('replaceTextSetting')}</Typography>
                <SwitchTextTrack
                  checked={replaceText}
                  onChange={e => setReplaceText(e.target.checked)}
                />
              </Box>

              <Typography sx={{ fontWeight: 700 }} variant="overline">{i18n.t('languageSelectLabel')}</Typography>
              <Select
                fullWidth
                id="locale-select"
                labelId="locale-select-label"
                onChange={e => setLocale(e.target.value)}
                value={locale}
              >
                <MenuItem value="arabic">العربية</MenuItem>
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="spanish">Español</MenuItem>
                <MenuItem value="french">Français</MenuItem>
                <MenuItem value="deutsch">Deutsch</MenuItem>
                <MenuItem value="japanese">日本語</MenuItem>
                <MenuItem value="chinese">中文</MenuItem>
                <MenuItem value="russian">Русский</MenuItem>
                <MenuItem value="portuguese">Português</MenuItem>
                <MenuItem value="italian">Italiano</MenuItem>
                <MenuItem value="korean">한국어</MenuItem>
                <MenuItem value="hindi">हिन्दी</MenuItem>
                <MenuItem value="bengali">বাংলা</MenuItem>
                <MenuItem value="urdu">اردو</MenuItem>
                <MenuItem value="turkish">Türkçe</MenuItem>
                <MenuItem value="vietnamese">Tiếng Việt</MenuItem>
                <MenuItem value="thai">ไทย</MenuItem>
                <MenuItem value="dutch">Nederlands</MenuItem>
                <MenuItem value="swedish">Svenska</MenuItem>
                <MenuItem value="danish">Dansk</MenuItem>
                <MenuItem value="norwegian">Norsk</MenuItem>
                <MenuItem value="finnish">Suomi</MenuItem>
                <MenuItem value="polish">Polski</MenuItem>
                <MenuItem value="czech">Čeština</MenuItem>
                <MenuItem value="hungarian">Magyar</MenuItem>
                <MenuItem value="greek">Ελληνικά</MenuItem>
                <MenuItem value="romanian">Română</MenuItem>
                <MenuItem value="indonesian">Bahasa Indonesia</MenuItem>
                <MenuItem value="malay">Bahasa Melayu</MenuItem>
                <MenuItem value="hebrew">עברית</MenuItem>
                <MenuItem value="persian">فارسی</MenuItem>
                <MenuItem value="swahili">Kiswahili</MenuItem>
                <MenuItem value="filipino">Filipino</MenuItem>
                <MenuItem value="ukrainian">Українська</MenuItem>
                <MenuItem value="slovak">Slovenčina</MenuItem>
                <MenuItem value="croatian">Hrvatski</MenuItem>
                <MenuItem value="serbian">Српски</MenuItem>
                <MenuItem value="bulgarian">Български</MenuItem>
                <MenuItem value="latvian">Latviešu</MenuItem>
                <MenuItem value="lithuanian">Lietuvių</MenuItem>
                <MenuItem value="estonian">Eesti</MenuItem>
                <MenuItem value="slovenian">Slovenščina</MenuItem>
                <MenuItem value="farsi">فارسی</MenuItem>
                <MenuItem value="tamil">தமிழ்</MenuItem>
                <MenuItem value="telugu">తెలుగు</MenuItem>
                <MenuItem value="marathi">मराठी</MenuItem>
                <MenuItem value="malayalam">മലയാളം</MenuItem>
                <MenuItem value="punjabi">ਪੰਜਾਬੀ</MenuItem>
                <MenuItem value="gujarati">ગુજરાતી</MenuItem>
                <MenuItem value="kannada">ಕನ್ನಡ</MenuItem>
                <MenuItem value="urdu">اردو</MenuItem>
                <MenuItem value="amharic">አማርኛ</MenuItem>
                <MenuItem value="yoruba">Yorùbá</MenuItem>
                <MenuItem value="zulu">isiZulu</MenuItem>
              </Select>
            </Box>

            <Divider sx={{ mb: 2, mt: 6, mx: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mx: 2 }}>
              <Button
                color="error"
                onClick={async () => {
                  await handleReset()
                  setMessage('Settings reset.')
                  setTimeout(() => setMessage(''), 3000)
                }}
                sx={{ borderRadius: 4 }}
                variant="text"
              >
                {i18n.t('resetButtonLabel')}
              </Button>

              {message && (
                <Typography color="primary" sx={{ mt: 1 }} variant="body2">
                  {message}
                </Typography>
              )}

              <Button
                color="primary"
                onClick={async () => {
                  await handleSave()
                  setMessage('Settings saved!')
                  setTimeout(() => setMessage(''), 3000)
                }}
                sx={{ borderRadius: 4 }}
                variant="outlined"
              >
                {i18n.t('saveButtonLabel')}
              </Button>
            </Box>

          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}

export default App
