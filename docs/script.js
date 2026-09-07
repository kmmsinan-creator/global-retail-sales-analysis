/* =========================================
   GLOBAL RETAIL INTELLIGENCE
   INTERACTIVE DATA ENGINE
   ========================================= */


let retailData = [];
let filteredData = [];

let selectedYear = "All";
let selectedMarket = "All";

let charts = {};


/* =========================================
   CHART SETTINGS
   ========================================= */

Chart.defaults.color = "#9aa9bd";

Chart.defaults.font.family = "'DM Sans', sans-serif";


const COLORS = {
    accent: "#4fd1c5",
    blue: "#4f8cff",
    orange: "#ffb86b",
    red: "#ff7070",
    grid: "rgba(255,255,255,0.07)"
};


const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        legend: {
            labels: {
                color: "#9aa9bd"
            }
        },

        tooltip: {
            backgroundColor: "#101f35",
            titleColor: "#ffffff",
            bodyColor: "#d5dbe5",
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
        }
    },

    animation: {
        duration: 700,
        easing: "easeOutQuart"
    }
};


/* =========================================
   COLUMN DETECTION
   Supports different CSV column names
   ========================================= */

function findColumn(row, possibleNames) {

    const columns = Object.keys(row);

    for (const possibleName of possibleNames) {

        const found = columns.find(column =>
            column
                .toLowerCase()
                .replace(/[\s_-]/g, "")
            ===
            possibleName
                .toLowerCase()
                .replace(/[\s_-]/g, "")
        );

        if (found) return found;
    }

    return null;
}


/* =========================================
   NUMBER CLEANING
   ========================================= */

function toNumber(value) {

    if (value === undefined || value === null) {
        return 0;
    }

    return Number(
        String(value)
            .replace(/[$,]/g, "")
            .trim()
    ) || 0;
}


/* =========================================
   DATE PARSING
   ========================================= */

function parseDate(value) {

    if (!value) return null;

    let date = new Date(value);

    if (!isNaN(date)) return date;


    // Handle DD-MM-YYYY or DD/MM/YYYY

    const parts = String(value)
        .split(/[\/-]/);

    if (parts.length === 3) {

        const day = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        const year = Number(parts[2]);

        if (year > 1900) {
            return new Date(year, month, day);
        }
    }

    return null;
}


/* =========================================
   FORMAT FUNCTIONS
   ========================================= */

function formatCurrency(value) {

    if (Math.abs(value) >= 1000000) {
        return "$" + (value / 1000000).toFixed(2) + "M";
    }

    if (Math.abs(value) >= 1000) {
        return "$" + (value / 1000).toFixed(1) + "K";
    }

    return "$" + value.toFixed(0);
}


function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}


/* =========================================
   LOAD CSV
   ========================================= */

Papa.parse("data/global_retail_powerbi.csv", {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results) {

        console.log(
            "CSV loaded:",
            results.data.length,
            "rows"
        );


        if (!results.data.length) {

            showError(
                "The CSV file could not be loaded."
            );

            return;
        }


        const sampleRow = results.data[0];


        console.log(
            "Detected columns:",
            Object.keys(sampleRow)
        );


        /* Detect columns */

        const salesColumn = findColumn(sampleRow, [
            "Sales",
            "Revenue",
            "TotalSales"
        ]);


        const profitColumn = findColumn(sampleRow, [
            "Profit",
            "TotalProfit"
        ]);


        const marketColumn = findColumn(sampleRow, [
            "Market",
            "Region",
            "MarketGroup"
        ]);


        const orderColumn = findColumn(sampleRow, [
            "OrderID",
            "OrderId",
            "Order ID"
        ]);


        const customerColumn = findColumn(sampleRow, [
            "CustomerID",
            "CustomerId",
            "Customer ID"
        ]);


        const dateColumn = findColumn(sampleRow, [
            "OrderDate",
            "Order Date",
            "Date"
        ]);


        console.log({
            salesColumn,
            profitColumn,
            marketColumn,
            orderColumn,
            customerColumn,
            dateColumn
        });


        if (!salesColumn || !profitColumn || !dateColumn) {

            showError(
                "Required columns could not be detected. Check browser console for column names."
            );

            return;
        }


        /* Normalize data */

        retailData = results.data
            .map(row => {

                const date =
                    parseDate(row[dateColumn]);

                return {

                    sales:
                        toNumber(row[salesColumn]),

                    profit:
                        toNumber(row[profitColumn]),

                    market:
                        marketColumn
                            ? String(
                                row[marketColumn]
                            ).trim()
                            : "Unknown",

                    order:
                        orderColumn
                            ? String(row[orderColumn])
                            : "",

                    customer:
                        customerColumn
                            ? String(row[customerColumn])
                            : "",

                    date: date,

                    year:
                        date
                            ? date.getFullYear()
                            : null,

                    month:
                        date
                            ? date.getMonth() + 1
                            : null,

                    quarter:
                        date
                            ? Math.floor(
                                date.getMonth() / 3
                            ) + 1
                            : null
                };

            })

            .filter(row =>
                row.date &&
                !isNaN(row.sales)
            );


        filteredData = [...retailData];


        console.log(
            "Valid records:",
            retailData.length
        );


        createYearFilters();

        createMarketFilters();

        updateDashboard();

    },


    error: function(error) {

        console.error(error);

        showError(
            "Error loading CSV data."
        );
    }
});


/* =========================================
   CREATE YEAR SLICERS
   ========================================= */

function createYearFilters() {

    const container =
        document.getElementById(
            "yearFilters"
        );


    if (!container) return;


    const years =
        [...new Set(
            retailData
                .map(row => row.year)
                .filter(Boolean)
        )]
        .sort();


    container.innerHTML = "";


    const allButton =
        createFilterButton(
            "All Years",
            "All",
            "year",
            true
        );

    container.appendChild(allButton);


    years.forEach(year => {

        container.appendChild(

            createFilterButton(
                year,
                year,
                "year",
                false
            )

        );

    });
}


/* =========================================
   CREATE MARKET SLICERS
   ========================================= */

function createMarketFilters() {

    const container =
        document.getElementById(
            "marketFilters"
        );


    if (!container) return;


    const markets =
        [...new Set(
            retailData
                .map(row => row.market)
                .filter(
                    market =>
                        market &&
                        market !== "Unknown"
                )
        )]
        .sort();


    container.innerHTML = "";


    const allButton =
        createFilterButton(
            "All Markets",
            "All",
            "market",
            true
        );

    container.appendChild(allButton);


    markets.forEach(market => {

        container.appendChild(

            createFilterButton(
                market,
                market,
                "market",
                false
            )

        );

    });
}


/* =========================================
   CREATE FILTER BUTTON
   ========================================= */

function createFilterButton(
    text,
    value,
    type,
    active
) {

    const button =
        document.createElement("button");


    button.textContent = text;

    button.className =
        "filter-btn" +
        (active ? " active" : "");


    button.dataset.value = value;

    button.dataset.type = type;


    button.addEventListener(
        "click",
        function() {

            if (type === "year") {

                selectedYear =
                    value;

                updateActiveButton(
                    "yearFilters",
                    button
                );

            }


            if (type === "market") {

                selectedMarket =
                    value;

                updateActiveButton(
                    "marketFilters",
                    button
                );

            }


            applyFilters();

        }
    );


    return button;
}


/* =========================================
   UPDATE ACTIVE BUTTON
   ========================================= */

function updateActiveButton(
    containerId,
    activeButton
) {

    document
        .querySelectorAll(
            "#" + containerId +
            " .filter-btn"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    activeButton.classList.add(
        "active"
    );
}


/* =========================================
   APPLY FILTERS
   ========================================= */

function applyFilters() {

    filteredData =
        retailData.filter(row => {

            const yearMatch =
                selectedYear === "All" ||
                String(row.year) ===
                String(selectedYear);


            const marketMatch =
                selectedMarket === "All" ||
                row.market === selectedMarket;


            return yearMatch &&
                marketMatch;

        });


    updateDashboard();
}


/* =========================================
   RESET FILTERS
   ========================================= */

document
    .getElementById("resetFilters")
    ?.addEventListener(
        "click",
        function() {

            selectedYear = "All";

            selectedMarket = "All";


            document
                .querySelectorAll(
                    "#yearFilters .filter-btn"
                )
                .forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.value === "All"
                    );

                });


            document
                .querySelectorAll(
                    "#marketFilters .filter-btn"
                )
                .forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.value === "All"
                    );

                });


            filteredData =
                [...retailData];


            updateDashboard();

        }
    );


/* =========================================
   DASHBOARD UPDATE
   ========================================= */

function updateDashboard() {

    updateKPIs();

    updateSummary();

    updateGrowthChart();

    updateMarketChart();

    updateMonthlyChart();

    updateQuarterChart();

    updateProfitabilityChart();

    updateInsights();

    updateRiskCard();
}


/* =========================================
   KPI CALCULATIONS
   ========================================= */

function updateKPIs() {

    const totalSales =
        filteredData.reduce(
            (sum, row) =>
                sum + row.sales,
            0
        );


    const totalProfit =
        filteredData.reduce(
            (sum, row) =>
                sum + row.profit,
            0
        );


    const orders =
        new Set(
            filteredData
                .map(row => row.order)
                .filter(Boolean)
        );


    const customers =
        new Set(
            filteredData
                .map(row => row.customer)
                .filter(Boolean)
        );


    const margin =
        totalSales
            ? (totalProfit / totalSales) * 100
            : 0;


    setText(
        "totalSales",
        formatCurrency(totalSales)
    );


    setText(
        "totalProfit",
        formatCurrency(totalProfit)
    );


    setText(
        "totalOrders",
        formatNumber(orders.size)
    );


    setText(
        "totalCustomers",
        formatNumber(customers.size)
    );


    setText(
        "profitMargin",
        margin.toFixed(2) + "%"
    );
}


/* =========================================
   FILTER SUMMARY
   ========================================= */

function updateSummary() {

    let summary = [];


    if (selectedYear === "All") {
        summary.push("All years");
    } else {
        summary.push(selectedYear);
    }


    if (selectedMarket === "All") {
        summary.push("All markets");
    } else {
        summary.push(selectedMarket);
    }


    setText(
        "filterSummary",
        `${filteredData.length.toLocaleString()} records · ${summary.join(" · ")}`
    );


    setText(
        "periodTag",
        summary.join(" · ")
    );
}


/* =========================================
   GROUP DATA HELPER
   ========================================= */

function groupSum(
    data,
    keyFunction,
    valueFunction
) {

    const result = {};


    data.forEach(row => {

        const key =
            keyFunction(row);

        if (
            key === null ||
            key === undefined
        ) return;


        result[key] =
            (result[key] || 0) +
            valueFunction(row);

    });


    return result;
}


/* =========================================
   DESTROY CHART
   ========================================= */

function destroyChart(name) {

    if (charts[name]) {

        charts[name].destroy();

        charts[name] = null;

    }
}


/* =========================================
   GROWTH CHART
   ========================================= */

function updateGrowthChart() {

    destroyChart("growth");


    const salesByYear =
        groupSum(
            filteredData,
            row => row.year,
            row => row.sales
        );


    const profitByYear =
        groupSum(
            filteredData,
            row => row.year,
            row => row.profit
        );


    const years =
        Object.keys(salesByYear)
            .sort();


    charts.growth =
        new Chart(
            document.getElementById(
                "growthChart"
            ),
            {

                type: "line",

                data: {

                    labels: years,

                    datasets: [

                        {
                            label: "Sales",

                            data:
                                years.map(
                                    year =>
                                        salesByYear[year]
                                ),

                            borderColor:
                                COLORS.accent,

                            backgroundColor:
                                "rgba(79,209,197,0.10)",

                            fill: true,

                            borderWidth: 3,

                            tension: 0.4
                        },

                        {
                            label: "Profit",

                            data:
                                years.map(
                                    year =>
                                        profitByYear[year]
                                ),

                            borderColor:
                                COLORS.blue,

                            borderWidth: 3,

                            tension: 0.4
                        }

                    ]
                },

                options: {

                    ...commonOptions,

                    scales: {

                        x: {
                            grid: {
                                display: false
                            }
                        },

                        y: {

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(value)
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   MARKET CHART
   ========================================= */

function updateMarketChart() {

    destroyChart("market");


    const marketSales =
        groupSum(
            filteredData,
            row => row.market,
            row => row.sales
        );


    const markets =
        Object.keys(marketSales)
            .sort(
                (a, b) =>
                    marketSales[b] -
                    marketSales[a]
            );


    charts.market =
        new Chart(
            document.getElementById(
                "marketChart"
            ),
            {

                type: "bar",

                data: {

                    labels: markets,

                    datasets: [

                        {
                            label: "Sales",

                            data:
                                markets.map(
                                    market =>
                                        marketSales[market]
                                ),

                            backgroundColor:
                                COLORS.accent,

                            borderRadius: 6
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

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(value)
                            }
                        },

                        y: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   MONTHLY CHART
   ========================================= */

function updateMonthlyChart() {

    destroyChart("monthly");


    const monthSales =
        groupSum(
            filteredData,
            row => row.month,
            row => row.sales
        );


    const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"
    ];


    const values =
        monthNames.map(
            (_, index) =>
                monthSales[index + 1] || 0
        );


    charts.monthly =
        new Chart(
            document.getElementById(
                "monthlyChart"
            ),
            {

                type: "line",

                data: {

                    labels: monthNames,

                    datasets: [

                        {
                            label: "Monthly Sales",

                            data: values,

                            borderColor:
                                COLORS.orange,

                            backgroundColor:
                                "rgba(255,184,107,0.10)",

                            fill: true,

                            borderWidth: 3,

                            tension: 0.4
                        }
                    ]
                },

                options: {

                    ...commonOptions,

                    scales: {

                        x: {
                            grid: {
                                display: false
                            }
                        },

                        y: {

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(value)
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   QUARTERLY CHART
   ========================================= */

function updateQuarterChart() {

    destroyChart("quarter");


    const quarterSales =
        groupSum(
            filteredData,
            row => row.quarter,
            row => row.sales
        );


    const quarterProfit =
        groupSum(
            filteredData,
            row => row.quarter,
            row => row.profit
        );


    const quarters =
        [1, 2, 3, 4];


    charts.quarter =
        new Chart(
            document.getElementById(
                "quarterChart"
            ),
            {

                type: "bar",

                data: {

                    labels:
                        quarters.map(
                            q => "Q" + q
                        ),

                    datasets: [

                        {
                            label: "Sales",

                            data:
                                quarters.map(
                                    q =>
                                        quarterSales[q] || 0
                                ),

                            backgroundColor:
                                "rgba(79,209,197,0.75)",

                            borderRadius: 7
                        },

                        {
                            label: "Profit",

                            data:
                                quarters.map(
                                    q =>
                                        quarterProfit[q] || 0
                                ),

                            backgroundColor:
                                "rgba(79,140,255,0.75)",

                            borderRadius: 7
                        }
                    ]
                },

                options: {

                    ...commonOptions,

                    scales: {

                        x: {
                            grid: {
                                display: false
                            }
                        },

                        y: {

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(value)
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   PROFITABILITY CHART
   ========================================= */

function updateProfitabilityChart() {

    destroyChart("profitability");


    const marketStats = {};


    filteredData.forEach(row => {

        if (!marketStats[row.market]) {

            marketStats[row.market] = {
                sales: 0,
                profit: 0
            };

        }


        marketStats[row.market].sales +=
            row.sales;

        marketStats[row.market].profit +=
            row.profit;

    });


    const markets =
        Object.keys(marketStats);


    const margins =
        markets.map(market => {

            const stats =
                marketStats[market];

            return stats.sales
                ? (stats.profit /
                    stats.sales) * 100
                : 0;

        });


    charts.profitability =
        new Chart(
            document.getElementById(
                "profitabilityChart"
            ),
            {

                type: "bar",

                data: {

                    labels: markets,

                    datasets: [

                        {
                            label:
                                "Profit Margin %",

                            data: margins,

                            backgroundColor:
                                markets.map(
                                    (_, index) =>
                                        index ===
                                        margins.indexOf(
                                            Math.min(...margins)
                                        )
                                            ? COLORS.red
                                            : COLORS.accent
                                ),

                            borderRadius: 7
                        }
                    ]
                },

                options: {

                    ...commonOptions,

                    scales: {

                        x: {
                            grid: {
                                display: false
                            }
                        },

                        y: {

                            beginAtZero: true,

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        value + "%"
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   DYNAMIC BUSINESS INSIGHTS
   ========================================= */

function updateInsights() {

    if (!filteredData.length) {

        setText(
            "insight1Text",
            "No data available for this filter combination."
        );

        return;
    }


    /* Yearly growth */

    const yearlySales =
        groupSum(
            filteredData,
            row => row.year,
            row => row.sales
        );


    const years =
        Object.keys(yearlySales)
            .sort();


    if (years.length >= 2) {

        const first =
            yearlySales[years[0]];

        const last =
            yearlySales[
                years[years.length - 1]
            ];

        const growth =
            ((last - first) / first) * 100;


        setText(
            "insight1Title",
            "Revenue performance trend"
        );


        setText(
            "insight1Text",

            `Sales changed by ${growth.toFixed(1)}% between ${years[0]} and ${years[years.length - 1]} within the current selection.`
        );

    } else {

        setText(
            "insight1Text",
            "Select multiple years to compare revenue growth."
        );
    }


    /* Best month */

    const monthlySales =
        groupSum(
            filteredData,
            row => row.month,
            row => row.sales
        );


    const bestMonth =
        Object.keys(monthlySales)
            .reduce(
                (best, month) =>
                    monthlySales[month] >
                    (monthlySales[best] || 0)
                        ? month
                        : best,
                1
            );


    const monthNames = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    setText(
        "insight2Title",
        `${monthNames[bestMonth]} is the strongest month`
    );


    setText(
        "insight2Text",

        `${monthNames[bestMonth]} generated ${formatCurrency(monthlySales[bestMonth] || 0)} in sales within the selected data.`
    );


    /* Best market */

    const marketSales =
        groupSum(
            filteredData,
            row => row.market,
            row => row.sales
        );


    const bestMarket =
        Object.keys(marketSales)
            .reduce(
                (best, market) =>
                    marketSales[market] >
                    (marketSales[best] || 0)
                        ? market
                        : best,
                Object.keys(marketSales)[0]
            );


    setText(
        "insight3Title",
        `${bestMarket} leads revenue performance`
    );


    setText(
        "insight3Text",

        `${bestMarket} generated ${formatCurrency(marketSales[bestMarket] || 0)} in revenue within the current selection.`
    );


    /* Lowest margin */

    const margins = {};


    Object.keys(marketSales)
        .forEach(market => {

            const rows =
                filteredData.filter(
                    row =>
                        row.market === market
                );


            const sales =
                rows.reduce(
                    (sum, row) =>
                        sum + row.sales,
                    0
                );


            const profit =
                rows.reduce(
                    (sum, row) =>
                        sum + row.profit,
                    0
                );


            margins[market] =
                sales
                    ? profit / sales * 100
                    : 0;

        });


    const lowestMarket =
        Object.keys(margins)
            .reduce(
                (lowest, market) =>
                    margins[market] <
                    margins[lowest]
                        ? market
                        : lowest,
                Object.keys(margins)[0]
            );


    setText(
        "insight4Title",
        `${lowestMarket} shows margin pressure`
    );


    setText(
        "insight4Text",

        `${lowestMarket} has a profit margin of ${(margins[lowestMarket] || 0).toFixed(2)}%, making it the lowest-margin market in the current selection.`
    );
}


/* =========================================
   RISK CARD
   ========================================= */

function updateRiskCard() {

    const stats = {};


    filteredData.forEach(row => {

        if (!stats[row.market]) {

            stats[row.market] = {
                sales: 0,
                profit: 0
            };

        }


        stats[row.market].sales += row.sales;

        stats[row.market].profit += row.profit;

    });


    const markets =
        Object.keys(stats);


    if (!markets.length) return;


    const lowestMarket =
        markets.reduce(
            (lowest, market) => {

                const lowestMargin =
                    stats[lowest].sales
                        ? stats[lowest].profit /
                        stats[lowest].sales
                        : 0;


                const currentMargin =
                    stats[market].sales
                        ? stats[market].profit /
                        stats[market].sales
                        : 0;


                return currentMargin <
                    lowestMargin
                    ? market
                    : lowest;

            },
            markets[0]
        );


    const margin =
        stats[lowestMarket].profit /
        stats[lowestMarket].sales *
        100;


    setText(
        "riskTitle",
        `${lowestMarket} shows the lowest profitability`
    );


    setText(
        "riskNumber",
        margin.toFixed(2) + "%"
    );


    setText(
        "riskDescription",

        `${lowestMarket} currently has the weakest profit margin among markets visible in the selected dataset.`
    );
}


/* =========================================
   DOM HELPER
   ========================================= */

function setText(id, text) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = text;
    }
}


/* =========================================
   ERROR MESSAGE
   ========================================= */

function showError(message) {

    console.error(message);

    setText(
        "filterSummary",
        message
    );
}


/* =========================================
   SMOOTH NAVIGATION
   ========================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function(event) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (target) {

                    event.preventDefault();

                    window.scrollTo({
                        top:
                            target.offsetTop - 80,
                        behavior:
                            "smooth"
                    });

                }
            }
        );
    });


console.log(
    "Global Retail Intelligence Dashboard initialized"
);
