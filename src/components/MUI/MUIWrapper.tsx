import { createTheme, ThemeProvider } from "@mui/material";
import { createContext } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { toggleTheme } from "../../reducer";
import { useAppDispatch, useAppSelector } from "../../hooks";

export const MUIWrapperContext = createContext({
  toggleColorMode: () => {},
});

export default function MUIWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  
  const muiWrapperUtils = {
    toggleColorMode: () => {
      dispatch(toggleTheme())
    },
  };

  const themeLight = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#e9f1f7"
      }
    }
  });
  
  const themeDark = createTheme({
    palette: {
      mode: "dark",
    }
  });

  return (
    <MUIWrapperContext.Provider value={muiWrapperUtils}>
      <ThemeProvider theme={mode == "light" ? themeLight : themeDark}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </MUIWrapperContext.Provider>
  );
}