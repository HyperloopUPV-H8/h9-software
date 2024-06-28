import { Field } from './Field/Field';
import styles from './Form.module.scss';
import { Header, HeaderInfo } from './Header/Header';
import { useSpring } from '@react-spring/web';
import { useListenKey } from '../../../../../hooks/useListenKey';
import { useState } from 'react';
import { useForm, Form as FormType } from '../../../../..';

type Props = {
    initialForm: Omit<FormType, 'isValid'>;
    onSubmit: (form: FormType) => void;
};

export const Form = ({ initialForm, onSubmit }: Props) => {
    const [listen, setListen] = useState(false);
    const [form, handleEvent] = useForm(initialForm);
    const [isOpen, setIsOpen] = useState(false);
    const [springs, api] = useSpring(() => ({
        from: { filter: 'brightness(1)' },
        config: {
            tension: 600,
        },
    }));

    function blinkHeader() {
        api.start({
            from: { filter: 'brightness(1.2)' },
            to: { filter: 'brightness(1)' },
        });
    }

    function trySubmit() {
        if (form.isValid) {
            blinkHeader();
            onSubmit(form);
        }
    }

    // TODO: this should be kept in a global context, so that it can be called from anywhere in the app
    useListenKey(
        ' ',
        () => {
            trySubmit();
        },
        listen
    );

    const headerInfo: HeaderInfo =
        form.fields.length > 0
            ? {
                  type: 'toggable',
                  isOpen: isOpen,
                  toggleDropdown: () => setIsOpen((prevValue) => !prevValue),
              }
            : { type: 'fixed' };

    return (
        <div className={styles.formWrapper}>
            <Header
                name={form.name}
                info={headerInfo}
                disabled={!form.isValid}
                onTargetToggle={(state) => setListen(state)}
                onButtonClick={() => trySubmit()}
                springs={springs}
            />
            {isOpen && form.fields.length > 0 && (
                <div className={styles.fields}>
                    {form.fields.map((field) => (
                        <Field
                            key={field.id}
                            field={field}
                            onChange={handleEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
