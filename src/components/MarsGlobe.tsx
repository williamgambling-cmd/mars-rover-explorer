import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { ROVERS } from '../data/rovers';
import type { RoverInfo } from '../types';

// Cesium Ion token from env
const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN as string;

// Mars 3D Tiles asset ID on Cesium Ion
const MARS_ASSET_ID = 3644333;

interface MarsGlobeProps {
  selectedRover: string | null;
  onSelectRover: (roverApiName: string) => void;
}

export default function MarsGlobe({
  selectedRover,
  onSelectRover,
}: MarsGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const markersRef = useRef<Map<string, Cesium.Entity>>(new Map());

  // Initialize CesiumJS viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Cesium Ion
    Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

    // Set Mars ellipsoid as default
    Cesium.Ellipsoid.default = Cesium.Ellipsoid.MARS;

    const viewer = new Cesium.Viewer(containerRef.current, {
      globe: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      selectionIndicator: false,
      infoBox: false,
      skyBox: false,
      skyAtmosphere: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
    });

    // Dark background for space
    viewer.scene.backgroundColor = Cesium.Color.BLACK;

    // Enable lighting
    viewer.scene.globe && (viewer.scene.globe.enableLighting = true);

    // Load Mars 3D Tileset
    Cesium.Cesium3DTileset.fromIonAssetId(MARS_ASSET_ID)
      .then((tileset) => {
        viewer.scene.primitives.add(tileset);

        // Zoom to Mars once loaded
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(137.44, -4.59, 8000000),
          orientation: {
            heading: 0,
            pitch: Cesium.Math.toRadians(-90),
            roll: 0,
          },
          duration: 0,
        });

        // Continuously render while camera is moving
        viewer.scene.requestRenderMode = false;
      })
      .catch((err) => {
        console.error('Failed to load Mars tileset:', err);
      });

    // Add rover landing site markers
    ROVERS.forEach((rover) => {
      const position = Cesium.Cartesian3.fromDegrees(
        rover.longitude,
        rover.latitude,
        2000
      );

      const entity = viewer.entities.add({
        name: rover.apiName,
        position,
        billboard: {
          image: createMarkerCanvas(rover),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 1.0,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.NONE,
        },
        label: {
          text: rover.name,
          font: '14px Inter, system-ui, sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -44),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });

      markersRef.current.set(rover.apiName, entity);
    });

    // Click handler for markers
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(
      (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(click.position);
        if (Cesium.defined(picked) && picked.id && picked.id.name) {
          const roverApiName = picked.id.name as string;
          const rover = ROVERS.find((r) => r.apiName === roverApiName);
          if (rover) {
            onSelectRover(roverApiName);
          }
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    viewerRef.current = viewer;

    return () => {
      handler.destroy();
      viewer.destroy();
      viewerRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to selected rover
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedRover) return;

    const rover = ROVERS.find((r) => r.apiName === selectedRover);
    if (!rover) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        rover.longitude,
        rover.latitude,
        300000
      ),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 2.0,
    });
  }, [selectedRover]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}

/**
 * Creates a marker pin canvas for a rover
 */
function createMarkerCanvas(rover: RoverInfo): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 44;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Pin shape
  ctx.beginPath();
  ctx.arc(16, 16, 12, Math.PI, 0, false);
  ctx.lineTo(16, 44);
  ctx.closePath();

  // Color based on status
  const color = rover.status === 'active' ? '#22c55e' : '#f97316';
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner circle
  ctx.beginPath();
  ctx.arc(16, 16, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  return canvas;
}
