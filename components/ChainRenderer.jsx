import React, { useState, useEffect } from 'react';
import Avalanche from "../components/Avalanche";
import Sepolia from "../components/Sepolia";

const ChainRenderer = () => {
    const [currentChainId, setCurrentChainId] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_chainId' })
            .then(handleChainChanged)
            .catch((err) => console.error(err));
        } else {
            console.log('MetaMask is not installed.');
        }
    }, []);

    const handleChainChanged = (chainId) => {
        setCurrentChainId(chainId);
    };

    if (!currentChainId) return null;

    return (
        <div>
            {currentChainId === '0xa86a' ? <Avalanche /> : <Sepolia />}
        </div>
    );
}

export default ChainRenderer;
