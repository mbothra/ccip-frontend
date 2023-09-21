import styles from "../styles/Home.module.css";
import Avalanche from "../components/Avalanche";
import '@chainlink/design-system/global-styles.css'
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style
import Sepolia from "../components/Sepolia";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <Avalanche></Avalanche>
      </main>
    </div>
  );
}
