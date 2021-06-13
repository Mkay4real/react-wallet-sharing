import React, { useState } from "react";
//Components
import LinearProgress from "@material-ui/core/LinearProgress";
import { FormControl, InputLabel, Input, FormHelperText, Paper, Typography, CssBaseline } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
//styles
import { Wrapper } from "./App.styles";

import { fetchSubAccounts, resetWalletAllocation, updateWalletAllocations, isAllocationChangeable, getPercentage } from "./services/accounts";
import { Button } from "@material-ui/core";

const FormItem = ({ account, onAllocationChange = () => { } }) => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="my-input">{account?.preferred_name}</InputLabel>
      <Input
        id="my-input"
        placeholder={account?.incoming_allocation}
        value={account?.incoming_allocation}
        type="number"
        max="100"
        min="0"
        disabled={!isAllocationChangeable(account)}
        name={account?.biz_wallet_id}
        onChange={(event_) => onAllocationChange(event_, account)}
      />
      {/* <FormHelperText id="my-helper-text"> Sample helper</FormHelperText> */}
    </FormControl>
  )
}

const SubWalletsShare = ({ accounts = [], onReset = () => { } }) => {
  const [mappedAccounts, setMappedAccounts] = React.useState([]);
  React.useEffect(() => {
    const totalAllocation = parseInt(accounts.reduce((ack, item) => ack + item.incoming_allocation, 0)).toFixed(2);
    console.log("Total Allocation", totalAllocation + "/100");
    setMappedAccounts(accounts.map((acc) => {
      if (acc.biz_wallet_type === "current" && totalAllocation < 100) {
        return ({ ...acc, incoming_allocation: 100 - totalAllocation })
      }
      return acc;
    }));

  }, [accounts]);

  const onAllocationChange = (e, item) => {
    let value = parseInt(e.target.value);
    let id = e.target.name;
    // if(!isNaN(value))
    // value= 0;

    console.log(value, id);

    setMappedAccounts(getPercentage(item, value, mappedAccounts));
  };
  return (
    <Wrapper style={{ margin: "auto", padding: 16, maxWidth: 600 }}>
      <CssBaseline />
      <Typography variant="h4" align="center" gutterBottom>My Account Dashboard</Typography>
  <Typography paragraph > This form allows business owners (you) to change the incoming allocation values across all returned sub-accounts that are not wallet type of 'current'
  Note: Total allocation can not be greater or less than 100%

  </Typography>

      <Paper style={{ padding: 16, }} color="primary">
        <Typography variant="h6" align="center" gutterBottom>Sub wallets Percentage</Typography>

        <form>
          <Grid container alignItems="flex-start" spacing={2}>
            {Array.isArray(mappedAccounts) ?
              mappedAccounts.map((item) => (
                <Grid item xs={12}>
                  <FormItem account={item} onAllocationChange={onAllocationChange} />
                </Grid>
              )) :
              null}
            <Grid item >
              <Button variant="contained" type="button" color="primary" raised onClick={() => { updateWalletAllocations(mappedAccounts) }}> Save</Button>
            </Grid>
            <Grid item >
              <Button variant="contained" type="button" color="secondary" onClick={() => {
                resetWalletAllocation().then(() => onReset())
              }}> Reset</Button>
            </Grid>
          </Grid>

        </form>
      </Paper>
    </Wrapper>
  );

}
const ProspaWallet = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [error, setError] = useState(null);

  const fetchWallets = () => {
    setIsLoading(true);
    fetchSubAccounts().then(data => {
      setWallets(data || sample);
      setIsLoading(false);
    }
    )
  }
  React.useEffect(() => {
    fetchWallets();
    // setWallets(data);
  }, [])

  console.log({ wallets });

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;


  const sample = [
    {
      "biz_wallet_id": 882,
      "biz_wallet_type": "current",
      "available_balance": "900.00",
      "total_balance": "30550.00",
      "debt_balance": "0.00",
      "pub_date": "2021-03-01T08:57:34.375639Z",
      "modified_date": "2021-06-03T07:01:04.678653Z",
      "preferred_name": "current",
      "biz_account_number": "0605000451",
      "partner_bank_code": "311",
      "partner_bank_name": "Parkway - ReadyCash",
      "upgrade_lock": false,
      "incoming_allocation": "0.0",
      "wallet_final_status": "active"
    },
    {
      "biz_wallet_id": 884,
      "biz_wallet_type": "other",
      "available_balance": "500.00",
      "total_balance": "0.00",
      "debt_balance": "0.00",
      "pub_date": "2021-03-01T09:03:49.063547Z",
      "modified_date": "2021-04-12T06:15:18.494830Z",
      "preferred_name": "wema",
      "biz_account_number": null,
      "partner_bank_code": "",
      "partner_bank_name": "",
      "upgrade_lock": false,
      "incoming_allocation": "0.0",
      "wallet_final_status": "active"
    },
    {
      "biz_wallet_id": 885,
      "biz_wallet_type": "salary",
      "available_balance": "0.00",
      "total_balance": "0.00",
      "debt_balance": "0.00",
      "pub_date": "2021-03-01T09:05:50.194676Z",
      "modified_date": "2021-03-01T09:05:59.585314Z",
      "preferred_name": "salary",
      "biz_account_number": "0605000453",
      "partner_bank_code": "311",
      "partner_bank_name": "Parkway - ReadyCash",
      "upgrade_lock": false,
      "incoming_allocation": "0.0",
      "wallet_final_status": "active"
    },
    {
      "biz_wallet_id": 887,
      "biz_wallet_type": "savings",
      "available_balance": "0.00",
      "total_balance": "0.00",
      "debt_balance": "0.00",
      "pub_date": "2021-03-01T09:07:13.972624Z",
      "modified_date": "2021-03-01T09:07:19.587800Z",
      "preferred_name": "savings",
      "biz_account_number": "0605000455",
      "partner_bank_code": "311",
      "partner_bank_name": "Parkway - ReadyCash",
      "upgrade_lock": false,
      "incoming_allocation": "0.0",
      "wallet_final_status": "active"
    },
    {
      "biz_wallet_id": 890,
      "biz_wallet_type": "tap",
      "available_balance": "0.00",
      "total_balance": "0.00",
      "debt_balance": "0.00",
      "pub_date": "2021-03-01T19:33:22.983582Z",
      "modified_date": "2021-03-01T19:33:47.820422Z",
      "preferred_name": "tap",
      "biz_account_number": "0605000456",
      "partner_bank_code": "311",
      "partner_bank_name": "Parkway - ReadyCash",
      "upgrade_lock": false,
      "incoming_allocation": "0.0",
      "wallet_final_status": "active"
    },
    {
      "biz_wallet_id": 886,
      "biz_wallet_type": "tax",
      "available_balance": "0.00",
      "total_balance": "0.00",
      "debt_balance": "0.00",
      "pub_date": "2021-03-01T09:06:49.973978Z",
      "modified_date": "2021-03-01T09:06:59.590631Z",
      "preferred_name": "tax",
      "biz_account_number": "0605000454",
      "partner_bank_code": "311",
      "partner_bank_name": "Parkway - ReadyCash",
      "upgrade_lock": false,
      "incoming_allocation": "0.0",
      "wallet_final_status": "active"
    }
  ];

  return (
    <SubWalletsShare accounts={wallets || sample} onReset={fetchWallets} />
  )
}
export default ProspaWallet;
