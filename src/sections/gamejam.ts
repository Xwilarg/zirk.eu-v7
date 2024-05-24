import { Chart, LineController, LineElement, PointElement, LinearScale, Title, BarController, BarElement, CategoryScale, PieController, ArcElement, Colors, Tooltip } from 'chart.js';

export function setupGamejams(): void {
    // Hover a gamejam image
    for (let elem of document.getElementsByClassName("gamejam")) {
        const img = elem.querySelector("img") as HTMLImageElement;
        elem.addEventListener("mouseover", e => { // Display the underlying GIF
            if ((elem as HTMLElement).dataset.missinggif !== "1") {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // Display an empty image so we don't have the "missing image" thing
                img.style.backgroundImage = `url(${img.dataset.src!.substring(0, img.dataset.src!.length - 4)}.gif)`;
            }
        });
        elem.addEventListener("mouseout", _ => { // Display the image
            if ((elem as HTMLElement).dataset.missinggif !== "1") {
                img.src = img.dataset.src!;
                img.style.backgroundImage = "";
            }
        });
    }

    const jamsList = document.querySelectorAll(".full-list .gamejam");
    function filter() {
        for (let elem of jamsList) {
            const game = elem as HTMLElement;
            let l = document.getElementById("filter-location") as HTMLSelectElement;
            if (l.value !== "" && l.value !== game.dataset.location) {
                game.hidden = true;
                continue;
            }
            let d = document.getElementById("filter-duration") as HTMLSelectElement;
            if (d.value !== "") {
                const s = d.value.split('-');
                const duration = parseInt(game.dataset.duration!);
                if (duration < parseInt(s[0]) || duration > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let en = document.getElementById("filter-entries") as HTMLSelectElement;;
            if (en.value !== "") {
                if (en.value === "-1") {
                    if (game.dataset.entries !== "-1") {
                        game.hidden = true;
                        continue;
                    }
                }
                const s = en.value.split('-');
                const entries = parseInt(game.dataset.entries!);
                if (entries < parseInt(s[0]) || entries > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let y = document.getElementById("filter-year") as HTMLSelectElement;;
            if (y.value !== "" && y.value !== game.dataset.year) {
                game.hidden = true;
                continue;
            }
            let e = document.getElementById("filter-engine") as HTMLSelectElement;;
            if (e.value !== "" && e.value !== game.dataset.engine) {
                game.hidden = true;
                continue;
            }
            let e2 = document.getElementById("filter-event") as HTMLSelectElement;;
            if (e2.value !== "" && e2.value !== game.dataset.event) {
                game.hidden = true;
                continue;
            }
            let lang = document.getElementById("filter-language") as HTMLSelectElement;;
            if (lang.value !== "" && !game.dataset.language!.split(';').includes(lang.value)) {
                game.hidden = true;
                continue;
            }
            let pe = document.getElementById("filter-people") as HTMLSelectElement;;
            if (pe.value !== "" && !game.dataset.team!.split(';').includes(pe.value)) {
                game.hidden = true;
                continue;
            }
            let alone = document.getElementById("filter-alone") as HTMLInputElement;
            if (alone.checked && game.dataset.team !== "") {
                game.hidden = true;
                continue;
            }
            let ranked = document.getElementById("filter-ranked") as HTMLInputElement;
            if (ranked.checked && game.dataset.score === "1") {
                game.hidden = true;
                continue;
            }
            game.hidden = false;
        }
    }

    let filters = [
        "filter-location", "filter-duration", "filter-year", "filter-engine", "filter-event", "filter-entries", "filter-language", "filter-people", "filter-alone", "filter-ranked"
    ]

    for (let f of filters) {
        document.getElementById(f)!.addEventListener("change", _ => {
            filter();
        });
    }

    function sortDate() {
        let i = 0;
        for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a: Element, b: Element): number => { return Date.parse((b as HTMLElement).dataset.date!) - Date.parse((a as HTMLElement).dataset.date!); })) {
            (elem as HTMLElement).style.order = i.toString();
            i++;
        }
    }

    function sortScore() {
        let i = 0;
        for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a: Element, b: Element): number => { return Date.parse((b as HTMLElement).dataset.score!) - Date.parse((a as HTMLElement).dataset.score!); })) {
            (elem as HTMLElement).style.order = i.toString();
            i++;
        }
    }

    function sortDuration() {
        let i = 0;
        for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a: Element, b: Element): number => { return Date.parse((b as HTMLElement).dataset.duration!) - Date.parse((a as HTMLElement).dataset.duration!); })) {
            (elem as HTMLElement).style.order = i.toString();
            i++;
        }
    }

    document.getElementById("jam-sort-date")!.addEventListener('change', () => {
        sortDate();
    });

    document.getElementById("jam-sort-score")!.addEventListener('change', () => {
        sortScore();
    });

    document.getElementById("jam-sort-duration")!.addEventListener('change', () => {
        sortDuration();
    });
    sortDate();

    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, BarController, BarElement, CategoryScale, PieController, ArcElement, Colors, Tooltip)
    {
        const ctx = document.getElementById("jam-stat-count") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let counts: Array<number> = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i.toString());
            counts.push([...jamsList].filter(x => (x as HTMLElement).dataset.year === i.toString()).length);
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Jams',
                    data: counts,
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Number of jams per years',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    {
        const ctx = document.getElementById("jam-stat-hours-count") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let counts: Array<number> = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i.toString());
            counts.push([...jamsList].filter(x => (x as HTMLElement).dataset.year === i.toString()).reduce((partialSum, x) => partialSum + Number.parseInt((x as HTMLElement).dataset.duration!), 0));
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Jams',
                    data: counts,
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Time spent of jams per years (hours)',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    {
        const ctx = document.getElementById("jam-stat-duration") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let averages: Array<number | null> = [];
        let medians: Array<number | null> = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i.toString());
            const elems = [...jamsList].filter(x => (x as HTMLElement).dataset.year === i.toString()).map(x => Number.parseInt((x as HTMLElement).dataset.duration!));

            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Math.trunc(elems.length / 2);
                if (elems.length % 2 === 0) {
                    medians.push((elems[index - 1] + elems[index]) / 2);
                } else {
                    medians.push(elems[index]);
                }
            } else {
                averages.push(null);
                medians.push(null);
            }
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average',
                    data: averages,
                    borderWidth: 1
                }, {
                    label: 'Medians',
                    data: medians,
                    borderWidth: 1
                }]
            },
            options: {
                spanGaps: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Jam durations (hours) per years',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    {
        const ctx = document.getElementById("jam-stat-score") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let averages: Array<number | null> = [];
        let medians: Array<number | null> = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i.toString());
            const elems = [...jamsList].filter(x => (x as HTMLElement).dataset.year === i.toString() && (x as HTMLElement).dataset.score !== "1" && parseInt((x as HTMLElement).dataset.entries!) >= 10).map(x => Number.parseFloat((x as HTMLElement).dataset.score!) * 100);

            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Math.trunc(elems.length / 2);
                if (elems.length % 2 === 0) {
                    medians.push((elems[index - 1] + elems[index]) / 2);
                } else {
                    medians.push(elems[index]);
                }
            } else {
                averages.push(null);
                medians.push(null);
            }
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average',
                    data: averages,
                    borderWidth: 1
                }, {
                    label: 'Medians',
                    data: medians,
                    borderWidth: 1
                }]
            },
            options: {
                spanGaps: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Jam scores (rank percentile) per years (≥10 entries)',
                    }
                },
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        reverse: true
                    },
                }
            }
        });
    }
    {
        const entries = [10, 100, 1000, 5000, 100000];
        const ctx = document.getElementById("jam-stat-score-by-entry-count") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let averages: Array<number | null> = [];
        let medians: Array<number | null> = [];

        for (let i = 0; i < entries.length; i++) {
            const d = entries[i];
            const last = i == 0 ? 0 : entries[i - 1];
            labels.push(`≤${d}`);
            const elems = [...jamsList].filter(x => parseInt((x as HTMLElement).dataset.entries!) > last && parseInt((x as HTMLElement).dataset.entries!) <= d && (x as HTMLElement).dataset.score !== "1").map(x => Number.parseFloat((x as HTMLElement).dataset.score!) * 100);

            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Math.trunc(elems.length / 2);
                if (elems.length % 2 === 0) {
                    medians.push((elems[index - 1] + elems[index]) / 2);
                } else {
                    medians.push(elems[index]);
                }
            } else {
                averages.push(null);
                medians.push(null);
            }
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average',
                    data: averages.map(x => x == null ? null : [100, x]),
                    borderWidth: 1
                }, {
                    label: 'Medians',
                    data: medians.map(x => x == null ? null : [100, x]),
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Jam scores (rank percentile) per jam entry count',
                    }
                },
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        reverse: true
                    },
                }
            }
        });
    }
    {
        const durations = [1, 24, 48, 72, 168, 10000];
        const ctx = document.getElementById("jam-stat-score-by-duration") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let averages: Array<number | null> = [];
        let medians: Array<number | null> = [];

        for (let i = 0; i < durations.length; i++) {
            const d = durations[i];
            const last = i == 0 ? 0 : durations[i - 1];
            labels.push(`≤${d}`);
            const elems = [...jamsList].filter(x => parseInt((x as HTMLElement).dataset.duration!) > last && parseInt((x as HTMLElement).dataset.duration!) <= d && (x as HTMLElement).dataset.score !== "1" && parseInt((x as HTMLElement).dataset.entries!) >= 10).map(x => Number.parseFloat((x as HTMLElement).dataset.score!) * 100);
            0
            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Math.trunc(elems.length / 2);
                if (elems.length % 2 === 0) {
                    medians.push((elems[index - 1] + elems[index]) / 2);
                } else {
                    medians.push(elems[index]);
                }
            } else {
                averages.push(null);
                medians.push(null);
            }
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average',
                    data: averages.map(x => x == null ? null : [100, x]),
                    borderWidth: 1
                }, {
                    label: 'Medians',
                    data: medians.map(x => x == null ? null : [100, x]),
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Jam scores (rank percentile) per jam length (≥10 entries)',
                    }
                },
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        reverse: true
                    },
                }
            }
        });
    }
    {
        const ctx = document.getElementById("jam-stat-engines") as HTMLCanvasElement;
        let labels: Array<string> = [];
        let values: Array<number> = [];

        for (const elem of [...new Set([...jamsList].map(x => (x as HTMLElement).dataset.engine))]) {
            labels.push(elem!);
            values.push([...jamsList].filter(x => (x as HTMLElement).dataset.engine === elem).length);
        }

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Engines',
                    data: values
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Engines used',
                    }
                }
            }
        });
    }
}