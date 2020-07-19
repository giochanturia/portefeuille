$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })
})

MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
};

var formulas = [
    "$y = {\\color{red}a}x + {\\color{red}b}$",
    "$y = {\\color{red}a_0} + \\dots + {\\color{red}a_n}x^n$",
    "$y = {\\color{red}a} e^{{\\color{red}b}x}$",
    "$y = {\\color{red}a} + {\\color{red}b} \\log x$",
    "$y = {\\color{red}a} x^{\\color{red}b}$"
]

function updateFormulas() {
    var ddl = document.getElementById("inputGroupSelect01");
    var selectedValue = parseInt(ddl.options[ddl.selectedIndex].value) - 1;
    document.getElementById("function-formula").innerHTML = formulas[selectedValue];
    MathJax.typeset();
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'function-formula']);
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

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

document.getElementById("inputGroupSelect01").addEventListener("change", (e) => {
    updateFormulas();
});

// - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - -
// CANVAS:

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});