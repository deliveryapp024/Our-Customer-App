import React from 'react';
import { CustomModal } from './CustomModal';

type Props = {
    visible: boolean;
    oldBranchName?: string | null;
    newBranchName?: string | null;
    onCancel: () => void;
    onConfirm: () => void;
};

export const CartSwitchModal: React.FC<Props> = ({
    visible,
    oldBranchName,
    newBranchName,
    onCancel,
    onConfirm,
}) => (
    <CustomModal
        visible={visible}
        title="Switch cart?"
        message={`Your cart has items from ${oldBranchName || 'another branch'}.\nAdding this item will switch your cart to ${newBranchName || 'this branch'} and clear current items.`}
        buttons={[
            { text: 'Cancel', style: 'cancel', onPress: onCancel },
            { text: 'Switch & Add', style: 'destructive', onPress: onConfirm },
        ]}
        onClose={onCancel}
    />
);

export default CartSwitchModal;
