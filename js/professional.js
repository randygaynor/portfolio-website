// professional.js
(function () {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZmFjOGQ0Ni1hYjI0LTRiNzItOGVlMS0yMmZjNzY3MmQ1ZjQiLCJpZCI6MzY3MDk2LCJpYXQiOjE3NjQ5NzMzOTF9.cwlhh1VjxuWv6YPd6hsNGF_jsTLTXJ8gwM_ej2VsqQ4";

    // --- Default zoomed-out camera parameters ---
    const defaultView = {
        destination: Cesium.Cartesian3.fromDegrees(-85, 20, 18000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0
        }
    };

    // Initialize Cesium Viewer
    const viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        timeline: false,
        geocoder: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        homeButton: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        selectionIndicator: false, // no yellow highlight
        infoBox: false
    });

    // --- OSM imagery ---
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({
            url: "https://a.tile.openstreetmap.org/"
        })
    );

    // --- Points of interest ---
    const points = [
        {
            name: "Florida State University",
            lat: 30.444,
            lon: -84.299,
            desc: `
                <ul>
                    <li>BS in Meteorology (Honors) - May 2023</li>
                    <li>MS in Meteorology - August 2025</li>
                    <li>Completed graduate and undergraduate research</li>
                    <li>Member of North Florida Chapter of AMS</li>
                    <li>Completed an internship in the field</li>
                </ul>
            `,
            link: "https://www.eoas.fsu.edu/"
        }
    ];

    // --- Add POIs to viewer ---
    points.forEach(p => {
        viewer.entities.add({
            name: p.name,
            position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat),
            billboard: {
                image: "https://upload.wikimedia.org/wikipedia/en/d/d5/Florida_State_Seminoles_logo.svg",
                scale: 0.3,
                verticalOrigin: Cesium.VerticalOrigin.CENTER
            },
            properties: {
                description: p.desc,
                link: p.link
            }
        });
    });

    // --- Default view ---
    viewer.camera.setView(defaultView);

    // --- Info panel DOM ---
    const infoPanel = document.getElementById("infoPanel");
    const infoTitle = document.getElementById("infoTitle");
    const infoDesc = document.getElementById("infoDesc");
    const infoLink = document.getElementById("infoLink");
    const closeInfo = document.getElementById("closeInfo");

    closeInfo.addEventListener("click", () => {
        infoPanel.classList.add("hidden");
    });

    // --- Auto-rotation ---
    let rotating = true;
    const rotationSpeed = 0.003; // radians per frame (~slow)

    viewer.clock.onTick.addEventListener(() => {
        if (rotating) {
            viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, -rotationSpeed);
        }
    });

    // --- Click handler ---
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(click => {
        const pickedObject = viewer.scene.pick(click.position);

        if (Cesium.defined(pickedObject) && pickedObject.id) {
            // --- Clicked on POI ---
            rotating = false; // stop auto-rotation

            const entity = pickedObject.id;
            const props = entity.properties;

            const carto = Cesium.Cartographic.fromCartesian(
                entity.position.getValue(viewer.clock.currentTime)
            );

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    Cesium.Math.toDegrees(carto.longitude),
                    Cesium.Math.toDegrees(carto.latitude),
                    100000
                ),
                duration: 2.5
            });

            // Show info panel
            infoTitle.textContent = entity.name || "";
            infoDesc.innerHTML = props?.description?.getValue() || "";
            infoLink.href = props?.link?.getValue() || "#";
            infoPanel.classList.remove("hidden");
        } else {
            // --- Clicked elsewhere: return to default view ---
            rotating = true; // resume auto-rotation
            viewer.camera.flyTo(defaultView);
            infoPanel.classList.add("hidden");
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // --- Resize handler ---
    window.addEventListener("resize", () => {
        viewer.resize();
    });

})();
