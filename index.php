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
        "entries" => $entries,
        "website" => $jam["nsfw"] ? null : $jam["website"],
        "source" => $jam["nsfw"] ? null : $jam["github"],
        "webgl" => $jam["nsfw"] ? null : $jam["webgl"][0],
        "gameplay" => $jam["gameplay"],
        "stream" => $jam["stream"],
        "score" => $jam["rating"] === null || $jam["rating"]["scores"] === null || $jam["rating"]["scores"]["Overall"]["rank"] === null ? 1
            : $jam["rating"]["scores"]["Overall"]["rank"] / $jam["rating"]["entries"]
    ]);
}
arsort($locations);
arsort($engines);
arsort($events);

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
    "jams" => $jamData,
    "locations" => $locations,
    "engines" => $engines,
    "events" => $events,
    "projects" => $projectsData,
    "about" => json_decode(file_get_contents("data/json/about.json"), true)
]);