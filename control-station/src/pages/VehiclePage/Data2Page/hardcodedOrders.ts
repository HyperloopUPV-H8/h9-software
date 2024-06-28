import { BoardOrders, Order, OrderDescription } from 'common';

export const hardcodedOrderToId = {
    set_regulator_pressure: 210,
    brake: 215,
    unbrake: 216,
    disable_emergency_tape: 217,
    enable_emergency_tape: 218,
    start_vertical_levitation: 356,
    stop_levitation: 357,
    start_horizontal_levitation: 360,
    test_current_control: 607,
    stop_pcu_control: 609,
    test_speed_control: 619,
    test_svpwm: 615,
    open_contactors: 902,
    close_contactors: 903,
};

export function getHardcodedOrders(boardOrders: BoardOrders[]): BoardOrders[] {
    const foundOrders = [] as OrderDescription[];
    const wantedOrdersIds = Object.values(hardcodedOrderToId);
    for (const board of boardOrders) {
        for (const order of board.orders) {
            if (wantedOrdersIds.includes(order.id)) {
                foundOrders.push(order);
            }
        }
        for (const stateOrder of board.stateOrders) {
            if (wantedOrdersIds.includes(stateOrder.id)) {
                foundOrders.push(stateOrder);
            }
        }
    }

    return [{ name: '', orders: foundOrders, stateOrders: [] }];
}

export const ResetVehicleOrder: Order = {
    id: 250,
    fields: {},
};

export const StopOrder: Order = {
    id: 200,
    fields: {},
};

export const BrakeOrder: Order = {
    id: 215,
    fields: {},
};

export const OpenContactorsOrder: Order = {
    id: 902,
    fields: {},
};
