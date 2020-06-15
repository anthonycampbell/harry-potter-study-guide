import React, { createContext, useState } from 'react'

export const AppContext = createContext();

function AppContextProvider(props){
    const [appState, setAppState] = useState(false)
    function storeAppState(newAppState){
        setAppState(newAppState)
    }

    return(
        <AppContext.Provider value={{ appState, storeAppState}}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;