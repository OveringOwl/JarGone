import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GradientStarIcon from './GradientStarIcon';

interface JargonCardProps extends Keyword { }

const typeColors: { [key: string]: [string, string] } = {
  'adjective': ['#00DD55', '#51F0A0'],
  'verb': ['#FF006F', '#FF70AE'],
  'noun': ['#0050FC', '#00C8FF'],
  'idiom': ['#7500E8', '#B973FE'],
  'slang': ['#FC5800', '#FFC300'],
  'error': ['#FF0550', '#FE7373'],
  default: ['#FFBB00', '#FFD900']
};

const getTypeColors = (type: string): [string, string] => {
  // Check if the type includes one of the defined types
  const normalizedType = Object.keys(typeColors).find((key) => type.toLowerCase().includes(key));
  return typeColors[normalizedType || 'default'];
};

const JargonCard: React.FC<JargonCardProps> = ({ keyword, type, meaning }) => {
  const [primaryColor, secondaryColor] = getTypeColors(type);
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
              background: `linear-gradient(0deg, ${primaryColor}, ${secondaryColor} 70%)`,
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
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <GradientStarIcon height="24" width="24" gradientColors={{ start: secondaryColor, end: primaryColor }} uniqueId={uniqueId} />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}>
          <Divider orientation="vertical" variant='fullWidth' flexItem sx={{ backgroundColor: primaryColor, borderRightWidth: 2 }} />

          <Typography variant="body2" color={primaryColor} fontWeight={700} fontStyle="italic" mt={1} mb={1} ml={2}>
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
