window.onload = function () {
    let linkReverse = {};

    // Link each link to where it should head
    for (let elem of document.getElementsByClassName("main-link")) {
        linkReverse[elem.dataset.target.toLowerCase()] = elem;
    }
    for (let elem of document.getElementsByClassName("main-link")) {
        const target = elem;
        elem.addEventListener("click", () => {
            displayTab(target.dataset.category, target.dataset.target);
        });
    }
    
    // Lead to right place depending of hash
    const urlParam = window.location.hash.toLowerCase().substring(1);

    setup_sketch();
    document.getElementById("sketch-data").addEventListener("click", _=> {
        load_sketch();
    });
    if (urlParam == "sketch") {
        load_sketch();
    }

    if (urlParam in linkReverse)
    {
        let target = linkReverse[urlParam];
        if (target.dataset.dependency !== undefined) { // If a link is dependent of something else, we open it first
            var dep = linkReverse[target.dataset.dependency];
            displayTab(dep.dataset.category, dep.dataset.target);
        }
        displayTab(target.dataset.category, urlParam);
    }

    // Hover a gamejam image
    for (let elem of document.getElementsByClassName("gamejam")) {
        const img = elem.querySelector("img");
        elem.addEventListener("mouseover", e => { // Display the underlying GIF
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // Display an empty image so we don't have the "missing image" thing
            img.style.backgroundImage = `url(${img.dataset.src.substring(0, img.dataset.src.length - 4)}.gif)`;
        });
        elem.addEventListener("mouseout", _ => { // Display the image
            img.src = img.dataset.src;
            img.style.backgroundImage = "";
        });
    }

    // Link buttons that should show a YouTube embed
    for (let elem of document.getElementsByClassName("youtube-show")) {
        const target = elem;
        elem.addEventListener("click", _ => {
            const player = document.getElementById(`${target.dataset.target}-yt-player`);
            player.hidden = false;
            player.src = `https://www.youtube-nocookie.com/embed/${target.dataset.id}`;
        });
    }

    // Link project preview in the big list
    for (let p of document.getElementsByClassName("project-image-preview")) {
        p.addEventListener("click", e => { // Show a project preview
            if (p.dataset.img === "" || document.getElementById("project-normal-preview-title").innerHTML === p.dataset.name) {
                document.getElementById("project-normal-preview").hidden = true;
            } else {
                document.getElementById("project-normal-preview-image").src = "";
                document.getElementById("project-normal-preview-title").innerHTML = p.dataset.name;
                document.getElementById("project-normal-preview-image").src = p.dataset.img;
                document.getElementById("project-normal-preview").hidden = false;
            }
            e.Handled = true;
        });
    }
    document.addEventListener("scroll", _ => {
        document.getElementById("project-normal-preview").hidden = true;
    });

    document.getElementById("new-cookie").addEventListener("click", _ => {
        let data;
        switch (Math.floor(Math.random() * 10))
        {
            case 0:
                data = Intl.DateTimeFormat().resolvedOptions().timeZone; // User timezone
                break;

            case 1:
                data = `${window.innerWidth}x${window.innerHeight}`; // Window dimentions
                break;

            case 2:
                data = `${navigator.oscpu}`; // Current OS (undefined on Chrome but uh)
                break;

            case 3:
                data = `${navigator.userAgent}`; // Current user agent
                break;

            case 4:
                data = `${navigator.language}`; // Current language
                break;

            case 5:
                data = `${new Date()}`; // Current date
                break;

            case 6:
                data = `true`; // Is cheese tasty
                break;

            default:
                data = Math.floor(Math.random() * 100000); // We just store a random number because whatever
                break;
        }

        document.cookie = `ZIRK_${Math.floor(Math.random() * 100000)}=${data}; max-age=3600; path=/; SameSite=Strict`;
        document.getElementById("faq-banner").innerHTML = `${new Date().toLocaleString()} - Cookie updated`;
    });

    const jamsList = document.querySelectorAll(".full-list .gamejam");
    function filter() {
        for (let game of jamsList) {
            let l = document.getElementById("filter-location");
            if (l.value !== "" && l.value !== game.dataset.location) {
                game.hidden = true;
                continue;
            }
            let d = document.getElementById("filter-duration");
            if (d.value !== "") {
                const s = d.value.split('-');
                const duration = parseInt(game.dataset.duration);
                if (duration < parseInt(s[0]) || duration > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let en = document.getElementById("filter-entries");
            if (en.value !== "") {
                if (en.value === "-1") {
                    if (game.dataset.entries !== "-1") {
                        game.hidden = true;
                        continue;
                    }
                }
                const s = en.value.split('-');
                const entries = parseInt(game.dataset.entries);
                if (entries < parseInt(s[0]) || entries > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let y = document.getElementById("filter-year");
            if (y.value !== "" && y.value !== game.dataset.year) {
                game.hidden = true;
                continue;
            }
            let e = document.getElementById("filter-engine");
            if (e.value !== "" && e.value !== game.dataset.engine) {
                game.hidden = true;
                continue;
            }
            let e2 = document.getElementById("filter-event");
            if (e2.value !== "" && e2.value !== game.dataset.event) {
                game.hidden = true;
                continue;
            }
            let lang = document.getElementById("filter-language");
            if (lang.value !== "" && !game.dataset.language.split(';').includes(lang.value)) {
                game.hidden = true;
                continue;
            }
            let pe = document.getElementById("filter-people");
            if (pe.value !== "" && !game.dataset.team.split(';').includes(pe.value)) {
                game.hidden = true;
                continue;
            }
            let alone = document.getElementById("filter-alone");
            if (alone.checked && game.dataset.team !== "") {
                game.hidden = true;
                continue;
            }
            let ranked = document.getElementById("filter-ranked");
            console.log(game.dataset.score);
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
        document.getElementById(f).addEventListener("change", _ => {
            filter();
        });
    }

    document.getElementById("jam-sort-date").addEventListener('change', () => {
        let i = 0;
        for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a, b) => { return a.dataset.date - b.dataset.date; })) {
            elem.style.order = i;
            i++;
        }
    });

    document.getElementById("jam-sort-score").addEventListener('change', () => {
        let i = 0;
        for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a, b) => { return a.dataset.score - b.dataset.score; })) {
            elem.style.order = i;
            i++;
        }
    });

    {
        const ctx = document.getElementById("jam-stat-count");
        let labels = [];
        let counts = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i);
            counts.push([...jamsList].filter(x => x.dataset.year === i.toString()).length);
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
        const ctx = document.getElementById("jam-stat-duration");
        let labels = [];
        let averages = [];
        let medians = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i);
            const elems = [...jamsList].filter(x => x.dataset.year === i.toString()).map(x => Number.parseInt(x.dataset.duration));

            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Number.parseInt(elems.length / 2);
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
        const ctx = document.getElementById("jam-stat-score");
        let labels = [];
        let averages = [];
        let medians = [];

        for (let i = 2016; i <= new Date().getFullYear(); i++) {
            labels.push(i);
            const elems = [...jamsList].filter(x => x.dataset.year === i.toString() && x.dataset.score !== "1").map(x => Number.parseFloat(x.dataset.score) * 100);

            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Number.parseInt(elems.length / 2);
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
                  text: 'Jam scores (rank percentile) per years',
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
        const ctx = document.getElementById("jam-stat-score-by-duration");
        let labels = [];
        let averages = [];
        let medians = [];

        for (let i in durations) {
            const d = durations[i];
            const last = i == 0 ? 0 : durations[i - 1];
            labels.push(`≤${d}`);
            const elems = [...jamsList].filter(x => x.dataset.duration > last && x.dataset.duration < d && x.dataset.score !== "1").map(x => Number.parseFloat(x.dataset.score) * 100);

            if (elems.length > 0) {
                averages.push(elems.reduce((partialSum, a) => partialSum + a, 0) / elems.length);
                const index = Number.parseInt(elems.length / 2);
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
              data: averages.map(x => [100, 100 - x]),
              borderWidth: 1
            }, {
                label: 'Medians',
                data: medians.map(x => [100, 100 - x]),
                borderWidth: 1
              }]
          },
          options: {
            spanGaps: true,
            plugins: {
                title: {
                  display: true,
                  text: 'Jam scores (rank percentile) per jam length',
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
        const ctx = document.getElementById("jam-stat-engines");
        let labels = [];
        let values = [];

        for (const elem of [...new Set([...jamsList].map(x => x.dataset.engine))]) {
            labels.push(elem);
            values.push([...jamsList].filter(x => x.dataset.engine === elem).length);
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
};