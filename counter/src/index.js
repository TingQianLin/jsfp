import h from 'hyperscript'
import hh from 'hyperscript-helpers'

const { div, button } = hh(h);

const initModel = 0;

function view(dispatch, model) {
    return div([
        div({ className: 'mv2' }, `Count: ${model}`),
        button({ className: 'pv1 ph2 mr2',
            onclick: () => dispatch(MSGS.ADD) }, '+'),
        button({ className: 'pv1 ph2',
            onclick: () => dispatch(MSGS.SUB) }, '-'),
    ]);
}

const MSGS = {
    ADD: '+',
    SUB: '-',
};

function update(msg, model) {
    switch (msg) {
        case MSGS.ADD:
            return model + 1;
        case MSGS.SUB:
            return model - 1;
        default:
            return model;
    }
}

function app(initModel, update, view, node) {
    let model = initModel;
    let currentView = view(dispatch, model);
    node.appendChild(currentView);
    function dispatch(msg) {
        model = update(msg, model);
        const updatedView = view(dispatch, model);
        node.replaceChild(updatedView, currentView);
        currentView = updatedView;
    }
}

const rootNode = document.getElementById('app');

app(initModel, update, view, rootNode);