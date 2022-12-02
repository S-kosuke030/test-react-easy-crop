import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    // console.log(croppedArea, croppedAreaPixels);
  }, []);
  useEffect(() => {
    setIsRendered(true);
  }, []);
  return (
    <div className="App">
      {isRendered && (
        <>
          <div className="crop-container">
            <Cropper
              image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(e.target.valueAsNumber);
              }}
              className="zoom-range"
            />
          </div>
        </>
      )}
    </div>
  );
}
