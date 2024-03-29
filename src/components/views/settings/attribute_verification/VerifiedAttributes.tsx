import React, {Fragment} from "react";

import {postData} from "./util";
import Attribute, {AttributeProp, VPType} from "./Attribute";
import {MatrixClientPeg} from "../../../../MatrixClientPeg";
import VerificationMark from "./VerificationMark";


interface IProps {
    user_id: string;
    deletable: boolean;
    countOnly: boolean;
    shouldRedraw?: boolean;
    resetShouldRedraw?: () => void;
}

interface IState {
    verifiedAttributes: VerifiedAttributeResponse[];
    isLoading: boolean;
}

export interface Claims {
    [key: string]: any
}

export interface IssuerInfoClaims {
    issuer_name: string;
    issuer_address: string;
    issuer_domain: string;
    issuer_authenticator_org_name: string;
    issuer_authenticator_address: string;
    not_before: string;
    not_after: string;
}

interface VerifiedData {
    [num: string]: {
        main_claims: Claims;
        all_claims: Claims;
        issuer_info: IssuerInfoClaims;
    }
}

interface VerifiedAttributeResponse {
    vp_type: VPType;
    description_ja: string;
    verified_data: VerifiedData;
}


const SUPPORTED_VERIFICATION = [
    "/_matrix/client/v3/verify_by_server/ageOver13",
    "/_matrix/client/v3/verify_by_server/affiliation",
    "/_matrix/client/v3/verify_by_server/joinConference",
]

export default class VerifiedAttributes extends React.Component<IProps, IState> {
    public constructor(props: IProps){
        super(props);
        this.state = {
            verifiedAttributes: [],
            isLoading: false
        };
    }

    public async componentDidMount() {
        await this.retrieveVerifiedAttributes();
    }

    public async componentDidUpdate(prevProps: IProps) {
        if ((prevProps.user_id !== this.props.user_id)||(this.props.shouldRedraw && !prevProps.shouldRedraw)){
            await this.retrieveVerifiedAttributes();
        }
    }

    private retrieveVerifiedAttributes = async () => {
        this.setState({ isLoading: true })
        try{
            const attributes: VerifiedAttributeResponse[] = []
            const baseUrl = MatrixClientPeg.get()?.getHomeserverUrl()
            if (baseUrl){
                for(const path of SUPPORTED_VERIFICATION){
                    const data = await postData(new URL(path, baseUrl).toString(),
                        {user_id: this.props.user_id}
                    )
                    if (data){
                        const verifiedAttributeResponse = data as VerifiedAttributeResponse
                        const verified_data = verifiedAttributeResponse.verified_data
                        if (Object.keys(verified_data).length > 0){
                            attributes.push(verifiedAttributeResponse)
                        }
                    }
                }
            }
            this.setState({ verifiedAttributes: attributes, isLoading: false});
            if (this.props?.resetShouldRedraw){
                this.props.resetShouldRedraw()
            }
        }catch(error){
            console.error("Error fetching data:", error);
            this.setState({ isLoading: false });
        }
    }

    private createAttributeProps = (): AttributeProp[] => {
        const result: AttributeProp[] = []
        this.state.verifiedAttributes.forEach((verifiedAttributeResponse) => {
           const {vp_type, description_ja, verified_data} = verifiedAttributeResponse
            for(const num of Object.keys(verified_data)) {
                const mainClaims = verified_data[num].main_claims
                const allClaims = verified_data[num].all_claims
                const issuerInfo = verified_data[num].issuer_info
                    result.push({
                        vp_type: vp_type,
                        description: description_ja,
                        num: num,
                        main_claims: mainClaims,
                        all_claims: allClaims,
                        issuer_info: issuerInfo,
                        deletable: this.props.deletable,
                    })
            }
            }
        )
        return result
    }

    public render(): React.ReactNode {
        const { isLoading } = this.state;
        if (isLoading) {
            return <div>Loading...</div>;
        }
        const attributeProps = this.createAttributeProps()
        if (this.props.countOnly){
            const text = `${attributeProps.length}項目認証済み`
            return (
                    <Fragment>
                        {attributeProps.length > 0 &&
                            (
                                <div style={{marginTop: "5px", marginBottom: "0px"}}>
                            <VerificationMark isVerified={true} />
                                    <span style={{display: "inline-block"}}>{text}</span>
                                    </div>
                            )
                        }
                    </Fragment>
            )
        }
        return (
            <Fragment>
                {attributeProps.map((attribute, index) => (
                        <Attribute
                            key={`${this.props.user_id}-${attribute.vp_type}-${attribute.num}`}
                            vp_type={attribute.vp_type}
                            description={attribute.description}
                            num={attribute.num}
                            main_claims={attribute.main_claims}
                            all_claims={attribute.all_claims}
                            issuer_info={attribute.issuer_info}
                            deletable={attribute.deletable}
                        />

                ))}
            </Fragment>
        )
    }
}
