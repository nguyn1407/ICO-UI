import { ActionType, IAuctionInfo, INftItem } from '@/_types';
import MarketContract from '@/contracts/MarketContract';
import NftContract from '@/contracts/NftContract';
import { useAppSelector } from '@/reduxs/hooks';
import { Flex, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, useBoolean, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import Nft from './components/Nft';
import ProcessingModal from '@/components/ProcessingModal';
import ListModal from './components/ListModal';
import SuccessModal from '@/components/SuccessModal';
import TransferModal from './components/TransferModal';
import NftAuction from '../auctions/components/NftAuction';
import AuctionContract from '@/contracts/AuctionContract';

export default function MarketView(){
  const {web3Provider, wallet} = useAppSelector((state) => state.account);
  const [nfts, setNfts] = React.useState<INftItem[]>([]);
  const [nftsListed, setNftsListed] = React.useState<INftItem[]>([]);
  const [nft, setNft] = React.useState<INftItem>();
  const [action, setAction] = React.useState<ActionType>();
  const [isOpen, setIsOpen] = useBoolean();
  const [txHash, setTxHash] = React.useState<string>();
  const [isUnlist, setIsUnList] = useBoolean();

  const [isProcessing, setIsProcessing] = useBoolean();
  const [isOpenTransferModal, setOpenTransferModal] = React.useState<boolean>(false);

  const [auctions, setAuctions] = React.useState<IAuctionInfo[]>([]);
  const [modalType, setModalType] = React.useState<"AUCTION" | "LISTING">("LISTING");

  const {
    isOpen: isSuccess,
    onClose: onCloseSuccess,
    onOpen: onOpenSuccess,
  } = useDisclosure();

  const getListNft = React.useCallback(async () => {
    if(!web3Provider || !wallet) return;
    const nftContract = new NftContract(web3Provider);
    if(!wallet.address){
      alert("Connect Wallet Wrong!");
      return
    }

    const nfts = await nftContract.getListNFT(wallet.address);
    setNfts(nfts.filter(p => p.name));
    const marketContract = new MarketContract(web3Provider);
    const ids = await marketContract.getNFTListedOnMarketplace();
    const listedNfts = await nftContract.getNftInfo(ids);
    setNftsListed(listedNfts);

    const auctionContract = new AuctionContract(web3Provider);
    const auctionNfts = await auctionContract.getAuctionByStatus();
    const myAuction = auctionNfts.filter((p) => p.auctioneer === wallet.address);
    const nftAuctions = await nftContract.getNftAuctionInfo(myAuction);
    setAuctions(nftAuctions);

  }, [web3Provider, wallet]);

  React.useEffect(() => {
    getListNft();
  },[getListNft]);

  const selectAction = async (ac: ActionType, item: INftItem) => {
    if (!web3Provider) return;
    setNft(item);
    setAction(ac);
    setIsProcessing.off();
    switch (ac) {
      case "AUCTION": {
        setModalType(ac === "AUCTION" ? "AUCTION" : "LISTING");
        setIsOpen.on();
        break;
      }
      case "LIST": {
        setIsOpen.on();
        break;
      }
      case "UNLIST": {
        setIsUnList.on();
        const marketContract = new MarketContract(web3Provider);
        const tx = await marketContract.unListNft(item.id);
        setTxHash(tx);
        setAction(undefined);
        setNft(undefined);
        setIsUnList.off();
        onOpenSuccess();
        await getListNft();
        break;
      }
      case "TRANSFER": {
        setOpenTransferModal(true);
        break;
      }
      default:
        break;
    }
  };

  const handleListNft = async (price: number, expireDate?: Date | null) => {
    if (!price || !web3Provider || !wallet || !nft) return;
    setIsProcessing.on();
    try {
      const nftContract = new NftContract(web3Provider);
      let tx = "";
      if(modalType === "LISTING"){
        const marketContract = new MarketContract(web3Provider);
        await nftContract.approve(marketContract._contractAddress, nft.id);
        const tx = await marketContract.listNft(nft.id, price);
      }else{
        if(!expireDate) return;
        const auctionContract = new AuctionContract(web3Provider);
        await nftContract.approve(auctionContract._contractAddress, nft.id);
        const startTime = Math.round((new Date().getTime() / 1000) + 60);
        tx = await auctionContract.createAuction(
          nft.id,
          price,
          startTime,
          Math.round(expireDate.getTime() / 1000)
        );
      }
      
      setTxHash(tx);
      onOpenSuccess();
      setAction(undefined);
      setNft(undefined);
      setIsOpen.off();
      await getListNft();
    } catch (er: any) {
      console.log(er);
      setIsProcessing.off();
    }
  };

  const handleTransfer = async (toAddress: string) => {
    setIsProcessing.on();
    try{
      if(!web3Provider || !wallet || !nft) return;
      
      const nftContract = new NftContract(web3Provider);
      await nftContract.approve(toAddress, nft.id);

      if(!wallet.address){
        console.log("wallet address connect error!");
        return;
      }

      const tx = await nftContract.safeTransferFrom(
        wallet.address,
        toAddress,
        nft.id
      );
        setTxHash(tx);
        setOpenTransferModal(false);
        onOpenSuccess();
        await getListNft();

        const transaction = {
          fromAddress: wallet.address,
          toAddress: toAddress,
          txHash: tx,
          action: "Transfer token"
        }
  
        fetch("http://localhost:3500/transactions/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction)
        })
        .then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error))
    }
    catch(ex){}

    setIsProcessing.off();
  }

  return(
    <Flex w="full">
      <Tabs>
        <TabList borderBottomColor="#5A5A5A" borderBottomRadius={2} mx="15px">
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            ITEMS
          </Tab>
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            active listings
          </Tab>
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Live Auctions
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nfts.map((nft, index) => (
                <Nft
                  item={nft}
                  key={index}
                  index={index}
                  isAuction
                  isList
                  isTransfer
                  onAction={(a) => selectAction(a, nft)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftsListed.map((nft, index) => (
                <Nft
                  item={nft}
                  key={index}
                  index={index}
                  isUnList
                  onAction={(a) => selectAction(a, nft)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {auctions.map((nft, index) => (
                <NftAuction
                  item={nft}
                  key={index}
                  isCancel
                  onAction={async (a) => {
                    setIsUnList.on();
                    try {
                      const auctionContract = new AuctionContract(web3Provider);
                      const tx = await auctionContract.cancelAuction(
                        nft.auctionId
                      );
                      setTxHash(tx);
                      onOpenSuccess();
                      await getListNft();
                    } catch (ex) {
                      console.log(ex);
                    }
                    setIsUnList.off();
                  }}
                />
              ))}
            </SimpleGrid>
                </TabPanel>
        </TabPanels> 
      </Tabs>

      <ProcessingModal isOpen={isUnlist} onClose={() => {}} />
      <ListModal
        type={modalType}
        isOpen={isOpen}
        nft={nft}
        isListing={isProcessing}
        onClose={() => setIsOpen.off()}
        onList={(amount, expireDate) => handleListNft(amount, expireDate)}/>

      <TransferModal
        isOpen={isOpenTransferModal}
        nft={nft}
        isTransfer={isProcessing}
        onClose={() => setOpenTransferModal(false)}
        onTransfer={(toAddress) => handleTransfer(toAddress)}
      />

      <SuccessModal
        hash={txHash}
        title="SUCCESS"
        isOpen={isSuccess}
        onClose={onCloseSuccess}
      />
    </Flex>
  );
}

