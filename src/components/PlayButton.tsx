import { FC } from 'react';
import { Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from "../hooks";
import { openEditLog, startPlay, stopPlay } from '../reducer';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

interface PlayButtonProps {
}

const Container = styled('div')(({ theme }) => ({
  position: "fixed",
  right: "30px",
  bottom: "30px",
}));

const PlayButton: FC<PlayButtonProps> = (props: PlayButtonProps) => {
  const logIdInPlay = useAppSelector((state) => state.logIdInPlay);
  const isInPlay = !!logIdInPlay;
  const dispatch = useAppDispatch();
 
  return (
    <Container>
      <Fab 
        color="primary"
        sx={{display: isInPlay ? "none" : "inline-flex"}} 
        onClick={e => dispatch(startPlay())}>
        <PlayIcon />
      </Fab>
      <Fab 
        color="secondary"
        sx={{display: isInPlay ? "inline-flex" : "none"}}
        onClick={e => dispatch(stopPlay())}>
        <StopIcon />
      </Fab>
    </Container>
  );
};

export default PlayButton;
