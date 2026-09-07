/* =========================================
   GLOBAL RETAIL INTELLIGENCE
   INTERACTIVE ANALYTICS DASHBOARD
   script.js
   ========================================= */


/* =========================================
   1. CHART DEFAULT SETTINGS
   ========================================= */

Chart.defaults.color = "#9aa9bd";

Chart.defaults.font.family =
    "'DM Sans', sans-serif";

Chart.defaults.font.size = 12;


/* =========================================
   2. GLOBAL CHART COLORS
   ========================================= */

const COLORS = {
    accent: "#4fd1c5",
    accentLight: "#7ee7dd",

    blue: "#4f8cff",

    orange: "#ffb86b",

    red: "#ff7070",

    muted: "#9aa9bd",

    grid: "rgba(255,255,255,0.06)",

    transparent: "rgba(0,0,0,0)"
};


/* =========================================
   3. COMMON CHART OPTIONS
   ========================================= */

const commonOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
        mode: "index",
        intersect: false
    },

    plugins: {

        legend: {
            display: false
        },

        tooltip: {

            backgroundColor: "#101f35",

            titleColor: "#f4f7fb",

            bodyColor: "#9aa9bd",

            borderColor: "rgba(255,255,255,0.10)",

            borderWidth: 1,

            padding: 12,

            cornerRadius: 8,

            displayColors: true
        }
    },

    animation: {

        duration: 1000,

        easing: "easeOutQuart"
    }
};


/* =========================================
   4. NUMBER FORMATTING FUNCTIONS
   ========================================= */

function formatCurrency(value) {

    if (value >= 1000000) {
        return "$" + (value / 1000000).toFixed(2) + "M";
    }

    if (value >= 1000) {
        return "$" + (value / 1000).toFixed(1) + "K";
    }

    return "$" + value;
}


function formatNumber(value) {

    if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + "M";
    }

    if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K";
    }

    return value;
}


/* =========================================
   5. REVENUE & PROFIT GROWTH CHART
   ========================================= */

const growthCanvas =
    document.getElementById("growthChart");

if (growthCanvas) {

    new Chart(growthCanvas, {

        type: "line",

        data: {

            labels: [
                "2011",
                "2012",
                "2013",
                "2014"
            ],

            datasets: [

                {
                    label: "Sales",

                    data: [
                        2259511,
                        2677493,
                        3405860,
                        4300041
                    ],

                    borderColor: COLORS.accent,

                    backgroundColor:
                        "rgba(79,209,197,0.12)",

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true,

                    pointRadius: 4,

                    pointHoverRadius: 7,

                    pointBackgroundColor:
                        COLORS.accent
                },

                {
                    label: "Profit",

                    data: [
                        248941,
                        307415,
                        406935,
                        504167
                    ],

                    borderColor: COLORS.blue,

                    backgroundColor:
                        "rgba(79,140,255,0.05)",

                    borderWidth: 3,

                    tension: 0.4,

                    fill: false,

                    pointRadius: 4,

                    pointHoverRadius: 7,

                    pointBackgroundColor:
                        COLORS.blue
                }
            ]
        },

        options: {

            ...commonOptions,

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    }
                },

                y: {

                    beginAtZero: true,

                    grid: {
                        color: COLORS.grid
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}


/* =========================================
   6. SALES BY MARKET CHART
   ========================================= */

const marketCanvas =
    document.getElementById("marketChart");

if (marketCanvas) {

    new Chart(marketCanvas, {

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

                        COLORS.accent,

                        COLORS.blue,

                        "#6c8cff",

                        COLORS.orange,

                        "#64748b",

                        "#38bdf8"
                    ],

                    borderRadius: 6,

                    borderSkipped: false
                }
            ]
        },

        options: {

            ...commonOptions,

            indexAxis: "y",

            scales: {

                x: {

                    grid: {
                        color: COLORS.grid
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },

                y: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    }
                }
            }
        }
    });
}


/* =========================================
   7. MONTHLY SALES TREND
   ========================================= */

const monthlyCanvas =
    document.getElementById("monthlyChart");

if (monthlyCanvas) {

    new Chart(monthlyCanvas, {

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

                    borderColor:
                        COLORS.orange,

                    backgroundColor:
                        "rgba(255,184,107,0.10)",

                    fill: true,

                    borderWidth: 3,

                    tension: 0.4,

                    pointRadius: 3,

                    pointHoverRadius: 6,

                    pointBackgroundColor:
                        COLORS.orange
                }
            ]
        },

        options: {

            ...commonOptions,

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    }
                },

                y: {

                    beginAtZero: false,

                    grid: {
                        color: COLORS.grid
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}


/* =========================================
   8. QUARTERLY PERFORMANCE
   ========================================= */

const quarterCanvas =
    document.getElementById("quarterChart");

if (quarterCanvas) {

    new Chart(quarterCanvas, {

        type: "bar",

        data: {

            labels: [
                "Q1",
                "Q2",
                "Q3",
                "Q4"
            ],

            datasets: [

                {
                    label: "Sales",

                    data: [

                        1989428,
                        2872415,
                        3480707,
                        4300355
                    ],

                    backgroundColor:
                        "rgba(79,209,197,0.75)",

                    borderRadius: 8,

                    borderSkipped: false
                },

                {
                    label: "Profit",

                    data: [

                        238555,
                        325104,
                        400362,
                        503437
                    ],

                    backgroundColor:
                        "rgba(79,140,255,0.75)",

                    borderRadius: 8,

                    borderSkipped: false
                }
            ]
        },

        options: {

            ...commonOptions,

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    }
                },

                y: {

                    grid: {
                        color: COLORS.grid
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}


/* =========================================
   9. MARKET PROFITABILITY CHART
   ========================================= */

const profitabilityCanvas =
    document.getElementById("profitabilityChart");

if (profitabilityCanvas) {

    new Chart(profitabilityCanvas, {

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
                    label: "Profit Margin %",

                    data: [

                        12.16,
                        12.69,
                        12.87,
                        10.24,
                        5.45,
                        11.34
                    ],

                    backgroundColor: [

                        COLORS.accent,

                        COLORS.blue,

                        "#6c8cff",

                        COLORS.orange,

                        COLORS.red,

                        "#38bdf8"
                    ],

                    borderRadius: 7,

                    borderSkipped: false
                }
            ]
        },

        options: {

            ...commonOptions,

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    }
                },

                y: {

                    beginAtZero: true,

                    max: 15,

                    grid: {
                        color: COLORS.grid
                    },

                    border: {
                        display: false
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
}


/* =========================================
   10. SMOOTH NAVIGATION
   ========================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        "click",
        function(event) {

            const targetId =
                this.getAttribute("href");

            if (
                targetId &&
                targetId !== "#"
            ) {

                const target =
                    document.querySelector(
                        targetId
                    );

                if (target) {

                    event.preventDefault();

                    const navHeight =
                        document.querySelector(
                            ".navbar"
                        )?.offsetHeight || 0;

                    const position =
                        target.offsetTop -
                        navHeight -
                        20;

                    window.scrollTo({

                        top: position,

                        behavior: "smooth"
                    });
                }
            }
        }
    );
});


/* =========================================
   11. ACTIVE NAVIGATION LINK
   ========================================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );


function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection =
                section.getAttribute("id");
        }
    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {

            link.classList.add("active");
        }
    });
}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* =========================================
   12. NAVBAR SCROLL EFFECT
   ========================================= */

const navbar =
    document.querySelector(".navbar");


window.addEventListener(
    "scroll",
    function() {

        if (!navbar) return;

        if (window.scrollY > 40) {

            navbar.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.18)";

        } else {

            navbar.style.boxShadow =
                "none";
        }
    }
);


/* =========================================
   13. KPI CARD HOVER EFFECT
   ========================================= */

const kpiCards =
    document.querySelectorAll(".kpi-card");


kpiCards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        function() {

            this.style.transform =
                "translateY(-5px)";
        }
    );

    card.addEventListener(
        "mouseleave",
        function() {

            this.style.transform =
                "translateY(0)";
        }
    );
});


/* =========================================
   14. INSIGHT CARD INTERACTION
   ========================================= */

const insightCards =
    document.querySelectorAll(".insight-card");


insightCards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        function() {

            this.style.transform =
                "translateY(-5px)";
        }
    );

    card.addEventListener(
        "mouseleave",
        function() {

            this.style.transform =
                "translateY(0)";
        }
    );
});


/* =========================================
   15. SCROLL REVEAL ANIMATION
   ========================================= */

const revealElements =
    document.querySelectorAll(

        ".kpi-card, " +
        ".chart-card, " +
        ".insight-card, " +
        ".risk-card, " +
        ".workflow-step"
    );


const revealObserver =
    new IntersectionObserver(

        function(entries) {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver.unobserve(
                        entry.target
                    );
                }
            });
        },

        {
            threshold: 0.1
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    revealObserver.observe(element);
});


/* =========================================
   16. CONSOLE PROJECT MESSAGE
   ========================================= */

console.log(
    "%cGlobal Retail Intelligence Dashboard Loaded",
    "color:#4fd1c5; font-size:16px; font-weight:bold;"
);

console.log(
    "Data Period: 2011–2014 | Markets: 6 | Analytics: SQL + Power BI + JavaScript"
);
