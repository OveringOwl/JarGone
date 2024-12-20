import CopyIcon from '@/components/ui/CopyIcon'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import useTheme from '@mui/material/styles/useTheme'
import Typography from '@mui/material/Typography'
import React from 'react'

import GradientStarIcon from './GradientStarIcon'

interface JargonCardProps extends Keyword {
  colorGradient?: string[]
}

const JargonCard: React.FC<JargonCardProps> = ({ colorGradient, keyword, meaning, type }) => {
  const theme = useTheme()

  const typeColors: { [key: string]: [string, string] } = {
    adjective: [theme.palette.greenShade.light, theme.palette.greenShade.main],
    default: ['#FFD900', '#FFBB00'],
    error: [theme.palette.error.light, theme.palette.error.main],
    idiom: [theme.palette.purpleShade.light, theme.palette.purpleShade.main],
    noun: [theme.palette.blueShade.light, theme.palette.blueShade.main],
    slang: [theme.palette.orangeShade.light, theme.palette.orangeShade.main],
    verb: [theme.palette.pinkShade.light, theme.palette.pinkShade.main],
  }

  const getTypeColors = (type: string): [string, string] => {
    // Check if the type includes one of the defined types
    const normalizedType = Object.keys(typeColors).find(key => type.toLowerCase().includes(key))
    return typeColors[normalizedType || 'default']
  }

  if (!colorGradient) {
    colorGradient = getTypeColors(type)
  }
  const [startColor, stopColor] = colorGradient
  const uniqueId = React.useId()

  const copyKeyword = () => {
    const keywordEntry = `${keyword} • (${type}) • ${meaning}\nvia ahmd.sh!`
    navigator.clipboard.writeText(keywordEntry)
  }

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CardContent>
        <Box sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          margin: '2px 0',
        }}
        >
          <Box sx={{
            alignItems: 'center',
            display: 'flex',
          }}
          >
            <Box sx={{
              background: `linear-gradient(0deg, ${stopColor}, ${startColor})`,
              borderRadius: '12px',
              padding: '2px 10px',
            }}
            >
              <Typography align="left" color="white" fontWeight={900} letterSpacing={-1} variant="h6">
                {keyword}
              </Typography>
            </Box>

            <IconButton
              onClick={copyKeyword}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.01)',
                },
                'color': 'grey',
                'ml': 1,
              }}
            >
              <CopyIcon color="#B9B9B9" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <GradientStarIcon gradientColors={{ end: stopColor, start: startColor }} height="24" uniqueId={uniqueId} width="24" />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
        >
          <Divider flexItem orientation="vertical" sx={{ backgroundColor: stopColor, borderRightWidth: 2 }} variant="fullWidth" />

          <Typography color={stopColor} fontStyle="italic" fontWeight={700} mb={1} ml={2} mt={1} variant="body2">
            {type}
          </Typography>
        </Box>

        <Typography align="left" color="text.primary" fontSize={14} fontWeight={400} letterSpacing={-0.5} variant="body1">
          {meaning}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default JargonCard
