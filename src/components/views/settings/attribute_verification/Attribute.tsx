import React, {Fragment} from "react";

import VerificationMark from "./VerificationMark";
import {postData} from "./util";
import {MatrixClientPeg} from "../../../../MatrixClientPeg";
import Modal from "../../../../Modal";
import AttributeDetail from "./AttributeDetail";
import {Claims, IssuerInfoClaims} from "./VerifiedAttributes";


export type VPType = "ageOver13" | "affiliation" | "joinConference"

export interface AttributeProp {
    vp_type: VPType;
    description: string;
    num: string;
    main_claims: Claims;
    all_claims: Claims;
    issuer_info: IssuerInfoClaims;
    deletable: boolean;
}

interface IState {
    isDeleted: boolean;
}

const DELETE_PATH = "/_matrix/client/v3/vp_delete"

export default class Attribute extends React.Component<AttributeProp, IState> {
    public constructor(props: AttributeProp){
        super(props);
        this.state = {
            isDeleted: false,
        }
    }

    private createBody = () => {
        return {
            vp_type: this.props.vp_type,
            num: this.props.num,
        }
    }

    private delete = async () => {
       // todo: implement dialog
        const baseUrl = MatrixClientPeg.get()?.getHomeserverUrl()
        await postData(new URL(DELETE_PATH, baseUrl).toString(), this.createBody())
        this.setState({isDeleted: true})
    }

    private decideLabel = () : string => {
        const vp_type = this.props.vp_type
        const description = this.props.description
        const claims = this.props.main_claims
        switch(vp_type){
            case "affiliation":
                return claims["$.companyName"]
            case "ageOver13":
                return description
            case "joinConference":
                return `${description}（${claims["$.vc.credentialSubject.name"]}）`
            default:
                return description
        }
    }

    private detail = () => {
       Modal.createDialog(
              AttributeDetail,
           {vp_type: this.props.vp_type,
               description: this.props.description,
               main_claims: this.props.main_claims,
               all_claims: this.props.all_claims,
               issuer_info: this.props.issuer_info}
       )
    }

    public render(): React.ReactNode {
        return (
            <Fragment>
                {!this.state.isDeleted && (
                    <div style={{marginTop: "5px", marginBottom: "0px"}}>
                <VerificationMark isVerified={true} />
                       <a onClick={this.detail} style={{color: "black"}}>{this.decideLabel()}</a>
                        {this.props.deletable &&
                            (
                                <a onClick={this.delete} style={{marginLeft: "25px"}}>削除する</a>
                            )
                        }
            </div>
                )}
            </Fragment>
        )
    }

}
