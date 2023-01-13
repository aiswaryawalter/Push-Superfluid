import React, { useEffect, useState } from "react";
import * as PushAPI from "@pushprotocol/restapi";

function Optin({signer, channelAddress, subscriberAddress}) {
  const optin = async (signer, channelAddress, subscriberAddress) => {
    try {
      await PushAPI.channels.subscribe({
        signer,
        channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
        userAddress: `eip155:5:${subscriberAddress}`, // user address in CAIP
        onSuccess: () => {
          console.log("opt in success");
        },
        onError: () => {
          console.error("opt in error");
        },
        env: "staging",
      });
    console.log('hey')
    } catch (e) {
      console.log(e);
    }
  };

  return <h1 onClick={() => optin(signer, channelAddress, subscriberAddress)}>Opt-in</h1>;
}

export default Optin;
