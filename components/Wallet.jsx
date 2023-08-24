import React from 'react';
import styles from '../styles/Wallet.module.css';

const Wallet = ({ id, imageUrl, chain, selected, onSelect, selectionOrder }) => {
  return (
    <div className={`${styles.wallet} ${styles[chain]}`} onClick={() => onSelect(id)}>
      <img src={imageUrl} alt="Wallet" />
      {selected && <div className={styles.selectionIndicator}>{selectionOrder}</div>}
    </div>
  );
};

export default Wallet;
