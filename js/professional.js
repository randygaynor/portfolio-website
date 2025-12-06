// professional.js
(function () {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZmFjOGQ0Ni1hYjI0LTRiNzItOGVlMS0yMmZjNzY3MmQ1ZjQiLCJpZCI6MzY3MDk2LCJpYXQiOjE3NjQ5NzMzOTF9.cwlhh1VjxuWv6YPd6hsNGF_jsTLTXJ8gwM_ej2VsqQ4";

    const defaultView = {
        destination: Cesium.Cartesian3.fromDegrees(-120, 20, 18000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0
        }
    };

    const viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        timeline: false,
        geocoder: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        homeButton: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        selectionIndicator: false,
        infoBox: false
    });

    // --- OSM base layer ---
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({ url: "https://a.tile.openstreetmap.org/" })
    );

    // --- Satellite imagery overlay ---
    const satelliteDate = "2024-09-25";
    const satelliteLayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
            url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${satelliteDate}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg`,
            layer: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible_Level9",
            maximumLevel: 9,
            credit: "NASA GIBS",
            subdomains: ["a","b","c"]
        })
    );
    satelliteLayer.alpha = 0.8;

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
                    <li>Member of the Phi Beta Kappa Honor Society</li>
                </ul>
            `,
            link: "https://www.eoas.fsu.edu/",
            linkText: "FSU EOAS",
            mediaPath: "", // no media
            mediaCaption: "",
            billboard: { image: "https://upload.wikimedia.org/wikipedia/en/d/d5/Florida_State_Seminoles_logo.svg", scale: 0.3 }
        },
        {
            name: "Hurricane Analyst Internship",
            lat: 22.32,
            lon: -87.05,
            desc: `
                <ul>
                    <li>Pictured is Hurricane Helene on September 25, 2024</li>
                    <li>With Moody's HWind, I produced operational wind field analyses of this storm</li>
                    <li>Learned Data Collection, Software Operation, and Client Interaction</li>
                    <li>Worked with GitHub, Database Interaction, Python, and Research</li>
                </ul>
            `,
            link: "https://www.moodys.com/web/en/us/capabilities/catastrophe-modeling/hwind.html",
            linkText: "Moody's HWind",
            mediaPath: "", // no media
            mediaCaption: "",
            billboard: { image: "https://raw.githubusercontent.com/randygaynor/portfolio-website/main/media/nGQAAAABklEQVQDAAVEjailRpAAAAAElFTkSuQmCC.png", scale: 0.07 }
        },
        {
            name: "Graduate Research",
            lat: 26.064,
            lon: -80.153,
            desc: `
                <ul>
                    <li>My graduate research focused on modeling severe weather over FLL</li>
                    <li>I used the Weather Research and Forecasting (WRF) model</li>
                    <li>Coupled with a new Lightning Data Assimilation (LDA) methodology</li>
                    <li>Improved convective representation of a flash flooding event</li>
                    <li>The severe event occurred on April 12, 2023</li>
                </ul>
            `,
            link: "https://search.proquest.com/openview/dd037ecd84674c7129dd23e722e459d8/1?pq-origsite=gscholar&cbl=18750&diss=y",
            linkText: "Published Paper",
            mediaPath: "../media/radar_test.gif", // GIF
            mediaCaption: "KAMX Radar Reflectivity animation during the flash flooding event with lightning flashes overlaid in blue",
            billboard: { image: "https://raw.githubusercontent.com/randygaynor/portfolio-website/main/media/pngtree-cartoon-storm-cloud-with-lightning-bolts-png-image_20717979.png", scale: 0.015 }
        },
        {
            name: "Undergraduate Research",
            lat: 39.743,
            lon: -104.995,
            desc: `
                <ul>
                    <li>My undergraduate research focused on smoke ingesting Cb</li>
                    <li>I investigated smoke trajectories using the HYSPLIT model</li>
                    <li>Traced them towards lightning producing Cb</li>
                    <li>Measured the percentage of +CG from that storm</li>
                    <li>Compared to the normal to test the hypothesis</li>
                </ul>
            `,
            link: "https://ui.adsabs.harvard.edu/abs/2023AMS...10322960G/abstract",
            linkText: "AMS Abstract",
            mediaPath: "../media/professional.jpg", // static image
            mediaCaption: "Me presenting my research at the AMS Student Conference at Denver, CO in 2023",
            billboard: { image: "https://raw.githubusercontent.com/randygaynor/portfolio-website/main/media/download.png", scale: 0.055 }
        }
    ];

    // --- Add POIs to viewer ---
    points.forEach(p => {
        viewer.entities.add({
            name: p.name,
            position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat),
            billboard: { image: p.billboard.image, scale: p.billboard.scale, verticalOrigin: Cesium.VerticalOrigin.CENTER },
            properties: { 
                description: p.desc, 
                link: p.link, 
                linkText: p.linkText, 
                mediaPath: p.mediaPath, 
                mediaCaption: p.mediaCaption 
            }
        });
    });

    // --- Default camera view ---
    viewer.camera.setView(defaultView);

    // --- DOM elements ---
    const infoPanel = document.getElementById("infoPanel");
    const infoTitle = document.getElementById("infoTitle");
    const infoDesc = document.getElementById("infoDesc");
    const infoLink = document.getElementById("infoLink");
    const closeInfo = document.getElementById("closeInfo");

    const mediaPanel = document.getElementById("imagePanel");
    const mediaImage = document.getElementById("poiImage");
    const mediaCaption = document.getElementById("imageCaption");

    closeInfo.addEventListener("click", () => {
        infoPanel.classList.add("hidden");
        mediaPanel.classList.add("hidden");
    });

    // --- Auto-rotation ---
    let rotating = true;
    const rotationSpeed = 0.003;
    viewer.clock.onTick.addEventListener(() => {
        if (rotating) viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, -rotationSpeed);
    });

    // --- Click handler ---
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(click => {
        const pickedObject = viewer.scene.pick(click.position);

        if (Cesium.defined(pickedObject) && pickedObject.id) {
            rotating = false;
            const entity = pickedObject.id;
            const props = entity.properties;

            const carto = Cesium.Cartographic.fromCartesian(entity.position.getValue(viewer.clock.currentTime));
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    Cesium.Math.toDegrees(carto.longitude),
                    Cesium.Math.toDegrees(carto.latitude),
                    500000
                ),
                duration: 2.5
            });

            // Show info panel
            infoTitle.textContent = entity.name || "";
            infoDesc.innerHTML = props?.description?.getValue() || "";
            infoLink.href = props?.link?.getValue() || "#";
            infoLink.textContent = props?.linkText?.getValue() || "Learn more";
            infoPanel.classList.remove("hidden");

            // Show media if available (GIF or image)
            const mediaPath = props?.mediaPath?.getValue ? props.mediaPath.getValue() : props.mediaPath;
            const mediaText = props?.mediaCaption?.getValue ? props.mediaCaption.getValue() : props.mediaCaption;

            if (mediaPath) {
                mediaImage.src = mediaPath;
                mediaCaption.textContent = mediaText || "";
                mediaPanel.classList.remove("hidden");
            } else {
                mediaPanel.classList.add("hidden");
            }

        } else {
            // Reset camera & hide panels
            rotating = true;
            viewer.camera.flyTo(defaultView);
            infoPanel.classList.add("hidden");
            mediaPanel.classList.add("hidden");
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // --- Resize handler ---
    window.addEventListener("resize", () => viewer.resize());

})();
