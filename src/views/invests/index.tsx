declare var window: any;

import React from 'react';
import {Flex, Heading, SimpleGrid, Spacer, useDisclosure} from '@chakra-ui/react'
import { IPackage, IWalletInfo, TOKEN, IRate} from '@/_types';
import { WalletInfo, ConnectWallet, SuccessModal } from '../../components'
import { ethers } from 'ethers';
import { packages } from '@/constants';
import InvestsCard from './components/InvestsCard';
import CrowdSaleContract from '@/contracts/CrowdSaleContract';
import UsdtContract from '@/contracts/UsdtContract';


 export default function InvestView(){
  const [wallet, setWallet] = React.useState<IWalletInfo>();
  const [web3Provider, setWeb3Provider] = React.useState<ethers.providers.Web3Provider>();

  const [rate, setRate] = React.useState<IRate>({bnbRate: 0, usdtRate: 0});
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [pak, setPak] = React.useState<IPackage>();
  const [txHash, setTxHash] = React.useState<string>();
  const {isOpen, onClose, onOpen} = useDisclosure();

  const getRate = React.useCallback(async ()=> {
    const crowdContract = new CrowdSaleContract();
    const bnbRate = await crowdContract.getBnbRate();
    const usdtRate = await crowdContract.getUsdtRate();

    setRate({bnbRate, usdtRate});
  }, []);

  React.useEffect(() => {
    getRate();
  }, [getRate]);


  const onConnectMetamark = async() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum,undefined);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await signer.getBalance();
      const bnbBalance = Number.parseFloat(
        ethers.utils.formatEther(bigBalance)
      );
      setWallet({ address, bnb: bnbBalance });
      setWeb3Provider(provider);
    }
  }

  const handleBuyIco = async (pk:IPackage) => {
    if(!web3Provider) return;
    setPak(pk);
    setIsProcessing(true);

    let hash = '';
    const crowdContract = new CrowdSaleContract(web3Provider);
    if(pk.token === TOKEN.USDT){
      const usdtContract = new UsdtContract(web3Provider);
      await usdtContract.approve(crowdContract._contractAddress, pk.amount/rate.usdtRate);
      hash = await crowdContract.buyTokenByUSDT(pk.amount);
    }else{
      hash = await crowdContract.buyTokenByBNB(pk.amount);
    }
    setTxHash(hash);
    onOpen();
    try{

    }catch(er:any){
      console.log(er);
      
    }
    setPak(undefined);
    setIsProcessing(false);
  }

  return(
    <Flex
    w={{base: "full", lg: "100%"}}
    flexDirection="column"
    margin="10px auto"
    
    >
      {/* <Flex>
        <Heading size="lg" fontWeight="bold">
          Blockchain trainee
        </Heading>
        <Spacer/>
        {!wallet && <ConnectWallet onClick={onConnectMetamark}/>}
        {wallet && <WalletInfo address={wallet?.address} amount={wallet?.bnb || 0} />}
      </Flex> */}
      <SimpleGrid column={{base: 1, lg: 3}} mt="50px" spacing="20px" display="flex" flexWrap="wrap">
        {packages.map((pk, index) => (
          <InvestsCard 
          pak={pk} 
          key={String(index)}
          isBuying={isProcessing && pak?.key === pk.key}
          rate={pk.token === TOKEN.BNB ? rate.bnbRate : rate.usdtRate}
          walletInfo={wallet}
          onBuy={()=>handleBuyIco(pk)}
          />
        ))}
      </SimpleGrid>
      <SuccessModal
      isOpen={isOpen}
      onClose={onClose}
      hash={txHash}
      title='BUY ICO'/>
    </Flex>
  );
 }