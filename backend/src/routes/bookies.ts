import { Elysia } from "elysia";

export const bookies = (app: Elysia) =>
    app.get("/bookies", () => {
        const Bookies = [
            {
                name: "sportybet",
                country: "Nigeria",
                countryShortCode: "ng",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "sportybet",
                country: "Ghana",
                countryShortCode: "gh",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "sportybet",
                country: "Uganda",
                countryShortCode: "ug",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "sportybet",
                country: "Tanzania",
                countryShortCode: "tz",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "sportybet",
                country: "Zambia",
                countryShortCode: "zm",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "sportybet",
                country: "Brazil",
                countryShortCode: "int",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "sportybet",
                country: "International",
                countryShortCode: "int",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "football",
                country: "Nigeria",
                countryShortCode: "ng",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "football",
                country: "Ghana",
                countryShortCode: "gh",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "msport",
                country: "Nigeria",
                countryShortCode: "ng",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "msport",
                country: "Ghana",
                countryShortCode: "gh",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "msport",
                country: "Uganda",
                countryShortCode: "ug",
                inputDisabled: false,
                outputDisabled: false,
            },
            {
                name: "bangbet",
                country: "Global",
                countryShortCode: "global",
                inputDisabled: false,
                outputDisabled: true,
            },
            {
                name: "stake",
                country: "Global",
                countryShortCode: "global",
                inputDisabled: false,
                outputDisabled: true,
            },
        ]
        return { message: "success", data: Bookies };

    })