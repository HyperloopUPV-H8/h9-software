import { ReactComponent as Thunder } from "assets/icons/thunder.svg";

type Props = { name: string; value: number };

export const BatteryTag = (props: Props) => {
    return (
        <div className={"battery-tag"}>
            <h3>{props.name}</h3>
            <div>
                <Thunder />
                <p>{props.value.toFixed(2)} W</p>
            </div>
        </div>
    );
};
