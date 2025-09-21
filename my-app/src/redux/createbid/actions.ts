import { RootState, RootThunkDispatch } from "../../store";
import {Dispatch} from 'react';

export interface Bid {
    productId: number;
    amount: number;
    finish: boolean;
    success: boolean;
  }

  export interface CreateBids {
      bids: Bid[];
  }

// Action creator
export function addBid(){
    return {
        type: '@@createBids/ADD_BID' as const,
    }
}

export type createBidsActions = ReturnType<typeof addBid>;
