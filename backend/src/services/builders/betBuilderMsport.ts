import { Builder } from "../../types/types";

// expects an array of bets from msport and returns an array of bets for football and sportybet
const betBuilderMsport = (data: any[]) => {
  let newBet: Array<Builder> = [];
  data.map((bet) => {
    let builder = {
      eventId: "",
      marketId: "",
      specifier: null,
      outcomeId: "",
    };

    builder.eventId = bet.event.eventId;
    builder.marketId = bet.market.id;
    builder.specifier = bet.market.specifiers || null;
    builder.outcomeId = bet.outcome.id;

    newBet.push(builder);
  });
  return newBet;
};

export default betBuilderMsport;
