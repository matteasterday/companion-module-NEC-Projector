/**
 * Builders for every supported NEC control command. Each returns the command byte
 * array WITHOUT the length prefix or checksum — `encodeCommand()` adds the length
 * prefix and the projector's CGI appends the checksum.
 *
 * Command numbers (e.g. "018") reference the Projector Control Command Reference Manual.
 */

import { toS16leBytes } from './protocol.js'

export type Bytes = number[]

// ----------------------------------------------------------------- power & input

/** 015. POWER ON. */
export const powerOn = (): Bytes => [0x02, 0x00, 0x00, 0x00, 0x00]
/** 016. POWER OFF. */
export const powerOff = (): Bytes => [0x02, 0x01, 0x00, 0x00, 0x00]
/** 018. INPUT SW CHANGE — `code` is an input-terminal code (see INPUT_CHOICES). */
export const inputSwitch = (code: number): Bytes => [0x02, 0x03, 0x00, 0x00, 0x02, 0x01, code & 0xff]

// ------------------------------------------------------------------------- mutes

/** 020 / 021. PICTURE MUTE ON / OFF. */
export const pictureMute = (on: boolean): Bytes => [0x02, on ? 0x10 : 0x11, 0x00, 0x00, 0x00]
/** 022 / 023. SOUND MUTE ON / OFF. */
export const soundMute = (on: boolean): Bytes => [0x02, on ? 0x12 : 0x13, 0x00, 0x00, 0x00]
/** 024 / 025. ONSCREEN MUTE ON / OFF. */
export const onscreenMute = (on: boolean): Bytes => [0x02, on ? 0x14 : 0x15, 0x00, 0x00, 0x00]

// ------------------------------------------------------------------ adjustments

/**
 * 030-1. PICTURE ADJUST.
 * @param item  brightness 00, contrast 01, color 02, hue 03, sharpness 04
 * @param value signed 16-bit value or delta
 * @param relative true = relative (nudge), false = absolute
 */
export function pictureAdjust(item: number, value: number, relative: boolean): Bytes {
	const [lo, hi] = toS16leBytes(value)
	return [0x03, 0x10, 0x00, 0x00, 0x05, item & 0xff, 0xff, relative ? 0x01 : 0x00, lo, hi]
}

/** 030-2. VOLUME ADJUST. */
export function volumeAdjust(value: number, relative: boolean): Bytes {
	const [lo, hi] = toS16leBytes(value)
	return [0x03, 0x10, 0x00, 0x00, 0x05, 0x05, 0x00, relative ? 0x01 : 0x00, lo, hi]
}

/** 030-12. ASPECT ADJUST — `code` is an aspect code (see ASPECT_CHOICES). */
export const aspectAdjust = (code: number): Bytes => [0x03, 0x10, 0x00, 0x00, 0x05, 0x18, 0x00, 0x00, code & 0xff, 0x00]

// ---------------------------------------------------------------- freeze/shutter

/** 079. FREEZE CONTROL. */
export const freeze = (on: boolean): Bytes => [0x01, 0x98, 0x00, 0x00, 0x01, on ? 0x01 : 0x02]
/** 051 / 052. SHUTTER (lens mute) CLOSE / OPEN. */
export const shutter = (close: boolean): Bytes => [0x02, close ? 0x16 : 0x17, 0x00, 0x00, 0x00]

// ----------------------------------------------------------------- remote keys

/** 050. REMOTE KEY CODE — `code` is a 16-bit key (high byte forced to 00h). */
export const remoteKey = (code: number): Bytes => [0x02, 0x0f, 0x00, 0x00, 0x02, code & 0xff, (code >> 8) & 0xff]

// ------------------------------------------------------------------------- lens

/** 053. LENS CONTROL — timed/continuous drive of a lens actuator. */
export const lensControl = (target: number, drive: number): Bytes => [
	0x02,
	0x18,
	0x00,
	0x00,
	0x02,
	target & 0xff,
	drive & 0xff,
]
/** 053-2. LENS CONTROL 2 — absolute/relative move, or stop (target 0xFF). */
export function lensControl2(target: number, value: number, relative: boolean): Bytes {
	const [lo, hi] = toS16leBytes(value)
	return [0x02, 0x1d, 0x00, 0x00, 0x04, target & 0xff, relative ? 0x02 : 0x00, lo, hi]
}
/** 053-3. LENS MEMORY CONTROL — move/store/reset. */
export const lensMemory = (op: number): Bytes => [0x02, 0x1e, 0x00, 0x00, 0x01, op & 0xff]
/** 053-4. REFERENCE LENS MEMORY CONTROL — acts on the profile from 053-10. */
export const refLensMemory = (op: number): Bytes => [0x02, 0x1f, 0x00, 0x00, 0x01, op & 0xff]
/** 053-10. LENS PROFILE SET. */
export const lensProfileSet = (profile: number): Bytes => [0x02, 0x27, 0x00, 0x00, 0x01, profile & 0xff]

// ------------------------------------------------------------- eco / audio / misc

/** 098-8. ECO MODE SET — `code` is an eco-mode code (see ECO_CHOICES). */
export const ecoModeSet = (code: number): Bytes => [0x03, 0xb1, 0x00, 0x00, 0x02, 0x07, code & 0xff]
/** 319-10. AUDIO SELECT SET. */
export const audioSelectSet = (inputTerminal: number, source: number): Bytes => [
	0x03,
	0xc9,
	0x00,
	0x00,
	0x03,
	0x09,
	inputTerminal & 0xff,
	source & 0xff,
]
/** 098-243-1. EDGE BLENDING MODE SET. */
export const edgeBlendingSet = (on: boolean): Bytes => [0x03, 0xb1, 0x00, 0x00, 0x03, 0xdf, 0x00, on ? 0x01 : 0x00]
/** 098-198. PIP / PICTURE BY PICTURE SET. */
export const pipPbpSet = (target: number, value: number): Bytes => [
	0x03,
	0xb1,
	0x00,
	0x00,
	0x03,
	0xc5,
	target & 0xff,
	value & 0xff,
]
/** 098-45. LAN PROJECTOR NAME SET — name truncated/padded to 16 bytes. */
export function lanProjectorNameSet(name: string): Bytes {
	const bytes = Array.from({ length: 16 }, (_, i) => name.charCodeAt(i) || 0).map((c) => c & 0xff)
	return [0x03, 0xb1, 0x00, 0x00, 0x12, 0x2c, ...bytes, 0x00]
}

// ----------------------------------------------------------- status / info requests

/** 305-3. BASIC INFORMATION REQUEST — power, input, mutes, freeze. */
export const reqBasicInfo = (): Bytes => [0x00, 0xbf, 0x00, 0x00, 0x01, 0x02]
/** 078-1. SETTING REQUEST — capabilities (sound, clock, base model type). */
export const reqSettingInfo = (): Bytes => [0x00, 0x85, 0x00, 0x00, 0x01, 0x00]
/** 078-2. RUNNING STATUS REQUEST — power/cooling state. */
export const reqRunningStatus = (): Bytes => [0x00, 0x85, 0x00, 0x00, 0x01, 0x01]
/** 078-3. INPUT STATUS REQUEST — selected source/terminal. */
export const reqInputStatus = (): Bytes => [0x00, 0x85, 0x00, 0x00, 0x01, 0x02]
/** 078-4. MUTE STATUS REQUEST — picture/sound/onscreen mute. */
export const reqMuteStatus = (): Bytes => [0x00, 0x85, 0x00, 0x00, 0x01, 0x03]
/** 078-5. MODEL NAME REQUEST. */
export const reqModelName = (): Bytes => [0x00, 0x85, 0x00, 0x00, 0x01, 0x04]
/** 078-6. COVER STATUS REQUEST. */
export const reqCoverStatus = (): Bytes => [0x00, 0x85, 0x00, 0x00, 0x01, 0x05]
/** 037-4. LAMP INFORMATION REQUEST 3 — content 01h = usage seconds, 04h = remaining %. */
export const reqLampInfo = (lamp: number, content: number): Bytes => [
	0x03,
	0x96,
	0x00,
	0x00,
	0x02,
	lamp & 0xff,
	content & 0xff,
]
/** 037-3. FILTER USAGE INFORMATION REQUEST. */
export const reqFilterInfo = (): Bytes => [0x03, 0x95, 0x00, 0x00, 0x00]
/** 037-6. CARBON SAVINGS INFORMATION REQUEST — target 00h total, 01h during operation. */
export const reqCarbonSavings = (target: number): Bytes => [0x03, 0x9a, 0x00, 0x00, 0x01, target & 0xff]
/** 009. ERROR STATUS REQUEST. */
export const reqErrorStatus = (): Bytes => [0x00, 0x88, 0x00, 0x00, 0x00]
/** 097-8. ECO MODE REQUEST. */
export const reqEcoMode = (): Bytes => [0x03, 0xb0, 0x00, 0x00, 0x01, 0x07]
/** 097-45. LAN PROJECTOR NAME REQUEST. */
export const reqLanName = (): Bytes => [0x03, 0xb0, 0x00, 0x00, 0x01, 0x2c]
/** 097-155. LAN MAC ADDRESS STATUS REQUEST2. */
export const reqMac = (): Bytes => [0x03, 0xb0, 0x00, 0x00, 0x02, 0x9a, 0x00]
/** 305-1. BASE MODEL TYPE REQUEST. */
export const reqBaseModelType = (): Bytes => [0x00, 0xbf, 0x00, 0x00, 0x01, 0x00]
/** 305-2. SERIAL NUMBER REQUEST. */
export const reqSerialNumber = (): Bytes => [0x00, 0xbf, 0x00, 0x00, 0x02, 0x01, 0x06]
/** 084. INFORMATION STRING REQUEST — type 03h H-sync, 04h V-sync. */
export const reqInfoString = (type: number): Bytes => [0x00, 0xd0, 0x00, 0x00, 0x03, 0x00, type & 0xff, 0x01]
/** 053-7. LENS INFORMATION REQUEST — which actuators are moving. */
export const reqLensInfo = (): Bytes => [0x02, 0x22, 0x00, 0x00, 0x01, 0x00]
/** 053-11. LENS PROFILE REQUEST. */
export const reqLensProfile = (): Bytes => [0x02, 0x28, 0x00, 0x00, 0x00]
