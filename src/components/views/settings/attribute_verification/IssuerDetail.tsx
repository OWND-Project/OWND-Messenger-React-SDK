import React from "react";

import {IssuerInfoClaims} from "./VerifiedAttributes";

interface IProps {
    issuer_info: IssuerInfoClaims;
}

interface IState {
}

export default class IssuerDetail extends React.Component<IProps, IState> {
    public constructor(props: IProps){
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div>
                <h1>この事業者は下記の通り認証されています</h1>
                <div>
                    <h4>認証された事業者</h4>
                    <h5 style={{marginBottom: "0%"}}>組織</h5>
                    {this.props.issuer_info.issuer_name}
                </div>
                <hr style={{marginTop: "5%"}} />
                <div>
                    <h4>発行元</h4>
                    <h5 style={{marginBottom: "0%"}}>組織</h5>
                    {this.props.issuer_info.issuer_authenticator_org_name}
                </div>
                <hr style={{marginTop: "5%"}} />
                <div>
                    <h4>有効期限</h4>
                    <h5 style={{marginBottom: "0%"}}>発行日</h5>
                    {this.props.issuer_info.not_before}
                    <h5 style={{marginBottom: "0%"}}>有効期限</h5>
                    {this.props.issuer_info.not_after}
                </div>
            </div>
        )
    }
}
