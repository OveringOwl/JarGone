import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../components/theme/theme.ts'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SwitchTextTrack from '@/components/ui/SwitchTextTrack.tsx';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import JargonCard from '@/components/ui/JargonCard.tsx';
import { MenuItem } from '@mui/material';

function App() {
  const settingsStoreKey = 'settings';
  const [apiKey, setApiKey] = useState('');
  const [confettiAnimation, setConfettiAnimation] = useState(true);
  const [replaceText, setReplaceText] = useState(true);
  const [locale, setLocale] = useState('english');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load settings from local storage when the component mounts
    const loadSettings = async () => {
      const savedSettings: string | null = await storage.getItem(`local:${settingsStoreKey}`);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setApiKey(parsedSettings.apiKey || '');
        setConfettiAnimation(parsedSettings.confettiAnimation !== undefined ? parsedSettings.confettiAnimation : true);
        setReplaceText(parsedSettings.replaceText !== undefined ? parsedSettings.replaceText : true);
        setLocale(parsedSettings.locale || 'english');
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    const settings = {
      apiKey,
      confettiAnimation,
      replaceText,
      locale
    };
    await storage.setItem(`local:${settingsStoreKey}`, JSON.stringify(settings));
    console.log('[JarGone]: Settings saved!');
  };

  const handleReset = async () => {
    setApiKey('');
    setConfettiAnimation(true);
    setReplaceText(true);
    setLocale('english');

    const settings = {
      apiKey: '',
      confettiAnimation: true,
      replaceText: true,
      locale
    };
    await storage.setItem(`local:${settingsStoreKey}`, JSON.stringify(settings));
    console.log('[JarGone]: Settings reset.');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(0deg, #FFBB00, #FFD900)",
        }}
      >
        <Card
          sx={{
            width: 400,
            boxShadow: 0,
            borderRadius: 6,
          }}
        >
          <CardContent>

            <JargonCard keyword="settings" type="plural noun" meaning="the controls of a piece of equipment." />

            <Divider sx={{ mb: 2, mx: 2 }} />

            <Box sx={{ px: 2, py: 1 }}>
              <Box sx={{ my: 2, letterSpacing: -0.5 }}>
                <Typography variant='overline' sx={{ fontWeight: 700 }}>OpenAI API Key</Typography>
                <TextField
                  fullWidth
                  autoComplete="off"
                  variant="outlined"
                  placeholder="sk-"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2, letterSpacing: -0.5 }}>
                <Typography>Confetti animation</Typography>
                <SwitchTextTrack
                  checked={confettiAnimation}
                  onChange={(e) => setConfettiAnimation(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2, letterSpacing: -0.5 }}>
                <Typography>Replace text</Typography>
                <SwitchTextTrack
                  checked={replaceText}
                  onChange={(e) => setReplaceText(e.target.checked)}
                />
              </Box>

              <Typography variant='overline' sx={{ fontWeight: 700 }}>Language</Typography>
              <Select
                labelId="locale-select-label"
                id="locale-select"
                fullWidth
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
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

            <Divider sx={{ mt: 6, mb: 2, mx: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, mx: 2 }}>
              <Button variant="text" color="error" onClick={async () => {
                await handleReset();
                setMessage('Settings reset.');
                setTimeout(() => setMessage(''), 3000);
              }}>
                Reset
              </Button>

              {message && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  {message}
                </Typography>
              )}

              <Button variant="contained" color="primary" onClick={async () => {
                await handleSave();
                setMessage('Settings saved!');
                setTimeout(() => setMessage(''), 3000);
              }}>
                Save
              </Button>
            </Box>

          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}

export default App
