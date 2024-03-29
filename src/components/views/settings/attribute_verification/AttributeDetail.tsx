import React from "react";

import {VPType} from "./Attribute";
import {Claims, IssuerInfoClaims} from "./VerifiedAttributes";
import Modal from "../../../../Modal";
import IssuerDetail from "./IssuerDetail";

interface IProps {
    vp_type: VPType;
    description: string;
    main_claims: Claims;
    all_claims: Claims;
    issuer_info: IssuerInfoClaims;
}

interface IState {
}

export default class AttributeDetail extends React.Component<IProps, IState> {
    public constructor(props: IProps){
        super(props);
    }

    private issuerDetail = () => {
        Modal.createDialog(
            IssuerDetail,
            {issuer_info: this.props.issuer_info}
        )
    }

    public render(): React.ReactNode {
        const style = {
            display: 'flex',
            backgroundColor: "#E9F7F2"
        };
        return (
            <div>
                <div>
                    <span style={style}>
                        <h1>以下の事業者によって認証されました</h1>
                    </span>
                    <div>
                        <h1 style={{marginBottom: "0px"}}>{this.props.issuer_info.issuer_name}</h1>
                        {this.props.issuer_info.issuer_authenticator_org_name &&
                            (
                                <div style={{marginTop: "0px"}}>
                                    <a onClick={this.issuerDetail}>Verified by {this.props.issuer_info.issuer_authenticator_org_name}</a>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <h4 style={{marginTop: "6%", marginBottom: "3px"}}>所在地</h4>
                        {this.props.issuer_info.issuer_address}
                    </div>
                    <div>
                        <h4 style={{marginBottom: "3px"}}>ドメイン名</h4>
                        {this.props.issuer_info.issuer_domain}
                    </div>
                </div>
            </div>
        )
    }
}
