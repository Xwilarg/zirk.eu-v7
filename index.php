<?php

require_once "vendor/autoload.php";

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader(["templates", "rpg/templates"]);
$twig = new Environment($loader);

# Gamejams
$jamData = array();
$locations = array();
$engines = array();
$events = array();
$languages = array();
$people = array();
$data = json_decode(file_get_contents("data/json/gamejam.json"), true);
foreach ($data as $jam) {
    if (isset($locations[$jam["location"]])) {
        $locations[$jam["location"]]++;
    } else {
        $locations[$jam["location"]] = 1;
    }
    if (isset($engines[$jam["engine"]])) {
        $engines[$jam["engine"]]++;
    } else {
        $engines[$jam["engine"]] = 1;
    }
    if (isset($events[$jam["shortEvent"]])) {
        $events[$jam["shortEvent"]]++;
    } else {
        $events[$jam["shortEvent"]] = 1;
    }
    foreach ($jam["language"] as $l) {
        if (isset($languages[$l])) {
            $languages[$l]++;
        } else {
            $languages[$l] = 1;
        }
    }
    foreach ($jam["team"] as $t) {
        if ($t === "D35298FE0A5D34C1A0DB4D02E00BD1F1") {
            continue;
        }
        if (isset($people[$t])) {
            $people[$t]++;
        } else {
            $people[$t] = 1;
        }
    }
    $overall = 0;
    $entries = 0;
    if ($jam["rating"] !== null && $jam["rating"]["scores"] !== null && $jam["rating"]["scores"]["Overall"]["rank"] !== null) {
        $overall = $jam["rating"]["scores"]["Overall"]["rank"];
        $entries = $jam["rating"]["entriesRated"] === null ? $jam["rating"]["entries"] : $jam["rating"]["entriesRated"];
    }

    array_push($jamData, [
        "name" => $jam["fullName"],
        "image" => "data/img/gamejam/" . $jam["name"] . ".jpg",
        "gif" => "data/img/gamejam/" . $jam["name"] . ".gif",
        "event" => $jam["event"],
        "shortEvent" => $jam["shortEvent"],
        "date" => $jam["date"],
        "duration" => $jam["duration"],
        "location" => $jam["location"],
        "engine" => $jam["engine"],
        "theme" => count($jam["theme"]) > 0 ? $jam["theme"][0] : null,
        "overall" => $overall,
        "team" => $jam["team"],
        "entries" => $entries,
        "website" => $jam["nsfw"] ? null : $jam["website"],
        "source" => $jam["nsfw"] ? null : $jam["github"],
        "webgl" => $jam["nsfw"] || count($jam["webgl"]) == 0 ? null : $jam["webgl"][0],
        "gameplay" => $jam["gameplay"],
        "stream" => $jam["stream"],
        "language" => $jam["language"],
        "entriesTotal" => ($jam["rating"] === null || $jam["rating"]["entries"] === null) ? -1 : $jam["rating"]["entries"],
        "score" => $jam["rating"] === null || $jam["rating"]["scores"] === null || $jam["rating"]["scores"]["Overall"]["rank"] === null ? 1
            : $jam["rating"]["scores"]["Overall"]["rank"] / $jam["rating"]["entries"]
    ]);
}
arsort($locations);
arsort($engines);
arsort($events);
arsort($languages);
arsort($people);

# Projects
function projectSort($a, $b) {
    return strcmp($a["name"], $b["name"]);
}
$projectsData = array();
$data = json_decode(file_get_contents("data/json/projects.json"), true);
usort($data, "projectSort");
foreach ($data as $project) {
    array_push($projectsData, [
        "name" => $project["nsfw"] ? null : $project["name"],
        "type" => $project["type"],
        "description" => $project["description"],
        "languages" => $project["languages"],
        "image" => $project["image"] === null ? null : "data/img/projects/" . $project["image"]["id"] . ".png",
        "start" => $project["dates"]["start"],
        "end" => $project["dates"]["end"],
        "highlight" => $project["highlight"],
        "links" => $project["nsfw"] ? array() : $project["links"]
    ]);
}

# Display page
echo $twig->render("index.html.twig", [
    "jams" => [
        "data" => $jamData,
        "locations" => $locations,
        "engines" => $engines,
        "events" => $events,
        "languages" => $languages,
        "people" => $people
    ],
    "projects" => $projectsData,
    "about" => json_decode(file_get_contents("data/json/about.json"), true)
]);