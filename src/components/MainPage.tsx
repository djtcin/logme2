import { FC, useEffect } from 'react';
import { Accordion, AccordionSummary } from '@mui/material';
import DT from '../tools/dateTools';
import { useAppDispatch, useAppSelector } from "../hooks";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import Week from './Week';
import { closeEditLog, deleteLog, loadLogMeData, saveLog } from '../reducer';
import LogModal from './LogModal';
import PlayButton from './PlayButton';

interface MainPageProps {
}

const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const logs = useAppSelector((state) => state.logs);
  const logIdInEdition = useAppSelector((state) => state.logIdInEdition);
  const logInEdition = logIdInEdition ? logs.find(l => l.id == logIdInEdition) : null;
  const dispatch = useAppDispatch();
  const lastSunday = DT.getLastSunday(new Date());
  const weeks: { currentWeek: boolean, firstDate: Date, logs: Log[] }[] = [];
  lastSunday.setHours(0);
  lastSunday.setMinutes(0);

  useEffect(() => {
    dispatch(loadLogMeData());
  }, []);
  
  for(let i = 0; i < 5; i++) {
    const firstDate = DT.addWeeks(lastSunday, -i);
    const firstDateIso = firstDate.toISOString();
    const lastDate = DT.addWeeks(firstDate, 1);
    const lastDateIso = lastDate.toISOString();

    weeks.push({
      currentWeek: i == 0,
      firstDate,
      logs: logs.filter(l => firstDateIso < l.dateStart && l.dateStart < lastDateIso )
    });
  }

  return  (
    <div className="MainPage">
      {weeks.map(w => 
        <Accordion defaultExpanded={w.currentWeek} key={w.firstDate.toISOString()}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography variant="overline">
              {w.currentWeek ? "This week" : `${DT.getFormatedDate(w.firstDate)} - ${DT.getFormatedDate(DT.addDays(w.firstDate, 6))}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Week dateStart={w.firstDate} logs={w.logs}></Week>
          </AccordionDetails>
        </Accordion>
      )}
      <LogModal 
        isOpen={!!logIdInEdition} 
        dateStart={logInEdition?.dateStart}
        dateEnd={logInEdition?.dateEnd}
        close={() => dispatch(closeEditLog())}
        delete={() => dispatch(deleteLog())}
        save={(dateStart?: string, dateEnd?: string) => dispatch(saveLog({dateStart, dateEnd}))}/>
      <PlayButton/>
    </div>
  );  
};

export default MainPage;
