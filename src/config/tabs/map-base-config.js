define({
    lang: 'en',
    plugins: {
        fullscreen: true,
        scalecontrol:'bottomleft'
    },
    guiController: {
        container: '',
        wmsLoader: false                 
    },
    baselayers: {
        cartodb: {
            title_en: "CartoDB light",
            title_fr: "CartoDB light",
            url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
            subdomains: 'abcd',
            maxZoom: 19
        },
        osm: {
            //url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            url: "http://{s}.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png",
            title_en: "Openstreetmap",
            title_fr: "Openstreetmap",
            maxZoom: 16
        },
        world_imagery: {
            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            title_en: "World Imagery",
            title_fr: "World Imagery"
        }
    },
    legendOptions: {
        fontColor: '0x000000',
        fontSize: '12',
        bgColor: '0xFFFFFF'
    }
});