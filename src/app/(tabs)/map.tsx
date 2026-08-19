import Mapbox, { Camera, MapView } from "@rnmapbox/maps";
import { useRef, useState } from "react";
import { View } from "react-native";
import SearchBar from "../../components/map/SearchBar";
import SpotCard from "../../components/map/SpotCard";
import SpotMarker from "../../components/map/SpotMarker";
import ZoomControls from "../../components/map/ZoomControls";
import { useReverseGeocode } from "../../hooks/useReverseGeocode";
import { GeocodingFeature } from "../../types/geocoding";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

const MIN_ZOOM = 2;
const MAX_ZOOM = 18;
const DEFAULT_ZOOM = 5;
const SEARCH_RESULT_ZOOM = 14;
const PH_CENTER: [number, number] = [121.774, 12.8797];

export default function MapScreen() {
  const cameraRef = useRef<Camera>(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [selectedSpot, setSelectedSpot] = useState<GeocodingFeature | null>(null);
  const { reverseGeocode, loading } = useReverseGeocode();

  const flyTo = (coordinate: [number, number], zoom = SEARCH_RESULT_ZOOM) => {
    setZoomLevel(zoom);
    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: zoom,
      animationDuration: 800,
    });
  };

  const handleZoomIn = () => {
    const next = Math.min(zoomLevel + 1, MAX_ZOOM);
    setZoomLevel(next);
    cameraRef.current?.setCamera({ zoomLevel: next, animationDuration: 300 });
  };

  const handleZoomOut = () => {
    const next = Math.max(zoomLevel - 1, MIN_ZOOM);
    setZoomLevel(next);
    cameraRef.current?.setCamera({ zoomLevel: next, animationDuration: 300 });
  };

  const handleSelectSearchResult = (feature: GeocodingFeature) => {
    setSelectedSpot(feature);
    flyTo(feature.coordinate, 14);
  };

  const handleMapPress = async (event: any) => {
    const coordinate: [number, number] = event.geometry.coordinates;
    setSelectedSpot({
      id: "pending",
      name: "Loading...",
      fullAddress: "",
      placeType: "",
      coordinate,
    });
    flyTo(coordinate, 14);

    const result = await reverseGeocode(coordinate);
    if (result) setSelectedSpot(result);
  };

    return (
    <View className="flex-1">
      <MapView style={{ flex: 1 }} onPress={handleMapPress}>
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: PH_CENTER,
            zoomLevel: DEFAULT_ZOOM,
          }}
        />

        {selectedSpot && (
          <SpotMarker id={selectedSpot.id} coordinate={selectedSpot.coordinate} />
        )}
      </MapView>

      <View className="absolute top-[55px] left-4 right-4">
        <SearchBar
          onSelectLocation={(feature) => {
            setSelectedSpot(feature);
            flyTo(feature.coordinate, 14);
          }}
        />

        <View className="mt-3">
          <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </View>
      </View>

      {selectedSpot && (
        <SpotCard
          spot={selectedSpot}
          loading={loading}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </View>
  );
}