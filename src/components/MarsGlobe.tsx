import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { ROVERS } from '../data/rovers';
import type { RoverInfo } from '../types';

// Cesium Ion token from env (inlined at build time by Vite)
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

  // Initialize CesiumJS viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Cesium Ion access token
    Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

    // Set Mars ellipsoid as default (must be set before creating Viewer)
    Cesium.Ellipsoid.default = Cesium.Ellipsoid.MARS;

    // Create viewer matching Cesium's official Mars example
    const viewer = new Cesium.Viewer(containerRef.current, {
      // Globe disabled since Mars is loaded as 3D Tiles
      globe: false,
      // 2D and Columbus View not supported for global 3D Tiles
      sceneModePicker: false,
      // Don't use Earth imagery layers
      baseLayerPicker: false,
      // Geocoder not supported for Mars
      geocoder: false,
      // Disable other unneeded widgets
      homeButton: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
    });

    // Dark background for space
    viewer.scene.backgroundColor = Cesium.Color.BLACK;

    viewerRef.current = viewer;

    // Load Mars 3D Tileset from Cesium Ion
    async function loadMars() {
      try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(MARS_ASSET_ID);
        viewer.scene.primitives.add(tileset);

        // Set initial camera position looking at Mars
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(137.44, -4.59, 8000000),
          orientation: {
            heading: 0,
            pitch: Cesium.Math.toRadians(-90),
            roll: 0,
          },
        });
      } catch (error) {
        console.error('Failed to load Mars tileset:', error);
      }
    }

    loadMars();

    // Add rover landing site markers
    ROVERS.forEach((rover) => {
      const position = Cesium.Cartesian3.fromDegrees(
        rover.longitude,
        rover.latitude,
        5000
      );

      viewer.entities.add({
        name: rover.apiName,
        position,
        billboard: {
          image: createMarkerCanvas(rover),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 1.0,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
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

    return () => {
      handler.destroy();
      viewer.destroy();
      viewerRef.current = null;
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
