import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./AmenityMap'), { ssr: false });

export default function AmenityMapWrapper({ amenity, myLocation }) {
  return <DynamicMap amenity={amenity} myLocation={myLocation} />;
}