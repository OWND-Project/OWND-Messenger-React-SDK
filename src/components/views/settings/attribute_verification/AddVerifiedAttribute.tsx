import React from "react";

import VerificationMark from "./VerificationMark";
import Modal, {IHandle} from "../../../../Modal";
import SelectAttribute from "./SelectAttribute";

interface IProps {
   credentialAdded: () => void
}

interface IState {
    modal: IHandle<any> | null
}

const SUPPORTED_CERTIFICATES = [
    {label: "13歳以上であること", path: "/_matrix/client/v3/vp/ageOver13"},
    {label: "所属組織", path: "/_matrix/client/v3/vp/affiliation"},
    {label: "イベント参加", path: "/_matrix/client/v3/vp/joinConference"},
]

export default class AddVerifiedAttribute extends React.Component<IProps, IState> {

    public constructor(props: IProps) {
        super(props);
        this.state  = {
            modal: null
        }
    }

    private addCertificate = () => {
        const modal = Modal.createDialog(
           SelectAttribute,
            {supportedCertificates: SUPPORTED_CERTIFICATES,
                credentialAdded: () => {
                    if (this.state.modal) {
                        this.state.modal.close() // close SelectAttribute modal
                        this.props.credentialAdded() // to update VerifiedAttributes
                    }
                }
            }
        )
        this.setState({modal})
    }

    render() {
        const spanStyle = {
            marginTop: "5px",
            display: 'flex',
        };
        return (
            <span style={spanStyle}>
                <VerificationMark
                    isVerified={false}
                 />
                <a onClick={this.addCertificate}>属性の証明を追加する</a>
            </span>
        )
    }
}
