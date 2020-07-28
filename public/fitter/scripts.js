// CANVAS:

var ctx = document.getElementById('myChart').getContext('2d');
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Data',
            backgroundColor: 'rgb(50,50,50)',
            data: []
        },{
            label: 'Fit',
            borderColor: 'rgb(255,50,50)',
            backgroundColor: 'rgba(0,0,0,0)',
            data: [],
            type: 'line',
            lineTension: 0,
            pointRadius: 0
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
                return tooltipItem.datasetIndex === 0;
            }
        }
    }
});

// EVERYTHING ELSE:

var order = parseInt(document.getElementById("order-input").value);

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
var datapoints = []

var minX = 0
var maxX = 0
var resX = 100

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
                <input type="number" step="0.01" class="form-control input-group-append" id="${p}" disabled>
            </div>
        `;
    }
    // console.log(parametersHTML);
    document.getElementById("parameters-container").innerHTML = parametersHTML;
    MathJax.typeset();
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })
}

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

function plotData() {
    for(elem of raw_data.data) {
        datapoints.push({x: elem[document.getElementById("xSelect").value], y: elem[document.getElementById("ySelect").value]});
    }
    scatterChart.data.datasets[0].data = datapoints;
    scatterChart.update();
}

function getData() {
    dataFile = document.getElementById("csvFile").files[0]
    if(dataFile !== undefined) {
        Papa.parse(dataFile, {
            header: true,
            complete: function(results) {
                raw_data = results;
                document.getElementById("csvFileLabel").innerHTML = document.getElementById("csvFile").files[0].name;
                var optionsHTML = ""
                console.log(raw_data);
                for(field of raw_data.meta.fields) {
                    optionsHTML = optionsHTML + `
                    <option value="${field}">${field}</option>`
                }
                document.getElementById("xSelect").innerHTML = optionsHTML;
                document.getElementById("ySelect").innerHTML = optionsHTML;
            }
        });
    } else {
        window.alert("No file selected.");
    }
}

// FIT:

function fit() {
    getData();
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