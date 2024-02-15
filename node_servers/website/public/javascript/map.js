let safezone1 = [21.822057501641, 38.216649297601];
let safezone2 = [21.822787062493, 38.221099885448];
let safezone3 = [21.823559538689, 38.222920502012];

let baseCenter = [(safezone1[0] + safezone2[0] + safezone3[0]) / 3, (safezone1[1] + safezone2[1] + safezone3[1]) / 3];
 
let zoom = 11;

let baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

let baseSource = new ol.source.Vector();

let iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([21.785301516944624, 38.289606268498105])),
    name: 'Icon',
});

let iconFeature2 = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(safezone1)),
    name: 'Icon',
}); 

let iconFeature4 = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(safezone3)),
    name: 'Icon',
});

for (let feature of [iconFeature, iconFeature2, iconFeature4]) {
    feature.setStyle(
        new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'img/heart-l',
                scale: 2,
            })
        })
    );

    baseSource.addFeature(feature);
}
// iconFeature.setStyle(
//     new ol.style.Style({
//         image: new ol.style.Icon({
//             anchor: [0.5, 0.5],
//             anchorXUnits: 'fraction',
//             anchorYUnits: 'pixels',
//             src: 'img/geo-alt-fill.svg',
//             scale: 2,
//         })
//     })
// );

// baseSource.addFeature(iconFeature);

let map = new ol.Map({
    target: 'map',
    layers: [
        baseLayer,
        new ol.layer.Vector({
            source: baseSource,
        }),
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat(baseCenter),
        zoom: zoom
    }),
});

async function mapRoute(serial) {

    // Fetch the data from the database
    // let response = await fetch(`/map/${serial}`);
    let link = `/map/${serial}`;    
    let link_data = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({data:{}}),

    }

    let data =  await fetch(link, link_data).then((res) => {
        // It checks if it should be returning a json or text (which in this case is html code )
        return res.json();
    }).then((data) => {        // Return the html code
        return data;
    }).catch(error => {
        console.log(error);
    });
    
    // let data = await response.json();
    console.log(data);
    // Create an array to hold the coordinates
    let coordinates = [];

    let center ;

    // Create a vector source
    let vectorSource = new ol.source.Vector();

    // For each object in the data, create a point and add it to the vector source
    
    for (let item of data) {
        let coordinate = ol.proj.fromLonLat([item.longitude, item.latitude]);
        coordinates.push(coordinate);

        let pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
        });

        vectorSource.addFeature(pointFeature);
    }

    // Create a line string using the coordinates and add it to the vector source
    // Make the color of the line red
    let lineFeature = new ol.Feature({
        geometry: new ol.geom.LineString(coordinates),
    });

    vectorSource.addFeature(lineFeature);

    // Create a vector layer using the vector source
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });
 
     // Add the vector layer to the map
     map.addLayer(vectorLayer);

    // Get middle point of the 1st and last point
    center = [(data[0].longitude + data[data.length - 1].longitude) / 2, (data[0].latitude + data[data.length - 1].latitude) / 2];

    checkSafeZonesCheckboxExists([safezone1, safezone2, safezone3]);
    checkDangerZonesCheckboxExists();

     // Fit the view to the extent of the vector layer
     let extent = vectorLayer.getSource().getExtent();
     map.getView().fit(extent, { padding: [60, 60, 60, 60] });

    // // Add the vector layer to the map
    // map.addLayer(vectorLayer);

    // console.log(document.getElementById("safe-zones"));
    
    
 
}

async function mapMult() {
    // Fetch the data from the database
    // let response = await fetch(`/map/${coords}`);
    // let data = await response.json();

    let data = [    

        [21.821499602166, 38.214525057432],

        [21.822014586297, 38.215502889974],

        [21.822057501641, 38.216649297601],

        [21.821671263543, 38.217492232863],

        [21.821671263543, 38.218200290937],

        [21.822100416985, 38.219009491727],

        [21.821928755608, 38.219953547941],

        [21.822057501641, 38.220459287303],

        [21.822787062493, 38.221099885448],

        [21.822787062493, 38.222178774837],

        [21.823173300591, 38.222650783914],

        [21.823559538689, 38.222920502012],

        [21.824417845574, 38.222886787304],

        [21.824804083672, 38.222886787304],

        [21.82519032177, 38.223122789929],

        [21.825662390557, 38.223493649649],

        [21.826391951409, 38.223426220749],

        [21.827593581048, 38.223055360686],

        [21.827636496392, 38.22362850726],

        [21.827293173638, 38.224302791567],

        [21.828709379998, 38.224741073015],

        [21.828709379998, 38.225347919891],

        [21.829696432915, 38.225314206308],

        [21.830297247735, 38.224842214512],

        [21.830898062554, 38.224437647678]

    ];

    // Create an array to hold the coordinates
    let coordinates = [];

    // Create a vector source
    let vectorSource = new ol.source.Vector();

    // For each object in the data, create a point and add it to the vector source
    for (let item of data) {
        let coordinate = ol.proj.fromLonLat([item[0], item[1]]);
        coordinates.push(coordinate);

        let pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
        });

        vectorSource.addFeature(pointFeature);
    }

    // Create a line string using the coordinates and add it to the vector source
    // Make the color of the line red
    let lineFeature = new ol.Feature({
        geometry: new ol.geom.LineString(coordinates),
    });

    vectorSource.addFeature(lineFeature);

    // Create a vector layer using the vector source
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 3,
            }),
        }),
    });

    // Get the last coordinate
    let lastCoordinate = coordinates[coordinates.length - 1];

    // Create a feature for the last coordinate
    let lastPointFeature = new ol.Feature({
        geometry: new ol.geom.Point(lastCoordinate),
    });

    // Set the style of the last point feature to use an icon
    lastPointFeature.setStyle(
        new ol.style.Style({
            image: new ol.style.Icon({
                src: 'img/geo-alt-fill.svg', // Replace with the path to your icon
            }),
        })
    );

    // Add the last point feature to the vector source
    vectorSource.addFeature(lastPointFeature);

    // Create the map
    let map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
            vectorLayer,
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2,
        }),
    });

    // Fit the view to the extent of the vector layer
    let extent = vectorLayer.getSource().getExtent();
    map.getView().fit(extent, { padding: [60, 60, 60, 60] });
}

function hashCode(str) {
    // Simple hash function to generate a number from a string
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    // Convert a number to a RGB color
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

async function drawPaths(route) {
    // Fetch the coordinates from the server-side route
    let trackers = await fetch(route).then((res) => {
        return res.text();
    }).then((data) => {
        return JSON.parse(data);
    }).catch(error => {
        callback(error, null)
        console.log(error);
    });

    console.log(trackers);
    // Create an array to hold the coordinates
    let coordinates = [];

    // Create a vector source
    let vectorSource = new ol.source.Vector();

    // For each object in the data, create a point and add it to the vector source
    
    for (let item of trackers["location"]) {
        let coordinate = ol.proj.fromLonLat(item);
        coordinates.push(coordinate);

        let pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
        });

        vectorSource.addFeature(pointFeature);
    }

    // Create a line string using the coordinates and add it to the vector source
    // Make the color of the line red
    let pathFeature = new ol.Feature({
        geometry: new ol.geom.LineString(coordinates),
    });

    // Create a vector layer using the vector source
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    let color = intToRGB(hashCode(tracker.type));

    pathFeature.setStyle(
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#' + color,
                width: 3,
            }),
        })
    );

    vectorSource.addFeature(pathFeature);
    // // Fit the view to the extent of the vector layer
    // let extent = vectorLayer.getSource().getExtent();
    // map.getView().fit(extent, { padding: [60, 60, 60, 60] });
    // Add the vector layer to the map
    map.addLayer(vectorLayer);
    
}

let markersLayer;

function addMarkers(coordinates, iconPath = 'img/geo-alt-fill.svg') {
    // Create a vector source
    let vectorSource = new ol.source.Vector();

    // For each set of coordinates, create a feature and add it to the vector source
    for (let coordinate of coordinates) {
        let pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinate)),
        });

        pointFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: iconPath, // Replace with the path to your icon
                }),
            })
        );

        vectorSource.addFeature(pointFeature);
    }

    // Create a vector layer using the vector source
    markersLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    let extent = markersLayer.getSource().getExtent();
    map.getView().fit(extent, { padding: [60, 60, 60, 60] });

    // Add the vector layer to the map
    map.addLayer(markersLayer);
}

function removeMarkers() {
    // Remove the markers layer from the map
    if (markersLayer) {
        map.removeLayer(markersLayer);
        markersLayer = null;
        let extent = map.getLayers().getArray()[1].getSource().getExtent();
        map.getView().fit(extent, { padding: [60, 60, 60, 60] });
    }
}

function checkSafeZonesCheckboxExists(safeZoneCoordinates) {
    // Get the 'safe-zones' checkbox
    let safeZonesCheckbox = document.getElementById('safe-zones');

    // Check if the checkbox exists
    if (safeZonesCheckbox) {
        // 'safe-zones' checkbox exists
        // Add an event listener to the checkbox
        safeZonesCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // If the checkbox is checked, call the addMarkers function
                // Replace 'map' and 'coordinates' with your actual map and coordinates
                addMarkers(safeZoneCoordinates, 'img/location-heart-filled.svg');
            } else {
                // If the checkbox is unchecked, you might want to remove the markers
                // This depends on your specific requirements
                removeMarkers();
            }
        });
    } else {
        // 'safe-zones' checkbox does not exist
        return false;
    }
}

// fetch(`/device_location?serial=${serial}`)

// function getSerialParameter() {
//     let url = new URL(window.location.href);
//     let serial = url.searchParams.get("serial");
//     return serial;
// }

// let serial = getSerialParameter();
// mapRoute(serial);

function checkDangerZonesCheckboxExists() {
    // Get the 'danger-zones' checkbox
    let dangerZonesCheckbox = document.getElementById('dangerous-zones');

    // Check if the checkbox exists
    if (dangerZonesCheckbox) {
        // 'danger-zones' checkbox exists
        // Add an event listener to the checkbox
        dangerZonesCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // If the checkbox is checked, call the drawPaths function
                drawPaths(`/fire_info`);
            } else {
                // If the checkbox is unchecked, you might want to remove the markers
                // This depends on your specific requirements
                removeMarkers();
            }
        });
    } else {
        // 'danger-zones' checkbox does not exist
        return false;
    }
}