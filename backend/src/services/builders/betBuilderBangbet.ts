import { Builder } from "../../types/types";

// expects an array of bets from Bangbet and returns an array of bets for football and sportybet
const betBuilderBangbet = (data: any[]) => {
  let newBet: Array<Builder> = [];
  data.map((bet) => {
    let builder = {
      eventId: "",
      marketId: "",
      specifier: null,
      outcomeId: "",
    };

    builder.eventId = bet.eventId;
    builder.marketId = bet.marketId;
    builder.specifier = bet.specifiers || null;
    builder.outcomeId = bet.outcomeId;

    newBet.push(builder);
  });
  return newBet;
};

export default betBuilderBangbet;
