import getBookiePostLinkUrl from "~/libs/getBookiePostLinkUrl";
import betBuilderStake from "~/services/builders/betBuilderStake";
import { Body } from "~/types/types";

const StakeToFootball = async (body: Body) => {
  const { code, input, output } = body;

  try {
    // fetch the outcomes/ events in the bet slip using my special api that bypasses cloudflare
    const res = await fetch("http://localhost:3012", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.status.toLowerCase() === "success" && !data.data.errors) {
      // clean up outcomes and stucture it properly as a fresh post
      const resultOutcomes = await betBuilderStake(
        data.data.data.bet.bet.outcomes
      );

      // throw error if bet is not supported
      if (resultOutcomes.error === "unsupported") {
        return { message: "error", error: "Unsupported bet" };
      }

      //   throw error is no bet is found
      if (resultOutcomes.newBet.length === 0) {
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
        body: JSON.stringify({ selections: resultOutcomes.newBet }),
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
    } else {
      return { message: "error", error: "Something went wrong" };
    }
  } catch (error) {
    // console.log("error",error);
    return { message: "error", error: "Something went wrong" };
  }
};

export default StakeToFootball;
