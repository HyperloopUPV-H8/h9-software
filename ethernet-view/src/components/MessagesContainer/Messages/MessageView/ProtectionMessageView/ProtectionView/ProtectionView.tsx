import styles from './ProtectionView.module.scss';
import { Protection } from 'common';

type Props = {
    protection: Protection;
};

const DECIMALS = 2;

export const ProtectionView = ({ protection }: Props) => {
    const ProtectionText = getProtectionText(protection);

    return <div className={styles.protectionView}>{ProtectionText}</div>;
};

function getProtectionText(protection: Protection) {
    switch (protection.kind) {
        case 'OUT_OF_BOUNDS':
            return (
                <>
                    <span>
                        {' '}
                        Want: [{protection.data.bounds[0].toFixed(
                            DECIMALS
                        )}, {protection.data.bounds[1].toFixed(DECIMALS)}]
                    </span>{' '}
                    <span>Got: {protection.data.value.toFixed(DECIMALS)}</span>
                </>
            );
        case 'UPPER_BOUND':
            return (
                <>
                    <span>
                        Want: x {'<'} {protection.data.bound.toFixed(DECIMALS)}
                    </span>{' '}
                    <span>Got: {protection.data.value.toFixed(DECIMALS)}</span>
                </>
            );
        case 'LOWER_BOUND':
            return (
                <>
                    <span>
                        Want: x {'>'} {protection.data.bound.toFixed(DECIMALS)}
                    </span>{' '}
                    <span>Got: {protection.data.value.toFixed(DECIMALS)}</span>
                </>
            );
        case 'EQUALS':
            return (
                <>
                    <span>
                        Mustn't be {protection.data.value.toFixed(DECIMALS)}
                    </span>
                </>
            );
        case 'NOT_EQUALS':
            return (
                <>
                    <span>
                        Must be {protection.data.want.toFixed(DECIMALS)} but is{' '}
                        {protection.data.value.toFixed(DECIMALS)}
                    </span>
                </>
            );
        case 'TIME_ACCUMULATION':
            return (
                <span>
                    Value was {protection.data.value.toFixed(DECIMALS)} for{' '}
                    {protection.data.timelimit.toFixed(DECIMALS)} seconds
                </span>
            );
        case 'ERROR_HANDLER':
        case 'WARNING':
            return <span>{protection.data}</span>;
    }
}
