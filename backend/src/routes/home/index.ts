import { Elysia, t } from "elysia";
import bangbetMsportemove from "~/controllers/bangbet/bangbetMsportemove";
import bangbetToFootball from "~/controllers/bangbet/bangbetToFootball";
import bangbetToMsport from "~/controllers/bangbet/bangbetToMsport";
import bangbetToSportybet from "~/controllers/bangbet/bangbetToSportybet";
import FootballToFootball from "~/controllers/football";
import FootballToMsport from "~/controllers/football/footballToMsport";
import FootballToSportybet from "~/controllers/football/footballToSportybet";
import MsportToMsport from "~/controllers/msport";
import MsportToFootball from "~/controllers/msport/msportToFootball";
import MsportToSportybet from "~/controllers/msport/msportToSportybet";
import SportybetToSportybet from "~/controllers/sportybet";
import SportyBetToFootball from "~/controllers/sportybet/sportybetToFootball";
import SportybetToMsport from "~/controllers/sportybet/sportybetToMsport";
import StakeToFootball from "~/controllers/stake/stakeToFootball";
import StakeToMsport from "~/controllers/stake/stakeToMsport";
import StakeToSportybet from "~/controllers/stake/stakeToSportybet";

export const home = (app: Elysia) =>
  app.post(
    "/",
    async ({ body, set }) => {
      const { code, input, output, remove } = body;

      if (input.name.toLocaleLowerCase() === "msport") {
        if (output.name.toLocaleLowerCase() === "sportybet") {
          const res = await MsportToSportybet(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "football") {
          const res = await MsportToFootball(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "msport") {
          const res = await MsportToMsport(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        // if (output.name.toLocaleLowerCase() === "bangbet") {
        //   const res = await MsportToBangbet(body);
        //   if (res.message === "error") {
        //     set.status = 400;
        //     return res;
        //   }
        //   set.status = 200;
        //   return res;
        // }
        else {
          set.status = 400;
          return { message: "error", error: "Something went wrong" };
        }
      }
      if (input.name.toLocaleLowerCase() === "sportybet") {
        if (output.name.toLocaleLowerCase() === "football") {
          const res = await SportyBetToFootball(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "msport") {
          const res = await SportybetToMsport(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "sportybet") {
          const res = await SportybetToSportybet(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        } else {
          set.status = 400;
          return { message: "error", error: "Something went wrong" };
        }
      }
      if (input.name.toLocaleLowerCase() === "football") {
        if (output.name.toLocaleLowerCase() === "sportybet") {
          const res = await FootballToSportybet(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "msport") {
          const res = await FootballToMsport(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "football") {
          const res = await FootballToFootball(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        } else {
          set.status = 400;
          return { message: "error", error: "Something went wrong" };
        }
      }
      if (input.name.toLocaleLowerCase() === "stake") {
        if (output.name.toLocaleLowerCase() === "sportybet") {
          const res = await StakeToSportybet(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "football") {
          const res = await StakeToFootball(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "msport") {
          const res = await StakeToMsport(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        } else {
          set.status = 400;
          return { message: "error", error: "Something went wrong" };
        }
      }
      if (input.name.toLocaleLowerCase() === "bangbet") {
        if (output.name.toLocaleLowerCase() === "sportybet") {
          const res = await bangbetToSportybet(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "football") {
          const res = await bangbetToFootball(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "msport" && remove === true) {
          const res = await bangbetMsportemove(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        if (output.name.toLocaleLowerCase() === "msport") {
          const res = await bangbetToMsport(body);
          if (res.message === "error") {
            set.status = 400;
            return res;
          }
          set.status = 200;
          return res;
        }
        // if (output.name.toLocaleLowerCase() === "bangbet") {
        //   const res = await bangbetToBangbet(body);
        //   if (res.message === "error") {
        //     set.status = 400;
        //     return res;
        //   }
        //   set.status = 200;
        //   return res;
        // }
        else {
          set.status = 400;
          return { message: "error", error: "Something went wrong" };
        }
      }

      set.status = 400;
      return { message: "error", error: "Not yet supported" };
    },
    {
      detail: {
        tags: ["Convert"]
      },
      body: t.Object({
        code: t.String(),
        input: t.Object({
          name: t.String(),
          country: t.String(),
          countryShortCode: t.String(),
        }),
        output: t.Object({
          name: t.String(),
          country: t.String(),
          countryShortCode: t.String(),
        }),
        remove: t.Boolean({
          default: false,
        }),
      }),
      response: {
        200: t.Object({
          message: t.String(),
          data: t.Array(t.Object({
            bettableBetSlip: t.Null(),
            followedTimes: t.Number(),
            message: t.Null(),
            operId: t.Null(),
            originalSelectionCount: t.Number(),
            rank: t.Number(),
            relatedBettableBetSlip: t.Null(),
            shareCode: t.String(),
            shareCodeWithoutUser: t.String(),
            showFollowedTimes: t.Number(),
            showRank: t.Number(),
            ticket: t.Null(),
            userId: t.Null()
          }))
        }),
        400: t.Object({
          message: t.String(),
          error: t.String()
        }),
        500: t.Object({
          message: t.String(),
          error: t.String()
        })
      }
    }
  );
