import { FC } from 'react';
import { Grid } from '@mui/material';
import Day from './Day';
import DT from '../tools/dateTools';

interface WeekProps {
  dateStart: Date;
  logs: Log[];
}

const Week: FC<WeekProps> = (props: WeekProps) => {
  const days: Date[] = [];
  const dateStart =  new Date(props.dateStart);
  let minHour = 23;
  let maxHour = 0; 

  for(let d = 0; d < 7; d++) {
    days.push(DT.addDays(dateStart, d));
  }

  props.logs.forEach(l => {
    minHour = Math.min(minHour, new Date(l.dateStart).getHours());
    if (l.dateEnd) {
      maxHour = Math.max(maxHour, new Date(l.dateEnd).getHours() + 1);
    }
  });

  return  (
    <div className="week">
      <Grid container spacing={1} columns={7}>
        { days.map(d => (<Grid item xs={1} key={d.toISOString()}>
            <Day date={d} logs={props.logs.filter(l => DT.isSameDay(new Date(l.dateStart), d))} minHour={minHour} maxHour={maxHour} />
          </Grid>)) }
      </Grid>
    </div>
  );  
};

export default Week;
