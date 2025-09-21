// import produce from "immer";
import { CreateBids,createBidsActions } from "./actions";



  const initialState:CreateBids = {
      bids: []
  }

  export function createBidsReducer(state: CreateBids = initialState): CreateBids {
      return initialState;
  }


  