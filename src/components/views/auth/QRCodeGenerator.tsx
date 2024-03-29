/*
Copyright 2015-2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component, ReactNode } from "react";
import QRCode from "qrcode.react";

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { _t } from "../../../languageHandler";

interface IProps {
    registration?: boolean;
    renderingData: string;
    pollingUri: string;
    callback: (data: any) => Promise<void>;
    showFromBeginning: boolean;
}

interface IState {
    showQRCode: boolean;
}

export default class QRCodeGenerator extends Component<IProps, IState> {
    private pollingIntervalId: number | null = null;
    private doPolling = false;

    public constructor(props: IProps) {
        super(props);
        this.doPolling = this.props.showFromBeginning;
        this.state = {
            showQRCode: this.props.showFromBeginning,
        };
    }

    public componentDidMount(): void {
        this.startPolling();
    }

    public componentWillUnmount(): void {
        this.stopPolling();
    }

    private stopPolling(): void {
        if (this.pollingIntervalId) {
            clearInterval(this.pollingIntervalId);
        }
    }

    private startPolling = (): void => {
        const POLLING_INTERVAL = 1500;

        this.pollingIntervalId = window.setInterval(async () => {
            try {
                if (!this.doPolling) {
                    return;
                }
                // todo: Executing the API should be implemented as a MatrixClient function.
                let accessToken = null
                try{
                    accessToken = MatrixClientPeg.safeGet().getAccessToken();
                }catch(error){}
                const response = await fetch(this.props.pollingUri,
                    accessToken ? {headers: {Authorization: `Bearer ${accessToken}`}} : {})

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        this.stopPolling();
                        await this.props.callback(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }, POLLING_INTERVAL);
    };

    private handleButtonClick = (): void => {
        this.setState({ showQRCode: true });
    };

    private renderQRCode(): ReactNode {
        if (this.state.showQRCode) {
            this.doPolling = true;
            return <QRCode value={this.props.renderingData} size={256} />;
        }
        return null;
    }

    private renderButton(): ReactNode {
        if (!this.state.showQRCode) {
            return (
                <button className="mx_Login_submit" onClick={this.handleButtonClick}>
                    {this.props.registration ? _t("action|wallet_register") : _t("action|wallet_signin")}
                </button>
            );
        }
        return null;
    }

    public render(): React.ReactNode {
        return (
            <div>
                {this.renderQRCode()}
                {!this.props.showFromBeginning && this.renderButton()}
            </div>
        );
    }
}
