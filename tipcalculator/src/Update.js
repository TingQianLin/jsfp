import * as R from 'ramda';

export const MSGS = {
  BILL_AMOUNT_INPUT: 'BILL_AMOUNT_INPUT',
  TIP_PERCENT_INPUT: 'TIP_PERCENT_INPUT',
};

export function billAmountMsg(billAmount) {
  return {
    type: MSGS.BILL_AMOUNT_INPUT,
    billAmount,
  };
}

export function tipPercentMsg(tipPercent) {
  return {
    type: MSGS.TIP_PERCENT_INPUT,
    tipPercent,
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.BILL_AMOUNT_INPUT: {
      if (msg.billAmount !== '') {
        const { billAmount } = msg;
        return { ...model, billAmount};
      }
      return { ...model, billAmount: ''};
    }
    case MSGS.TIP_PERCENT_INPUT: {
      if (msg.tipPercent !== '') {
        const { tipPercent } = msg;
        return { ...model, tipPercent };
      }
      return { ...model, tipPercent: ''};
    }
  }
  return model;
}

export default update;
