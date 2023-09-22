import React, { useState } from 'react';
import Wallet from '../components/Wallet';
import styles from '../styles/Avalanche.module.css';
import {senderAbi, receiverAbi, contractAddress} from "./constants";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { Contract } from "alchemy-sdk";
import AlertSnackbar from './AlertSnackbar';
import TransactionModal from './TransactionModal';
import button from '@chainlink/design-system/button.module.css'

const CircleNumber = ({ number, text }) => {
  const circleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#375bd2',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '14px'  // Spacing between the circle and the text
  };

  const textStyle = {
    maxWidth: '240px',  // Adjust the width as needed
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    color:'black'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '0 50px' }}>
      <div style={circleStyle}>{number}</div>
      <div style={textStyle}>{text}</div>
    </div>
  );
};


const App = () => {
  const wallets = [
    { id: 0, imageUrl: '/A.svg', chain: 'chain1' },
    { id: 1, imageUrl: '/B.svg', chain: 'chain1' },
    { id: 2, imageUrl: '/C.svg', chain: 'chain1' },
    { id: 3, imageUrl: '/D.svg', chain: 'chain1' },
    { id: 4, imageUrl: '/E.svg', chain: 'chain1' },
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
  const [disabled, setDisabled] = useState(true)
  const [gif, setGif] = useState('')

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
    // Process selected wallets here

    try {
        setGif('/CCIP.gif')
        setIsWaiting(true)
        setTransactionMessage("Sending cross-chain transaction using CCIP...");
        const sendTransaction = await senderContract.send(contractAddress['11155111']); // Adjust with proper function parameters if needed
        await sendTransaction.wait();
        setGif('')
        setSuccessfulTxsCount(0); // reset the count
    } catch (e) {
        setGif('')
        setTransactionMessage("Error sending the batch transaction.");
        console.log("Error sending the send transaction:", e.message || e);
        setIsWaiting(false)
        setAlertProps({
          open: true,
          message: 'Cross Chain Transaction failed!',
          severity: 'error'
        });    

        return;
    }
  setIsWaiting(false)
  setAlertProps({
    open: true,
    message: 'Cross Chain Transaction successful!',
    severity: 'success'
  });    

    setSelectedWallets([]);
    setName('');
  };

  const handleCrossChain = async () => {
    const senderContract = new Contract(contractAddress[chain.id], senderAbi, signer)
  }
 
  return (
    <div className={styles.container}>
    <h1>Chainlink CCIP</h1>
    <p style={{color:'black'}}>Make your cross-chain move with Chainlink CCIP</p>
    <div className="card" style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', width:'1200px'}}>
      <CircleNumber number={1} text="Select three wallets" />
      <CircleNumber number={2} text="Transfer wallets cross-chain to Ethereum using CCIP" />
      <CircleNumber number={3} text="Win swag based on the wallets you transferred" />
    </div>


  <div className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop:'34px'}}>
    <p style={{color:'black', alignContent: 'center'}}>Select three Wallets</p>
      <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
    </div>

    <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '34px', width: '1200px' }}>
    
        <div style={{ display: 'flex', alignItems: 'center' }}>

            <p style={{ color: 'black', margin: '0 20px 0 -100px', alignSelf: 'center', textAlign: 'right', width: '500px' }}>
                Initiate Cross-chain Transfer to Ethereum
            </p>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                style={{ maxWidth: '300px', marginRight: '20px' }}
            />

            <button 
                className={button.primary} 
                onClick={handleSubmit} 
                disabled={!(selectedWallets.length === 3 && name.trim() !== '')}
            >
                Transfer
            </button>

        </div>

    </div>




    <AlertSnackbar 
      open={alertProps.open} 
      handleClose={() => setAlertProps(prev => ({ ...prev, open: false }))} 
      message={alertProps.message} 
      severity={alertProps.severity} 
    />
    <TransactionModal open={isWaiting} message={transactionMessage} gif={gif}/>

  </div>
  );
};

export default App;

