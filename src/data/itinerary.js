import airportPhoto from '../assets/photos/airport.jpg'
import citygatePhoto from '../assets/photos/citygate.jpg'
import ngongPingPhoto from '../assets/photos/ngong-ping.jpg'
import macauFerryPhoto from '../assets/photos/macau-ferry.jpg'
import centralPierPhoto from '../assets/photos/central-pier.jpg'
import disneylandPhoto from '../assets/photos/disneyland.jpg'
import victoriaPeakPhoto from '../assets/photos/victoria-peak.jpg'
import k11MuseaPhoto from '../assets/photos/k11-musea.jpg'
import ladiesMarketPhoto from '../assets/photos/ladies-market.jpg'
import hotelPhoto from '../assets/photos/hotel.webp'

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=75`

export const HOTEL = {
  name: 'iclub AMTD Sheung Wan Hotel',
  shortName: 'iclub Sheung Wan',
  address: '5 Bonham Strand West, Sheung Wan',
  lat: 22.2862,
  lng: 114.1492,
  mapsUrl: 'https://www.google.com/maps?q=22.2862,114.1492',
}

export const itinerary = [
  {
    day: 1,
    date: "Mon, June 29, 2026",
    title: "Arrival + Lantau Island",
    stops: [
      {
        time: "11:50 AM",
        name: "Hong Kong International Airport",
        description: "Arrival, immigration, Octopus card, eSIM, withdraw cash",
        lat: 22.3134736,
        lng: 113.9137283,
        photos: [airportPhoto],
        galleryPhotos: [
          U('1436491865332-7a61a109cc05'),
          U('1530521954074-e64f6810b32d'),
          U('1565985999003-c3a08853a0a2'),
          U('1587019158091-1a103c5dd17f'),
        ],
      },
      {
        time: "1:15 PM",
        name: "Citygate Outlets",
        description: "Quick stop on the way to the cable car",
        lat: 22.289733,
        lng: 113.9412938,
        photos: [citygatePhoto],
        galleryPhotos: [
          U('1555529669-e69e7aa0ba9a'),
          U('1481437156560-3205f6a55735'),
          U('1528698827591-e19ccd7bc23d'),
          U('1519985176271-adb1088fa94c'),
        ],
      },
      {
        time: "2:00 PM",
        name: "Ngong Ping 360",
        description: "Cable car + village, late lunch, sightseeing, Big Buddha",
        lat: 22.2563163,
        lng: 113.9014163,
        photos: [ngongPingPhoto],
        galleryPhotos: [
          U('1609137144813-7d9921338f24'),
          U('1576675784432-27b0f3f64a26'),
          U('1464822759023-fed622ff2c3b'),
          U('1508739773434-c26b3d09e071'),
        ],
      },
      {
        time: "7:00 PM",
        name: "iclub AMTD Sheung Wan Hotel",
        description: "Check in · Your home base for the full trip · 5 Bonham Strand West, Sheung Wan — 5 min walk from Sheung Wan MTR",
        lat: 22.2862,
        lng: 114.1492,
        photos: [hotelPhoto],
        galleryPhotos: [
          U('1578683010236-d716f9a3f461'),
          U('1536592383029-e7dc3459fb17'),
          U('1517760444738-76a18f4dc3c9'),
          U('1522771739844-12a943543e5f'),
        ],
        isHotel: true,
      },
    ],
  },
  {
    day: 2,
    date: "Tue, June 30, 2026",
    title: "Macau Day Trip + Harbor Cruise",
    stops: [
      {
        time: "8:00 AM",
        name: "Hong Kong - Macau Ferry Terminal",
        description: "Ferry departure to Macau",
        lat: 22.2880927,
        lng: 114.1517666,
        photos: [macauFerryPhoto],
        galleryPhotos: [
          U('1520699049698-dc49e09f9e66'),
          U('1507525428034-b723cf961d3e'),
          U('1548574505-5e239809ee19'),
          U('1562802378-063ec186a863'),
        ],
      },
      {
        time: "TBA",
        name: "Macau (exact spots TBA)",
        description: "Sightseeing in Macau, details to be added",
        lat: null,
        lng: null,
        photos: [],
        galleryPhotos: [],
        isTBA: true,
      },
      {
        time: "7:30 PM",
        name: "Central Pier No.9",
        description: "Harbor cruise departure point, Symphony of Lights",
        lat: 22.2860695,
        lng: 114.1625605,
        photos: [centralPierPhoto],
        galleryPhotos: [
          U('1536592383029-e7dc3459fb17'),
          U('1517760444738-76a18f4dc3c9'),
          U('1576699218742-67a5e7d31e93'),
          U('1575999502951-4ab25b5ca889'),
        ],
      },
    ],
  },
  {
    day: 3,
    date: "Wed, July 1, 2026",
    title: "Hong Kong Disneyland",
    stops: [
      {
        time: "9:30 AM - 10:00 PM",
        name: "Hong Kong Disneyland",
        description: "Full day — rides, shows, fireworks",
        lat: 22.3129666,
        lng: 114.0412819,
        photos: [disneylandPhoto],
        galleryPhotos: [
          U('1514888286974-affa1a17d9b2'),
          U('1575783970733-1aaedde1db74'),
          U('1569877764161-4d13804a18e4'),
          U('1568083641460-3a0b6b3edf4f'),
        ],
      },
    ],
  },
  {
    day: 4,
    date: "Thu, July 2, 2026",
    title: "Peak, Tsim Sha Tsui, Mong Kok",
    stops: [
      {
        time: "10:00 AM",
        name: "Victoria Peak",
        description: "Peak Tram, Sky Terrace, skyline views",
        lat: 22.2758835,
        lng: 114.1455319,
        photos: [victoriaPeakPhoto],
        galleryPhotos: [
          U('1576699218742-67a5e7d31e93'),
          U('1524413840772-f4ce77c706d5'),
          U('1525625293386-3f8f99389edd'),
          U('1536592383029-e7dc3459fb17'),
        ],
      },
      {
        time: "1:30 PM",
        name: "K11 MUSEA",
        description:
          "Lunch in Tsim Sha Tsui, Avenue of Stars, HK Cultural Center, HK Space Museum, Clock Tower",
        lat: 22.2941573,
        lng: 114.1739272,
        photos: [k11MuseaPhoto],
        galleryPhotos: [
          U('1554995207-c18c203602cb'),
          U('1517760444738-76a18f4dc3c9'),
          U('1547452366940-a25d7d9df2c8'),
          U('1519741498029-6c4d3068ea6f'),
        ],
      },
      {
        time: "6:00 PM",
        name: "Ladies' Market",
        description:
          "Dinner in Mong Kok, night market shopping, Sneakers Street",
        lat: 22.317609,
        lng: 114.1709284,
        photos: [ladiesMarketPhoto],
        galleryPhotos: [
          U('1583394293214-e98f1e04a7d7'),
          U('1556741533-974db495d756'),
          U('1558618666-fcd25c85cd64'),
          U('1519985176271-adb1088fa94c'),
        ],
      },
    ],
  },
  {
    day: 5,
    date: "Fri, July 3, 2026",
    title: "Travel Home",
    stops: [
      {
        time: "TBA",
        name: "Departure details TBA",
        description: "Flight home, details to be added",
        lat: null,
        lng: null,
        photos: [],
        galleryPhotos: [],
        isTBA: true,
      },
    ],
  },
]
