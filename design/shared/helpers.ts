import { C } from './constants'
import type { TableSkin } from './types'

export const scoreCol = (s: number, exited = false) =>
  exited ? C.textSub : s > 0 ? C.green : s < 0 ? C.red : C.textSub

export const scoreLbl = (s: number) => `${s > 0 ? '+' : ''}${s}`

export function chipColors(score: number) {
  if (score > 200) return { main: '#FFD93D', light: '#FFF176', shadow: '#B8860B' }
  if (score > 0)   return { main: '#6BCB77', light: '#93DE9D', shadow: '#3A8C46' }
  if (score < 0)   return { main: '#FF6B6B', light: '#FF9999', shadow: '#C0392B' }
  return { main: '#9E9E9E', light: '#BDBDBD', shadow: '#616161' }
}

export function skinBg(skin: TableSkin): string {
  return skin === 'classic' ? 'radial-gradient(ellipse at 40% 35%, #3D7A52, #1f4028)'
    : skin === 'poker' ? 'radial-gradient(ellipse at 40% 35%, #252545, #0d0d1a)'
    : skin === 'wood'  ? 'radial-gradient(ellipse at 40% 35%, #D4A373, #8B5E3C)'
    : 'radial-gradient(ellipse at 40% 35%, #5EDDD4, #2AADA4)'
}
