"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
  type UseSendUserOperationResult,
  useSendUserOperation,
  useSmartAccountClient,
} from '@account-kit/react';
import React, { useCallback, useEffect, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { tokenAbi } from '@/ABIs/returnToken';
import { nftAbi } from '@/ABIs/returnNFT';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { Alchemy } from 'alchemy-sdk';
import { alchemySetting } from '@/config';
import Image from 'next/image';
import { TOKEN_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, ALCHEMY_RPC_URL } from '@/tempEnv';
import './globals.css';

export default function Home() {
  const [provider, setProvider] = useState<any>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [NFTData, setNFTData] = useState();

  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true, // optional parameter that will wait for the transaction to be mined before returning
    onSuccess: ({ hash, request }) => {
      console.log('hash ', hash);
      console.log('req ', request);
      fetchData();
    },
    onError: (error) => {
      console.log(error);
      fetchData();
    },
  });

  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  const getNFT = useCallback(async () => {
    const alchemy = new Alchemy(alchemySetting);
    const nftData = await alchemy.nft.getNftsForOwner(user?.address);
    if (nftData?.ownedNfts?.length > 0) {
      const nftMetadata = nftData.ownedNfts[0]?.raw.metadata;
      setNFTData(nftMetadata);
    }
  }, [user?.address]);

  const getToken = useCallback(async () => {
    const supply = await provider.readContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: tokenAbi,
      functionName: 'getTokenCount',
      args: [user?.address]
    });
    console.log(supply);
    setTokenCount(Number(supply));
  }, [provider, user?.address]);

  const fetchData = useCallback(async () => {
    getNFT();
    getToken();
  }, [getNFT, getToken]);

  const mint = (contract: `0x${string}`, abi: any, funcName: string) => {
    sendUserOperation({
      uo: {
        target: contract,
        data: encodeFunctionData({
          abi: abi,
          functionName: funcName,
          args: [user?.address]
        })
      },
    })
  };

  useEffect(() => {
    const provider = createPublicClient({
      chain: sepolia,
      transport: http(ALCHEMY_RPC_URL)
    })
    setProvider(provider);
  }, []);

  useEffect(() => {
    user && provider && fetchData();
  }, [fetchData, provider, user]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center text-center">
      {signerStatus.isInitializing ? (
        <>Loading...</>
      ) : user ? (
        <div>
          <div className="flex flex-col gap-2 p-2">
            <p className="text-l">Logged in as</p>
            <p className="text-l font-bold"> {user ? user?.address : "anon"} </p>
            {tokenCount > 0 && <p className="text-xl font-bold mt-6">{`$RTN owned: ${tokenCount}`}</p>}
            {NFTData && (
              <div>
                <p className="text-xl font-bold gap-2 p-2">{NFTData?.description}</p>
                <div className="flex items-center justify-center">
                  <div style={{ width: '50%' }}>
                    <Image src={NFTData?.image} alt={'Image'} width={4} height={3} layout={'responsive'} />
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-row  justify-center items-center gap-20">
              <button
                className="btn btn-primary mt-6 w-56"
                onClick={() => mint(TOKEN_CONTRACT_ADDRESS, tokenAbi, 'mintToken')}
                disabled={isSendingUserOperation}
              >
                {isSendingUserOperation ? "Minting..." : "Mint Token"}
              </button>
              <button
                className="btn btn-primary mt-6 w-56"
                onClick={() => mint(NFT_CONTRACT_ADDRESS, nftAbi, 'mintNFT')}
                disabled={isSendingUserOperation || NFTData}
              >
                {NFTData ? "NFT minted" : isSendingUserOperation ? "Minting..." : "Mint NFT"}
              </button>
            </div>
          </div>
          <div className="my-10">
            <button className="btn btn-primary mt-6 w-56 logout" onClick={() => logout()}>
              Log out
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={openAuthModal}>
          Login
        </button>
      )
      }
    </main >
  );
}
