
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

/**
 * Initializing the embedded map for books that exist in multiple libraries
 * @param {*} isbn To get the locations where the book has copies 
 */
async function mapMult(isbn) {

    let books, center;

    books = await fetch(`/map/${isbn}`).then((res) => {
        return res.json();
    }).then((data) => {
        return data;
    }).catch(error => {
        console.log(error);
    });


    const icons = [];

    for (let i = 0; i < books.length; i++) {

        icons.push(new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(books[i].location.split(','))),
            name: books[i].name,
        }))
    }


    center = books[0].location.split(',');

    let vectorLayer = new ol.layer.Vector({

        source: new ol.source.Vector({ features: icons }),

        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'img/geo-alt-fill.svg',
                scale: 2,
            })
        })
    });

    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
            vectorLayer

        ],
        view: new ol.View({
            center: ol.proj.fromLonLat(center),
            zoom: 16
        }),

    });

    // used for hover interactions
    let selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: [vectorLayer]
    });


    // Handle the hover event
    map.addInteraction(selectPointerMove);

    selectPointerMove.on('select',
        function (e) {
            let feature = e.selected[0];

            if (feature) {
                document.getElementById(`library-reserve-url-${e.selected[0]['A']['name']}`).style = 'background-color: #ECE5F1; cursor: pointer;';
            } else {
                for (i = 0; i < books.length; i++) {
                    document.getElementsByClassName('library-reservations')[i].style.background = '';
                    document.getElementsByClassName('library-reservations')[i].style.opacity = '1';
                }
            }
        });


    if (books.length != 1) {
        // Get the extent of the vector layer
        let extent = vectorLayer.getSource().getExtent();

        // Fit the view to the extent of the vector layer
        map.getView().fit(extent, { padding: [60, 60, 60, 60] }); // Adjust padding as needed
    }
}
