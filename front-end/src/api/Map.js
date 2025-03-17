// import React, { useEffect } from 'react';

// const Map = () => {
//   useEffect(() => {
//     // 새로운 script 태그를 생성합니다.
//     const script = document.createElement('script');
//     // Kakao Maps API를 로드하는 URL을 설정합니다.
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=42af010ae3642fdb49216ce28996e1ea&autoload=false`;
//     // script 태그를 비동기로 로드하도록 설정합니다.
//     script.async = true;
//     // document의 head에 script 태그를 추가합니다.
//     document.head.appendChild(script);

//     // script 로드가 완료되면 실행됩니다.
//     script.onload = () => {
//       // Kakao Maps API를 초기화합니다.
//       window.kakao.maps.load(() => {
//         // 지도를 표시할 div 요소를 가져옵니다.
//         const mapContainer = document.getElementById('map');
//         // 지도의 초기 옵션을 설정합니다.
//         const mapOption = {
//           // 지도의 중심 좌표를 설정합니다.
//           center: new window.kakao.maps.LatLng(33.450701, 126.570667),
//           // 지도의 확대 레벨을 설정합니다.
//           level: 3,
//         };
//         // 지도를 생성합니다.
//         const map = new window.kakao.maps.Map(mapContainer, mapOption);

//         // 마커를 표시할 위치와 타이틀을 설정한 객체 배열을 정의합니다.
//         const positions = [
//           {
//             title: '카카오',
//             latlng: new window.kakao.maps.LatLng(33.450705, 126.570677),
//           },
//           {
//             title: '생태연못',
//             latlng: new window.kakao.maps.LatLng(33.450936, 126.569477),
//           },
//           {
//             title: '텃밭',
//             latlng: new window.kakao.maps.LatLng(33.450879, 126.569940),
//           },
//           {
//             title: '근린공원',
//             latlng: new window.kakao.maps.LatLng(33.451393, 126.570738),
//           },
//         ];

//         // 마커 이미지의 URL을 설정합니다.
//         const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

//         // positions 배열을 순회하며 마커를 생성하고 지도에 표시합니다.
//         positions.forEach((position) => {
//           // 마커 이미지의 크기를 설정합니다.
//           const imageSize = new window.kakao.maps.Size(24, 35);
//           // 마커 이미지를 생성합니다.
//           const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

//           // 마커를 생성하여 지도에 추가합니다.
//           new window.kakao.maps.Marker({
//             map: map, // 마커를 표시할 지도 객체
//             position: position.latlng, // 마커의 위치
//             title: position.title, // 마커의 타이틀, 마우스를 올리면 표시됩니다.
//             image: markerImage, // 마커 이미지
//           });
//         });
//       });
//     };

//     // 컴포넌트가 언마운트될 때 script 태그를 제거합니다.
//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   return (
//     // 지도를 표시할 div 요소입니다.
//     <div id="map" style={{ width: '100%', height: '350px' }}></div>
//   );
// };

// export default Map;


import React, { useEffect } from 'react';

const Map = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=42af010ae3642fdb49216ce28996e1ea&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        const positions = [
          {
            title: '선우 집',
            latlng: new window.kakao.maps.LatLng(35.170165292753, 126.86244773114),
          },
          {
            title: '동천파출소',
            latlng: new window.kakao.maps.LatLng(35.170969176581, 126.86438914459),
          },
          {
            title: '빛고을초등학교',
            latlng: new window.kakao.maps.LatLng(35.169347980191,126.86003408395),
          },
          {
            title: '행정복지센터',
            latlng: new window.kakao.maps.LatLng(35.170946225126, 126.86467469572),
          },
        ];

        const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        positions.forEach((position) => {
          const imageSize = new window.kakao.maps.Size(24, 35);
          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

          new window.kakao.maps.Marker({
            map: map,
            position: position.latlng,
            title: position.title,
            image: markerImage,
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '350px' }}></div>
  );
};

export default Map;
