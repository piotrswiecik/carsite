import {Bid} from "@/types";
import {create} from "zustand";

type State = {
    bids: Bid[];
    open: boolean; // use to handle bid display on/off when auction is finished
};

type Actions = {
    setBids: (bids: Bid[]) => void;
    addBid: (bid: Bid) => void;
    setOpen: (open: boolean) => void;
};

export const useBidStore = create<State & Actions>((set) => ({
    bids: [],
    open: true,
    setBids: (bids) => set(() => ({bids})),
    addBid: (bid) => set((state) => ({
        bids: !state.bids.find(x => x.id === bid.id) ? [...state.bids, bid] : [...state.bids] // avoid duplicates
    })),
    setOpen: (open) => set(() => ({open})),
}));