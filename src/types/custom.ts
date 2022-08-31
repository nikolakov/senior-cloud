import { AddressInfo } from 'net';

// Typescript typeguard
export const isAddressInfo = (addressInfo: string | AddressInfo): addressInfo is AddressInfo => {
  return (<AddressInfo>addressInfo).address !== undefined;
};
