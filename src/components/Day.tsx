import { FC } from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import DT from '../tools/dateTools';
import { useAppDispatch, useAppSelector } from "../hooks";
import { openEditLog } from '../reducer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface DayProps {
  date: Date;
  logs: Log[];
  minHour: number;
  maxHour: number;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const DayNumber = styled('div')(({ theme }) => ({
  fontSize: "21px",
  fontWeight: "bold",
  textAlign: "right",
  width: "30px",
  marginRight: "5px"
}));

const DayDetails = styled('div')(({ theme }) => ({
  fontSize: "small",
}));

const Header = styled('div')(({ theme }) => ({
  display: "flex"
}));

const TotalContainer = styled('div')(({ theme }) => ({
  
}));

const DayCalendar = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f2f3f5',
  marginTop: "5px",
  position: "relative",
}));

const HoursIndicatorLine = styled('hr')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#282828' : '#e7e7e7',
  border: "none",
  height: "1px",
  width: "100%",
  position: "absolute",
  margin: "0px",
}));

const HoursIndicatorLabel = styled('span')(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#3a3737' : '#ddd9d9',
  position: "absolute",
  userSelect: "none",
}));

const LogCalendar = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#4a4081' : '#73a5ff',
  position: "absolute",
  width: "100%",
  borderRadius: "5px",
  padding: "2px 5px",
  fontSize: "small",
  cursor: "pointer",
  zIndex: "1",

  'div': {
    display: "flex",
    alignItems: "center",
  },
  
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? "#584d91" : '#90b8ff',
    boxShadow:  theme.palette.mode === 'dark' ? "#290d3e 2px 2px 4px" : "#3b59af 2px 2px 4px",
    zIndex: "2",
  }
}));

const Day: FC<DayProps> = (props: DayProps) => {
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const date = new Date(props.date);
  const dayKey = date.toISOString();
  const now = new Date();
  const minHour = Math.min(props.minHour, settings.defaultMinHour);
  const maxHour = Math.max(props.maxHour, settings.defaultMaxHour);
  const isDateToday = DT.isSameDay(now, date);
  const isTodayOverMax = now.getHours() >= maxHour;
  const nbHours = maxHour - minHour;
  const hourHeight = settings.calendarHeight/(nbHours);
  const hoursIndicators: {index: number, top: number, label: string}[] = [];
  const logsCalendar: {id: string, top: number, height: number, label: string, showPlay: boolean}[] = [];
  let total: number = 0;

  const dateMaxHour =  new Date(props.date);
  dateMaxHour.setHours(maxHour);
  dateMaxHour.setMinutes(0);

  for(let i = 1; i < nbHours; i++) {
    hoursIndicators.push({index: i, top: i * hourHeight, label: `${minHour + i}h`});
  }

  props.logs.forEach(l => {
    const dateStart = new Date(l.dateStart);
    const dateEnd = l.dateEnd ? new Date(l.dateEnd) : (isDateToday && !isTodayOverMax ? now : dateMaxHour);
    const start = DT.getDecimalTime(dateStart);
    const end = DT.getDecimalTime(dateEnd);
    let top = (start - minHour) * hourHeight;
    let height = Math.max((end - start) * hourHeight, settings.minLogHeight);
    
    if (top + height > settings.calendarHeight) {
      top = settings.calendarHeight - settings.minLogHeight;
    }

    total += end - start;
    logsCalendar.push({
      id: l.id,
      top,
      height,
      label: `${DT.getFormatedTime(dateStart)}${l.dateEnd ? " - " + DT.getFormatedTime(dateEnd) : "" }`,
      showPlay: !l.dateEnd
    });
  });

  return (
    <Item className="Day">
      <Header>
        <DayNumber>{ props.date.getDate() }</DayNumber>
        <DayDetails>
          <div>{ props.date.toLocaleString('default', { month: 'long' }) }</div>
          <div>{ props.date.toLocaleString('default', { weekday: 'long' }) }</div>
        </DayDetails>
      </Header>
      <TotalContainer>
        Total: {DT.getRoundTo25(total)}
      </TotalContainer>
      <DayCalendar sx={{height: `${settings.calendarHeight}px`}}>
        {hoursIndicators.map(h => h.index % 2 == 0 ? 
          <HoursIndicatorLabel key={`label_${h.index}_${dayKey}`} sx={{top: `${h.top - 17}px`, right: "2px"}}>{h.label}</HoursIndicatorLabel> : null)}
        {hoursIndicators.map(h => 
          <HoursIndicatorLine key={`line_${h.index}`} sx={{top: `${h.top}px`}}/>)}
        {logsCalendar.map(l => <LogCalendar 
          onClick={e => dispatch(openEditLog(l.id))}
          key={l.id} 
          sx={{top: `${l.top}px`, height: `${l.height}px`}}>
            <div>{l.label}{l.showPlay ? <PlayArrowIcon sx={{ fontSize: 16 }}/> : null}</div>
          </LogCalendar>)}
      </DayCalendar>
    </Item>
  );
};

export default Day;
