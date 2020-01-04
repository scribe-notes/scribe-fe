import {createContext} from 'react';

const HistoryContext = createContext({history: [], setHistory: () => {}});

export default HistoryContext;