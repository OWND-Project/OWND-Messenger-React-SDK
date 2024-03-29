import React, {Fragment} from "react";

interface IProps {
    isVerified: boolean;
}
export default class VerificationMark extends React.Component<IProps, {}> {
    public constructor(props: IProps) {
        super(props);
    }

    render() {
        const style = {
            paddingTop: "3px",
            paddingRight: "15px"
        }
        return (
            <Fragment>
                {this.props.isVerified ?
                    <span className="mx_ProfileVerifiedMark" style={style} /> :
                    <span className="mx_ProfileUnVerifiedMark" style={style} />}
            </Fragment>
        );
    }
}

