import * as React from 'react';

interface IDatePickupProps {
    name: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const datePickup = (props: IDatePickupProps) => {
    return (
        <div className="field">
            <div className="control">
                <input
                    className="input is-rounded"
                    name={props.name}
                    type="date"
                    onChange={props.onChange}
                    value={props.value ? props.value : new Date().toISOString().slice(0, 10)}
                />
            </div>
        </div>
    );
}

export default datePickup;