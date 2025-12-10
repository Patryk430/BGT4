import React, { useState } from "react";
import { ethers } from "ethers";

// ------------------ EDIT THESE ------------------

// 1) Paste your deployed contract address here:
const CONTRACT_ADDRESS = "0xBd6b9DB9e2b6C1ea9fb9Ce59748240b2A26E21Aa";

// 2) Paste your ABI array from build/contracts/Subscription.json
//    Example: const ABI = [ { "inputs": [...], "name": "price", ... }, ... ];
const ABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_billingPeriod",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldPeriod",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newPeriod",
          "type": "uint256"
        }
      ],
      "name": "BillingPeriodUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "atTimestamp",
          "type": "uint256"
        }
      ],
      "name": "Cancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        }
      ],
      "name": "PriceUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expiry",
          "type": "uint256"
        }
      ],
      "name": "Renewed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expiry",
          "type": "uint256"
        }
      ],
      "name": "Subscribed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawn",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback",
      "payable": true
    },
    {
      "inputs": [],
      "name": "billingPeriod",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "creator",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "expiry",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [],
      "name": "subscribe",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "renew",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "secondsRemaining",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        }
      ],
      "name": "updatePrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPeriod",
          "type": "uint256"
        }
      ],
      "name": "updateBillingPeriod",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// ------------------------------------------------

function App() {
  const [account, setAccount] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getContract() {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    return { provider, signer, contract };
  }

  async function connectWallet() {
    try {
      setError("");
      if (!window.ethereum) {
        setError("MetaMask not detected");
        return;
      }

      // Ask MetaMask for accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const { signer, contract } = await getContract();
      const addr = await signer.getAddress();
      setAccount(addr);

      await loadData(contract, addr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to connect");
    }
  }

  async function loadData(contract, addr) {
    try {
      setLoading(true);
      setError("");

      // Read price
      const priceWei = await contract.price(); // bigint
      setPrice(priceWei.toString());

      // Read status
      const isActive = await contract.isActive(addr);
      setActive(isActive);
    } catch (err) {
      console.error("loadData error:", err);
      setError("Failed to load contract data – check ABI, address, and network.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe() {
    try {
      setLoading(true);
      setError("");

      const { signer, contract } = await getContract();
      const addr = await signer.getAddress();

      const priceWei = await contract.price();
      const tx = await contract.subscribe({ value: priceWei });
      await tx.wait();

      await loadData(contract, addr);
      alert("Subscription successful");
    } catch (err) {
      console.error("subscribe error:", err);
      setError(err.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "32px",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <h1>Subscription dApp</h1>

      <button onClick={connectWallet} disabled={loading}>
        {account ? "Reconnect" : "Connect Wallet"}
      </button>

      {account && (
        <>
          <p>
            <strong>Account:</strong> {account}
          </p>
          <p>
            <strong>Price:</strong>{" "}
            {price ? `${price} wei` : "(not loaded yet)"}
          </p>
          <p>
            <strong>Status:</strong> {active ? "Active ✅" : "Not active ❌"}
          </p>

          <button onClick={handleSubscribe} disabled={loading}>
            {loading ? "Processing..." : "Subscribe"}
          </button>
        </>
      )}

      {!account && <p>Connect your wallet to see subscription info.</p>}

      {error && (
        <p style={{ color: "red", marginTop: "16px" }}>
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
}

export default App;
