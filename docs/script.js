/* =========================================
   GLOBAL RETAIL INTELLIGENCE
   INTERACTIVE DATA ENGINE
   ========================================= */

let retailData = [];
let filteredData = [];

let selectedYear = "All";
let selectedYearFrom = null;
let selectedYearTo = null;
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
                color: "#9aa9bd",
                usePointStyle: false,
                padding: 16
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
   ========================================= */

function findColumn(row, possibleNames) {

    const columns = Object.keys(row);

    for (const possibleName of possibleNames) {

        const normalizedPossibleName =
            possibleName
                .toLowerCase()
                .replace(/[\s_-]/g, "");

        const found = columns.find(column =>

            column
                .toLowerCase()
                .replace(/[\s_-]/g, "")
            ===
            normalizedPossibleName
        );

        if (found) {
            return found;
        }
    }

    return null;
}


/* =========================================
   NUMBER CLEANING
   ========================================= */

function toNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return 0;
    }

    return Number(
        String(value)
            .replace(/[$,%]/g, "")
            .replace(/,/g, "")
            .trim()
    ) || 0;
}


/* =========================================
   DATE PARSING
   ========================================= */

function parseDate(value) {

    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (!isNaN(date.getTime())) {
        return date;
    }

    const parts =
        String(value).split(/[\/-]/);

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

    const absoluteValue = Math.abs(value);

    if (absoluteValue >= 1000000) {
        return "$" + (value / 1000000).toFixed(2) + "M";
    }

    if (absoluteValue >= 1000) {
        return "$" + (value / 1000).toFixed(1) + "K";
    }

    return "$" + Number(value || 0).toFixed(0);
}


function formatNumber(value) {

    return new Intl.NumberFormat(
        "en-US"
    ).format(value || 0);
}


/* =========================================
   MONTH HELPERS
   ========================================= */

const shortMonthNames = [
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
];


const fullMonthNames = [
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


function normalizeMonth(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const numericMonth = Number(value);

    if (
        numericMonth >= 1 &&
        numericMonth <= 12
    ) {
        return numericMonth;
    }

    const monthString =
        String(value)
            .trim()
            .toLowerCase();

    const monthIndex =
        fullMonthNames.findIndex(
            month =>
                month.toLowerCase() === monthString
        );

    if (monthIndex !== -1) {
        return monthIndex + 1;
    }

    const shortMonthIndex =
        shortMonthNames.findIndex(
            month =>
                month.toLowerCase() ===
                monthString.substring(0, 3)
        );

    if (shortMonthIndex !== -1) {
        return shortMonthIndex + 1;
    }

    return null;
}


/* =========================================
   LOAD CSV
   ========================================= */

Papa.parse(
    "data/global_retail_powerbi.csv",
    {

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


            const sampleRow =
                results.data[0];


            console.log(
                "Detected columns:",
                Object.keys(sampleRow)
            );


            /* =========================================
               DETECT COLUMNS
               ========================================= */

            const salesColumn =
                findColumn(
                    sampleRow,
                    [
                        "sales",
                        "revenue",
                        "total_sales",
                        "totalsales"
                    ]
                );


            const profitColumn =
                findColumn(
                    sampleRow,
                    [
                        "profit",
                        "total_profit",
                        "totalprofit"
                    ]
                );


            const marketColumn =
                findColumn(
                    sampleRow,
                    [
                        "market",
                        "market_group",
                        "marketgroup",
                        "region"
                    ]
                );


            const orderColumn =
                findColumn(
                    sampleRow,
                    [
                        "order_id",
                        "orderid",
                        "order id"
                    ]
                );


            const customerColumn =
                findColumn(
                    sampleRow,
                    [
                        "customer_id",
                        "customerid",
                        "customer id"
                    ]
                );


            const dateColumn =
                findColumn(
                    sampleRow,
                    [
                        "order_date",
                        "orderdate",
                        "order date",
                        "date"
                    ]
                );


            /* IMPORTANT:
               Use existing cleaned columns
               from your Power BI CSV
            */

            const yearColumn =
                findColumn(
                    sampleRow,
                    [
                        "year"
                    ]
                );


            const monthColumn =
                findColumn(
                    sampleRow,
                    [
                        "month",
                        "month_number",
                        "monthnumber"
                    ]
                );


            const quarterColumn =
                findColumn(
                    sampleRow,
                    [
                        "quarter"
                    ]
                );


            console.log({
                salesColumn,
                profitColumn,
                marketColumn,
                orderColumn,
                customerColumn,
                dateColumn,
                yearColumn,
                monthColumn,
                quarterColumn
            });


            if (
                !salesColumn ||
                !profitColumn
            ) {

                showError(
                    "Required sales or profit columns could not be detected."
                );

                return;
            }


            /* =========================================
               NORMALIZE DATA
               ========================================= */

            retailData =
                results.data
                    .map(row => {

                        const date =
                            dateColumn
                                ? parseDate(
                                    row[dateColumn]
                                )
                                : null;


                        const csvYear =
                            yearColumn
                                ? Number(
                                    row[yearColumn]
                                )
                                : null;


                        const csvMonth =
                            monthColumn
                                ? normalizeMonth(
                                    row[monthColumn]
                                )
                                : null;


                        let csvQuarter =
                            quarterColumn
                                ? Number(
                                    String(
                                        row[quarterColumn]
                                    )
                                    .replace(/[^0-9]/g, "")
                                )
                                : null;


                        if (
                            !csvQuarter ||
                            csvQuarter < 1 ||
                            csvQuarter > 4
                        ) {
                            csvQuarter = null;
                        }


                        return {

                            sales:
                                toNumber(
                                    row[salesColumn]
                                ),

                            profit:
                                toNumber(
                                    row[profitColumn]
                                ),

                            market:
                                marketColumn
                                    ? String(
                                        row[marketColumn]
                                    ).trim()
                                    : "Unknown",

                            order:
                                orderColumn
                                    ? String(
                                        row[orderColumn]
                                    ).trim()
                                    : "",

                            customer:
                                customerColumn
                                    ? String(
                                        row[customerColumn]
                                    ).trim()
                                    : "",

                            date: date,


                            /* USE CSV YEAR FIRST */

                            year:
                                (
                                    csvYear &&
                                    !isNaN(csvYear)
                                )
                                    ? csvYear
                                    : (
                                        date
                                            ? date.getFullYear()
                                            : null
                                    ),


                            /* USE CSV MONTH FIRST */

                            month:
                                csvMonth
                                    ? csvMonth
                                    : (
                                        date
                                            ? date.getMonth() + 1
                                            : null
                                    ),


                            /* USE CSV QUARTER FIRST */

                            quarter:
                                csvQuarter
                                    ? csvQuarter
                                    : (
                                        csvMonth
                                            ? Math.ceil(
                                                csvMonth / 3
                                            )
                                            : (
                                                date
                                                    ? Math.floor(
                                                        date.getMonth() / 3
                                                    ) + 1
                                                    : null
                                            )
                                    )
                        };
                    })

                    .filter(row =>
                        row.year &&
                        row.month &&
                        !isNaN(row.sales)
                    );


            filteredData =
                [...retailData];


            console.log(
                "Valid records:",
                retailData.length
            );


            console.log(
                "Available years:",
                [...new Set(
                    retailData.map(
                        row => row.year
                    )
                )]
            );


            console.log(
                "Available markets:",
                [...new Set(
                    retailData.map(
                        row => row.market
                    )
                )]
            );


            createYearFilters();

            createMarketFilters();

            updateDashboard();
        },


        error: function(error) {

            console.error(
                "CSV loading error:",
                error
            );

            showError(
                "Error loading CSV data."
            );
        }
    }
);


/* =========================================
   CREATE YEAR RANGE SLICER
   ========================================= */

function createYearFilters() {

    const container =
        document.getElementById(
            "yearFilters"
        );


    if (!container) {
        console.warn(
            "yearFilters container not found"
        );
        return;
    }


    const years =
        [...new Set(
            retailData
                .map(row => Number(row.year))
                .filter(year => Number.isFinite(year))
        )]
        .sort(
            (a, b) => a - b
        );


    if (!years.length) {
        container.innerHTML =
            '<div class="year-range-all">No years available</div>';
        return;
    }


    const minYear = years[0];
    const maxYear = years[years.length - 1];


    selectedYearFrom = minYear;
    selectedYearTo = maxYear;
    selectedYear = "All";


    container.innerHTML = `
        <div class="year-range-values">

            <div
                class="year-range-value"
                id="yearFromValue"
            >
                ${minYear}
            </div>

            <div
                class="year-range-summary"
                id="yearRangeSummary"
            >
                All Years
            </div>

            <div
                class="year-range-value"
                id="yearToValue"
            >
                ${maxYear}
            </div>

        </div>


        <div class="year-range-track">

            <div class="year-range-base"></div>

            <div
                class="year-range-progress"
                id="yearRangeProgress"
            ></div>

            <input
                type="range"
                id="yearFromSlider"
                class="year-range-slider year-range-slider-from"
                min="${minYear}"
                max="${maxYear}"
                step="1"
                value="${minYear}"
                aria-label="Starting year"
            >

            <input
                type="range"
                id="yearToSlider"
                class="year-range-slider year-range-slider-to"
                min="${minYear}"
                max="${maxYear}"
                step="1"
                value="${maxYear}"
                aria-label="Ending year"
            >

        </div>


        <div class="year-range-ticks">

            ${years.map(year => `
                <span
                    class="year-range-tick active"
                    data-year="${year}"
                >
                    ${year}
                </span>
            `).join("")}

        </div>


        <button
            type="button"
            class="year-range-all"
            id="allYearsButton"
        >
            All Years
        </button>
    `;


    const fromSlider =
        document.getElementById(
            "yearFromSlider"
        );


    const toSlider =
        document.getElementById(
            "yearToSlider"
        );


    if (fromSlider) {
        fromSlider.addEventListener(
            "input",
            handleYearRangeInput
        );
    }


    if (toSlider) {
        toSlider.addEventListener(
            "input",
            handleYearRangeInput
        );
    }


    document
        .querySelectorAll(
            ".year-range-tick"
        )
        .forEach(tick => {

            tick.addEventListener(
                "click",
                function() {

                    const year =
                        Number(this.dataset.year);

                    setYearRange(
                        year,
                        year
                    );
                }
            );
        });


    document
        .getElementById("allYearsButton")
        ?.addEventListener(
            "click",
            function() {

                setYearRange(
                    minYear,
                    maxYear
                );
            }
        );


    updateYearRangeUI();
}


/* =========================================
   YEAR RANGE INPUT
   ========================================= */

function handleYearRangeInput(event) {

    const fromSlider =
        document.getElementById(
            "yearFromSlider"
        );


    const toSlider =
        document.getElementById(
            "yearToSlider"
        );


    if (!fromSlider || !toSlider) {
        return;
    }


    let from =
        Number(fromSlider.value);


    let to =
        Number(toSlider.value);


    if (from > to) {

        if (event.target === fromSlider) {
            from = to;
            fromSlider.value = from;
        } else {
            to = from;
            toSlider.value = to;
        }
    }


    selectedYearFrom = from;
    selectedYearTo = to;


    selectedYear =
        from === to
            ? String(from)
            : "All";


    updateYearRangeUI();

    applyFilters();
}


/* =========================================
   SET YEAR RANGE
   ========================================= */

function setYearRange(from, to) {

    const minYear = getMinYear();
    const maxYear = getMaxYear();


    if (
        minYear === null ||
        maxYear === null
    ) {
        return;
    }


    from = Math.max(
        minYear,
        Math.min(Number(from), maxYear)
    );


    to = Math.max(
        minYear,
        Math.min(Number(to), maxYear)
    );


    if (from > to) {
        [from, to] = [to, from];
    }


    selectedYearFrom = from;
    selectedYearTo = to;


    selectedYear =
        from === to
            ? String(from)
            : "All";


    const fromSlider =
        document.getElementById(
            "yearFromSlider"
        );


    const toSlider =
        document.getElementById(
            "yearToSlider"
        );


    if (fromSlider) {
        fromSlider.value = from;
    }


    if (toSlider) {
        toSlider.value = to;
    }


    updateYearRangeUI();

    applyFilters();
}


/* =========================================
   YEAR RANGE HELPERS
   ========================================= */

function getAvailableYears() {

    return [
        ...new Set(
            retailData
                .map(row => Number(row.year))
                .filter(year => Number.isFinite(year))
        )
    ].sort(
        (a, b) => a - b
    );
}


function getMinYear() {

    const years =
        getAvailableYears();

    return years.length
        ? years[0]
        : null;
}


function getMaxYear() {

    const years =
        getAvailableYears();

    return years.length
        ? years[years.length - 1]
        : null;
}


function updateYearRangeUI() {

    if (
        selectedYearFrom === null ||
        selectedYearTo === null
    ) {
        return;
    }


    const fromValue =
        document.getElementById(
            "yearFromValue"
        );


    const toValue =
        document.getElementById(
            "yearToValue"
        );


    const summary =
        document.getElementById(
            "yearRangeSummary"
        );


    const progress =
        document.getElementById(
            "yearRangeProgress"
        );


    const fromSlider =
        document.getElementById(
            "yearFromSlider"
        );


    const toSlider =
        document.getElementById(
            "yearToSlider"
        );


    if (fromValue) {
        fromValue.textContent =
            selectedYearFrom;
    }


    if (toValue) {
        toValue.textContent =
            selectedYearTo;
    }


    if (summary) {

        if (
            selectedYearFrom === getMinYear() &&
            selectedYearTo === getMaxYear()
        ) {
            summary.textContent =
                "All Years";

        } else if (
            selectedYearFrom === selectedYearTo
        ) {
            summary.textContent =
                String(selectedYearFrom);

        } else {
            summary.textContent =
                `${selectedYearFrom} — ${selectedYearTo}`;
        }
    }


    if (
        progress &&
        fromSlider &&
        toSlider
    ) {

        const min =
            Number(fromSlider.min);

        const max =
            Number(fromSlider.max);

        const from =
            Number(fromSlider.value);

        const to =
            Number(toSlider.value);

        const range =
            max - min;

        const left =
            range === 0
                ? 0
                : ((from - min) / range) * 100;

        const right =
            range === 0
                ? 100
                : ((to - min) / range) * 100;

        progress.style.left =
            `${left}%`;

        progress.style.width =
            `${right - left}%`;
    }


    document
        .querySelectorAll(
            ".year-range-tick"
        )
        .forEach(tick => {

            const year =
                Number(tick.dataset.year);

            tick.classList.toggle(
                "active",
                year >= selectedYearFrom &&
                year <= selectedYearTo
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


    if (!container) {
        console.warn(
            "marketFilters container not found"
        );
        return;
    }


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


    container.appendChild(

        createFilterButton(
            "All Markets",
            "All",
            "market",
            true
        )
    );


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


    button.type = "button";

    button.textContent = text;


    button.className =
        "filter-btn" +
        (
            active
                ? " active"
                : ""
        );


    button.dataset.value =
        String(value);

    button.dataset.type =
        type;


    button.addEventListener(
        "click",
        function() {

            if (type === "year") {

                selectedYear =
                    String(value);

                updateActiveButton(
                    "yearFilters",
                    button
                );
            }


            if (type === "market") {

                selectedMarket =
                    String(value);

                updateActiveButton(
                    "marketFilters",
                    button
                );
            }


            console.log(
                "Filters changed:",
                {
                    selectedYear,
                    selectedMarket
                }
            );


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

    const buttons =
        document.querySelectorAll(
            "#" +
            containerId +
            " .filter-btn"
        );


    buttons.forEach(button => {

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

    const from =
        selectedYearFrom !== null
            ? selectedYearFrom
            : getMinYear();


    const to =
        selectedYearTo !== null
            ? selectedYearTo
            : getMaxYear();


    filteredData =
        retailData.filter(row => {

            const year =
                Number(row.year);

            const yearMatch =
                Number.isFinite(year) &&
                year >= from &&
                year <= to;


            const marketMatch =
                selectedMarket === "All" ||
                String(row.market) ===
                String(selectedMarket);


            return (
                yearMatch &&
                marketMatch
            );
        });


    console.log(
        "Filtered records:",
        filteredData.length,
        {
            selectedYearFrom,
            selectedYearTo,
            selectedMarket
        }
    );


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

            const minYear =
                getMinYear();

            const maxYear =
                getMaxYear();


            selectedYearFrom = minYear;
            selectedYearTo = maxYear;
            selectedYear = "All";
            selectedMarket = "All";


            const fromSlider =
                document.getElementById(
                    "yearFromSlider"
                );


            const toSlider =
                document.getElementById(
                    "yearToSlider"
                );


            if (
                fromSlider &&
                minYear !== null
            ) {
                fromSlider.value = minYear;
            }


            if (
                toSlider &&
                maxYear !== null
            ) {
                toSlider.value = maxYear;
            }


            document
                .querySelectorAll(
                    "#marketFilters .filter-btn"
                )
                .forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.value ===
                        "All"
                    );
                });


            updateYearRangeUI();

            applyFilters();


            console.log(
                "Filters reset"
            );
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
        totalSales > 0
            ? (
                totalProfit /
                totalSales
            ) * 100
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

    const summary = [];


    if (
        selectedYearFrom === getMinYear() &&
        selectedYearTo === getMaxYear()
    ) {
        summary.push("All Years");

    } else if (
        selectedYearFrom === selectedYearTo
    ) {
        summary.push(String(selectedYearFrom));

    } else {
        summary.push(
            `${selectedYearFrom} — ${selectedYearTo}`
        );
    }


    if (selectedMarket === "All") {
        summary.push("All Markets");
    } else {
        summary.push(selectedMarket);
    }


    setText(
        "filterSummary",

        `${formatNumber(
            filteredData.length
        )} records · ${summary.join(" · ")}`
    );


    setText(
        "periodTag",
        summary.join(" · ")
    );
}


/* =========================================
   GROUP SUM HELPER
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
            key === undefined ||
            key === ""
        ) {
            return;
        }


        result[key] =
            (result[key] || 0) +
            (Number(valueFunction(row)) || 0);
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
   EMPTY CHART HELPER
   ========================================= */

function hasCanvas(id) {

    return document.getElementById(id) !== null;
}


/* =========================================
   GROWTH CHART

   ALL YEARS:
   Shows yearly trend

   SINGLE YEAR:
   Shows monthly trend
   ========================================= */

function updateGrowthChart() {

    if (!hasCanvas("growthChart")) {
        return;
    }


    destroyChart("growth");


    const canvas =
        document.getElementById(
            "growthChart"
        );


    let labels = [];
    let salesValues = [];
    let profitValues = [];


    /* =====================================
       ALL YEARS SELECTED
       ===================================== */

    if (selectedYearFrom !== selectedYearTo) {

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
                .map(Number)
                .sort(
                    (a, b) => a - b
                );


        labels =
            years.map(String);


        salesValues =
            years.map(
                year =>
                    salesByYear[year] || 0
            );


        profitValues =
            years.map(
                year =>
                    profitByYear[year] || 0
            );


        setText(
            "growthChartTitle",
            "Revenue & Profit Growth"
        );


        setText(
            "growthChartSubtitle",
            "Performance evolution across years"
        );

    }


    /* =====================================
       SINGLE YEAR SELECTED
       SHOW MONTHLY TREND
       ===================================== */

    else {

        const salesByMonth =
            groupSum(
                filteredData,
                row => row.month,
                row => row.sales
            );


        const profitByMonth =
            groupSum(
                filteredData,
                row => row.month,
                row => row.profit
            );


        labels =
            [...shortMonthNames];


        salesValues =
            Array.from(
                { length: 12 },
                (_, index) =>
                    salesByMonth[index + 1] || 0
            );


        profitValues =
            Array.from(
                { length: 12 },
                (_, index) =>
                    profitByMonth[index + 1] || 0
            );


        setText(
            "growthChartTitle",
            `Revenue & Profit Trend — ${selectedYearFrom}`
        );


        setText(
            "growthChartSubtitle",
            `Monthly performance during ${selectedYearFrom}`
        );
    }


    charts.growth =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label: "Sales",

                            data: salesValues,

                            borderColor:
                                COLORS.accent,

                            backgroundColor:
                                "rgba(79,209,197,0.10)",

                            fill: true,

                            borderWidth: 3,

                            tension: 0.4,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            pointBackgroundColor:
                                COLORS.accent
                        },

                        {
                            label: "Profit",

                            data: profitValues,

                            borderColor:
                                COLORS.blue,

                            backgroundColor:
                                "rgba(79,140,255,0.05)",

                            fill: false,

                            borderWidth: 3,

                            tension: 0.4,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            pointBackgroundColor:
                                COLORS.blue
                        }
                    ]
                },

                options: {

                    ...commonOptions,

                    interaction: {
                        mode: "index",
                        intersect: false
                    },

                    scales: {

                        x: {
                            grid: {
                                display: false
                            },

                            ticks: {
                                color: "#9aa9bd"
                            }
                        },

                        y: {

                            beginAtZero: true,

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                color: "#9aa9bd",

                                callback:
                                    value =>
                                        formatCurrency(
                                            value
                                        )
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   MARKET SALES CHART
   ========================================= */

function updateMarketChart() {

    if (!hasCanvas("marketChart")) {
        return;
    }


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

                    plugins: {
                        ...commonOptions.plugins,

                        legend: {
                            display: false
                        }
                    },

                    scales: {

                        x: {

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(
                                            value
                                        )
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
   MONTHLY SALES CHART
   ========================================= */

function updateMonthlyChart() {

    if (!hasCanvas("monthlyChart")) {
        return;
    }


    destroyChart("monthly");


    const monthSales =
        groupSum(
            filteredData,
            row => row.month,
            row => row.sales
        );


    const values =
        shortMonthNames.map(
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

                    labels:
                        shortMonthNames,

                    datasets: [

                        {
                            label:
                                "Monthly Sales",

                            data:
                                values,

                            borderColor:
                                COLORS.orange,

                            backgroundColor:
                                "rgba(255,184,107,0.10)",

                            fill: true,

                            borderWidth: 3,

                            tension: 0.4,

                            pointRadius: 3,

                            pointHoverRadius: 6
                        }
                    ]
                },

                options: {

                    ...commonOptions,

                    plugins: {
                        ...commonOptions.plugins,

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

                            beginAtZero: true,

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(
                                            value
                                        )
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   QUARTERLY PERFORMANCE
   ========================================= */

function updateQuarterChart() {

    if (!hasCanvas("quarterChart")) {
        return;
    }


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

                            beginAtZero: true,

                            grid: {
                                color: COLORS.grid
                            },

                            ticks: {

                                callback:
                                    value =>
                                        formatCurrency(
                                            value
                                        )
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

    if (!hasCanvas("profitabilityChart")) {
        return;
    }


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


            return stats.sales > 0
                ? (
                    stats.profit /
                    stats.sales
                ) * 100
                : 0;
        });


    const lowestMargin =
        margins.length
            ? Math.min(...margins)
            : 0;


    charts.profitability =
        new Chart(
            document.getElementById(
                "profitabilityChart"
            ),
            {

                type: "bar",

                data: {

                    labels:
                        markets,

                    datasets: [

                        {
                            label:
                                "Profit Margin %",

                            data:
                                margins,

                            backgroundColor:
                                margins.map(
                                    margin =>

                                        margin ===
                                        lowestMargin

                                            ? COLORS.red

                                            : COLORS.accent
                                ),

                            borderRadius: 7
                        }
                    ]
                },

                options: {

                    ...commonOptions,

                    plugins: {
                        ...commonOptions.plugins,

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
            "insight1Title",
            "No data available"
        );

        setText(
            "insight1Text",
            "No records match the current filter combination."
        );

        setText(
            "insight2Title",
            "No data available"
        );

        setText(
            "insight2Text",
            "Try selecting a different filter."
        );

        return;
    }


    /* =====================================
       REVENUE TREND
       ===================================== */

    const yearlySales =
        groupSum(
            filteredData,
            row => row.year,
            row => row.sales
        );


    const years =
        Object.keys(yearlySales)
            .map(Number)
            .sort(
                (a, b) => a - b
            );


    if (years.length >= 2) {

        const firstYear =
            years[0];

        const lastYear =
            years[years.length - 1];


        const firstValue =
            yearlySales[firstYear];


        const lastValue =
            yearlySales[lastYear];


        const growth =
            firstValue !== 0
                ? (
                    (lastValue - firstValue) /
                    firstValue
                ) * 100
                : 0;


        setText(
            "insight1Title",
            "Revenue performance trend"
        );


        setText(
            "insight1Text",

            `Sales changed by ${growth.toFixed(1)}% between ${firstYear} and ${lastYear} within the current selection.`
        );

    } else {

        setText(
            "insight1Title",
            `Performance during ${selectedYearFrom}`
        );

        setText(
            "insight1Text",
            "The current view is filtered to a single year. Monthly trends are displayed in the Revenue & Profit chart."
        );
    }


    /* =====================================
       BEST MONTH
       ===================================== */

    const monthlySales =
        groupSum(
            filteredData,
            row => row.month,
            row => row.sales
        );


    const months =
        Object.keys(monthlySales);


    let bestMonth =
        months.length
            ? months.reduce(
                (best, month) =>

                    monthlySales[month] >
                    monthlySales[best]

                        ? month
                        : best
            )
            : 1;


    const bestMonthIndex =
        Number(bestMonth) - 1;


    setText(
        "insight2Title",

        `${fullMonthNames[bestMonthIndex] || "N/A"} is the strongest month`
    );


    setText(
        "insight2Text",

        `${fullMonthNames[bestMonthIndex] || "This period"} generated ${formatCurrency(monthlySales[bestMonth] || 0)} in sales within the selected data.`
    );


    /* =====================================
       BEST MARKET
       ===================================== */

    const marketSales =
        groupSum(
            filteredData,
            row => row.market,
            row => row.sales
        );


    const markets =
        Object.keys(marketSales);


    if (markets.length) {

        const bestMarket =
            markets.reduce(
                (best, market) =>

                    marketSales[market] >
                    marketSales[best]

                        ? market
                        : best
            );


        setText(
            "insight3Title",

            `${bestMarket} leads revenue performance`
        );


        setText(
            "insight3Text",

            `${bestMarket} generated ${formatCurrency(marketSales[bestMarket])} in revenue within the current selection.`
        );
    }


    /* =====================================
       LOWEST MARGIN MARKET
       ===================================== */

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


    const marketMargins = {};


    Object.keys(marketStats)
        .forEach(market => {

            const stats =
                marketStats[market];


            marketMargins[market] =
                stats.sales > 0

                    ? (
                        stats.profit /
                        stats.sales
                    ) * 100

                    : 0;
        });


    const marginMarkets =
        Object.keys(marketMargins);


    if (marginMarkets.length) {

        const lowestMarket =
            marginMarkets.reduce(
                (lowest, market) =>

                    marketMargins[market] <
                    marketMargins[lowest]

                        ? market
                        : lowest
            );


        setText(
            "insight4Title",

            `${lowestMarket} shows margin pressure`
        );


        setText(
            "insight4Text",

            `${lowestMarket} has a profit margin of ${marketMargins[lowestMarket].toFixed(2)}%, making it the lowest-margin market in the current selection.`
        );
    }
}


/* =========================================
   RISK CARD
   ========================================= */

function updateRiskCard() {

    if (!filteredData.length) {

        setText(
            "riskTitle",
            "No risk data available"
        );

        setText(
            "riskNumber",
            "0%"
        );

        setText(
            "riskDescription",
            "No records match the selected filters."
        );

        return;
    }


    const stats = {};


    filteredData.forEach(row => {

        if (!stats[row.market]) {

            stats[row.market] = {
                sales: 0,
                profit: 0
            };
        }


        stats[row.market].sales +=
            row.sales;

        stats[row.market].profit +=
            row.profit;
    });


    const markets =
        Object.keys(stats);


    if (!markets.length) {
        return;
    }


    const lowestMarket =
        markets.reduce(
            (lowest, market) => {

                const lowestMargin =
                    stats[lowest].sales > 0

                        ? (
                            stats[lowest].profit /
                            stats[lowest].sales
                        ) * 100

                        : 0;


                const currentMargin =
                    stats[market].sales > 0

                        ? (
                            stats[market].profit /
                            stats[market].sales
                        ) * 100

                        : 0;


                return currentMargin < lowestMargin
                    ? market
                    : lowest;

            },
            markets[0]
        );


    const margin =
        stats[lowestMarket].sales > 0

            ? (
                stats[lowestMarket].profit /
                stats[lowestMarket].sales
            ) * 100

            : 0;


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

                const targetId =
                    this.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
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
