// This file is used to connect to the Ethereum network using the Metamask wallet.

// import Web3 from 'web3';

// window.ethereum.request({ method: 'eth_requestAccounts' });

// const web3 =new Web3(window.ethereum);

// export default web3;


////////////////////////////////////

import Web3 from 'web3';

// Create a function to request accounts asynchronously
const getWeb3 = async () => {
  // Request user permission to access their Ethereum accounts
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  // Create and return the web3 instance
  return new Web3(window.ethereum);
};

// Initialize web3 with the current provider
const web3 = new Web3(window.ethereum);

// Export both the initialized web3 and the function to request accounts
export { getWeb3 };
export default web3;
