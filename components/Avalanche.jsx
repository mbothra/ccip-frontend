import React, { useState } from 'react';
import Wallet from '../components/Wallet';
import styles from '../styles/Avalanche.module.css';
import {senderAbi, receiverAbi, contractAddress} from "./constants";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { Contract } from "alchemy-sdk";
import AlertSnackbar from './AlertSnackbar';
import TransactionModal from './TransactionModal';


const App = () => {
  const wallets = [
    { id: 0, imageUrl: '/wallet.svg', chain: 'chain1' },
    { id: 1, imageUrl: '/wallet.svg', chain: 'chain1' },
    { id: 2, imageUrl: '/wallet.svg', chain: 'chain1' },
    { id: 3, imageUrl: '/wallet.svg', chain: 'chain1' },
    { id: 4, imageUrl: '/wallet.svg', chain: 'chain1' },
  ];
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [name, setName] = useState('');
  const { chain, _ } = useNetwork();
  const { data: signer } = useSigner();
  const [isWaiting, setIsWaiting] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("Processing Transaction...");
  const [alertProps, setAlertProps] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [successfulTxsCount, setSuccessfulTxsCount] = useState(0);

  const handleSelect = (id) => {
    if (selectedWallets.includes(id)) {
      setSelectedWallets(selectedWallets.filter((walletId) => walletId !== id));
    } else if (selectedWallets.length < 3) {
      setSelectedWallets([...selectedWallets, id]);
    }
  };

  const handleSubmit = async () => {
    if (name.trim() === '') {
      setAlertProps({
        open: true,
        message: 'Please enter your name.',
        severity: 'error'
      });
      return;
    }
    if (selectedWallets.length !== 3) {
      setAlertProps({
        open: true,
        message: 'Please select three wallets.',
        severity: 'error'
      });
      return;
    }
    console.log(selectedWallets)
    const senderContract = new Contract(contractAddress[chain.id], senderAbi, signer)
    setIsWaiting(true);  // Open the waiting modal
    try {
      setIsWaiting(true)
      setTransactionMessage("Sending wallet picks...");
      const pickBags = await senderContract.pickBags(name, selectedWallets[0], selectedWallets[1], selectedWallets[2])
      await pickBags.wait();  
      setSuccessfulTxsCount(prevCount => prevCount + 1); // increment the successful transaction count
    } catch (e) {
      setIsWaiting(false)
      setTransactionMessage("Error processing transaction.");
      console.log("Error sending transaction:", e.message || e);
      return;
    }

    setIsWaiting(false)
    setAlertProps({
      open: true,
      message: 'Transaction completed successfully!',
      severity: 'success'
    });
        // Check if we've had 3 successful transactions
    if (successfulTxsCount === 3) {
        try {
            setIsWaiting(true)
            setTransactionMessage("Processing batch cross-chain transaction...");
            const sendTransaction = await senderContract.send(contractAddress['11155111']); // Adjust with proper function parameters if needed
            await sendTransaction.wait();
            setSuccessfulTxsCount(0); // reset the count
        } catch (e) {
            setTransactionMessage("Error sending the batch transaction.");
            console.log("Error sending the send transaction:", e.message || e);
            return;
        }
        setIsWaiting(false)
        setAlertProps({
          open: true,
          message: 'Batch Cross Chain Transaction successful!',
          severity: 'success'
        });    
    }
    // Process selected wallets here
    setSelectedWallets([]);
    setName('');
  };

  return (
    <div className={styles.container}>
    <h1 className={styles.tagline}>
      Link, Sync, and Win! Make your Cross-chain move with <span className={styles.highlight}>Chainlink CCIP</span>  
    </h1>
    <div className={styles.wallets}>
      {wallets.map((wallet) => (
        <Wallet
          key={wallet.id}
          id={wallet.id}
          imageUrl={wallet.imageUrl}
          chain={wallet.chain}
          selected={selectedWallets.includes(wallet.id)}
          onSelect={handleSelect}
          selectionOrder={selectedWallets.indexOf(wallet.id) + 1}
        />
      ))}
    </div>
    <div className={styles.inputButtonContainer}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder="Name"  /* Added placeholder */
        />
        <button className={styles.button} onClick={handleSubmit}>Initiate Cross-Chain transfer to Ethereum</button>
      </div>
    <div className={styles.footerSteps}>
      <div className={styles.footerContent}>
        <p>1. Select three wallets</p>
        <p>2. Initiate cross-chain transfer of amount within these wallets to Sepolia</p>
        <p>3. Win swag worth that amount</p>
      </div>
    </div>
    <AlertSnackbar 
      open={alertProps.open} 
      handleClose={() => setAlertProps(prev => ({ ...prev, open: false }))} 
      message={alertProps.message} 
      severity={alertProps.severity} 
    />
    <TransactionModal open={isWaiting} message={transactionMessage} />

  </div>
  );
};

export default App;

