import { Builder } from "../../types/types";

const betBuilder = (data: any[]) => {
  let newBet: Array<Builder> = [];
  data.map((bet) => {
    let builder = {
      eventId: "",
      marketId: "",
      specifier: null,
      outcomeId: "",
    };
    bet.markets.map(
      (market: { outcomes: any[]; id: string; specifier: null }) => {
        market.outcomes.map((outcome: { id: string }) => {
          builder.eventId = bet.eventId;
          builder.marketId = market.id;
          builder.specifier = market.specifier || null;
          builder.outcomeId = outcome.id;
        });
      }
    );
    newBet.push(builder);
  });
  return newBet;
};

export default betBuilder;
