import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import { CreateFlow } from "./CreateFlow";

import { addresses, abis } from "@my-app/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

import { useWeb3React } from "@web3-react/core";
import * as PushAPI from '@pushprotocol/restapi';

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const { ens } = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  const { account, library, chainId } = useWeb3React();
  const signer = library.getSigner(account);
  
  // Getting Channel Details
  const yourChannel = '0x7BF52A34D90C6266CD0524989eDcEAa395C20b79';
  const [ channelDetails, setChannelDetails ] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await PushAPI.channels.getChannel({
        channel: `eip155:5:${yourChannel}`, // channel address in CAIP
        env: 'staging'
      });

      console.log(data);
      setChannelDetails(data);
    }

    if (!channelDetails && account) {
      console.log('Calling channel data');
      fetchData().catch(console.error);
    }
  }, [channelDetails, account]);

  // Getting Channel Opt-in -1 is not set, 0 is opted out and 1 is opted in
  const [ channelOptStatus, setChannelOptStatus ] = useState(-1);
  const [ userDetail, setUserDetail ] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await PushAPI.user.getSubscriptions({
        user: `eip155:5:${account}`, // user address in CAIP or in address if defaulting to Ethereum
        env: 'staging'
      });

      console.log(data);
      let found = false;
      for (var i = 0; i < data.length; i++) {
        const element = data[i];
        console.log(element.channel);
        if (element.channel === yourChannel) {
          setChannelOptStatus(1);
          found = true;
          console.log('channel found in user opt ins')
        }

        if (found) {
          break;
        }
      }
      
      if (!found) {
        setChannelOptStatus(0);
      }
      setChannelDetails(data);
    }

    if (!userDetail && account) {
      console.log('Calling user details');
      fetchData().catch(console.error);
    }
  }, [userDetail, account]);
  

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
      <CreateFlow />

      {/* {channelOptStatus != -1 &&
          <Button
            onClick={async () => {
              
              if (channelOptStatus) {
                // user subscribed, unsubscribe them
                await PushAPI.channels.unsubscribe({
                  signer: library.getSigner(),
                  channelAddress: `eip155:5:${yourChannel}`, // channel address in CAIP
                  userAddress: `eip155:5:${account}`, // user address in CAIP
                  onSuccess: () => {
                    setChannelOptStatus(!channelOptStatus);
                  },
                  onError: () => {
                    console.error('opt out error');
                  },
                  env: 'staging'
                })
              }
              else {
                // user unsubscribed, subscribe them
                await PushAPI.channels.subscribe({
                  signer: library.getSigner(),
                  channelAddress: `eip155:5:${yourChannel}`, // channel address in CAIP
                  userAddress: `eip155:5:${account}`, // user address in CAIP
                  onSuccess: () => {
                  console.log('opt in success');
                    setChannelOptStatus(!channelOptStatus);
                  },
                  onError: () => {
                    console.error('opt in error');
                  },
                  env: 'staging'
                })
              }             
            }}
          >
            {channelOptStatus ? 'Gasless opt-out' : 'Gasless opt-in'}
          </Button>
        } */}



        {/* <Image src={logo} alt="ethereum-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <Link href="https://reactjs.org">
          Learn React
        </Link>
        <Link href="https://usedapp.io/">Learn useDapp</Link>
        <Link href="https://thegraph.com/docs/quick-start">Learn The Graph</Link> */}
      </Body>
    </Container>
  );
}

export default App;
