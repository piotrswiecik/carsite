import {create} from "zustand";

type State = {
    pageSize: number;
    pageNumber: number;
    pageCount: number;
    searchTerm: string;
    searchInputValue: string;
    orderBy: string;
    filterBy: string;
};

type Actions = {
    setParams: (params: Partial<State>) => void;
    setSearchInputValue: (value: string) => void;
    reset: () => void;
};

const initialState: State = {
    pageNumber: 1,
    pageSize: 12,
    pageCount: 1,
    searchTerm: "",
    searchInputValue: "",
    orderBy: "make",
    filterBy: "live"
};

export const useParamsStore = create<State & Actions>()((set) => ({
    ...initialState,

    // provides implementation for setParams in Actions
    // takes a partial State param and uses "set()" function provided by zustand to update state
    setParams: (newParams) => {
        // set takes a partial of State & Actions (so all properties of State & Actions are available but optional)
        // it's supposed to process any state changes in any way and then return the new state as State typed object
        set((state) => {
            // if pageNumber was changed, simply update it in state
            if (newParams.pageNumber) {
                return {
                    ...state,
                    pageNumber: newParams.pageNumber
                }
            } else {
                // if something else was changed (pageSize, searchTerm), update it in state and reset pageNumber to 1
                // so for example after changing pageSize, we want to start from the first page anew
                return {
                    ...state,
                    ...newParams,
                    pageNumber: 1
                }
            }
        });
    },

    reset: () => set(initialState),
    
    setSearchInputValue(value: string) {
        set({searchInputValue: value});
    }
}));