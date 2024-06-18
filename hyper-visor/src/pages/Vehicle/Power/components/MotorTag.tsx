import {ReactComponent as MotorIcon} from "assets/icons/motor.svg";

type Props = { value: number }

export const MotorTag = (props: Props) => {

    return (
        <div className={'motor-tag'}>
            <MotorIcon className={'motor-icon'} />
            <p>{props.value} W</p>
        </div>
    )
}