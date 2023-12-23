import { INftItem } from '@/_types';
import MarketContract from '@/contracts/MarketContract';
import NftContract from '@/contracts/NftContract';
import { SimpleGrid, Toast, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react'
import NftP2P from './components/NftP2P';
import { useAppSelector } from '@/reduxs/hooks';
import CardContract from '@/contracts/TokenContract';
import { SuccessModal } from '@/components';
import { getToast } from '@/untils';

export const P2PView = () => {

  const toast = useToast();

  const {web3Provider, wallet} = useAppSelector((state) => state.account);
  const [nfts, setNfts] = React.useState<INftItem[]>();
  const [currentNft, setCurrentNft] = React.useState<INftItem>();
  const [txHash, setTxHash] = React.useState<string>();
  const {isOpen, onClose, onOpen} = useDisclosure();

  const getListedNfts =  React.useCallback(async () => {
    try{
      const marketContract = new MarketContract(web3Provider);
      const nftContract = new NftContract(web3Provider);

      const listedList = await marketContract.getNFTListedOnMarketplace();
      const nftList = await nftContract.getNftInfo(listedList);
      setNfts(nftList);
    }
    catch(ex){}
  }, []);

  React.useEffect(() => {
    getListedNfts();
  }, [getListedNfts])

  const handleBuy = React.useCallback(async (nft: INftItem) => {
    if(!web3Provider || !nft.price) return;
    try{
      setCurrentNft(nft);
      const marketContract = new MarketContract(web3Provider);
      const CardContract = new CardContract(web3Provider);
      await CardContract.approve(marketContract._contractAddress, nft.price);
      const tx = await marketContract.buyNft(nft.id, nft.price);
      setTxHash(tx);
      onOpen();

    }catch(er: any){
      console.log(er);
      
      toast(getToast(er));
    }
  }, [onOpen, Toast, web3Provider])

  return (
    <>
      <SimpleGrid columns={4} spacing="20px">
        {nfts?.map((nft) => (
          <NftP2P
            item={nft}
            key={nft.id}
            isDisabled={!wallet}
            isBuying={currentNft?.id === nft.id}
            onAction={() => handleBuy(nft)}
          />
        ))}
      </SimpleGrid>
      <SuccessModal
        title="BUY NFT"
        hash={txHash}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  ) 
}
