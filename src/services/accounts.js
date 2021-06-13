

const TOKEN = "0b2146ca1735c3f4b1a93b17d2a30976430609b4a55ef465e68db4bdbccf7cad";
const USER_ID = "577";

export const fetchSubAccounts = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${TOKEN}`);

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let data = null;
    try {
        data = await (await (fetch("https://stage.getprospa.com/api/v1/account/holder_sub_wallets/" + USER_ID, requestOptions))).json();
        console.log('data', JSON.stringify(data.data));
    } catch (error) {
        console.log('error', error);
        return data;
    }
    return data.data;

}

export const updateWallet = async (payload) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${TOKEN}`);

    let formdata = new FormData();
    formdata.append("biz_account_id", USER_ID);
    formdata.append("wallet_allocation", JSON.stringify(payload));
    // formdata.append("wallet_allocation", "[{\"walletID\":34, \"walletShare\":20}, {\"walletID\":35, \"walletShare\":40},{\"walletID\":138, \"walletShare\":10},{\"walletID\":139, \"walletShare\":10},{\"walletID\":140, \"walletShare\":10},{\"walletID\":141, \"walletShare\":10}]");

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    console.log("update payload", JSON.stringify(payload));

    fetch("https://stage.getprospa.com/api/v1/account/stake_share_add/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export const resetWalletAllocation = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${TOKEN}`);

    let formdata = new FormData();
    formdata.append("biz_account_id", USER_ID);

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("https://stage.getprospa.com/api/v1/account/readjust_wallet_share/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


/*
et Wallet Allocation To Default ENDPOINT)
Code a function in javascript to allow business owners to change the incoming allocation values across all returned sub-accounts that are not biz_wallet_type:current
Reflect the percentage change across all sub-account input fields (including current), as the business owner changes any value in the input fields. i.e if the allocation is set as (current: 100/tax: 0/savings: 0/salary: 0) and the business owner updates the savings sub-account to 10%, the new allocation will be (current: 90/tax: 0/savings: 10/salary: 0)
Connect to the Update Wallet Allocation ENDPOINT to submit allocation form input values
Connect to the Set Wallet Allocation To Default ENDPOINT to reset wallet allocation values

*/

const warn = (message) => {
    alert(message);
};

const changeAllocation = (subAccountType) => {
    if (subAccountType?.biz_wallet_type == "current") {
        warn("You can't change current wallet account");
        //console.log("Sorry, you ca")
        return false;
    }
}

export const isAllocationChangeable = (subAccountType) => {
    return (subAccountType?.biz_wallet_type !== "current");
}

export const getPercentage = (selectedSubAccount, newAllocation = 0, allSubAccounts = []) => {
    //attempt to find the current account
    let findCurrentAccount = allSubAccounts.find((item) => item.biz_wallet_type == "current");
    if (!findCurrentAccount) {
        throw new Error("Current account not found");
    }
    newAllocation = parseInt(newAllocation);
    if (isNaN(newAllocation)) {
        warn("New allocation is not a number: " + newAllocation);
        newAllocation = 0;
    }
    const minAllocation = 0;
    const maxAllocation = parseInt(findCurrentAccount?.incoming_allocation) + parseInt(selectedSubAccount?.incoming_allocation);
    if (newAllocation > maxAllocation) {
        //new allocation is more than the available allocation
        warn("Current allocation is more than the available allocation: " + maxAllocation);
        selectedSubAccount.incoming_allocation = maxAllocation;
    } else if (newAllocation < minAllocation) {
        //new allocation is more than the available allocation
        warn("Current allocation is less than the minimum allocation: " + minAllocation);
        selectedSubAccount.incoming_allocation = minAllocation;
    } else {
        selectedSubAccount.incoming_allocation = newAllocation;
    }
    //update the current account percentage or allocation
    findCurrentAccount.incoming_allocation = maxAllocation - selectedSubAccount?.incoming_allocation;
    //get new percentage
    const accounts = allSubAccounts.map((item) => {
        if (item.biz_wallet_id == selectedSubAccount.biz_wallet_id) {
            return ({ ...item, ...selectedSubAccount });
        } else if (item.biz_wallet_type == "current") {
            return ({ ...item, ...findCurrentAccount });
        } else {
            return item;
        }

    })

    return accounts;

}

export const updateWalletAllocations = (accounts = []) => {
    let payload = accounts.map((item) =>
        ({
            walletID: item.biz_wallet_id,
            walletShare: item.incoming_allocation,
        }));

    updateWallet(payload);
}