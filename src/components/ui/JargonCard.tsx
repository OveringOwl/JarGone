import React from 'react';
import useTheme from '@mui/material/styles/useTheme';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CopyIcon from '@/components/ui/CopyIcon';
import GradientStarIcon from './GradientStarIcon';

interface JargonCardProps extends Keyword {
  colorGradient?: string[]
}

const JargonCard: React.FC<JargonCardProps> = ({ keyword, type, meaning, colorGradient }) => {
  const theme = useTheme();

  const typeColors: { [key: string]: [string, string] } = {
    'adjective': [theme.palette.blueShade.light, theme.palette.blueShade.main],
    'error': [theme.palette.error.light, theme.palette.error.main],
    'idiom': [theme.palette.purpleShade.light, theme.palette.purpleShade.main],
    'noun': [theme.palette.greenShade.light, theme.palette.greenShade.main],
    'slang': [theme.palette.orangeShade.light, theme.palette.orangeShade.main],
    'verb': [theme.palette.pinkShade.light, theme.palette.pinkShade.main],
    default: ['#FFD900', '#FFBB00']
  };

  const getTypeColors = (type: string): [string, string] => {
    // Check if the type includes one of the defined types
    const normalizedType = Object.keys(typeColors).find((key) => type.toLowerCase().includes(key));
    return typeColors[normalizedType || 'default'];
  };

  if (!colorGradient) {
    colorGradient = getTypeColors(type);
  }
  const [startColor, stopColor] = colorGradient;
  const uniqueId = React.useId();

  const copyKeyword = () => {
    const keywordEntry = `${keyword} • (${type}) • ${meaning}\nvia ahmd.sh!`;
    navigator.clipboard.writeText(keywordEntry);
  };

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CardContent>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '2px 0',
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <Box sx={{
              background: `linear-gradient(0deg, ${stopColor}, ${startColor})`,
              padding: '2px 10px',
              borderRadius: '12px',
            }}>
              <Typography align='left' variant="h6" color="white" fontWeight={900} letterSpacing={-1}>
                {keyword}
              </Typography>
            </Box>

            <IconButton
              onClick={copyKeyword}
              sx={{
                ml: 1,
                color: 'grey',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.01)',
                }
              }}
            >
              <CopyIcon color='#B9B9B9' />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <GradientStarIcon height="24" width="24" gradientColors={{ start: startColor, end: stopColor }} uniqueId={uniqueId} />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}>
          <Divider orientation="vertical" variant='fullWidth' flexItem sx={{ backgroundColor: stopColor, borderRightWidth: 2 }} />

          <Typography variant="body2" color={stopColor} fontWeight={700} fontStyle="italic" mt={1} mb={1} ml={2}>
            {type}
          </Typography>
        </Box>

        <Typography align="left" variant="body1" color="text.primary" fontWeight={400} fontSize={14} letterSpacing={-0.5}>
          {meaning}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JargonCard
