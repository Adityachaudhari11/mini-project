document.addEventListener("DOMContentLoaded", function () {
    // Target the elements
    document.querySelector(".accountList").addEventListener("click", changeAccount);
    document.getElementById("userAddress").addEventListener("click", copyAddress);
    document.getElementById("transferfund").addEventListener("click", handler);
    document.getElementById("header_network").addEventListener("click", getOpenNetwork);
    document.getElementById("network_item").addEventListener("click", getSelectedNetwork);
    document.getElementById("add_network").addEventListener("click", setNetwork);
    document.getElementById("loginAccount").addEventListener("click", loginUser);
    document.getElementById("accountCreate").addEventListener("click", createUser);
    document.getElementById("openCreate").addEventListener("click", openCreate);
    document.getElementById("sign_up").addEventListener("click", signUp);
    document.getElementById("login_up").addEventListener("click", login);
    document.getElementById("logout").addEventListener("click", logout);
    document.getElementById("open_Transfer").addEventListener("click", openTransfer);
    document.getElementById("goBack").addEventListener("click", goback);
    document.getElementById("open_Import").addEventListener("click", openImport);
    document.getElementById("goBack_import").addEventListener("click", importGoBack);
    document.getElementById("open_assets").addEventListener("click", openAssets);
    document.getElementById("open_activity").addEventListener("click", openActivity);
    document.getElementById("goHomePage").addEventListener("click", goHomePage);
    document.getElementById("openAccountImport").addEventListener("click", openImportModel);
    document.getElementById("close_import_account").addEventListener("click", closeImportModel);
    document.getElementById("add_new_token").addEventListener("click", addToken);
    document.getElementById("add_New_Account").addEventListener("click", addAccount);
});

// State variables
let providerURL = "https://polygon-amoy.g.alchemy.com/v2/XmqLtljL9SGmyGSEHK95H322L6dPhbsS";
let privateKey;
let address;

// Functions for data and their storage
function handler() {
    document.getElementById("transfer_center").style.display = "flex";
    const amount = document.getElementById("amount").value;
    const toAddress = document.getElementById("toAddress").value; // Correct ID for the recipient address

    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    let wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
    };

    let linkElement = document.getElementById("link");
    wallet.sendTransaction(tx).then((txobj) => {
        console.log("txHash:", txobj.hash);
        document.getElementById("transfer_center").style.display = "none";
        linkElement.href = `https://mumbai.polygonscan.com/tx/${txobj.hash}`;
        linkElement.style.display = "block";
    }).catch((error) => {
        console.error("Transaction error:", error);
    });
}

function checkBalance(address) {
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    
    provider.getBalance(address).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance);
        document.getElementById("accountBalance").innerHTML = `${balanceInEth} MATIC`;
        document.getElementById("userAddress").innerHTML = `${address.slice(0, 15)}...`;
    }).catch((error) => {
        console.error("Balance fetch error:", error);
    });
}

function getOpenNetwork() {
    document.getElementById("network").style.display = "block";
}

function getSelectedNetwork(e) {
    const element = document.getElementById("selected_network");
    element.innerHTML = e.target.innerHTML;

    switch (e.target.innerHTML) {
        case "Ethereum Mainnet":
            providerURL = "https://eth-mainnet.g.alchemy.com/v2/XmqLtljL9SGmyGSEHK95H322L6dPhbsS";
            break;
        case "Polygon Mainnet":
            providerURL = "https://rpc.ankr.com/polygon";
            break;
        case "Polygon Amoy":
            providerURL = "https://rpc.ankr.com/polygon_amoy";
            break;
        case "Sepolia testnet":
            providerURL = "https://rpc.ankr.com/eth_sepolia";
            break;
        case "Holesky testnet":
            providerURL = "https://rpc.ankr.com/eth_holesky";
            break;
    }
    document.getElementById("network").style.display = "none";
    console.log(providerURL);
}

function setNetwork() {
    document.getElementById("network").style.display = "none";
}

function loginUser() {
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("LoginUser").style.display = "block";
}

function createUser() {
    document.getElementById("createAccount").style.display = "block";
    document.getElementById("LoginUser").style.display = "none";
}

function openCreate() {
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("create_popUp").style.display = "block";
}

function signUp() {
    console.log("Signup btn triggered");
    const name = document.getElementById("sign_up_name").value;
    const email = document.getElementById("sign_up_email").value;
    const password = document.getElementById("sign_up_password").value;
    const passwordConfirm = document.getElementById("sign_up_passwordConfirm").value;

    document.getElementById("field").style.display = 'none';
    document.getElementById("center").style.display = 'block';

    const wallet = ethers.Wallet.createRandom();

    if (wallet.address) {
        console.log(wallet);
        const url = "http://localhost:3005/api/v1/user/signup";

        const data = {
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            address: wallet.address,
            private_key: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase,
        };

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => response.json()).then((result) => {
            document.getElementById("createdAddress").innerHTML = wallet.address;
            document.getElementById("createdPrivateKey").innerHTML = wallet.privateKey;
            document.getElementById("createdMnemonic").innerHTML = wallet.mnemonic.phrase;
            document.getElementById("center").style.display = "block";
            document.getElementById("accountData").style.display = "block";

            const userwallet = {
                address: wallet.address,
                private_key: wallet.privateKey,
                mnemonic: wallet.mnemonic.phrase,
            };

            localStorage.setItem("userWallet", JSON.stringify(userwallet));
            document.getElementById("goHomePage").style.display = "block";
            window.location.reload();
        }).catch((error) => {
            console.log("ERROR:", error);
        });
    }
}

function login() {
    document.getElementById("login_form").style.display = "none";
    document.getElementById("login_form").style.display = "block";

    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    const url = "http://localhost:3005/api/v1/user/login";
    const data = {
        email: email,
        password: password,
    };

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json()).then((result) => {
        console.log(result);
        const userWallet = {
            address: result.data.user.address,
            private_key: result.data.user.private_key,
            mnemonic: result.data.user.mnemonic,
        };

        localStorage.setItem("userWallet", JSON.stringify(userWallet));
        window.location.reload();
    }).catch((error) => {
        console.log(error);
    });
}

function logout() {
    localStorage.removeItem("userWallet");
    window.location.reload();
}

function openTransfer() {
    document.getElementById("transfer_form").style.display = "block";
    document.getElementById("home").style.display = "none";
}

function goback() {
    document.getElementById("transfer_form").style.display = "none";
    document.getElementById("home").style.display = "block";
}

function openImport() {
    document.getElementById("import_token").style.display = "block";
    document.getElementById("home").style.display = "none";
}

function importGoBack() {
    document.getElementById("import_token").style.display = "none";
    document.getElementById("home").style.display = "block";
}

function openActivity() { 
    document.getElementById("activity").style.display = "block";
    document.getElementById("assets").style.display = "none";
}

function openAssets() {
    document.getElementById("activity").style.display = "none";
    document.getElementById("assets").style.display = "block";
}

function goHomePage() {
    document.getElementById("create_popUp").style.display = "none";
    document.getElementById("home").style.display = "block";
}

function openImportModel() {
    document.getElementById("import_account").style.display = "block";
    document.getElementById("home").style.display = "none";
}

function closeImportModel() {
    document.getElementById("import_account").style.display = "none";
    document.getElementById("home").style.display = "block";
}

function addToken() {
    const tokenAddress = document.getElementById("token_address").value;
    const name = document.getElementById("token_name").value;
    const symbol = document.getElementById("token_symbol").value;

    const url = "http://localhost:3000/api/v1/tokens/createtoken";
    const data = {
        name: name,
        address: tokenAddress,
        symbol: symbol,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((result) => {
          console.log(result);
          window.location.reload();
      })
      .catch((error) => {
          console.log("ERROR:", error);
      });
}

function addAccount() {
    const privateKeyInput = document.getElementById("add_account_private_key").value;
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    let wallet = new ethers.Wallet(privateKeyInput, provider);
    
    console.log(wallet);

    const url = "http://localhost:3000/api/v1/account/createaccount";
    const data = {
        privatekey: privateKeyInput,
        address: wallet.address,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((result) => {
          console.log(result);
          window.location.reload();
      })
      .catch((error) => {
          console.log(error);
      });
}

function myFunction() {
    const str = localStorage.getItem("userWallet");
    const parsedObj = JSON.parse(str);

    if (parsedObj?.address) {
        document.getElementById("loginUser").style.display = "none";
        document.getElementById("home").style.display = "block";

        privateKey = parsedObj.private_key;
        address = parsedObj.address;

        checkBalance(parsedObj.address);
    }

    const tokenRender = document.querySelector("#assets");
    const accountRender = document.querySelector(".accountList");

    const url = "http://localhost:3005/api/v1/tokens/alltoken";
    
    fetch(url).then((response) => response.json()).then((data) => {
        let elements = "";
        data.data.tokens.map((token) => {
            elements += `
                <div class="assets_item">
                    <img class="assets_item_png" src="./assets/logo.png" alt=""/>
                    <span>${token.address.slice(0, 15)}...</span>
                    <span>${token.symbol}</span>
                </div>`;
        });
        tokenRender.innerHTML = elements;
    }).catch((error) => {
        console.log(error);
    });

    fetch("http://localhost:3005/api/v1/account/allaccount").then((response) => response.json()).then((data) => {
        let accounts = "";
        data.data.accounts.map((account, i) => {
            accounts += `
                <div class="list">
                    <p>${i + 1}</p>
                    <p class="accountsValue" data-address="${account.address}" data-privatekey="${account.privateKey}">
                        ${account.address.slice(0, 25)}...
                    </p>
                </div>`;
        accountRender.innerHTML += accounts;
        });
    }).catch((error) => {
        console.log(error);
    });

    console.log(privateKey);
}

function copyAddress() {
    navigator.clipboard.writeText(address).then(() => {
        console.log("Address copied to clipboard");
    }).catch((err) => {
        console.error("Failed to copy address:", err);
    });
}

function changeAccount() {
    const data = document.querySelector(".accountsValue");
    const newAddress = data.getAttribute("data-address");
    const newPrivateKey = data.getAttribute("data-privatekey");

    console.log(newPrivateKey, newAddress);

    const userWallet = {
        address: newAddress,
        private_key: newPrivateKey,
        mnemonic: "changed"
    };

    localStorage.setItem("userWallet", JSON.stringify(userWallet));
    window.location.reload();
}

window.onload = myFunction;
