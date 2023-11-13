import { PaletteMode } from '@mui/material';
import { MyStorage } from './models/myStorage';
import { createAction, createReducer } from '@reduxjs/toolkit';
import DT from './tools/dateTools';
import { v4 as uuidv4 } from 'uuid';

const tempLogsTest = [
  {id: "c5c12651-dea8-496a-a27f-d2bb5c012d57", dateStart: "2022-11-01T15:15:11.961Z", dateEnd: "2022-11-01T18:00:11.961Z"},
  {id: "4de162f5-9b1e-4fe7-a749-bee074d4d92e", dateStart: "2023-11-01T15:15:11.961Z", dateEnd: "2023-11-01T18:00:11.961Z"},
  {id: "f16b523a-38b9-4f49-8719-9810c3f46fd1", dateStart: "2023-11-02T18:45:11.961Z"},
  {id: "6eeb13a3-3bc0-4bfe-b81d-8e80d2040deb", dateStart: "2023-11-06T15:15:11.961Z", dateEnd: "2023-11-06T18:00:11.961Z"},
  {id: "db6b664a-d9f9-43d7-9389-70ec1490176e", dateStart: "2023-11-06T18:45:11.961Z"},
  {id: "e09e68f0-c105-4ec9-8d96-025176940e44", dateStart: "2023-11-07T13:14:11.961Z", dateEnd: "2023-11-07T13:15:11.961Z"},
  {id: "6479f2ca-869e-4059-b383-c25c3f6b3669", dateStart: "2023-11-07T22:55:59.961Z", dateEnd: "2023-11-08T00:01:59.961Z"},
  {id: "7f86b5a6-1867-4060-bc03-fe944e1082e5", dateStart: "2023-11-09T15:14:11.961Z", dateEnd: "2023-11-09T18:36:11.961Z"},
  {id: "d90996da-c6e6-4f22-8853-212e5841a574", dateStart: "2023-11-10T22:19:10.961Z"},
];

const _LSKey_theme = 'THEME';
const _LSKey_logs = 'LOGS';
const _LSKey_logIdInPlay = 'LOG_IN_PLAY';
const _LSKey_lastLogIdInPlay = 'LAST_LOG_IN_PLAY';
const _LSKey_settings = 'SETTINGS';

const initialState : MyStorage = {
  theme: "light",
  logs:[],
  settings: {
    defaultMinHour: 8,
    defaultMaxHour: 19,
    calendarHeight: 250,
    minLogHeight: 21,
    minutesForMerge: 5,
  }
};

export const toggleTheme = createAction('theme/toggle');
export const loadLogMeData = createAction('logs/load');
export const openEditLog = createAction<string>('modal/edit-log/open');
export const closeEditLog = createAction('modal/edit-log/close');
export const startPlay = createAction('logs/play/start');
export const stopPlay = createAction('logs/play/stop');
export const deleteLog = createAction('logs/delete');
export const saveLog = createAction<{dateStart: string|undefined, dateEnd: string|undefined}>('logs/save');
// TODO
// export const saveSettings = createAction('settings/save');

export const logmeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(toggleTheme, (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    })
    .addCase(loadLogMeData, (state) => {
      loadLogMeDataAction(state);
    })
    .addCase(openEditLog, (state, action) => {
      state.logIdInEdition = action.payload;
    })
    .addCase(closeEditLog, (state) => {
      state.logIdInEdition = undefined;
      state.errorEdit = undefined;
    })
    .addCase(startPlay, (state) => {
      startPlayAction(state);
    })
    .addCase(stopPlay, (state) => {
      stopPlayAction(state);
    })
    .addCase(deleteLog, (state) => {
      deleteLogAction(state);
    })
    .addCase(saveLog, (state, action) => {
      saveLogAction(state, action.payload.dateStart, action.payload.dateEnd);
    })
    .addMatcher((action) => action.type.startsWith('theme/'),
      (state) => { localStorage.setItem(_LSKey_theme, state.theme); }
    )
    .addMatcher((action) => action.type.startsWith('logs/'),
      (state) => { 
        localStorage.setItem(_LSKey_logs,  JSON.stringify(state.logs)); 
        localStorage.setItem(_LSKey_logIdInPlay,  state.logIdInPlay || ""); 
        localStorage.setItem(_LSKey_lastLogIdInPlay,  state.lastLogIdInPlay || ""); 
      }
    )
});

/**
 * Restore logs from localStorage and fix inconsistencies.
 */
function loadLogMeDataAction(state: MyStorage) {
  const localStorageLogIdInPlay = localStorage.getItem(_LSKey_logIdInPlay);
  const localStorageLastLogIdInPlay = localStorage.getItem(_LSKey_lastLogIdInPlay);
  const localStorageTheme = localStorage.getItem(_LSKey_theme);
  const localStorageLogs = localStorage.getItem(_LSKey_logs);
  const localStorageSettings = localStorage.getItem(_LSKey_settings);
  const oneMonthAgo = DT.addMonths(new Date(), -1);
  const logs: Log[] = localStorageLogs ? JSON.parse(localStorageLogs) : tempLogsTest;
  const today = new Date();

  // Get all logs from last month. If they don't have a dateEnd, create one.
  state.logs = logs
    .filter(l => l.dateStart > oneMonthAgo.toISOString())
    .map(l => {
      if (!l.dateEnd) {
        const dateEnd = new Date(l.dateStart);
        dateEnd.setHours(state.settings.defaultMaxHour);
        dateEnd.setMinutes(0);
        l.dateEnd = dateEnd.toISOString();
      }
      return l;
    });

  if (localStorageTheme) {
    state.theme = localStorageTheme as PaletteMode;
  }

  const logInPlay = localStorageLogIdInPlay && state.logs.find(l => l.id == localStorageLogIdInPlay);
  if (logInPlay && DT.isSameDay(today, new Date(logInPlay.dateStart))) {
    logInPlay.dateEnd = undefined;
    state.logIdInPlay = logInPlay.id;
  }

  const logLastPlay = localStorageLastLogIdInPlay && state.logs.find(l => l.id == localStorageLastLogIdInPlay);
  if (logLastPlay && DT.isSameDay(today, new Date(logLastPlay.dateStart))) {
    state.lastLogIdInPlay = logLastPlay.id;
  }

  if (localStorageSettings) {
    state.settings = JSON.parse(localStorageSettings);
  }
}

function startPlayAction(state: MyStorage) {
  const now = new Date();
  let log = state.lastLogIdInPlay && state.logs.find(l => 
    l.id == state.lastLogIdInPlay 
    && l.dateEnd
    && DT.diffInMinutes(now, new Date(l.dateEnd)) <= state.settings.minutesForMerge);

  if (!log) {
    log = { id: uuidv4(), dateStart: now.toISOString() };
    state.logs.push(log);
  }
  
  log.dateEnd = undefined;
  state.logIdInPlay = log.id;
  state.lastLogIdInPlay = log.id;
}

function stopPlayAction(state: MyStorage) {
  let log = state.logs.find(l => l.id == state.logIdInPlay);
  state.logIdInPlay = undefined;

  if (log) {
    log.dateEnd = (new Date()).toISOString();
  }
}

function deleteLogAction(state: MyStorage) {
  const log = state.logs.find(l => l.id == state.logIdInEdition);
  
  if (log) {
    const index = state.logs.indexOf(log);
    state.logs.splice(index, 1);
  }
  if (state.logIdInPlay == state.logIdInEdition) {
    state.logIdInPlay = undefined;
  }
  if (state.lastLogIdInPlay == state.logIdInEdition) {
    state.lastLogIdInPlay = undefined;
  }
  state.logIdInEdition = undefined;
  state.errorEdit = undefined;
}

function saveLogAction(state: MyStorage, dateStart?: string, dateEnd?: string) {
  const log = state.logs.find(l => l.id == state.logIdInEdition);

  if (!log) {
    throw new Error();
  } else if (!dateStart) {
    state.errorEdit = "You can not save a log without a start time."
  } else if (!dateEnd && log.id != state.lastLogIdInPlay) {
    state.errorEdit = "Only the last played log can have an empty end time."
  } else {
    log.dateStart = dateStart;
    log.dateEnd = dateEnd;
    state.logIdInEdition = undefined;
    state.errorEdit = undefined;

    if (state.logIdInPlay == log.id && !!dateEnd) {
      state.logIdInPlay = undefined;
    }
  }
}