import { IPackage, IWalletInfo } from '@/_types';
import { numberFormat } from '@/untils';
import { Box, Image, Text, Button, HStack, Spinner } from "@chakra-ui/react";
import React from 'react';

interface Iprops{
  pak: IPackage,
  isBuying: boolean,
  rate: number,
  walletInfo?: IWalletInfo,
  onBuy?: () => void 
}

export default function InvestsCard ({pak, isBuying, rate, walletInfo, onBuy} : Iprops) {

  return(
    <Box
    w="360px"
    bg="bg.secondary"
    borderRadius="16px"
    overflow="hidden"
    padding="10px"
    border="1px solid rgba(254,223,86,.6)"
    alignItems="center"
    display="flex"
    flexDirection="column"
    marginBottom="50px"
  >
    <Box
      bgImage={`/${pak.bg}`}
      w="full"
      h="210px"
      borderRadius="16px"
      bgSize="cover"
      bgPos="center"
    />

  <Box
      w="120px"
      h="120px"
      margin="0px auto"
      borderRadius="full"
      marginTop="-60px"
      position="relative"
    >
      <Image
        src={`/${pak.icon}`}
        alt="bnb"
        w="120px"
        h="120px"
        borderRadius="full"
        objectFit="cover"
        border="6px solid rgba(254,223,86,.6)"
      />
      <Image
        src="/verified.svg"
        w="80px"
        alt="verified"
        position="absolute"
        bottom="-30px"
        right="-20px"
      />
    </Box>

    <Text my="20px" fontSize="24px" fontWeight="bold">
      {pak.name }
    </Text>
    <Button
      disabled
      variant="primary"
      my="20px"
      bg="transparent"
      border="1px solid #fff"
      color="rgba(255,255,255, 0.7)"
    >
      {numberFormat(pak.amount)} IPT
    </Button>
    <HStack my="15px">
      <Text color="gray">Amount of coins to pay: </Text>
      <Text variant="notoSan" fontSize="16px">
        {numberFormat(pak.amount / rate)} {pak.token}
      </Text>
    </HStack>

    <Button w="full" variant="primary" disabled={!walletInfo?.address || isBuying} onClick={onBuy}>
      {isBuying ? <Spinner /> : 'Buy Now'}        
    </Button>

  </Box>
  )
}


;