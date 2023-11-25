import getBookiePostLinkUrl from "~/libs/getBookiePostLinkUrl";
import getBookieShareLinkUrl from "~/libs/getBookieShareLinkUrl";
import betBuilderMsport from "~/services/builders/betBuilderMsport";
import { Body } from "~/types/types";

const MsportToBangbet = async (body: Body) => {
  const { code, input, output } = body;

  // get the bookie share link url
  const url = getBookieShareLinkUrl(code, input.countryShortCode, input.name);

  try {
    // fetch the outcomes/ events in the bet slip
    const res = await fetch(url, {
      method: "GET",
    });
    const data = await res.json();

    if (data.message.toLowerCase() === "success") {
      // clean up outcomes and stucture it properly as a fresh post
      const resultOutcomes = betBuilderMsport(data.data.bettableBetSlip);

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
        return { message: "error", error: postData.message };
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
    return { message: "error", error: "Something went wrong" };
  }
};

export default MsportToBangbet;
