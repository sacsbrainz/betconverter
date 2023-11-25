import extractNamesFromMsportError from "~/helpers/msport/extractNamesFromMsportError";
import getBookiePostLinkUrl from "~/libs/getBookiePostLinkUrl";
import getBookieShareLinkUrl from "~/libs/getBookieShareLinkUrl";
import betBuilderBangbet from "~/services/builders/betBuilderBangbet";
import { Body } from "~/types/types";

const bangbetMsportemove = async (body: Body) => {
  const { code, input, output } = body;

  // get the bookie share link url
  const url = getBookieShareLinkUrl(code, input.countryShortCode, input.name);

  try {
    // fetch the outcomes/ events in the bet slip
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `bookingCode=${code}`,
    });
    const data = await res.json();

    if (data.info.toLowerCase() === "success") {
      // clean up outcomes and stucture it properly as a fresh post
      const resultOutcomes = betBuilderBangbet(data.data);

      //   throw error is no bet is found
      if (resultOutcomes.length === 0) {
        return { message: "error", error: "No bet found" };
      }

      //   url to post the bet slip to
      const urlPost = getBookiePostLinkUrl(
        output.countryShortCode,
        output.name
      );

      // post the bet slip to the bookie
      const resPost = await fetch(urlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selections: resultOutcomes }),
      });

      const postData = await resPost.json();

      //   throw only hand picked error messages
      if (postData.message.startsWith("Some markets are not available:")) {
        const extractedNames = extractNamesFromMsportError(postData.message);

        const filteredData = data.data.filter(
          (item: { homeTeamName: any; awayTeamName: any }) => {
            const eventName = `${item.homeTeamName} vs. ${item.awayTeamName}`;
            return !extractedNames.some(
              ({ homeTeam, awayTeam }) =>
                eventName.includes(homeTeam) && eventName.includes(awayTeam)
            );
          }
        );
        const resultOutcomes2 = betBuilderBangbet(filteredData);

        //   throw error is no bet is found
        if (resultOutcomes2.length === 0) {
          return { message: "error", error: "No bet found" };
        }

        // post the bet slip to the bookie
        const resPost2 = await fetch(urlPost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selections: resultOutcomes2 }),
        });

        const postData2 = await resPost2.json();

        if (postData2.message.toLowerCase() !== "success") {
          return { message: "error", error: "Something went wrong" };
        }

        return {
          message: "success",
          data: {
            shareCode: postData2.data.shareCode,
          },
        };
      }

      if (postData.message.startsWith("invalid event data, no market there")) {
        return { message: "error", error: postData.message };
      }

      if (postData.message.toLowerCase() !== "success") {
        return { message: "error", error: "Something went wrong" };
      }

      return { message: "success", data: postData.data };
    } else if (data.message === "The code is invalid.") {
      return { message: "error", error: "The code is invalid." };
    } else if (data.message === "The code has expired.") {
      return { message: "error", error: "The code has expired." };
    } else {
      return { message: "error", error: "Something went wrong" };
    }
  } catch (error) {
    // console.log(error);
    return { message: "error", error: "Something went wrong" };
  }
};

export default bangbetMsportemove;
