import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';  // Adjust path accordingly
import styles from '../styles/Sepolia.module.css';
import { receiverAbi, contractAddress } from "./constants";
import AlertSnackbar from './AlertSnackbar';
import TransactionModal from './TransactionModal';
import { ethers } from 'ethers';

const Sepolia = () => {
    const [data, setData] = useState([]);
    const infuraRpcUrl = 'https://sepolia.infura.io/v3/84a22f268f104ea3b696699dfbc10a25'; // Replace with your Infura RPC URL
    const provider = new ethers.providers.JsonRpcProvider(infuraRpcUrl);
    const yourPrivateKey = 'f11ffe0c2a41fb52c9112793ce2fbad6ce48eaeca11b493421a26f7c234ec6fe'; // Replace with your private key
    const signer = new ethers.Wallet(yourPrivateKey, provider);

    const columns = [
        { label: 'Attendee Name', dataKey: 'name', width: 250 },
        { label: 'Total Amount Won', dataKey: 'amount', numeric: true, width: 250 },
        { label: 'Source Chain', dataKey: 'source',  width: 250 },
        { label: 'Destination Chain', dataKey: 'destination',  width: 250 },
        { label: 'Rank', dataKey: 'rank', width: 150 }
    ];
    
    const calculateRanks = (dataArray) => {
        return dataArray.sort((a, b) => {
            b_amount = hexToNumber(b['amount']._hex);
            a_amount = hexToNumber(a['amount']._hex);
            return b_amount - a_amount
        }).map((item, index) => {
                let rank;
                if (index === 0) rank = 'Highest';
                else if (index === 1) rank = 'Second Highest';
                else if (index === 2) rank = 'Third Highest';
                else rank = '';
    
                return { 'name': item['name'],'amount':hexToNumber(item['amount']._hex), 'source': 'Avalanche Fuji', 'destination': 'Ethereum Sepolia', rank };
            });
    };
    
    
    async function getWeb3Account() {
        const account = await signer.getAddress();
        const chainId = (await provider.getNetwork()).chainId;
        return {
            signer: signer,
            provider: provider,
            chainId: chainId,
            account: account
        };
    }
    
    const hexToNumber = (hex) => {
        return parseInt(hex, 16);
    };
             

    const getContractData = async () => {

        const { signer, provider, chainId, account } = await getWeb3Account();
        const contract = new ethers.Contract(contractAddress['11155111'], receiverAbi, provider);
        const receiverContract = contract.connect(signer);
        try {
            // Replace this with the actual method from your smart contract
            const rawData = await receiverContract.getAllNameAndAmounts();
            console.log("API call result:", rawData);
            const rankedData = calculateRanks(rawData);
            console.log(rawData)
            setData(rankedData);    
        } catch (error) {
            console.error("Error calling API:", error);
        }

    };

    useEffect(() => {
        getContractData();  // Fetch data immediately when component mounts

        const interval = setInterval(() => {
            getContractData();
        }, 60000);  // Polls every minute

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.spacing}>Chainlink CCIP Finale: The Trio's Mighty Total</h1>
            <DataTable data={data} columns={columns} className={styles.table} />
            <div className={styles.spacing}>
                <button className={styles.button} onClick={() => getContractData()}>Refresh Data</button>
            </div>
            <AlertSnackbar />
            <TransactionModal />
        </div>
    );
};

export default Sepolia;
