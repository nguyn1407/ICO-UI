import { Button, HStack, Image, Text } from "@chakra-ui/react";
import {numberFormat, showShortAddress} from '../untils'

import React from 'react';

interface Iprops {
  address?: string;
  amount: number;
}

export default function WalletInfo({address, amount}: Iprops){

    return (
      <Button variant="outline" ml="10px" >
        <HStack>
          <Text>{showShortAddress(address)}</Text>
          <Image src="/bnb.png" w="25px" alt="bnb" ml="20px"></Image>
          <Text>{numberFormat(amount)}</Text>
        </HStack>
      </Button>
    )
  
}

