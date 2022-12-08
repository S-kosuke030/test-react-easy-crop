import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { Area, MediaSize } from 'react-easy-crop';
import CropperModal from './CropperModal';
import getCroppedImg from '../utils/getCroppedImg';
import { saveAs } from 'file-saver';

export const ASPECT_RATIO = 1 / 1;
export const CROP_WIDTH = 300;

const Container = styled('div')(({ theme }) => ({
  marginTop: 30,
  minWidth: '100%',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  flexFlow: 'column',
  '& .file-upload-container': {
    width: 500,
    marginTop: 10,
    '& .button': {
      backgroundColor: '#00A0FF',
      color: 'white'
    }
  },
  '& .img-container': {
    marginTop: 40,
    width: `${CROP_WIDTH}px`,
    height: `${CROP_WIDTH / ASPECT_RATIO}px`,
    display: 'flex',
    alinItems: 'center',
    borderRadius: 5,
    border: '1px solid gray',
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
    '& .img': {
      width: '100%',
      objectFit: 'contain',
      backgroundColor: '#EAEAEA'
    },
    '& .no-img': {
      backgroundColor: '#EAEAEA',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000'
    }
  }
}));

export default function Home() {
  const [isRendered, setIsRendered] = useState(false);
  /** Cropモーダルの開閉 */
  const [isOpen, setIsOpen] = useState(false);

  /** アップロードした画像URL */
  const [imgSrc, setImgSrc] = useState('');

  /** 画像の拡大縮小倍率 */
  const [zoom, setZoom] = useState(1);

  /** 画像拡大縮小の最小値 */
  const [minZoom, setMinZoom] = useState(1);

  /** 切り取る領域の情報 */
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  /** 切り取る領域の情報 */
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  /** 切り取ったあとの画像URL */
  const [croppedImgSrc, setCroppedImgSrc] = useState('');

  useEffect(() => {
    setIsRendered(true);
  }, []);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          setImgSrc(reader.result.toString() || '');
          setIsOpen(true);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
    const { width, height } = mediaSize;
    const mediaAspectRatio = width / height;
    if (mediaAspectRatio > ASPECT_RATIO) {
      // 縦幅に合わせてZoomを指定
      const result = CROP_WIDTH / ASPECT_RATIO / height;
      setZoom(result);
      setMinZoom(result);
    }
  }, []);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
      console.log('croppedImage', croppedImage);
      saveAs(croppedImage, 'cropped');
      // setCroppedImgSrc(croppedImage);
    } catch (e) {
      console.log(e);
    }
  }, [croppedAreaPixels, imgSrc]);
  return (
    <div className="App">
      {isRendered && (
        <Container>
          <div className="file-upload-container">
            <Button variant="contained" component="label" className="button">
              Upload File
              <input type="file" hidden onChange={onFileChange} />
            </Button>
          </div>
          <CropperModal
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            onCropComplete={onCropComplete}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            imgSrc={imgSrc}
            showCroppedImage={showCroppedImage}
            onMediaLoaded={onMediaLoaded}
            minZoom={minZoom}
          />
        </Container>
      )}
    </div>
  );
}
