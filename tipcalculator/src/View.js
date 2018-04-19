import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  billAmountMsg,
  tipPercentMsg,
} from "./Update";

const {
  div,
  h1,
  pre,
  label,
  input,
  p,
} = hh(h);

function inputRow(labeltext, value, oninput) {
  return [
    label({ className: 'db w-100 mv2'}, labeltext),
    input({
      className: 'border-box pa2 ba w-100 mb2 tr',
      type: 'text',
      value,
      oninput,
    }),
  ];
}

function resultRow(text, resultValue) {
  return div({ className: 'flex mv3' }, [
    p( { className: 'w-50 tl mv2'}, text),
    p( { className: 'w-50 tr mv2'}, resultValue),
  ]);
}

const round = places =>
  R.pipe(
    num => num * Math.pow(10, places),
    Math.round,
    num => num * Math.pow(10, -1 * places),
  );

const formatMoney = R.curry(
  (symbol, places, number) => {
    return R.pipe(
      R.defaultTo(0),
      round(places),
      num => num.toFixed(places),
      R.concat(symbol),
    )(number);
  }
);

function countTipTotal(billAmount, tipPercent) {
  const bill = parseFloat(billAmount);
  const tip = bill * parseFloat(tipPercent)/100 || 0;
  return [tip, bill + tip];
}

function view(dispatch, model) {
  const { billAmount, tipPercent } = model;
  const [tip, total] = countTipTotal(billAmount, tipPercent);
  const toMoney = formatMoney('$', 2);

  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Tip Calculator'),
    inputRow("Bill Amount", billAmount, e => dispatch(billAmountMsg(e.target.value))),
    inputRow("Tip %", tipPercent, e => dispatch(tipPercentMsg(e.target.value))),
    resultRow("Tip:", toMoney(tip)),
    resultRow("Total", toMoney(total)),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
