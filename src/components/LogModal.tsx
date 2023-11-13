import { FC, useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, styled } from '@mui/material';
import { useAppSelector } from "../hooks";
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

interface LogModalProps {
  isOpen: boolean;
  dateStart: string|undefined;
  dateEnd: string|undefined;
  close: () => void;
  delete: () => void;
  save: (dateStart?: string, dateEnd?: string) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Containter = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "10px",
  gap: "20px",
}));

const LogModal: FC<LogModalProps> = (props: LogModalProps) => {
  const errorEdit = useAppSelector((state) => state.errorEdit);
  const [newDateStart, setNewDateStart] = useState<dayjs.Dayjs|null>(null);
  const [newDateEnd, setNewDateEnd] = useState<dayjs.Dayjs|null>(null);
  
  useEffect(() => {
    setNewDateStart(props.dateStart ? dayjs(props.dateStart) : null)
    setNewDateEnd(props.dateEnd ? dayjs(props.dateEnd) : null)
  },[props.isOpen]);

  return  (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dayjs(props.dateStart).format("dddd, DD MMMM")}
      </DialogTitle>
      <DialogContent>
        {errorEdit ? <Alert severity="error" sx={{marginBottom: "10px"}}>{errorEdit}</Alert> : null}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Containter>
            <TimePicker label="Start" ampm={false} value={newDateStart} onChange={d => setNewDateStart(d)} />
            <TimePicker label="End" ampm={false} value={newDateEnd} onChange={d => setNewDateEnd(d)} />
          </Containter>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{justifyContent: "space-between"}}>
        <Button onClick={e => props.delete()} startIcon={<DeleteIcon/>} color="error">Delete</Button>
        <Button onClick={e => props.save(newDateStart?.toISOString(), newDateEnd?.toISOString())} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );  
};

export default LogModal;
