export interface Builder {
  eventId: string;
  marketId: string;
  specifier: string | null;
  outcomeId: string;
}

export interface Body {
  code: string;
  input: {
    name: string;
    country: string;
    countryShortCode: string;
  };
  output: {
    name: string;
    country: string;
    countryShortCode: string;
  };
}
