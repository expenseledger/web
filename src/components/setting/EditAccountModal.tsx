import React from "react";
import { toNumber } from "../../common/utils";
import { currencySymbols } from "../../service/constants";
import Account from "../../service/model/Account";
import Modal from "../bases/Modal";
import TextBox from "../bases/TextBox";
import { Box, Grid, Text } from "@radix-ui/themes";

interface EditAccountModalProps {
    account: Account;
    onSave: (name: string, balance: number) => Promise<void>;
    triggerer: React.ReactElement;
}

/** Edits an account's name and sets its balance directly (no transaction). */
const EditAccountModal: React.FC<EditAccountModalProps> = (props) => {
    const [name, setName] = React.useState(props.account.name);
    const [balance, setBalance] = React.useState(props.account.balance.toString());

    return (
        <Modal
            title="Edit Account"
            onConfirmHandler={() => props.onSave(name, toNumber(balance))}
            cancelBtnTxt="Cancel"
            cancelBtnType="default"
            confirmBtnTxt="Save"
            confirmBtnType="primary"
            triggerer={props.triggerer}>
            <Grid columns="3" gap="3" align="center" width="100%">
                <Box>
                    <Text>Name</Text>
                </Box>
                <Box gridColumn="2 / span 2">
                    <TextBox
                        name="account-name"
                        ariaLabel="Name"
                        updateValue={setName}
                        value={name}
                    />
                </Box>
                <Box>
                    <Text>Balance</Text>
                </Box>
                <Box gridColumn="2 / span 2">
                    <TextBox
                        name="account-balance"
                        ariaLabel="Balance"
                        type="number"
                        addOn={{ text: currencySymbols[props.account.currency], position: "front" }}
                        updateValue={setBalance}
                        value={balance}
                    />
                </Box>
            </Grid>
        </Modal>
    );
};

export default EditAccountModal;
