import React from 'react';
import {_t} from "../../../../../languageHandler";

interface IProps {
    onConfirm: () => void;
    onClose: () => void;
}

class ConfirmationDialog extends  React.Component<IProps, {}>{

    handleYesClick = () => {
        this.props.onConfirm();
    }

    handleNoClick = () => {
        this.props.onClose();
    }

    render() {
        return (
            <div>
                <div className="mx_Dialog_content">
                    <p>{_t("settings|general|deactivate_confirm_content")}</p>
                    <ul>
                        <li>{_t("settings|general|deactivate_confirm_content_1")}</li>
                        <li>{_t("settings|general|deactivate_confirm_content_2")}</li>
                        <li>{_t("settings|general|deactivate_confirm_content_3")}</li>
                        <li>{_t("settings|general|deactivate_confirm_content_4")}</li>
                        <li>{_t("settings|general|deactivate_confirm_content_5")}</li>
                    </ul>
                </div>
                <button onClick={this.handleYesClick}>{_t("action|continue")}</button>
                <button onClick={this.handleNoClick}>{_t("action|cancel")}</button>
            </div>
        );
    }
}

export default ConfirmationDialog;
