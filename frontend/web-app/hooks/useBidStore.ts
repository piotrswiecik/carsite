import {Bid} from "@/types";
import {create} from "zustand";

type State = {
    bids: Bid[];
};

type Actions = {
    setBids: (bids: Bid[]) => void;
    addBid: (bid: Bid) => void;
};

export const useBidStore = create<State & Actions>((set) => ({
    bids: [],
    setBids: (bids) => set(() => ({bids})),
    addBid: (bid) => set((state) => ({
        bids: !state.bids.find(x => x.id === bid.id) ? [...state.bids, bid] : [...state.bids] // avoid duplicates
    }))
}));