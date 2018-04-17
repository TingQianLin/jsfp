import * as R from 'ramda';

export const MSGS = {
  VALUE_LEFT_INPUT: 'VALUE_LEFT_INPUT',
  VALUE_RIGHT_INPUT: 'VALUE_RIGHT_INPUT',
  UNIT_LEFT_CHANGE: 'UNIT_LEFT_CHANGE',
  UNIT_RIGHT_CHANGE: 'UNIT_RIGHT_CHANGE',
};

export function valueLeftInputMsg(valueLeft) {
  return {
    type: MSGS.VALUE_LEFT_INPUT,
    valueLeft,
  };
}

export function valueRightInputMsg(valueRight) {
  return {
    type: MSGS.VALUE_RIGHT_INPUT,
    valueRight,
  };
}

export function unitLeftChangeMsg(unitLeft) {
  return {
    type: MSGS.UNIT_LEFT_CHANGE,
    unitLeft,
  };
}

export function unitRightChangeMsg(unitRight) {
  return {
    type: MSGS.UNIT_RIGHT_CHANGE,
    unitRight,
  };
}

const toNum = R.pipe(parseFloat, R.defaultTo(0));

function FtoC(temp) {
  return 5 / 9 * (temp - 32);
}

function CtoF(temp) {
  return 9 / 5 * temp + 32;
}

function KtoC(temp) {
  return temp - 273.15;
}

function CtoK(temp) {
  return temp + 273.15;
}

const FtoK = R.pipe(FtoC, CtoK);
const KtoF = R.pipe(KtoC, CtoF);

const UnitConversions = {
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK,
  },
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK,
  },
  Kelvin: {
    Celsius: KtoC,
    Fahrenheit: KtoF,
  },
};


function convertTemp(valueFrom, unitFrom, unitTo) {
  const convertFunc = R.pathOr(
    R.identity,
    [unitFrom, unitTo],
    UnitConversions
  );

  return convertFunc(valueFrom);
}

function rountToTwoDigit(value) {
  return Math.round(value*100)/100
}

function convertValue(model) {
  const { valueLeft, valueRight, unitLeft, unitRight } = model;

  const [ valueFrom, unitFrom, unitTo ] =
    model.sourceLeft ? [valueLeft, unitLeft, unitRight]:[valueRight, unitRight, unitLeft]

  const valueTo = R.pipe(
    convertTemp,
    rountToTwoDigit,
  )(valueFrom, unitFrom, unitTo);

  return model.sourceLeft ? { ... model, valueRight: valueTo }:{ ... model, valueLeft: valueTo };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.VALUE_LEFT_INPUT: {
      if (msg.valueLeft !== '') {
        const valueLeft = toNum(msg.valueLeft);
        return convertValue({ ...model, sourceLeft: true, valueLeft });
      }
      return { ...model, sourceLeft: true, valueLeft: '', valueRight: ''};
    }
    case MSGS.VALUE_RIGHT_INPUT: {
      if (msg.valueRight !== '') {
        const valueRight = toNum(msg.valueRight);
        return convertValue({ ...model, sourceLeft: false, valueRight });
      }
      return { ...model, sourceLeft: false, valueLeft: '', valueRight: ''};
    }
    case MSGS.UNIT_LEFT_CHANGE: {
      const { unitLeft } = msg;
      return convertValue({ ...model, unitLeft });
    }
    case MSGS.UNIT_RIGHT_CHANGE: {
      const { unitRight } = msg;
      return convertValue({ ...model, unitRight });
    }
  }
  return model;
}

export default update;
