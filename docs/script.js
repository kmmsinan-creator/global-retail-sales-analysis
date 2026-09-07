// ==========================================
// GLOBAL RETAIL INTELLIGENCE
// Interactive Analytics Charts
// ==========================================


// Chart.js Global Configuration

Chart.defaults.color = "#9aa9bd";

Chart.defaults.font.family = "'DM Sans', sans-serif";


// ==========================================
// 1. ANNUAL SALES TREND
// ==========================================

const salesTrend = document.getElementById("salesTrendChart");

new Chart(salesTrend, {

    type: "line",

    data: {

        labels: ["2011", "2012", "2013", "2014"],

        datasets: [

            {
                label: "Sales ($)",

                data: [
                    2259511,
                    2677493,
                    3405860,
                    4300041
                ],

                borderColor: "#4fd1c5",

                backgroundColor: "rgba(79, 209, 197, 0.12)",

                fill: true,

                tension: 0.4,

                borderWidth: 3,

                pointBackgroundColor: "#4fd1c5",

                pointRadius: 5,

                pointHoverRadius: 7
            }

        ]
    },


    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                callbacks: {

                    label: function(context) {

                        return "$" +
                            (context.raw / 1000000)
                                .toFixed(2) +
                            "M";
                    }
                }
            }
        },


        scales: {

            x: {

                grid: {
                    display: false
                }

            },

            y: {

                grid: {
                    color: "rgba(255,255,255,0.05)"
                },

                ticks: {

                    callback: function(value) {

                        return "$" +
                            (value / 1000000) +
                            "M";
                    }
                }
            }
        }
    }

});


// ==========================================
// 2. SALES BY MARKET
// ==========================================

const marketSales = document.getElementById("marketSalesChart");

new Chart(marketSales, {

    type: "bar",

    data: {

        labels: [
            "APAC",
            "EU",
            "North America",
            "LATAM",
            "EMEA",
            "Africa"
        ],

        datasets: [

            {

                label: "Sales",

                data: [
                    3585833,
                    2938139,
                    2364286,
                    2164687,
                    806184,
                    783776
                ],

                backgroundColor: [
                    "#4fd1c5",
                    "#4f8cff",
                    "#7ee7dd",
                    "#668cff",
                    "#ff7070",
                    "#ffb86b"
                ],

                borderRadius: 6

            }

        ]

    },


    options: {

        indexAxis: "y",

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            }

        },


        scales: {

            x: {

                grid: {
                    color: "rgba(255,255,255,0.05)"
                },

                ticks: {

                    callback: function(value) {

                        return "$" +
                            (value / 1000000).toFixed(1) +
                            "M";
                    }
                }

            },

            y: {

                grid: {
                    display: false
                }

            }

        }

    }

});


// ==========================================
// 3. MONTHLY SALES PATTERN
// ==========================================

const monthlySales = document.getElementById("monthlySalesChart");

new Chart(monthlySales, {

    type: "line",

    data: {

        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],

        datasets: [

            {

                label: "Monthly Sales",

                data: [
                    675141,
                    543768,
                    770519,
                    698603,
                    904061,
                    1269751,
                    749423,
                    1293852,
                    1437432,
                    1168220,
                    1551319,
                    1580816
                ],

                borderColor: "#4f8cff",

                backgroundColor: "rgba(79,140,255,.1)",

                fill: true,

                tension: 0.35,

                borderWidth: 2,

                pointRadius: 3

            }

        ]

    },


    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            }

        },


        scales: {

            x: {

                grid: {
                    display: false
                }

            },

            y: {

                grid: {
                    color: "rgba(255,255,255,.05)"
                },

                ticks: {

                    callback: function(value) {

                        return "$" +
                            (value / 1000000).toFixed(1) +
                            "M";
                    }
                }

            }

        }

    }

});


// ==========================================
// 4. QUARTERLY SALES VS PROFIT
// ==========================================

const quarterly = document.getElementById("quarterlyChart");

new Chart(quarterly, {

    type: "bar",

    data: {

        labels: ["Q1", "Q2", "Q3", "Q4"],

        datasets: [

            {

                label: "Sales",

                data: [
                    1989428,
                    2872415,
                    3480707,
                    4300355
                ],

                backgroundColor: "#4f8cff",

                borderRadius: 6

            },


            {

                label: "Profit",

                data: [
                    238555,
                    325103,
                    400362,
                    503437
                ],

                backgroundColor: "#4fd1c5",

                borderRadius: 6

            }

        ]

    },


    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "top",

                labels: {
                    boxWidth: 10
                }

            }

        },


        scales: {

            x: {

                grid: {
                    display: false
                }

            },

            y: {

                grid: {
                    color: "rgba(255,255,255,.05)"
                },

                ticks: {

                    callback: function(value) {

                        return "$" +
                            (value / 1000000).toFixed(1) +
                            "M";
                    }
                }

            }

        }

    }

});


// ==========================================
// 5. PROFIT MARGIN BY MARKET
// ==========================================

const profitMargin = document.getElementById("profitMarginChart");

new Chart(profitMargin, {

    type: "bar",

    data: {

        labels: [
            "North America",
            "EU",
            "APAC",
            "Africa",
            "LATAM",
            "EMEA"
        ],

        datasets: [

            {

                label: "Profit Margin (%)",

                data: [
                    12.87,
                    12.69,
                    12.16,
                    11.34,
                    10.24,
                    5.45
                ],

                backgroundColor: [
                    "#4fd1c5",
                    "#4fd1c5",
                    "#4fd1c5",
                    "#4f8cff",
                    "#ffb86b",
                    "#ff7070"
                ],

                borderRadius: 7

            }

        ]

    },


    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                callbacks: {

                    label: function(context) {

                        return context.raw + "%";
                    }

                }

            }

        },


        scales: {

            x: {

                grid: {
                    display: false
                }

            },

            y: {

                beginAtZero: true,

                grid: {
                    color: "rgba(255,255,255,.05)"
                },

                ticks: {

                    callback: function(value) {

                        return value + "%";
                    }

                }

            }

        }

    }

});


// ==========================================
// SCROLL REVEAL EFFECT
// ==========================================

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },

    {
        threshold: 0.1
    }

);


document.querySelectorAll(
    ".kpi-card, .chart-card, .insight-card, .risk-card"
).forEach(el => {

    observer.observe(el);

});
