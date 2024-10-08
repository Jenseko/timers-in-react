import { createContext, useContext, useReducer, type ReactNode } from "react";


// -1- TYPE DEFINITIONS
export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = {
    isRunning: false,
    timers: [],
} 

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};


// -2- CREATE TIMER-CONTEXT
const TimersContext = createContext<TimersContextValue | null>(null);

// -3- CREATING CUSTOM HOOK FOR TIMER-CONTEXT
export function useTimersContext() {
    const timersCtx = useContext(TimersContext);

    if (timersCtx === null) {
        throw new Error('TimersContext is null - that should not be the case!');
    }
    return timersCtx;
}

type TimersContextProviderProps = {
    children: ReactNode;
};


// -4- DEFINING ACTIONS FOR TIMER-REDUCER
type StartTimersAction = {
type: 'START_TIMERS',
}

type StopTimersAction = {
    type: 'STOP_TIMERS',
    }

type AddTimerAction = {
    type: 'ADD_TIMER',
    payload: Timer,
    }

type Action = StartTimersAction | StopTimersAction | AddTimerAction;


// -5- TIMER-REDUCER
function timersReducer(state: TimersState, action: Action) : TimersState {
if(action.type === 'START_TIMERS') {
    return {
        ...state,
        isRunning: true,
    }
}

if(action.type === 'STOP_TIMERS') {
    return {
        ...state,
        isRunning: false,
    }
}

if(action.type === 'ADD_TIMER') {
    return {
        ...state,
        timers: [
            ...state.timers,
            {
                name: action.payload.name,
                duration: action.payload.duration,
            }
        ]
    }
}
return state;
}

// -6- TIMER-CONTEXT-PROVIDER
export default function TimersContextProvider({children}: TimersContextProviderProps) {

const [timersState, dispatch] = useReducer(timersReducer, initialState);


// -7- CREATING CONTEXT-VALUE
    const ctx: TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,
        addTimer(timerData) {
            dispatch({type: 'ADD_TIMER', payload: timerData});
        },
        startTimers(){
            dispatch({type: 'START_TIMERS'})
        },
        stopTimers(){
            dispatch({type: 'STOP_TIMERS'})
        },
    };

return (<TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
)};
