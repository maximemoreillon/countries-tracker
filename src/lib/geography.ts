export const deg2Rag = (x: number) => (Math.PI * x) / 180.0
export const spherical2cartesian = (
  lat: number,
  lon: number,
  radius: number
) => [
  radius * Math.cos(lon) * Math.cos(lat),
  radius * Math.sin(lat),
  radius * Math.sin(lon) * Math.cos(lat),
]
