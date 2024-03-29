import React from "react";

import Modal, {IHandle} from "../../../../Modal";
import QRCodeForVp from "./QRCodeForVP";
import {MatrixClientPeg} from "../../../../MatrixClientPeg";
import {getData} from "./util";

interface Certificate {
    label: string;
    path: string;
}

interface VPRequest {
    client_id: string;
    request_uri: string;
    polling_uri: string;
}

interface IProps {
    supportedCertificates: Certificate[];
    credentialAdded: () => void
}

interface IState {
    modal: IHandle<any> | null
}

export default class SelectAttribute extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state  = {
            modal: null
        }
    }

    private createVpUri = (parameters: VPRequest): string => {
        const uri = new URL("openid4vp://");
        uri.search = new URLSearchParams({
            client_id: parameters.client_id,
            request_uri: parameters.request_uri,
        }).toString();
        return uri.toString();
    };

    private showQrCodeModal = async (path: string)=> {
        const baseUrl = MatrixClientPeg.get()?.getHomeserverUrl()
        if (baseUrl){
            const vpRequest = await getData(new URL(path, baseUrl).toString()) as VPRequest
            if (vpRequest) {
                const pollingUri = vpRequest.polling_uri;
                const vpUri = this.createVpUri(vpRequest)
                const modal = Modal.createDialog(
                    QRCodeForVp,
                    {
                        data: vpUri,
                        pollingUri: pollingUri,
                        credentialAdded: () => {
                            if (this.state.modal) {
                                this.state.modal.close() // close the QRCodeForVp modal
                                this.props.credentialAdded() // close SelectAttribute modal
                            }
                        }
                    }
                )
                this.setState({modal})
            }
        }
    }

    render() {

        return (
            <div>
                <h1>
                    証明したい属性を選んでください
                </h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1 , display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        {this.props.supportedCertificates.slice(0, this.props.supportedCertificates.length / 2).map((button) => (
                            <button onClick={() => {this.showQrCodeModal(button.path)}} style={{margin: "16px"}} key={button.path}>{button.label}</button>
                        ))}
                    </div>
                    <div style={{ flex: 1 , display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        {this.props.supportedCertificates.slice(this.props.supportedCertificates.length / 2).map((button) => (
                            <button onClick={() => {this.showQrCodeModal(button.path)}} style={{margin: "16px"}} key={button.path}>{button.label}</button>
                        ))}
                    </div>
                </div>
            </div>

        );
    }
}

