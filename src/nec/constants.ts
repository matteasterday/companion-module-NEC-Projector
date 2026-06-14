/**
 * NEC projector parameter code tables and dropdown choices.
 *
 * Many code tables (input terminal, aspect, eco mode, selection-signal readback) are
 * MODEL-DEPENDENT — the same logical input has different codes across projector
 * families (e.g. HDMI 1 is 1Ah on older PA/PX/PH but A1h on M/ME and newer PA).
 * Each action that uses these therefore also offers a "Custom (hex)" choice backed by
 * a free-text field, and the readback decoders fall back to raw codes when unknown.
 *
 * Sourced from the "Projector Control Command Reference Manual Appendixes" (rev 20.0)
 * and cross-checked against a live NP-PA550W.
 */

import { toHex } from './protocol.js'

export interface Choice {
	id: number | string
	label: string
}

/** Sentinel id used by dropdowns that allow a raw hex code via a companion text field. */
export const CUSTOM = 'custom'

// --------------------------------------------------------------------------- inputs

/**
 * Input-terminal codes for [018. INPUT SW CHANGE]. Curated union across all models;
 * codes differ by family, so labels note the affected series. Use "Custom (hex)" for
 * anything not listed (see HELP.md for the full per-model table).
 */
export const INPUT_CHOICES: Choice[] = [
	{ id: 0x01, label: 'Computer 1 / RGB (01h)' },
	{ id: 0x02, label: 'Computer 2 / BNC (02h)' },
	{ id: 0x03, label: 'Computer 3 (03h)' },
	{ id: 0x06, label: 'Video / BNC(CV) (06h)' },
	{ id: 0x0b, label: 'S-Video / BNC(Y/C) (0Bh)' },
	{ id: 0x10, label: 'Component (10h)' },
	{ id: 0x1a, label: 'HDMI 1 (1Ah) — older PA/PX/PH/PE' },
	{ id: 0x1b, label: 'DisplayPort / HDMI 2 (1Bh) — older PA' },
	{ id: 0xa1, label: 'HDMI 1 (A1h) — M/ME/P/newer PA' },
	{ id: 0xa2, label: 'HDMI 2 (A2h) — M/ME/newer PA' },
	{ id: 0xa6, label: 'DisplayPort (A6h) — newer PA/PX' },
	{ id: 0xa7, label: 'DisplayPort 2 (A7h)' },
	{ id: 0x9c, label: 'DVI-D (9Ch)' },
	{ id: 0x1c, label: 'Stereo DVI / SLOT (1Ch)' },
	{ id: 0x1f, label: 'Viewer / USB-A (1Fh)' },
	{ id: 0x20, label: 'LAN / Network / Ethernet (20h)' },
	{ id: 0x22, label: 'USB Display / USB-B (22h)' },
	{ id: 0x23, label: 'APPS / USB-B (23h)' },
	{ id: 0xab, label: 'SLOT (ABh)' },
	{ id: 0xbf, label: 'HDBaseT (BFh)' },
	{ id: 0xc4, label: 'SDI 1 (C4h)' },
	{ id: 0xc5, label: 'SDI 2 (C5h)' },
	{ id: 0xc6, label: 'SDI 3 (C6h)' },
	{ id: 0xc7, label: 'SDI 4 (C7h)' },
	{ id: CUSTOM, label: 'Custom (enter hex code below)' },
]

/** Input names for feedbacks / presets, matched against the decoded active input. */
export const INPUT_NAME_CHOICES: Choice[] = [
	{ id: 'Computer 1', label: 'Computer 1 / RGB' },
	{ id: 'Computer 2', label: 'Computer 2' },
	{ id: 'Computer 3', label: 'Computer 3' },
	{ id: 'Video', label: 'Video' },
	{ id: 'S-Video', label: 'S-Video' },
	{ id: 'Component', label: 'Component' },
	{ id: 'HDMI', label: 'HDMI' },
	{ id: 'HDMI 2', label: 'HDMI 2' },
	{ id: 'DVI-D', label: 'DVI-D' },
	{ id: 'DisplayPort', label: 'DisplayPort' },
	{ id: 'Viewer', label: 'Viewer' },
	{ id: 'Network', label: 'LAN / Network' },
	{ id: 'HDBaseT', label: 'HDBaseT' },
	{ id: 'SDI', label: 'SDI' },
]

/**
 * Decode the (selection signal type 1, selection signal type 2) pair from
 * [305-3 BASIC INFORMATION REQUEST] / [078-3 INPUT STATUS REQUEST] into an input name.
 *
 * type2 is the primary terminal discriminator; type1 distinguishes Computer 1/2/3.
 * The two documented schemes (older "06h = HDMI" PA family and newer "21h = HDMI") do
 * not actually overlap on any single model, so a unified map is safe. Unknown codes
 * fall back to a raw label.
 */
export function decodeInputName(type1: number, type2: number): string {
	switch (type2) {
		case 0x01:
			return type1 >= 2 ? `Computer ${type1}` : 'Computer 1'
		case 0x02:
			return 'Video'
		case 0x03:
			return 'S-Video'
		case 0x04:
			return 'Component'
		case 0x06:
			return 'HDMI'
		case 0x07:
			return 'Viewer'
		case 0x20:
			return 'DVI-D'
		case 0x21:
			return 'HDMI'
		case 0x22:
			return 'DisplayPort'
		case 0x23:
			return 'Viewer'
		case 0x27:
			return 'Network'
		case 0x28:
			return 'HDBaseT'
		case 0xff:
			return 'No Input'
		default:
			return `Input ${toHex(type2)}`
	}
}

// --------------------------------------------------------------------------- aspect

/** Aspect codes for [030-12. ASPECT ADJUST] (model-dependent — see HELP.md). */
export const ASPECT_CHOICES: Choice[] = [
	{ id: 0x00, label: 'Auto (00h)' },
	{ id: 0x01, label: 'Wide Zoom / 4:3 (Windows) (01h)' },
	{ id: 0x02, label: '16:9 / Wide Screen (02h)' },
	{ id: 0x03, label: 'Native / 16:9 (03h)' },
	{ id: 0x04, label: '4:3 (04h)' },
	{ id: 0x05, label: '15:9 (05h)' },
	{ id: 0x06, label: '16:10 / Full (06h)' },
	{ id: 0x07, label: 'Letter Box / Zoom (07h)' },
	{ id: 0x08, label: 'Native (08h)' },
	{ id: 0x0b, label: '5:4 (0Bh)' },
	{ id: 0x0c, label: '16:10 (0Ch)' },
	{ id: 0x0d, label: '15:9 (0Dh)' },
	{ id: 0x0e, label: 'Native (0Eh)' },
	{ id: 0x0f, label: 'Auto (0Fh)' },
	{ id: 0x10, label: 'Normal (10h)' },
	{ id: CUSTOM, label: 'Custom (enter hex code below)' },
]

// ----------------------------------------------------------------------------- eco

/** Eco / Lamp / Light mode codes for [097-8]/[098-8] (model-dependent). */
export const ECO_CHOICES: Choice[] = [
	{ id: 0x00, label: 'Off / Normal (00h)' },
	{ id: 0x01, label: 'On / Auto Eco / Eco (01h)' },
	{ id: 0x02, label: 'Eco / Normal / Eco1 (02h)' },
	{ id: 0x03, label: 'Eco / Eco2 (03h)' },
	{ id: 0x04, label: 'Long Life (04h)' },
	{ id: 0x05, label: 'Boost (05h)' },
	{ id: CUSTOM, label: 'Custom (enter hex code below)' },
]

/** Best-effort label for an eco-mode readback code. */
export function ecoLabel(code: number): string {
	switch (code) {
		case 0x00:
			return 'Off / Normal'
		case 0x01:
			return 'On / Eco'
		case 0x02:
			return 'Eco 1'
		case 0x03:
			return 'Eco 2'
		case 0x04:
			return 'Long Life'
		case 0x05:
			return 'Boost'
		default:
			return toHex(code)
	}
}

// ------------------------------------------------------------------- picture adjust

/** Adjustment targets for [030-1. PICTURE ADJUST]. */
export const PICTURE_ITEMS: Choice[] = [
	{ id: 0x00, label: 'Brightness' },
	{ id: 0x01, label: 'Contrast' },
	{ id: 0x02, label: 'Color' },
	{ id: 0x03, label: 'Hue' },
	{ id: 0x04, label: 'Sharpness' },
]

// ------------------------------------------------------------------------ remote keys

/** Remote-control key codes for [050. REMOTE KEY CODE] (16-bit, high byte 00h). */
export const REMOTE_KEYS: Choice[] = [
	{ id: 0x02, label: 'Power On' },
	{ id: 0x03, label: 'Power Off' },
	{ id: 0x05, label: 'Auto Adjust' },
	{ id: 0x06, label: 'Menu' },
	{ id: 0x07, label: 'Up' },
	{ id: 0x08, label: 'Down' },
	{ id: 0x09, label: 'Right' },
	{ id: 0x0a, label: 'Left' },
	{ id: 0x0b, label: 'Enter' },
	{ id: 0x0c, label: 'Exit' },
	{ id: 0x0d, label: 'Help' },
	{ id: 0x0f, label: 'Magnify +' },
	{ id: 0x10, label: 'Magnify −' },
	{ id: 0x13, label: 'Mute (Picture)' },
	{ id: 0x29, label: 'Picture' },
	{ id: 0x4b, label: 'Computer 1' },
	{ id: 0x4c, label: 'Computer 2' },
	{ id: 0x4f, label: 'Video 1' },
	{ id: 0x51, label: 'S-Video 1' },
	{ id: 0x84, label: 'Volume +' },
	{ id: 0x85, label: 'Volume −' },
	{ id: 0x8a, label: 'Freeze' },
	{ id: 0xa3, label: 'Aspect' },
	{ id: 0xd7, label: 'Source' },
	{ id: 0xee, label: 'Eco / Lamp Mode' },
]

// ------------------------------------------------------------------------------ lens

/** Lens targets for timed/continuous drive [053. LENS CONTROL]. */
export const LENS_TARGETS: Choice[] = [
	{ id: 0x00, label: 'Zoom' },
	{ id: 0x01, label: 'Focus' },
	{ id: 0x02, label: 'Lens Shift (H)' },
	{ id: 0x03, label: 'Lens Shift (V)' },
	{ id: 0x06, label: 'Periphery Focus' },
]

/** Drive directions/durations for [053. LENS CONTROL] (DATA02). */
export const LENS_DRIVE: Choice[] = [
	{ id: 0x00, label: 'Stop' },
	{ id: 0x01, label: '+ for 1 second' },
	{ id: 0x02, label: '+ for 0.5 second' },
	{ id: 0x03, label: '+ for 0.25 second' },
	{ id: 0x7f, label: '+ continuous (send Stop to halt)' },
	{ id: 0x81, label: '− continuous (send Stop to halt)' },
	{ id: 0xfd, label: '− for 0.25 second' },
	{ id: 0xfe, label: '− for 0.5 second' },
	{ id: 0xff, label: '− for 1 second' },
]

/** Lens memory operations [053-3]/[053-4]. */
export const LENS_MEM_OPS: Choice[] = [
	{ id: 0x00, label: 'Move (recall)' },
	{ id: 0x01, label: 'Store (save)' },
	{ id: 0x02, label: 'Reset' },
]

/** Reference lens-memory profile [053-10. LENS PROFILE SET]. */
export const LENS_PROFILES: Choice[] = [
	{ id: 0x00, label: 'Profile 1' },
	{ id: 0x01, label: 'Profile 2' },
]

// ---------------------------------------------------------------------- audio select

/** Audio source values (DATA02) for [319-10. AUDIO SELECT SET] (model-dependent). */
export const AUDIO_SOURCES: Choice[] = [
	{ id: 0x00, label: 'HDMI 1 (00h)' },
	{ id: 0x01, label: 'HDMI 2 (01h)' },
	{ id: 0x02, label: 'DisplayPort (02h)' },
	{ id: 0x03, label: 'HDBaseT / Ethernet / LAN (03h)' },
	{ id: 0x04, label: 'USB-A (04h)' },
	{ id: 0x05, label: 'USB-B (05h)' },
	{ id: 0x09, label: 'HDBaseT (09h)' },
	{ id: CUSTOM, label: 'Custom (enter hex code below)' },
]

// ------------------------------------------------------------------- status decoding

/** Decode the operation-status byte (DATA01 of [305-3]). */
export function decodeOperationStatus(code: number): string {
	switch (code) {
		case 0x00:
			return 'Standby (Sleep)'
		case 0x01:
		case 0x02:
		case 0x03:
			return 'Warming Up'
		case 0x04:
			return 'Power On'
		case 0x05:
			return 'Cooling'
		case 0x06:
			return 'Standby (Error)'
		case 0x0f:
			return 'Standby (Power Saving)'
		case 0x10:
			return 'Network Standby'
		default:
			return toHex(code)
	}
}

/** True when the projector is on or warming up (01h–03h warming, 04h on). */
export function isPoweredOn(operationStatus: number): boolean {
	// Cooling (05h) and all standby codes (00h, 06h, 0Fh, 10h) count as "off".
	return operationStatus >= 0x01 && operationStatus <= 0x04
}

/** Decode the "content displayed" byte (DATA02 of [305-3]). */
export function decodeContent(code: number): string {
	switch (code) {
		case 0x00:
			return 'Video signal'
		case 0x01:
			return 'No signal'
		case 0x02:
			return 'Viewer'
		case 0x03:
			return 'Test pattern'
		case 0x04:
			return 'LAN'
		case 0x05:
			return 'Test pattern (user)'
		case 0x10:
			return 'Signal switching'
		case 0xff:
			return 'N/A'
		default:
			return toHex(code)
	}
}

/**
 * Decode the 12 error-status bytes from [009. ERROR STATUS REQUEST] into a list of
 * active error descriptions. An empty list means normal operation.
 */
export function decodeErrors(data: readonly number[]): string[] {
	const errors: string[] = []
	const bit = (idx: number, b: number) => ((data[idx] ?? 0) & (1 << b)) !== 0
	// DATA01 (index 0)
	if (bit(0, 0)) errors.push('Cover error')
	if (bit(0, 1)) errors.push('Temperature error (bi-metallic)')
	if (bit(0, 3) || bit(0, 4)) errors.push('Fan error')
	if (bit(0, 5)) errors.push('Power error')
	if (bit(0, 6)) errors.push('Lamp/backlight off')
	if (bit(0, 7)) errors.push('Lamp at end of life (replace lamp)')
	// DATA02 (index 1)
	if (bit(1, 0)) errors.push('Lamp usage time exceeded limit')
	if (bit(1, 1)) errors.push('Formatter error')
	if (bit(1, 2)) errors.push('Lamp 2 off')
	// DATA03 (index 2)
	if (bit(2, 1)) errors.push('FPGA error')
	if (bit(2, 2)) errors.push('Temperature error (sensor)')
	if (bit(2, 3)) errors.push('Lamp not present')
	if (bit(2, 4)) errors.push('Lamp data error')
	if (bit(2, 5)) errors.push('Mirror cover error')
	if (bit(2, 7)) errors.push('Lamp 2 usage time exceeded limit')
	// DATA04 (index 3)
	if (bit(3, 0)) errors.push('Lamp 2 not present')
	if (bit(3, 1)) errors.push('Lamp 2 data error')
	if (bit(3, 2)) errors.push('Temperature error (dust)')
	if (bit(3, 3)) errors.push('Foreign matter sensor error')
	if (bit(3, 5)) errors.push('Ballast communication error')
	if (bit(3, 6)) errors.push('Iris calibration error')
	if (bit(3, 7)) errors.push('Lens not installed properly')
	// DATA09 (index 8) — extended status
	if (bit(8, 1)) errors.push('Interlock switch open')
	if (bit(8, 2)) errors.push('System error (slave CPU)')
	if (bit(8, 3)) errors.push('System error (formatter)')
	return errors
}
