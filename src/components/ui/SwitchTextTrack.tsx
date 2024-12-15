import { styled, useTheme } from "@mui/material/styles";
import Switch, { SwitchProps, switchClasses } from "@mui/material/Switch";

const SwitchTextTrack = (props: SwitchProps) => {
  const theme = useTheme(); // Access the theme dynamically

  const StyledSwitch = styled(Switch)({
    width: 80,
    height: 48,
    padding: 8,
    [`& .${switchClasses.switchBase}`]: {
      padding: 11,
      color: "#ff6a00",
    },
    [`& .${switchClasses.thumb}`]: {
      width: 26,
      height: 26,
      backgroundColor: "#fff",
    },
    [`& .${switchClasses.track}`]: {
      background: `linear-gradient(to right, ${theme.palette.error.light}, ${theme.palette.error.main})`,
      opacity: "1 !important",
      borderRadius: 20,
      position: "relative",
      "&:before, &:after": {
        display: "inline-block",
        position: "absolute",
        top: "50%",
        width: "50%",
        transform: "translateY(-50%)",
        color: "#ffffff",
        textAlign: "center",
        fontSize: "0.75rem",
        fontWeight: 500,
      },
      "&:before": {
        content: '"YES"',
        left: 4,
        opacity: 0,
      },
      "&:after": {
        content: '"NO"',
        right: 4,
      },
    },
    [`& .${switchClasses.checked}`]: {
      [`&.${switchClasses.switchBase}`]: {
        color: "#185a9d",
        transform: "translateX(32px)",
        "&:hover": {
          backgroundColor: "rgba(24,90,157,0.08)",
        },
      },
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: "#fff",
      },
      [`& + .${switchClasses.track}`]: {
        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        "&:before": {
          opacity: 1,
        },
        "&:after": {
          opacity: 0,
        },
      },
    },
  });

  return <StyledSwitch {...props} />;
};

export default SwitchTextTrack;
