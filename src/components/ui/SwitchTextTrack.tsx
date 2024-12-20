import type { SwitchProps } from '@mui/material/Switch'

import { styled, useTheme } from '@mui/material/styles'
import Switch, { switchClasses } from '@mui/material/Switch'

function SwitchTextTrack(props: SwitchProps) {
  const theme = useTheme()

  const StyledSwitch = styled(Switch)({
    [`& .${switchClasses.checked}`]: {
      [`& + .${switchClasses.track}`]: {
        '&:after': {
          opacity: 0,
        },
        '&:before': {
          opacity: 1,
        },
        'background': `linear-gradient(to right, ${theme.palette.greenShade.main}, ${theme.palette.greenShade.light})`,
      },
      [`&.${switchClasses.switchBase}`]: {
        '&:hover': {
          backgroundColor: 'rgba(24,90,157,0.08)',
        },
        'color': '#185A9D',
        'transform': 'translateX(32px)',
      },
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: '#fff',
      },
    },
    [`& .${switchClasses.switchBase}`]: {
      color: '#ff6a00',
      padding: 11,
    },
    [`& .${switchClasses.thumb}`]: {
      backgroundColor: '#fff',
      height: 26,
      width: 26,
    },
    [`& .${switchClasses.track}`]: {
      '&:after': {
        content: '"NO"',
        right: 4,
      },
      '&:before': {
        content: '"YES"',
        left: 4,
        opacity: 0,
      },
      '&:before, &:after': {
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: 500,
        position: 'absolute',
        textAlign: 'center',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '50%',
      },
      'background': `linear-gradient(to right, ${theme.palette.error.light}, ${theme.palette.error.main})`,
      'borderRadius': 20,
      'opacity': '1 !important',
      'position': 'relative',
    },
    height: 48,
    padding: 8,
    width: 80,
  })

  return <StyledSwitch {...props} />
}

export default SwitchTextTrack
