
/**
 * Initializing the embedded map feature
 * @param {*} lon longtitude
 * @param {*} lat latitude
 */
function mapInit(lon, lat) {

    let zoom = 16;

    const iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
        name: 'Icon',
    });

    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [iconFeature]

                }),
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'img/geo-alt-fill.svg',
                        scale: 2,
                    })
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom
        }),

    });
}

// /**
//  * 
//  * @param {*} coords 
//  */
// async function mapRoute(coords) {

//     // Fetch the data from the database
//     let response = await fetch(`/map/${coords}`);
//     let data = await response.json();

//     // Create an array to hold the coordinates
//     let coordinates = [];

//     // Create a vector source
//     let vectorSource = new ol.source.Vector();

//     // For each object in the data, create a point and add it to the vector source
//     for (let item of data) {
//         let coordinate = ol.proj.fromLonLat([item[0], item[1]]);
//         coordinates.push(coordinate);

//         let pointFeature = new ol.Feature({
//             geometry: new ol.geom.Point(coordinate),
//         });

//         vectorSource.addFeature(pointFeature);
//     }

//     // Create a line string using the coordinates and add it to the vector source
//     // Make the color of the line red
//     let lineFeature = new ol.Feature({
//         geometry: new ol.geom.LineString(coordinates),
//     });

//     vectorSource.addFeature(lineFeature);

//     // Create a vector layer using the vector source
//     let vectorLayer = new ol.layer.Vector({
//         source: vectorSource,
//         style: new ol.style.Style({
//             stroke: new ol.style.Stroke({
//                 color: 'red',
//                 width: 3,
//             }),
//         }),
//     });
//     // Create the map
//     let map = new ol.Map({
//         target: 'map',
//         layers: [
//             new ol.layer.Tile({
//                 source: new ol.source.OSM(),
//             }),
//             vectorLayer,
//         ],
//         view: new ol.View({
//             center: ol.proj.fromLonLat([0, 0]),
//             zoom: 2,
//         }),
//     });

//     // Fit the view to the extent of the vector layer
//     let extent = vectorLayer.getSource().getExtent();
//     map.getView().fit(extent, { padding: [60, 60, 60, 60] });
// }

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

