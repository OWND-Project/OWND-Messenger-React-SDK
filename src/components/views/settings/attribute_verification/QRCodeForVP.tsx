import React from "react";

import QRCodeGenerator from "../../auth/QRCodeGenerator";

interface IProps {
    data: string
    pollingUri: string
    credentialAdded: () => void
}

export default class QRCodeForVp extends React.Component<IProps, {}> {
    public constructor(props: IProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <h1>ウォレットの証明書で追加</h1>
                <h2>QRコードをウォレットで読み取って証明書を登録しましょう</h2>
                <div>
                    <QRCodeGenerator
                        renderingData={this.props.data}
                        pollingUri={this.props.pollingUri}
                        callback={async (data: any) => {
                            this.props.credentialAdded()
                        }}
                        showFromBeginning={true}
                    />
                </div>
            </div>
        );
    }
}

