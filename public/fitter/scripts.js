// CANVAS:


var ctx = document.getElementById('myChart').getContext('2d');
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Fit',
            borderColor: 'rgb(255,50,50)',
            backgroundColor: 'rgba(0,0,0,0)',
            data: [],
            type: 'line',
            lineTension: 0,
            pointRadius: 0
        }, {
            label: 'Data',
            backgroundColor: 'rgb(50,50,50)',
            data: []
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        },
        tooltips: {
            filter: function (tooltipItem) {
                return tooltipItem.datasetIndex === 1;
            }
        }
    }
});

// EVERYTHING ELSE:

var order = parseInt(document.getElementById("order-input").value);
var precision = parseInt(document.getElementById("precision-input").value);

var formulas = [
    "$y = {\\color{red}a}x + {\\color{red}b}$",
    "$y = {\\color{red}a_0} + \\dots + {\\color{red}a_n}x^n$",
    "$y = {\\color{red}a} e^{{\\color{red}b}x}$",
    "$y = {\\color{red}a} + {\\color{red}b} \\log x$",
    "$y = {\\color{red}a} x^{\\color{red}b}$"
]

var parameters = [
    "a", "b"
]

var parameterFixed = [
    false, false
]

var datafile = null
var raw_data = null

fields = []
fieldsN = []

var minX = 0
var maxX = 0
var resX = 200


var baked_data = null

var parameterValues = []

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })
})

MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
};

// FRONT:

function updateFormulas() {
    var ddl = document.getElementById("functionSelect");
    var selectedValue = parseInt(ddl.options[ddl.selectedIndex].value) - 1;
    document.getElementById("function-formula").innerHTML = formulas[selectedValue];
    MathJax.typeset();
    if (selectedValue === 1) {
        document.getElementById("order").style.display = "flex";
    } else {
        document.getElementById("order").style.display = "none";
    }
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'function-formula']);
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function updateParameters() {
    parameters = []
    parameterFixed = []
    var ddl = document.getElementById("functionSelect");
    var selectedValue = parseInt(ddl.options[ddl.selectedIndex].value) - 1;
    if (selectedValue === 1) {
        for (var i = 0; i < order + 1; i++) {
            parameters.push("a_{" + i + "}");
            parameterFixed.push(false);
        }
    } else {
        parameters.push("a");
        parameters.push("b");
        parameterFixed.push(false);
        parameterFixed.push(false);
    }
    parametersHTML = "";
    for (p of parameters) {
        parametersHTML = parametersHTML + `
        <div class="input-group mb-3" class="parameter-container">
                <div class="input-group-prepend">
                    <label class="input-group-text input-group-prepend">$${p}$</label>
                    <div class="input-group-text" data-toggle="tooltip" data-placement="right" title="Parameter fixing not implemented yet.">
                        <input type="checkbox" id="checkbox-${p}" class="input-group-text" onclick="toggleParameter('${p}')" checked disabled>
                    </div>
                </div>
                <input type="text" class="form-control input-group-append" id="${p}" disabled>
            </div>
        `; // When parameter-fixing is implemented, change the input type to number with appropriate steps.
    }
    document.getElementById("parameters-container").innerHTML = parametersHTML;
    // document.getElementById("chisq").value = "";
    MathJax.typeset();
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })
}

document.getElementById("precision-input").addEventListener("input", (e) => {
    if (document.getElementById("precision-input").value === "") {
        document.getElementById("precision-input").value = 2;
    }
    else if (document.getElementById("precision-input").value > 100) {
        document.getElementById("precision-input").value = 100;
    } else if (document.getElementById("precision-input").value < 2) {
        document.getElementById("precision-input").value = 2;
    } else {
        document.getElementById("precision-input").value = parseInt(document.getElementById("precision-input").value);
    }
    precision = parseInt(document.getElementById("precision-input").value);
});

document.getElementById("order-input").addEventListener("input", (e) => {
    if (document.getElementById("order-input").value === "") {
        document.getElementById("order-input").value = 0;
    }
    else if (document.getElementById("order-input").value > 20) {
        document.getElementById("order-input").value = 20;
    } else if (document.getElementById("order-input").value < 0) {
        document.getElementById("order-input").value = 0;
    } else {
        document.getElementById("order-input").value = parseInt(document.getElementById("order-input").value);
    }
    order = parseInt(document.getElementById("order-input").value);
    updateParameters();
});

function toggleParameter(p) { // NOT IMPLEMENTED YET.
    const i = parameters.indexOf(p);
    if (i !== -1) {
        const fixed = !document.getElementById("checkbox-" + p).checked;
        parameterFixed[i] = fixed;
        document.getElementById(p).disabled = fixed;
    }
}

// DATA:

function checkForFilters(elem) {
    return false; // TODO.
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function plotData() {
    scatterChart.data.datasets[0].data = [];
    scatterChart.data.datasets[1].data = [];
    baked_data = [];
    minX = Infinity;
    maxX = -Infinity;


    for (var i = 0; i < raw_data.data.length - 1; i++) {
        elem = raw_data.data[i];
        var xValue = parseFloat(elem[document.getElementById("xSelect").value]);
        var yValue = parseFloat(elem[document.getElementById("ySelect").value]);
        if (xValue > maxX) maxX = xValue;
        if (xValue < minX) minX = xValue;
        baked_data.push([xValue, yValue]);
        scatterChart.data.datasets[1].data.push({ x: xValue, y: yValue });
    }
    scatterChart.update();

    document.getElementById("chisq").value = "";
    for (var i = 0; i < parameters.length; i++) {
        document.getElementById(parameters[i]).value = "";
    }
}

function getData() {
    dataFile = document.getElementById("csvFile").files[0]
    if (dataFile !== undefined) {
        Papa.parse(dataFile, {
            header: true,
            complete: function (results) {
                document.getElementById("csvFileLabel").innerHTML = document.getElementById("csvFile").files[0].name;
                raw_data = results;
                var numericFieldsN = 0;
                var optionsHTML = ""
                for (field of raw_data.meta.fields) {
                    var isFieldNumeric = !isNaN(raw_data.data[0][field]);
                    if (isFieldNumeric) {
                        numericFieldsN += 1;
                        optionsHTML = optionsHTML + `
                            <option value="${field}">${field}</option>`;
                    }
                    fields.push(field);
                    fieldsN.push(isFieldNumeric);
                }
                if (numericFieldsN >= 2) {
                    document.getElementById("xSelect").innerHTML = optionsHTML;
                    // document.getElementById("xSelect").value = document.getElementById("xSelect").firstChild.value;
                    document.getElementById("ySelect").innerHTML = optionsHTML;
                    document.getElementById("ySelect").value = document.getElementById("ySelect").lastChild.value;
                    plotData();
                } else {
                    window.alert("CSV file must contain at least 2 NUMERIC column.");
                }
            }
        });
    } else {
        window.alert("No file selected.");
    }
}

// FIT:

function fit() {
    var ddl = document.getElementById("functionSelect");
    var selectedValue = parseInt(ddl.options[ddl.selectedIndex].value);
    var result;
    if (selectedValue === 1) {
        /* linear */
        result = regression.linear(baked_data, { precision: precision });
    } else if (selectedValue === 2) {
        /* polynomial */
        result = regression.polynomial(baked_data, { order: order, precision: precision });
    } else if (selectedValue === 3) {
        /* exponential */
        result = regression.exponential(baked_data, { precision: precision });
    } else if (selectedValue === 4) {
        /* logarithmic */
        result = regression.logarithmic(baked_data, { precision: precision });
    } else if (selectedValue === 5) {
        /* power */
        result = regression.power(baked_data, { precision: precision });
    }

    scatterChart.data.datasets[0].data = []
    for (var i = 1; i <= resX; i++) {
        var xValue = parseFloat(i * (maxX - minX) / resX) + parseFloat(minX);
        var yValue = result.predict(xValue)[1];
        scatterChart.data.datasets[0].data.push({ x: xValue, y: yValue });
    }
    scatterChart.update();

    for (var i = 0; i < parameters.length; i++) {
        // regression.polynomial returns parameters in inversed order, so:
        var _i = selectedValue !== 2 ? i : parameters.length - 1 - i;
        document.getElementById(parameters[i]).value = result.equation[_i].toPrecision(5);
    }

    // Chi-squared:
    var dof = baked_data.length - parameters.length
    var chisq = 0;
    for (var i = 0; i < baked_data.length; i++) {
        const observed = baked_data[i][1]
        const expected = result.predict(baked_data[i][0])[1]
        chisq += Math.pow(observed - expected, 2)/expected
    }
    chisq = chisq / dof;
    document.getElementById("chisq").value = chisq.toPrecision(10);
}

// SIDEBAR STUFF:

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("sidebar").style.left = "0px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("sidebar").style.left = "-300px";
}


function toggleNav() {
    if (parseInt(window.getComputedStyle(document.getElementById("sidebar")).getPropertyValue('left')) == 0) {
        closeNav();
    } else {
        openNav();
    }
}

document.addEventListener("keyup", (e) => {
    // if (e.keyCode === 27) { closeNav(); }    // Esc on keyboard.
    if (e.keyCode === 83) { toggleNav(); }    // 's' on keyboard.
});

document.getElementById("functionSelect").addEventListener("change", (e) => {
    updateFormulas();
    updateParameters();
});

document.getElementById("csvFile").addEventListener("change", (e) => {
    getData();
});

document.getElementById("xSelect").addEventListener("change", (e) => {
    plotData();
});

document.getElementById("ySelect").addEventListener("change", (e) => {
    plotData();
});

// - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - -
// CANVAS:

// var ctx = document.getElementById('myChart').getContext('2d');
// var scatterChart = new Chart(ctx, {
//     type: 'scatter',
//     data: {
//         datasets: [{
//             label: 'Data',
//             backgroundColor: 'rgb(50,50,50)',
//             data: [
//                 {x: 1,y: 4},
//                 {x: 2,y: 5},
//                 {x: 3,y: 6},
//                 {x: 4,y: 7},
//                 {x: 5,y: 8},
//                 {x: 6,y: 9}
//             ]
//         },{
//             label: 'Fit',
//             borderColor: 'rgb(255,50,50)',
//             backgroundColor: 'rgba(0,0,0,0)',
//             data: [
//                 {x: 1,y: 4},
//                 {x: 2,y: 5},
//                 {x: 3,y: 6},
//                 {x: 4,y: 7},
//                 {x: 5,y: 8},
//                 {x: 6,y: 8}
//             ],
//             type: 'line',
//             lineTension: 0,
//             pointRadius: 0
//         }]
//     },
//     options: {
//         scales: {
//             xAxes: [{
//                 type: 'linear',
//                 position: 'bottom'
//             }]
//         },
//         tooltips: {
//             filter: function (tooltipItem) {
//                 return tooltipItem.datasetIndex === 0;
//             }
//         }
//     }
// });