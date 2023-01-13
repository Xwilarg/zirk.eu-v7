<?php

require_once "vendor/autoload.php";

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader(["templates", "rpg/templates"]);
$twig = new Environment($loader);

# Gamejams
$jamData = array();
$data = json_decode(file_get_contents("data/json/gamejam.json"), true);
foreach ($data as $jam) {
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
        "date" => $jam["date"],
        "duration" => $jam["duration"],
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

# Projects
$projectsData = array();
$data = json_decode(file_get_contents("data/json/projects.json"), true);
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
    "jams" => $jamData ,
    "projects" => $projectsData,
    "about" => json_decode(file_get_contents("data/json/about.json"), true)
]);