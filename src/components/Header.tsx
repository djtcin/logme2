import {
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import MUISwitch from "./MUI/MUISwitch";

export default function Header() {

  return (
    <AppBar position="static">
      <Toolbar>
        <AccessAlarmIcon sx={{ mr: 2 }}/>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Logme
        </Typography>
        <MUISwitch/>
      </Toolbar>
    </AppBar>
  );
}