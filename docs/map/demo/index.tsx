import { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import { shanghai, rizhao, qingdao } from "./utils/markerData";
import { v4 as uuidv4 } from "uuid";
import "./index.less";

export default function HomePage() {
  const MapRef = useRef(null);

  const initMap = async () => {
    const AMap = await AMapLoader.load({
      key: "181e6e351a7829b15e0806764c3a146a",
      version: "2.0",
      plugins: ["AMap.ToolBar", "AMap.Geolocation", "AMap.PlaceSearch"],
      AMapUI: {
        version: "1.1",
        plugins: ["overlay/SimpleMarker"],
      },
      Loca: {
        version: "2.0",
      },
    });
    const map = new AMap.Map(MapRef.current, {
      resizeEnable: true,
      // zoom: 13,
      layers: [AMap.createDefaultLayer()],
    });
    map.addControl(
      new AMap.ToolBar({
        position: "RB",
        offset: [10, 70],
      })
    );
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      offset: [10, 20],
      zoomToAccuracy: true,
      position: "RB",
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();

    // const x = ``;

    // console.log(
    //   JSON.stringify(
    //     x
    //       .split("\n")
    //       .filter((v) => v.trim() !== "")
    //       .map((item) => ({ name: item.trim(), id: uuidv4() }))
    //   )
    // );

    // const placeSearch = new AMap.PlaceSearch({
    //   city: "",
    // });
    // x.forEach((item) => {
    //   placeSearch.search(
    //     item.name,
    //     (
    //       status: string,
    //       result: { info: string; poiList: { pois: [any] } }
    //     ) => {
    //       if (status === "complete" && result.info === "OK") {
    //         item.lat = result.poiList.pois[0].location.lat;
    //         item.lng = result.poiList.pois[0].location.lng;
    //         console.log(JSON.stringify(x));
    //       }
    //     }
    //   );
    // });

    const showRegion = [shanghai, rizhao, qingdao];
    showRegion.forEach((region) => {
      region.forEach((item, index) => {
        const marker = new AMap.Marker({
          position: [item.lng, item.lat],
          icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          anchor: "bottom-center",
          offset: new AMap.Pixel(0, 0),
        });
        marker.setMap(map);
        marker.setLabel({
          direction: "right",
          offset: new AMap.Pixel(10, 0),
          content: `<div class='info'>${item.name}</div>`,
        });
      });
    });
  };

  useEffect(() => {
    initMap();
  }, []);

  return <div style={{ width: "100%", height: "70vh" }} ref={MapRef} />;
}
