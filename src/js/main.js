require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Zoom",
    "esri/widgets/Home",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "esri/tasks/Locator",
    "esri/geometry/Extent",
    "esri/renderers/smartMapping/creators/color",
    "esri/widgets/Legend",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.js",
    "esri/widgets/Expand",
    "dojo/number",
    "esri/widgets/Print"
], function(Map, MapView, BasemapToggle, Zoom, Home, Search, FeatureLayer, Locator, Extent, colorRendererCreator, Legend, QueryTask, Query, Chart, Expand, number, Print){

    //===========================
    //Create the basic requirements
    var map = new Map({
        basemap: "streets-navigation-vector"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-95.444, 29.756],
        zoom: 8
    });
    view.ui.remove("zoom");

    var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "satellite"
    });

    var zoom = new Zoom({
        view: view
    });

    var home = new Home({
        view: view
    });

    var expandPrint = new Expand({
        view: view,
        content: new Print({
            view: view,
            printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        })
    });

    //Search for desktop screens but no search on phones
    var searchWidget = new Search({
        view: view,
        includeDefaultSources: false,
        sources: [{
            locator: new Locator({
                url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
            }),
            singleLineFieldName: "SingleLine",
            outFields: ["Addr_type"],
            searchExtent: new Extent({
                xmax: -97.292800,
                ymax: 30.797600,
                xmin: -93.236100,
                ymin: 28.460500
            }),
            placeholder: "3555 Timmons Ln, Houston, TX"
        }]
    });

    //Legend for desktops
    var legendWidget = new Legend({
        view: view
    });

    //Legend for smaller devices
    var expandLegend = new Expand({
        view: view,
        content: new Legend({
            view: view
        })
    });

    //Determine the type of legend to use
    isResponsiveSize = view.widthBreakpoint === "xsmall";
    updateView(isResponsiveSize);

    //Watch for Breakpoints
    view.watch("widthBreakpoint", function(breakpoint){
        switch(breakpoint){
            case "xsmall":
            case "small":
                updateView(true);
                break;
            case "medium":
            case "large":
            case "xlarge":
                updateView(false);
                break;
            default:
        }
    });

    //===========================================  
    //Block Group renderers
    var jGroupRenderer1980 = {
        type: "class-breaks",
        field: "tp_1980",
        legendOptions: {
            title: "1980 - Total Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,187,161, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,146,114, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "5,000 to 10,000"
            },{
                minValue: 10001,
                maxValue: 50000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jGroupRenderer1990 = {
        type: "class-breaks",
        field: "tp_1990",
        legendOptions: {
            title: "1990 - Total Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,187,161, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,146,114, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "5,000 to 10,000"
            },{
                minValue: 10001,
                maxValue: 50000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jGroupRenderer2000 = {
        type: "class-breaks",
        field: "tp_2000",
        legendOptions: {
            title: "2000 - Total Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,187,161, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,146,114, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "5,000 to 10,000"
            },{
                minValue: 10001,
                maxValue: 50000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jGroupRenderer2010 = {
        type: "class-breaks",
        field: "tp_2010",
        legendOptions: {
            title: "2010 - Total Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,187,161, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,146,114, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "5,000 to 10,000"
            },{
                minValue: 10001,
                maxValue: 50000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jGroupRendererCurrent = {
        type: "class-breaks",
        field: "Pop_Total",
        legendOptions: {
            title: "2018 - Total Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,187,161, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,146,114, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "5,000 to 10,000"
            },{
                minValue: 10001,
                maxValue: 50000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var car0GroupRenderer = {
        type: "class-breaks",
        field: "Auto_0_Car",
        legendOptions: {
            title: "Households with No Vehicle"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 25,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 25"
            }, {
                minValue: 26,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "26 to 75"
            }, {
                minValue: 76,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 300"
            }
        ]
    };

    var car1GroupRenderer = {
        type: "class-breaks",
        field: "Auto_1_Car",
        legendOptions: {
            title: "Households with 1 Vehicle"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,000"
            }
        ]
    };

    var car2GroupRenderer = {
        type: "class-breaks",
        field: "Auto_2_Car",
        legendOptions: {
            title: "Households with 2 Vehicles"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 3,000"
            }
        ]
    };

    var car3GroupRenderer = {
        type: "class-breaks",
        field: "Auto_3_Car",
        legendOptions: {
            title: "Households with 3 Vehicles"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 75"
            }, {
                minValue: 76,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 150"
            }, {
                minValue: 151,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,500"
            }
        ]
    };

    var car4GroupRenderer = {
        type: "class-breaks",
        field: "Auto_4Plus_Car",
        legendOptions: {
            title: "Households with 4 or More Vehicles"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 25,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 25"
            }, {
                minValue: 26,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "26 to 75"
            }, {
                minValue: 76,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 300"
            }
        ]
    };

    var age1GroupRenderer = {
        type: "class-breaks",
        field: "Age_Under_5",
        legendOptions: {
            title: "People Under Age 5"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 2,000"
            }
        ]
    };

    var age2GroupRenderer = {
        type: "class-breaks",
        field: "Age_5to17",
        legendOptions: {
            title: "People Age 5 to 17"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1000,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,000 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 6000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 6,000"
            }, {
                minValue: 6000,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 6,000"
            }
        ]
    };

    var age3GroupRenderer = {
        type: "class-breaks",
        field: "Age_18to34",
        legendOptions: {
            title: "People Age 18 to 34"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1000,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,000 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5000,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 5,000"
            }
        ]
    };

    var age4GroupRenderer = {
        type: "class-breaks",
        field: "Age_35to64",
        legendOptions: {
            title: "People Age 35 to 64"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1000,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,000 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5000,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 5,000"
            }
        ]
    };

    var age5GroupRenderer = {
        type: "class-breaks",
        field: "Age_65plus",
        legendOptions: {
            title: "People Age 65 and Older"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1200,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "601 to 1,200"
            }, {
                minValue: 1200,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,200"
            }
        ]
    };

    var earn1GroupRenderer = {
        type: "class-breaks",
        field: "Inc_Below_25",
        legendOptions: {
            title: "Household Income Below $25K"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 75"
            }, {
                minValue: 76,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 500"
            }, {
                minValue: 501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 500"
            }
        ]
    };

    var earn2GroupRenderer = {
        type: "class-breaks",
        field: "Inc_25To50",
        legendOptions: {
            title: "Household Income $25K to $50K"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 75"
            }, {
                minValue: 76,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 500"
            }, {
                minValue: 501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 500"
            }
        ]
    };

    var earn3GroupRenderer = {
        type: "class-breaks",
        field: "Inc_50To100",
        legendOptions: {
            title: "Household Income $50K to $100K"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1200,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "601 to 1,200"
            }, {
                minValue: 1201,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,200"
            }
        ]
    };

    var earn4GroupRenderer = {
        type: "class-breaks",
        field: "Inc_Above_100",
        legendOptions: {
            title: "Household Income Above $100K"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 3,000"
            }
        ]
    };

    var race1GroupRenderer = {
        type: "class-breaks",
        field: "Pop_White",
        legendOptions: {
            title: "White Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 6500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 6,500"
            }, {
                minValue: 6501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 6,500"
            }
        ]
    };

    var race2GroupRenderer = {
        type: "class-breaks",
        field: "Pop_Black",
        legendOptions: {
            title: "Black Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 3,000"
            }
        ]
    };

    var race3GroupRenderer = {
        type: "class-breaks",
        field: "Pop_Hispanic",
        legendOptions: {
            title: "Hispanic Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 5,000"
            }
        ]
    };

    var race4GroupRenderer = {
        type: "class-breaks",
        field: "Pop_Asian",
        legendOptions: {
            title: "Asian Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 5,000"
            }
        ]
    };

    var race5GroupRenderer = {
        type: "class-breaks",
        field: "Pop_Other",
        legendOptions: {
            title: "Other Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 50"
            }, {
                minValue: 51,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 100"
            }, {
                minValue: 101,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 500"
            }
        ]
    };

    var edu1GroupRenderer = {
        type: "class-breaks",
        field: "Edu_No_High_School",
        legendOptions: {
            title: "No High School Education"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 100"
            }, {
                minValue: 101,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "601 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,000"
            }
        ]
    };

    var edu2GroupRenderer = {
        type: "class-breaks",
        field: "Edu_High_School",
        legendOptions: {
            title: "High School Education"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,500"
            }
        ]
    };

    var edu3GroupRenderer = {
        type: "class-breaks",
        field: "Edu_Associate",
        legendOptions: {
            title: "Associate's Degree"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 3,000"
            }
        ]
    };

    var edu4GroupRenderer = {
        type: "class-breaks",
        field: "Edu_Bachelors",
        legendOptions: {
            title: "Bachelor's Degree"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 3,000"
            }
        ]
    };

    var edu5GroupRenderer = {
        type: "class-breaks",
        field: "Edu_Graduate",
        legendOptions: {
            title: "Graduate Degree"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 150,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "150 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 2,500"
            }
        ]
    };

    var lang1GroupRenderer = {
        type: "class-breaks",
        field: "Lang_No_Eng",
        legendOptions: {
            title: "Speaks No English"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 50"
            }, {
                minValue: 51,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 500"
            }, {
                minValue: 501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 500"
            }
        ]
    };

    var lang2GroupRenderer = {
        type: "class-breaks",
        field: "Lang_Eng_Not_Well",
        legendOptions: {
            title: "Speaks English Not Well"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 75"
            }, {
                minValue: 76,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 750"
            }, {
                minValue: 751,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 750"
            }
        ]
    };

    var lang3GroupRenderer = {
        type: "class-breaks",
        field: "Lang_Eng_Well",
        legendOptions: {
            title: "Speaks English Well"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 100"
            }, {
                minValue: 101,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,000"
            }
        ]
    };

    var lang4GroupRenderer = {
        type: "class-breaks",
        field: "Lang_Eng_Very_Well",
        legendOptions: {
            title: "Speaks English Very Well"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 5,000"
            }
        ]
    };

    var lang5GroupRenderer = {
        type: "class-breaks",
        field: "Lang_Eng_Only",
        legendOptions: {
            title: "Speaks Only English"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10000,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var mode1GroupRenderer = {
        type: "class-breaks",
        field: "Mot_Carpool",
        legendOptions: {
            title: "Carpool to Work"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 75"
            }, {
                minValue: 76,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,500"
            }
        ]
    };

    var mode2GroupRenderer = {
        type: "class-breaks",
        field: "Mot_Drove_Alone",
        legendOptions: {
            title: "Drove Alone to Work"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 750"
            }, {
                minValue: 751,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "751 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 7500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 7,500"
            }, {
                minValue: 7501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 7,500"
            }
        ]
    };

    var mode3GroupRenderer = {
        type: "class-breaks",
        field: "Mot_Pedbike",
        legendOptions: {
            title: "Walks/Bikes to Work"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 25,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 25"
            }, {
                minValue: 26,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "26 to 50"
            }, {
                minValue: 51,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 300"
            }
        ]
    };

    var mode4GroupRenderer = {
        type: "class-breaks",
        field: "Mot_Telework",
        legendOptions: {
            title: "Teleworks"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 25,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 25"
            }, {
                minValue: 26,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "26 to 100"
            }, {
                minValue: 101,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 500"
            }
        ]
    };

    var mode5GroupRenderer = {
        type: "class-breaks",
        field: "Mot_Transit",
        legendOptions: {
            title: "Uses Transit to Work"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 15,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 15"
            }, {
                minValue: 16,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "16 to 50"
            }, {
                minValue: 51,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 100"
            }, {
                minValue: 101,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 150"
            }, {
                minValue: 151,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 150"
            }
        ]
    };

    var mode6GroupRenderer = {
        type: "class-breaks",
        field: "Mot_Other",
        legendOptions: {
            title: "Other Mode of Travel to Work"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 15,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 15"
            }, {
                minValue: 16,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "16 to 50"
            }, {
                minValue: 51,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 100"
            }, {
                minValue: 101,
                maxValue: 200,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 200"
            }, {
                minValue: 201,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 200"
            }
        ]
    };

    var time1GroupRenderer = {
        type: "class-breaks",
        field: "Ttw_Below_5",
        legendOptions: {
            title: "Commute to Work Under 5 mins"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 15,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 15"
            }, {
                minValue: 16,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "16 to 50"
            }, {
                minValue: 51,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 100"
            }, {
                minValue: 101,
                maxValue: 200,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 200"
            }, {
                minValue: 201,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 200"
            }
        ]
    };

    var time2GroupRenderer = {
        type: "class-breaks",
        field: "Ttw_5To15",
        legendOptions: {
            title: "Commute to Work 5 to 15 mins"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 100"
            }, {
                minValue: 101,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 750"
            }, {
                minValue: 751,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 750"
            }
        ]
    };

    var time3GroupRenderer = {
        type: "class-breaks",
        field: "Ttw_15To30",
        legendOptions: {
            title: "Commute to Work 15 to 30 mins"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 2,500"
            }
        ]
    };

    var time4GroupRenderer = {
        type: "class-breaks",
        field: "Ttw_30To60",
        legendOptions: {
            title: "Commute to Work 30 to 60 mins"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 750"
            }, {
                minValue: 751,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "751 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 5,000"
            }
        ]
    };

    var time5GroupRenderer = {
        type: "class-breaks",
        field: "Ttw_60Plus",
        legendOptions: {
            title: "Commute to Work Over 60 mins"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 100"
            }, {
                minValue: 101,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,500"
            }
        ]
    };

    var pov1GroupRenderer = {
        type: "class-breaks",
        field: "Pov_Below",
        legendOptions: {
            title: "Households Under the Poverty Rate"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 50"
            }, {
                minValue: 51,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 100"
            }, {
                minValue: 101,
                maxValue: 200,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 200"
            }, {
                minValue: 201,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "201 to 300"
            }, {
                minValue: 301,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 300"
            }
        ]
    };

    var pov2GroupRenderer = {
        type: "class-breaks",
        field: "Pov_Rate",
        legendOptions: {
            title: "Poverty Rate (%)"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 10.9,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 10"
            }, {
                minValue: 11,
                maxValue: 20.9,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "11 to 20"
            }, {
                minValue: 21,
                maxValue: 30.9,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "21 to 30"
            }, {
                minValue: 31,
                maxValue: 40.9,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "31 to 40"
            }, {
                minValue: 41,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 40"
            }
        ]
    };

    var pov3GroupRenderer = {
        type: "class-breaks",
        field: "Unemp_Rate",
        legendOptions: {
            title: "Unemployment Rate (%)"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 5.9,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 5"
            }, {
                minValue: 6,
                maxValue: 10.9,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "6 to 10"
            }, {
                minValue: 11,
                maxValue: 20.9,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "11 to 20"
            }, {
                minValue: 21,
                maxValue: 30.9,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "21 to 30"
            }, {
                minValue: 31,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 30"
            }
        ]
    };

    var hudLowRenderer = {
        type: "class-breaks",
        field: "Low",
        legendOptions: {
            title: "Number of Low Income Persons"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1200,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "601 to 1,200"
            }, {
                minValue: 1201,
                maxValue: 1800,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,201 to 1,800"
            }, {
                minValue: 1801,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,800"
            }
        ]
    };

    var hudLowModRenderer = {
        type: "class-breaks",
        field: "Lowmod",
        legendOptions: {
            title: "Number of Low & Moderate Income Persons"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,501 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 2,000"
            }
        ]
    };

    var hudLmmiRenderer = {
        type: "class-breaks",
        field: "Lmmi",
        legendOptions: {
            title: "Number of Low, Moderate and Medium Income Persons"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 4000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "3,001 to 4,000"
            }, {
                minValue: 4001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 4,000"
            }
        ]
    };

    var hudLowmodunivRenderer = {
        type: "class-breaks",
        field: "Lowmoduniv",
        legendOptions: {
            title: "Number of All Persons"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 4000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 4,000"
            }, {
                minValue: 4001,
                maxValue: 8000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "4,001 to 8,000"
            }, {
                minValue: 8001,
                maxValue: 16000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "8,001 to 16,000"
            }, {
                minValue: 16001,
                maxValue: 5000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 16,000"
            }
        ]
    };

    var hudLowmodPctRenderer = {
        type: "class-breaks",
        field: "Lowmod_pct",
        legendOptions: {
            title: "Percentage of Low & Moderate Income Persons"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 20.0,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 20"
            }, {
                minValue: 20.01,
                maxValue: 35.0,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "21 to 35"
            }, {
                minValue: 35.01,
                maxValue: 50.0,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "36 to 50"
            }, {
                minValue: 50.01,
                maxValue: 70.0,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 70"
            }, {
                minValue: 70.01,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "71 to 100"
            }
        ]
    };

    var vulPovertyRenderer = {
        type: "class-breaks",
        field: "poverty",
        legendOptions: {
            title: "Poverty"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1200,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "601 to 1,200"
            }, {
                minValue: 1201,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,200"
            }
        ]
    };

    var vulHispanicsRenderer = {
        type: "class-breaks",
        field: "hispanic",
        legendOptions: {
            title: "Hispanics"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 4000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 4,000"
            }, {
                minValue: 4001,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 4,000"
            }
        ]
    };

    var vulLEProfRenderer = {
        type: "class-breaks",
        field: "LE_Prof",
        legendOptions: {
            title: "Limited English"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1200,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "601 to 1,200"
            }, {
                minValue: 1201,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,200"
            }
        ]
    };

    var vulDisabledRenderer = {
        type: "class-breaks",
        field: "tot_dp_hh",
        legendOptions: {
            title: "Disabled"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 125,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 125"
            }, {
                minValue: 126,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "126 to 250"
            }, {
                minValue: 251,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "251 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 1,000"
            }
        ]
    };

    var vulElderlyRenderer = {
        type: "class-breaks",
        field: "elderly",
        legendOptions: {
            title: "Number of Elderly Persons"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 50"
            }, {
                minValue: 51,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 600,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "301 to 600"
            }, {
                minValue: 601,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 600"
            }
        ]
    };

    var vulNoCarRenderer = {
        type: "class-breaks",
        field: "auto_0_car",
        legendOptions: {
            title: "Owns No Vehicle"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 25,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 25"
            }, {
                minValue: 26,
                maxValue: 75,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "26 to 75"
            }, {
                minValue: 76,
                maxValue: 150,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "76 to 150"
            }, {
                minValue: 151,
                maxValue: 300,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "151 to 300"
            }, {
                minValue: 301,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 300"
            }
        ]
    };

    var vulFemaleRenderer = {
        type: "class-breaks",
        field: "Fem_HH_Chd",
        legendOptions: {
            title: "Female Householder with Child"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 50,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 50"
            }, {
                minValue: 51,
                maxValue: 100,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "51 to 100"
            }, {
                minValue: 101,
                maxValue: 200,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "101 to 200"
            }, {
                minValue: 201,
                maxValue: 400,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "201 to 400"
            }, {
                minValue: 401,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 400"
            }
        ]
    };

    var vulNHNWRenderer = {
        type: "class-breaks",
        field: "NHNW",
        legendOptions: {
            title: "Non-Hispanic Minorities"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "null",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "501 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "1,001 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 4000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "2,001 to 4,000"
            }, {
                minValue: 4001,
                maxValue: 1000000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 0.2,
                        color: [0,0,0, 0.2]
                    }
                },
                label: "Greater than 4,000"
            }
        ]
    };

    //============================================
    //Add the different layers to the map

    var group = new FeatureLayer({
        url: "https://gis.h-gac.com/arcgisdev/rest/services/Census/Equity_Profiles_Places_BGs_Counties/MapServer/1",
        renderer: jGroupRendererCurrent,
        title: "Block Groups",
        listMode: "hide"
    });
    map.add(group);

    var hud = new FeatureLayer({
        url: "https://gis.h-gac.com/arcgisdev/rest/services/Census/HUD_LMI_2015/MapServer/0",
        title: "HUD Low and Moderate Income",
        visible: false,
        listMode: "hide"
    });
    map.add(hud);

    var vulnerable = new FeatureLayer({
        url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_BGs_Vulnerable_Population/MapServer/0",
        title: "Vulnerable Population",
        visible: false,
        listMode: "hide"
    });
    map.add(vulnerable);

    //===========================================
    //Determine how to symbolize the data
    var fieldDropdown = $("#fieldDropdown").val();
    var yrDropdown = $("#yearDropdown").val();
    var carDropdown = $("#carDropdown").val();
    var ageDropdown = $("#ageDropdown").val();
    var earningDropdown = $("#earningDropdown").val();
    var raceDropdown = $("#raceDropdown").val();
    var eduDropdown = $("#eduDropdown").val();
    var langDropdown = $("#langDropdown").val();
    var modeDropdown = $("#modeDropdown").val();
    var timeDropdown = $("#timeDropdown").val();
    var povertyDropdown = $("#povertyDropdown").val();

    
    $("#fieldDropdown").change(function(){
        fieldDropdown = $("#fieldDropdown").val();
        var layer = $("input:checked").val();
        console.log("The selected layer: " + layer);
        fieldChoice(layer, fieldDropdown, yrDropdown);
    });

    $("#yearDropdown").change(function(){
        yrDropdown = $("#yearDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseRenderer(selectedLayer, yrDropdown);
    });

    $("#carDropdown").change(function(){
        carDropdown = $("#carDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseCarRenderer(selectedLayer, fieldDropdown, carDropdown);
    });

    $("#ageDropdown").change(function(){
        ageDropdown = $("#ageDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseAgeRenderer(selectedLayer, ageDropdown);
    });

    $("#earningDropdown").change(function(){
        earningDropdown = $("#earningDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseIncomeRenderer(selectedLayer, earningDropdown);
    });

    $("#raceDropdown").change(function(){
        raceDropdown = $("#raceDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseRaceRenderer(selectedLayer, raceDropdown);
    });

    $("#eduDropdown").change(function(){
        eduDropdown = $("#eduDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseEducationRenderer(selectedLayer, eduDropdown);
    });

    $("#langDropdown").change(function(){
        langDropdown = $("#langDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseLangRenderer(selectedLayer, langDropdown);
    });

    $("#modeDropdown").change(function(){
        modeDropdown = $("#modeDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseModeRenderer(selectedLayer, modeDropdown);
    });

    $("#timeDropdown").change(function(){
        timeDropdown = $("#timeDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseTimeRenderer(selectedLayer, timeDropdown);
    });

    $("#povertyDropdown").change(function(){
        povertyDropdown = $("#povertyDropdown").val();
        var selectedLayer = $("input:checked").val();
        choosePovertyRenderer(selectedLayer, povertyDropdown);
    });

    $("#vulPicker").change(function(){
        vulPicker = $("#vulPicker").val();
        changeVulnerableRenderer(vulPicker);
    });

    $("#hudPicker").change(function(){
        hudPicker = $("#hudPicker").val();
        changeHUDRenderer(hudPicker);
    });

    $("#vulPopStyle").click(function(){
        hud.visible = false;
        group.visible = false;
        vulnerable.visible = true;
        var vulDropdown = $("#vulPicker").val();

        //Set the renderer for the boundary
        boundaryChange("vulnerable", vulDropdown);
    });

    $("#blockStyle").click(function(){
        group.visible = true;
        hud.visible = false;
        vulnerable.visible = false;

        //Set the renderer for the boundary
        boundaryChange("group", fieldDropdown, yrDropdown, carDropdown, ageDropdown, earningDropdown, raceDropdown, eduDropdown, langDropdown, modeDropdown, timeDropdown);
    });

    $("#hudStyle").click(function(){
        group.visible = false;
        hud.visible = true;
        vulnerable.visible = false;
        var hudDropdown = $("#hudPicker").val();

        boundaryChange("hud", hudDropdown);
    });

    //Function to determine which renderer to use
    function chooseRenderer(layer, year){
        console.log(layer);
        if (layer === "group"){
            if (year == "1980"){
                group.renderer = jGroupRenderer1980;
            } else if (year == "1990"){
                group.renderer = jGroupRenderer1990;
            } else if (year == "2000"){
                group.renderer = jGroupRenderer2000;
            } else if (year == "2010"){
                group.renderer = jGroupRenderer2010;
            } else if (year == "current"){
                group.renderer = jGroupRendererCurrent;
            }
        }
    }

    function chooseCarRenderer(layer, field, car){
        if (layer === "group"){
            if (field === "Car"){
                if (car === "car0"){
                    group.renderer = car0GroupRenderer;
                } else if (car === "car1"){
                    group.renderer = car1GroupRenderer;
                } else if (car === "car2"){
                    group.renderer = car2GroupRenderer;
                } else if (car === "car3"){
                    group.renderer = car3GroupRenderer;
                } else if (car === "car4"){
                    group.renderer = car4GroupRenderer;
                }
            }
        }
    }

    function chooseAgeRenderer(layer, age){
        if (layer === "group"){
            if (age === "age1"){
                group.renderer = age1GroupRenderer;
            } else if (age === "age2"){
                group.renderer = age2GroupRenderer;
            } else if (age === "age3"){
                group.renderer = age3GroupRenderer;
            } else if (age === "age4"){
                group.renderer = age4GroupRenderer;
            } else if (age === "age5"){
                group.renderer = age5GroupRenderer;
            }
        }
    }

    function chooseIncomeRenderer(layer, earnings){
        if (layer === "group"){
            if (earnings === "earn1"){
                group.renderer = earn1GroupRenderer;
            } else if (earnings === "earn2"){
                group.renderer = earn2GroupRenderer;
            } else if (earnings === "earn3"){
                group.renderer = earn3GroupRenderer;
            } else if (earnings === "earn4"){
                group.renderer = earn4GroupRenderer;
            }
        }
    }

    function chooseRaceRenderer(layer, race){
        if (layer === "group"){
            if (race === "race1"){
                group.renderer = race1GroupRenderer;
            } else if (race === "race2"){
                group.renderer = race2GroupRenderer;
            } else if (race === "race3"){
                group.renderer = race3GroupRenderer;
            } else if (race === "race4"){
                group.renderer = race4GroupRenderer;
            } else if (race === "race5"){
                group.renderer = race5GroupRenderer;
            }
        }
    }

    function chooseEducationRenderer(layer, education){
        if (layer === "group"){
            if (education === "edu1"){
                group.renderer = edu1GroupRenderer;
            } else if (education === "edu2"){
                group.renderer = edu2GroupRenderer;
            } else if (education === "edu3"){
                group.renderer = edu3GroupRenderer;
            } else if (education === "edu4"){
                group.renderer = edu4GroupRenderer;
            } else if (education === "edu5"){
                group.renderer = edu5GroupRenderer;
            }
        }
    }

    function chooseLangRenderer(layer, langDropdown){
        if (layer === "group"){
            if (langDropdown === "lang1"){
                group.renderer = lang1GroupRenderer;
            } else if (langDropdown === "lang2"){
                group.renderer = lang2GroupRenderer;
            } else if (langDropdown === "lang3"){
                group.renderer = lang3GroupRenderer;
            } else if (langDropdown === "lang4"){
                group.renderer = lang4GroupRenderer;
            } else if (langDropdown === "lang5"){
                group.renderer = lang5GroupRenderer;
            }
        }
    }

    function chooseModeRenderer(layer, modeDropdown){
        if (layer === "group"){
            if (modeDropdown === "mode1"){
                group.renderer = mode1GroupRenderer;
            } else if (modeDropdown === "mode2"){
                group.renderer = mode2GroupRenderer;
            } else if (modeDropdown === "mode3"){
                group.renderer = mode3GroupRenderer;
            } else if (modeDropdown === "mode4"){
                group.renderer = mode4GroupRenderer;
            } else if (modeDropdown === "mode5"){
                group.renderer = mode5GroupRenderer;
            } else if (modeDropdown === "mode6"){
                group.renderer = mode6GroupRenderer;
            }
        }
    }

    function chooseTimeRenderer(layer, timeDropdown){
        if (layer === "group"){
            if (timeDropdown === "time1"){
                group.renderer = time1GroupRenderer;
            } else if (timeDropdown === "time2"){
                group.renderer = time2GroupRenderer;
            } else if (timeDropdown === "time3"){
                group.renderer = time3GroupRenderer;
            } else if (timeDropdown === "time4"){
                group.renderer = time4GroupRenderer;
            } else if (timeDropdown === "time5"){
                group.renderer = time5GroupRenderer;
            }
        }
    }

    function choosePovertyRenderer(layer, povertyDropdown){
        if (layer === "group"){
            if (povertyDropdown === "pov1"){
                group.renderer = pov1GroupRenderer;
            } else if (povertyDropdown === "pov2"){
                group.renderer = pov2GroupRenderer;
            } else if (povertyDropdown === "pov3"){
                group.renderer = pov3GroupRenderer;
            }
        }
    }

    //Function after the field dropdown is change
    function fieldChoice(layer, fieldDropdown, yrDropdown){
        if (fieldDropdown == "total"){
            $("#yearDropdown").show();
            $("#yearLabel").show();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseRenderer(layer, yrDropdown);
        } else if (fieldDropdown == "Car") {
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").show();
            $("#carDropdown").show();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseCarRenderer(layer, fieldDropdown, carDropdown);
        } else if (fieldDropdown == "Age"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").show();
            $("#ageLabel").show();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseAgeRenderer(layer, ageDropdown);
        } else if (fieldDropdown === "Income"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").show();
            $("#earningLabel").show();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseIncomeRenderer(layer, earningDropdown);
        } else if (fieldDropdown === "Race"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").show();
            $("#raceLabel").show();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseRaceRenderer(layer, raceDropdown);
        } else if (fieldDropdown === "Education"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").show();
            $("#eduLabel").show();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseEducationRenderer(layer, eduDropdown);
        } else if (fieldDropdown === "Language"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").show();
            $("#langDropdown").show();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseLangRenderer(layer, langDropdown);
        } else if (fieldDropdown === "Mode"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").show();
            $("#modeDropdown").show();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseModeRenderer(layer, modeDropdown);
        } else if (fieldDropdown === "Travel"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").show();
            $("#timeDropdown").show();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            chooseTimeRenderer(layer, timeDropdown);
        } else if (fieldDropdown === "Poverty"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").show();
            $("#povertyDropdown").show();
            choosePovertyRenderer(layer, povertyDropdown);
        }
    }

    //Functions for when the user clicks on the boundary layer buttons
    function boundaryChange(layer, field, year, carDropdown, ageDropdown, earningDropdown, raceDropdown, eduDropdown, langDropdown, modeDropdown, timeDropdown){
        
        if (layer === "group"){
            $("#fieldDropdown").show();
            $("#hudPicker").hide();
            $("#vulPicker").hide();

            if (field === "total"){
                $("#yearDropdown").show();
                $("#yearLabel").show();

                if (year === "1980"){
                    group.renderer = jGroupRenderer1980;
                } else if (year == "1990"){
                    group.renderer = jGroupRenderer1990;
                } else if (year == "2000"){
                    group.renderer = jGroupRenderer2000;
                } else if (year == "2010"){
                    group.renderer = jGroupRenderer2010;
                } else if (year == "current"){
                    group.renderer = jGroupRendererCurrent;
                }
            } else if (field === "Car"){
                $("#carLabel").show();
                $("#carDropdown").show();

                if (carDropdown === "car0"){
                    group.renderer = car0GroupRenderer;
                } else if (carDropdown === "car1"){
                    group.renderer = car1GroupRenderer;
                } else if (carDropdown === "car2"){
                    group.renderer = car2GroupRenderer;
                } else if (carDropdown === "car3"){
                    group.renderer = car3GroupRenderer;
                } else if (carDropdown === "car4"){
                    group.renderer = car4GroupRenderer;
                }
            } else if (field === "Age"){
                $("#ageDropdown").show();
                $("#ageLabel").show();

                if (ageDropdown == "age1"){
                    group.renderer = age1GroupRenderer;
                } else if (ageDropdown == "age2"){
                    group.renderer = age2GroupRenderer;
                } else if (ageDropdown == "age3"){
                    group.renderer = age3GroupRenderer;
                } else if (ageDropdown === "age4"){
                    group.renderer = age4GroupRenderer;
                } else if (ageDropdown === "age5"){
                    group.renderer = age5GroupRenderer;
                }
            } else if (field === "Income"){
                $("#earningDropdown").show();
                $("#earningLabel").show();

                if (earningDropdown === "earn1"){
                    group.renderer = earn1GroupRenderer;
                } else if (earningDropdown === "earn2"){
                    group.renderer = earn2GroupRenderer;
                } else if (earningDropdown === "earn3"){
                    group.renderer = earn3GroupRenderer;
                } else if (earningDropdown === "earn4"){
                    group.renderer = earn4GroupRenderer;
                }
            } else if (field === "Race"){
                $("#raceDropdown").show();
                $("#raceLabel").show();

                if (raceDropdown === "race1"){
                    group.renderer = race1GroupRenderer;
                } else if (raceDropdown === "race2"){
                    group.renderer = race2GroupRenderer;
                } else if (raceDropdown === "race3"){
                    group.renderer = race3GroupRenderer;
                } else if (raceDropdown === "race4"){
                    group.renderer = race4GroupRenderer;
                } else if (raceDropdown === "race5"){
                    group.renderer = race5GroupRenderer;
                }
            } else if (field === "Education"){
                $("#eduDropdown").show();
                $("#eduLabel").show();

                if (eduDropdown === "edu1"){
                    group.renderer = edu1GroupRenderer;
                } else if (eduDropdown === "edu2"){
                    group.renderer = edu2GroupRenderer;
                } else if (eduDropdown === "edu3"){
                    group.renderer = edu3GroupRenderer;
                } else if (eduDropdown === "edu4"){
                    group.renderer = edu4GroupRenderer;
                } else if (eduDropdown === "edu5"){
                    group.renderer = edu5GroupRenderer;
                }
            } else if (field === "Language"){
                $("#langLabel").show();
                $("#langDropdown").show();

                if (langDropdown === "lang1"){
                    group.renderer = lang1GroupRenderer;
                } else if (langDropdown === "lang2"){
                    group.renderer = lang2GroupRenderer;
                } else if (langDropdown === "lang3"){
                    group.renderer = lang3GroupRenderer;
                } else if (langDropdown === "lang4"){
                    group.renderer = lang4GroupRenderer;
                } else if (langDropdown === "lang5"){
                    group.renderer = lang5GroupRenderer;
                }
            } else if (field === "Mode"){
                $("#modeLabel").show();
                $("#modeDropdown").show();

                if (modeDropdown === "mode1"){
                    group.renderer = mode1GroupRenderer;
                } else if (modeDropdown === "mode2"){
                    group.renderer = mode2GroupRenderer;
                } else if (modeDropdown === "mode3"){
                    group.renderer = mode3GroupRenderer;
                } else if (modeDropdown === "mode4"){
                    group.renderer = mode4GroupRenderer;
                } else if (modeDropdown === "mode5"){
                    group.renderer = mode5GroupRenderer;
                } else if (modeDropdown === "mode6"){
                    group.renderer = mode6GroupRenderer;
                }
            } else if (field === "Travel"){
                $("#timeLabel").show();
                $("#timeDropdown").show();

                if (timeDropdown === "time1"){
                    group.renderer = time1GroupRenderer;
                } else if (timeDropdown === "time2"){
                    group.renderer = time2GroupRenderer;
                } else if (timeDropdown === "time3"){
                    group.renderer = time3GroupRenderer;
                } else if (timeDropdown === "time4"){
                    group.renderer = time4GroupRenderer;
                } else if (timeDropdown === "time5"){
                    group.renderer = time5GroupRenderer;
                }
            } else if (field === "Poverty"){
                $("#povertyLabel").show();
                $("#povertyDropdown").show();

                if (povertyDropdown === "pov1"){
                    group.renderer = pov1GroupRenderer;
                } else if (povertyDropdown === "pov2"){
                    group.renderer = pov2GroupRenderer;
                } else if (povertyDropdown === "pov3"){
                    group.renderer = pov3GroupRenderer;
                }
            }
        } else if (layer === "vulnerable"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            $("#fieldDropdown").hide();
            $("#hudPicker").hide();
            $("#vulPicker").show();

            switch(field){
                case "poverty":
                    vulnerable.renderer = vulPovertyRenderer;
                    break;
                case "NHNW":
                    vulnerable.renderer = vulNHNWRenderer;
                    break;
                case "hispanic":
                    vulnerable.renderer = vulHispanicsRenderer;
                    break;
                case "LE_prof":
                    vulnerable.renderer = vulLEProfRenderer;
                    break;
                case "tot_dp_hh":
                    vulnerable.renderer = vulDisabledRenderer;
                    break;
                case "elderly":
                    vulnerable.renderer = vulElderlyRenderer;
                    break;
                case "auto_0_car":
                    vulnerable.renderer = vulNoCarRenderer;
                    break;
                case "Fem_HH_Chd":
                    vulnerable.renderer = vulFemaleRenderer;
                    break;
            }

        } else if (layer === "hud"){
            $("#yearDropdown").hide();
            $("#yearLabel").hide();
            $("#ageDropdown").hide();
            $("#ageLabel").hide();
            $("#earningDropdown").hide();
            $("#earningLabel").hide();
            $("#raceDropdown").hide();
            $("#raceLabel").hide();
            $("#eduDropdown").hide();
            $("#eduLabel").hide();
            $("#langLabel").hide();
            $("#langDropdown").hide();
            $("#carLabel").hide();
            $("#carDropdown").hide();
            $("#modeLabel").hide();
            $("#modeDropdown").hide();
            $("#timeLabel").hide();
            $("#timeDropdown").hide();
            $("#povertyLabel").hide();
            $("#povertyDropdown").hide();
            $("#fieldDropdown").hide();
            $("#hudPicker").show();
            $("#vulPicker").hide();

            switch(field){
                case "Low":
                    hud.renderer = hudLowRenderer;
                    break;
                case "Lowmod":
                    hud.renderer = hudLowModRenderer;
                    break;
                case "Lmmi":
                    hud.renderer = hudLmmiRenderer;
                    break;
                case "Lowmoduniv":
                    hud.renderer = hudLowmodunivRenderer;
                    break;
                case "Lowmod_pct":
                    hud.renderer = hudLowmodPctRenderer;
                    break;
            }
        }
    }

    function changeHUDRenderer(hudPicker){
        switch(hudPicker){
            case "Low":
                hud.renderer = hudLowRenderer;
                break;
            case "Lowmod":
                hud.renderer = hudLowModRenderer;
                break;
            case "Lmmi":
                hud.renderer = hudLmmiRenderer;
                break;
            case "Lowmoduniv":
                hud.renderer = hudLowmodunivRenderer;
                break;
            case "Lowmod_pct":
                hud.renderer = hudLowmodPctRenderer;
                break;
        }
    }

    function changeVulnerableRenderer(vulPicker){
        switch(vulPicker){
            case "poverty":
                vulnerable.renderer = vulPovertyRenderer;
                break;
            case "NHNW":
                vulnerable.renderer = vulNHNWRenderer;
                break;
            case "hispanic":
                vulnerable.renderer = vulHispanicsRenderer;
                break;
            case "LE_prof":
                vulnerable.renderer = vulLEProfRenderer;
                break;
            case "tot_dp_hh":
                vulnerable.renderer = vulDisabledRenderer;
                break;
            case "elderly":
                vulnerable.renderer = vulElderlyRenderer;
                break;
            case "auto_0_car":
                vulnerable.renderer = vulNoCarRenderer;
                break;
            case "Fem_HH_Chd":
                vulnerable.renderer = vulFemaleRenderer;
                break;
        }
    }

    //Functions to create the graphs on for the popups
    view.on("click", function(event){
        var graphLayer = $("input:checked").val();
        chooseQueryTask(graphLayer, event.mapPoint);
    });

    //Remove the charts and tables when the popup is hidden
    $("#reportModal").on("hidden.bs.modal", function(){
        $("#Job_chart").remove();
        $("#reportTable").remove();
        $("#reportTable2").remove();
        $("#reportTable3").remove();
        $("#reportTable4").remove();
        $("#reportTable5").remove();
        $("#reportTable6").remove();
        $("#reportTable8").remove();
        $("#reportTable9").remove();
        $("#reportTable10").remove();
    });

    $("#hudReportModal").on("hidden.bs.modal", function(){
        $("#hudReportTable").remove();
    });

    $("#vulReportModal").on("hidden.bs.modal", function(){
        $("#vulReportTable").remove();
        $("#vulReportTable2").remove();
    });

    //Create a query to get the attributes of the selected layer
    function chooseQueryTask(layer, point){
        var query = {
            geometry: point,
            outFields: ["*"],
            returnGeometry: false
        };

        console.log(layer);
        
        if (layer === "group"){
            group.queryFeatures(query).then(function(result){
                setJobInfo(result.features["0"].attributes);
            });

            $("#reportModal").modal("show");
            
        } else if (layer === "hud"){
            hud.queryFeatures(query).then(function(result){
                setHUDAttributes(result.features["0"].attributes);
            });

            $("#hudReportModal").modal("show");
        } else if (layer === "vulPop"){
            vulnerable.queryFeatures(query).then(function(result){
                setVulAttributes(result.features["0"].attributes);
            });

            $("#vulReportModal").modal("show");
        }
    }

    //Function to create the chart    
    function setJobInfo(results){
        //Check to see which boundary is being displayed
        if (results.Tract){
            $("#reportTile").text("Census Tract: " +results.Tract);
        } else {
            $("#reportTile").text("Block Group: " +results.Block_Group);
        }

        //Create a table to display the values
        $("#Attributes").append("<div id='reportTable'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>People Age 5 or Younger</th><th scope='col'>People Age 5 to 17</th><th scope='col'>People Age 18 to 34</th><th scope='col'>People Age 35 to 64</th><th scope='col'>People Age 65 and Older</th></tr></thead><tbody><tr><td>"+number.format(results.Age_Under_5)+"</td><td>"+number.format(results.Age_5to17)+"</td><td>"+number.format(results.Age_18to34)+"</td><td>"+number.format(results.Age_35to64)+"</td><td>"+number.format(results.Age_65plus)+"</td></tr></tbody></div>");
        $("#Attributes").append("<div id='reportTable2'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>White Population</th><th scope='col'>Black Population</th><th>Hispanic Population</th><th>Asian Population</th><th scope='col'>Other Population</th></tr></thead><tbody><tr><td>"+number.format(results.Pop_White)+"</td><td>"+number.format(results.Pop_Black)+"</td><td>"+number.format(results.Pop_Hispanic)+"</td><td>"+number.format(results.Pop_Asian)+"</td><td>"+number.format(results.Pop_Other)+"</td></tr></tbody></div>");
        $("#Attributes").append("<div id='reportTable3'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Less than High School Education</th><th scope='col'>High School Education</th><th scope='col'>Associate's Degree</th><th>Bachelor's Degree</th><th scope='col'>Graduate Degree</th></tr></thead><tbody><tr><td>"+number.format(results.Edu_No_High_School)+"</td><td>"+number.format(results.Edu_High_School)+"</td><td>"+number.format(results.Edu_Associate)+"</td><td>"+number.format(results.Edu_Bachelors)+"</td><td>"+number.format(results.Edu_Graduate)+"</td></tr></tbody></div>");
        $("#Attributes").append("<div id='reportTable8'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Speaks No English</th><th scope='col'>Speaks English Not Well</th><th scope='col'>Speaks English Well</th><th>Speaks English Very Well</th><th scope='col'>Only Speaks English</th></tr></thead><tbody><tr><td>"+number.format(results.Lang_No_Eng)+"</td><td>"+number.format(results.Lang_Eng_Not_Well)+"</td><td>"+number.format(results.Lang_Eng_Well)+"</td><td>"+number.format(results.Lang_Eng_Very_Well)+"</td><td>"+number.format(results.Lang_Eng_Only)+"</td></tr></tbody></div>");
        $("#Attributes").append("<div id='reportTable9'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Household Income Below $25K</th><th scope='col'>Household Income $25K to $50K</th><th scope='col'>Household Income $50K to $100K</th><th>Household Income Above $100K</th><th scope='col'>Median Household Income</th></tr></thead><tbody><tr><td>"+number.format(results.Inc_Below_25)+"</td><td>"+number.format(results.Inc_25To50)+"</td><td>"+number.format(results.Inc_50To100)+"</td><td>"+number.format(results.Inc_Above_100)+"</td><td>$"+number.format(results.Inc_HH_Median)+"</td></tr></tbody></div>");
        $("#Attributes").append("<div id='reportTable10'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Households Above Poverty Rate</th><th scope='col'>Households Under Poverty Rate</th><th scope='col'>% of People with Income Below Poverty Rate</th><th>Unemployment Rate</th><th scope='col'>Median House Value</th></tr></thead><tbody><tr><td>"+number.format(results.Pov_Above)+"</td><td>"+number.format(results.Pov_Below)+"</td><td>"+results.Pov_Rate+"</td><td>"+results.Unemp_Rate+"</td><td>$"+number.format(results.Med_Hu_val)+"</td></tr></tbody></div>");
        $("#JobTypes").append("<div id='reportTable4'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Households Owning 0 Cars</th><th scope='col'>Households Owning 1 Cars</th><th scope='col'>Households Owning 2 Cars</th><th scope='col'>Households Owning 3 Cars</th><th scope='col'>Households Owning 4 or More Cars</th></tr></thead><tbody><tr><td>"+number.format(results.Auto_0_Car)+"</td><td>"+number.format(results.Auto_1_Car)+"</td><td>"+number.format(results.Auto_2_Car)+"</td><td>"+number.format(results.Auto_3_Car)+"</td><td>"+number.format(results.Auto_4Plus_Car)+"</td></tr></tbody></div>");
        $("#JobTypes").append("<div id='reportTable5'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Carpools to Work</th><th scope='col'>Drive Alone to Work</th><th scope='col'>Other Way to Work</th><th scope='col'>Walks/Bikes to Work</th><th scope='col'>Teleworks</th><th scope='col'>Uses Transit to Work</th></tr></thead><tbody><tr><td>"+number.format(results.Mot_Carpool)+"</td><td>"+number.format(results.Mot_Drove_Alone)+"</td><td>"+number.format(results.Mot_Other)+"</td><td>"+number.format(results.Mot_Pedbike)+"</td><td>"+number.format(results.Mot_Telework)+"</td><td>"+number.format(results.Mot_Transit)+"</td></tr></tbody></div>");
        $("#JobTypes").append("<div id='reportTable6'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Time to Work Under 5 mins</th><th scope='col'>Time to Work 5 to 15 mins</th><th scope='col'>Time to Work 15 to 30 mins</th><th scope='col'>Time to Work 30 to 60 mins</th><th scope='col'>Time to Work 60 or More mins</th></tr></thead><tbody><tr><td>"+number.format(results.Ttw_Below_5)+"</td><td>"+number.format(results.Ttw_5To15)+"</td><td>"+number.format(results.Ttw_15To30)+"</td><td>"+number.format(results.Ttw_30To60)+"</td><td>"+number.format(results.Ttw_60Plus)+"</td></tr></tbody></div>");
        $("#Job").append("<canvas id='Job_chart'></canvas>");
        var canvas = $("#Job_chart");

        var data = {
            datasets: [
                {
                    data: [results.tp_1980, results.tp_1990, results.tp_2000, results.tp_2010, results.Pop_Total],
                    backgroundColor: ["#d73347"],
                    borderColor: "#d73347",
                    fill: false,
                    label: "Total Population",
                    pointBackgroundColor: "#d73347"
                }
            ],
            labels: ["1980", "1990", "2000", "2010", "2018"]
        };

        myChart = new Chart(canvas,{
            type: "line",
            data: data,
            options: {
                tooltips: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem, data){
                            var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    }
                },
                hover: {
                    mode: "nearest",
                    intersect: true
                },
                scales:{
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Year"
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Total Population"
                        },
                        ticks: {
                            callback: function(value){
                                return parseFloat(value).toLocaleString();
                            }
                        }
                    }]
                }
            }
        });

        return canvas;
    }

    function setHUDAttributes(results){
        $("#hudReportTile").text("Block Group: " +results.GEOID);

        //Create a table to display the values
        $("#hudAttributes").append("<div id='hudReportTable'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Low Income</th><th scope='col'>Low & Moderate Income</th><th scope='col'>Low, Moderate & Medium Income</th><th scope='col'>All Incomes</th><th scope='col'>Low & Moderate Income (%)</th></tr></thead><tbody><tr><td>"+number.format(results.Low)+"</td><td>"+number.format(results.Lowmod)+"</td><td>"+number.format(results.Lmmi)+"</td><td>"+number.format(results.Lowmoduniv)+"</td><td>"+number.format(results.Lowmod_pct)+"</td></tr></tbody></div>");
    }

    function setVulAttributes(results){
        $("#vulReportTile").text("Block Group: " +results.Block_Group);

        //Create a table to display the values
        $("#vulAttributes").append("<div id='vulReportTable'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Poverty</th><th scope='col'>Non-Hispanic Minorities</th><th scope='col'>Hispanic Minorities</th><th scope='col'>Limited English</th></tr></thead><tbody><tr><td>"+number.format(results.poverty)+"</td><td>"+number.format(results.NHNW)+"</td><td>"+number.format(results.hispanic)+"</td><td>"+number.format(results.LE_prof)+"</td></tr></tbody></div>");
        $("#vulAttributes").append("<div id='vulReportTable2'><table class='table table-sm table-hover table-striped table-bordered'><thead><tr><th scope='col'>Disbled</th><th scope='col'>Elderly</th><th scope='col'>Owns No Vehicle</th><th scope='col'>Female Householder with Child</th></tr></thead><tbody><tr><td>"+number.format(results.tot_dp_hh)+"</td><td>"+number.format(results.elderly)+"</td><td>"+number.format(results.auto_0_car)+"</td><td>"+number.format(results.Fem_HH_Chd)+"</td></tr></tbody></div>");
    }

    //Functions to determine the screen size
    function updateView(isMobile){
        setMobileWidgets(isMobile);
    }

    function setMobileWidgets(isMobile){
        if (isMobile){
            view.ui.add(expandLegend, "top-left");
            view.ui.add(basemapToggle, "top-right");
            view.ui.add(home, "top-left");
            view.ui.remove(zoom);
            view.ui.remove(searchWidget);
            view.ui.remove(legendWidget);
            view.ui.remove(expandPrint);
        } else {
            view.ui.add(legendWidget, "top-right");
            view.ui.add(basemapToggle, "bottom-right");
            view.ui.add(zoom, "bottom-right");
            view.ui.add(home, "bottom-right");
            view.ui.add(searchWidget, "bottom-right");
            view.ui.add(expandPrint, "bottom-left");
            view.ui.remove(expandLegend);
        }
    }
    
});